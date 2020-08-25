import {Component, OnInit, ViewChild} from '@angular/core';
import {
  NzTreeNodeOptions,
  NzModalService,
  NzModalRef,
  NzTreeNode,
  NzMessageService,
  NzTreeComponent,
} from 'ng-zorro-antd';

import {Apis} from '@/shared/urls.const';
import {GridAction} from '@/model/GridAction';
import {SystemModule} from '@/model/SystemModule';

import {ModuleManageFormComponent} from '../module-manage-form/module-manage-form.component';
import {TongchangHttpService, TongchangLibService} from 'tongchang-lib';

import {buttonAccess} from '../../../config.const';

@Component({
  selector: 'app-module-manage',
  templateUrl: './module-manage.component.html',
  styleUrls: ['./module-manage.component.scss']
})
export class ModuleManageComponent implements OnInit {

  @ViewChild(NzTreeComponent) tree: NzTreeComponent;

  constructor(
    private msg: NzMessageService,
    private modal: NzModalService,
    private util: TongchangLibService,
    private http: TongchangHttpService,
  ) {
  }

  ngOnInit() {
    this.actionInit()
    this.getModuleTree()
  }

  moTypeMap = {
    [1]: '一级模块',
    [2]: '二级模块',
    [3]: '按钮',
  }

  moduleMap = new Map<string, SystemModule>()

  selectedNode: SystemModule;
  gridActions: GridAction[]

  nodeTree: NzTreeNodeOptions[] = []

  get tableData(): SystemModule[] {
    if (this.selectedNode) {
      return this.selectedNode.children || []
    } else {
      const mos = []
      this.moduleMap.forEach(mo => {
        if (mo.type === 1) mos.push(mo)
      })
      return mos
    }
  }

  actionInit() {
    this.gridActions = [
      {
        name: '新增',
        icon: 'plus',
        code: 'module-manage_add',
        type: 'primary',
        click: () => {
          const modalRef: NzModalRef = this.modal.create({
            nzTitle: '模块新增',
            nzContent: ModuleManageFormComponent,
            nzComponentParams: {
              originData: new SystemModule(
                this.selectedNode ? this.selectedNode.type + 1 : 1,
                this.selectedNode ? this.selectedNode.id : 0,
                this.selectedNode ? (this.selectedNode.type > 1 ? false : true) : true
              )
            },
            nzMaskClosable: false,
            nzWrapClassName: 'modal-vertical-center',
            nzWidth: 600,
            nzFooter: [
              {
                label: '取消',
                onClick: () => modalRef.close()
              },
              {
                label: '提交',
                type: 'primary',
                onClick: comp => this.onAddSubmit(modalRef, comp.formVal),
                disabled: comp => !comp.form.valid
              }
            ]
          })

        },
        isExist: buttonAccess("module-manage_add"),
      },
      {
        name: '刷新',
        icon: 'reload',
        code: 'module-manage_reload',
        type: 'dashed',
        click: () => {
          this.getModuleTree()
        },
        isExist: buttonAccess("module-manage_reload"),
      }
    ]
  }

  onTreeNodeClick(node: NzTreeNode) {

    if (!node.isSelectable) return

    if (node.isSelected) {
      this.selectedNode = this.moduleMap.get(node.key)/*  node.origin['module'] */
    } else {
      this.selectedNode = undefined
    }
  }

  async getModuleTree() {
    const {messageId: msgId} = this.msg.loading('请求中', {nzDuration: 0})
    const res = await this.http.get<SystemModule[]>(Apis.moduleTree).toPromise()

    this.msg.remove(msgId)

    if (res.code !== 0) {
      this.modal.confirm({
        nzTitle: '菜单树请求失败',
        nzContent: '是否重试?',
        nzOnOk: () => this.getModuleTree()
      })
      return
    } else {
      this.msg.success('模块树刷新成功')
    }

    this.moduleMap.clear()
    this.nodeTree = this.convertNodes(res.data)

    if (this.selectedNode) {
      this.selectedNode = this.moduleMap.get(`${this.selectedNode.id}`)
    }
  }

  edit(module: SystemModule) {
    const modalRef: NzModalRef = this.modal.create({
      nzTitle: '模块修改',
      nzContent: ModuleManageFormComponent,
      nzComponentParams: {
        originData: module
      },
      nzMaskClosable: false,
      nzWrapClassName: 'modal-vertical-center',
      nzWidth: 900,
      nzFooter: [
        {
          label: '取消',
          onClick: () => modalRef.close()
        },
        {
          label: '提交',
          type: 'primary',
          onClick: comp => this.onEditSubmit(modalRef, comp.formVal),
          disabled: comp => !comp.form.valid
        }
      ]

    })
  }

  async del(module: SystemModule) {
    if (module.children && module.children.length > 0) {
      this.msg.error('此模块下包含子模块, 不能删除')
      return
    }

    await this.util.submitConfirm(null, '确定删除?')

    const res = await this.http.delete(`${Apis.module}/${module.id}`).toPromise()

    if (res.code === 0) {
      this.msg.success(res.message)
      this.removeModule(module)
    }
  }

  private convertNodes(modules: SystemModule[]): NzTreeNodeOptions[] {
    return modules.map(item => {

      this.moduleMap.set(`${item.id}`, item)

      let children: NzTreeNodeOptions[] = []
      if (item.children && item.children.length > 0) {
        children = this.convertNodes(item.children)
      } else if (!item.children) {
        item.children = []
      }

      return {
        title: item.module_name,
        key: item.id + '',
        selectable: item.type < 3,
        isLeaf: item.type === 3,
        selected: this.selectedNode ? this.selectedNode.id === item.id : false,
        children,
        // module: item
      } as NzTreeNodeOptions
    })
  }

  private moNode2TreeNode(item: SystemModule): NzTreeNodeOptions {
    return {
      title: item.module_name,
      key: item.id + '',
      selectable: item.type < 3,
      isLeaf: item.type === 3,
      selected: this.selectedNode ? this.selectedNode.id === item.id : false,
      children: [],
    }
  }

  private async onAddSubmit(modalRef: NzModalRef, formVal: SystemModule) {
    await this.util.submitConfirm()
    const res = await this.http.post<SystemModule>(Apis.module, formVal).toPromise()
    if (res.code === 0) {
      this.msg.success(res.message)
      modalRef.close()
      this.addModule(res.data)
    }
  }

  private async onEditSubmit(modalRef: NzModalRef, formVal: SystemModule) {
    await this.util.submitConfirm()
    const res = await this.http.put<SystemModule>(Apis.module, formVal).toPromise()
    if (res.code === 0) {
      this.msg.success(res.message)
      modalRef.close()
      this.updateModule(res.data)
    }
  }

  private updateModule(mo: SystemModule) {
    /** 节点 Map 更新 */
    (() => {
      /**
       * 更新其父节点children属性的引用
       */
      const parentNode = this.moduleMap.get(`${mo.parent_id}`)
      if (parentNode) {
        const index = parentNode.children.findIndex(it => it.id === mo.id)
        const parentChildren = parentNode.children
        parentNode.children = [
          ...parentChildren.slice(0, index),
          mo,
          ...parentChildren.slice(index + 1)
        ]
      }

      /**
       * 原节点children引用接入接口返回的节点上
       */
      const children = this.moduleMap.get(`${mo.id}`).children
      mo.children = children

      /**
       * 更新节点map
       */
      this.moduleMap.set(`${mo.id}`, mo)
    })();

    /** 菜单树更新 */
    (() => {

      const treeNode = this.tree.getTreeNodeByKey(`${mo.id}`)

      treeNode.title = mo.module_name
      treeNode.key = `${mo.id}`
      treeNode.isSelectable = mo.type < 3,
        treeNode.isLeaf = mo.type === 3
    })();
  }

  private addModule(mo: SystemModule) {
    mo.children = []

    /** 节点 Map 更新 */
    if (mo.parent_id !== 0) {
      const parentNode = this.moduleMap.get(`${mo.parent_id}`)
      const siblings = parentNode.children
      parentNode.children = [...siblings, mo]
    }
    this.moduleMap.set(`${mo.id}`, mo)

    /** 菜单树更新 */
    const pNode = this.tree.getTreeNodeByKey(`${mo.parent_id}`)
    const newNode = this.moNode2TreeNode(mo)
    pNode.addChildren([newNode])
  }

  private removeModule(mo: SystemModule) {
    /** 节点 Map 更新 */
    if (mo.parent_id !== 0) {
      const parentNode = this.moduleMap.get(`${mo.parent_id}`)
      const siblings = parentNode.children
      const index = siblings.findIndex(it => it.id === mo.id)

      parentNode.children = [
        ...siblings.slice(0, index),
        ...siblings.slice(index + 1)
      ]
    }
    this.moduleMap.delete(`${mo.id}`)

    /** 菜单树更新 */
    this.tree.getTreeNodeByKey(`${mo.id}`).remove()
  }
}
