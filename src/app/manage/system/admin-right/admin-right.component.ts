import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { TongchangHttpService, DebugLog, TongchangLibService } from 'tongchang-lib';
import { SystemModule } from '@/model/SystemModule';
import { Apis } from '@/shared/urls.const';
import { CommonService } from '@/core/common.service';
import { NzModalService, NzTreeNodeOptions, NzTreeComponent, NzTreeNode, NzMessageService } from 'ng-zorro-antd';
import {
  PLATFORM_RIGHTS_KEY,
  VERIFY_COMP_RIGHTS_KEY,
  VERIFY_CUSM_RIGHTS_KEY,
} from '@/config.const'

const AllTypesKey = [
  PLATFORM_RIGHTS_KEY,
  VERIFY_COMP_RIGHTS_KEY,
  VERIFY_CUSM_RIGHTS_KEY,
]

interface RightTreeConf {
  key: string;
  title: string;
  showSaveBt: boolean;
  nodesOptions: NzTreeNodeOptions[]
}

@Component({
  selector: 'app-admin-right',
  templateUrl: './admin-right.component.html',
  styleUrls: ['./admin-right.component.scss']
})
export class AdminRightComponent implements OnInit {

  constructor(
    private http: TongchangHttpService,
    private util: TongchangLibService,
    private commSer: CommonService,
    private modal: NzModalService,
    private msg: NzMessageService,
  ) { }

  treesConf: RightTreeConf[] = [
    {
      key: PLATFORM_RIGHTS_KEY,
      title: '平台管理员权限',
      showSaveBt: false,
      nodesOptions: [],
    },
    {
      key: VERIFY_COMP_RIGHTS_KEY,
      title: '验证实施管理员权限',
      showSaveBt: false,
      nodesOptions: [],
    },
    {
      key: VERIFY_CUSM_RIGHTS_KEY,
      title: '验证客户管理员权限',
      showSaveBt: false,
      nodesOptions: [],
    },
  ]

  ngOnInit() {
    this.initData()
  }

  tree: NzTreeNodeOptions[];

  async initData() {
    const fieldRetry = (title: string) => {
      this.modal.confirm({
        nzOkText: '重试',
        nzTitle: title,
        nzClosable: false,
        nzMaskClosable: false,
        nzOnOk: () => this.initData()
      })
    }

    const moTreeRes = await this.commSer.getModuleTree().toPromise()
    if (moTreeRes.code !== 0) return fieldRetry('菜单树请求失败')
    const moduleTree = moTreeRes.data
    const valuesRes = await this.commSer.getParamsByKey(...AllTypesKey).toPromise()
    if (valuesRes.code !== 0) return fieldRetry('配置请求失败')

    this.treesConf.forEach(it => {
      const codes: number[] = valuesRes.data[it.key] || []
      it.nodesOptions = this.convertNodes(moduleTree, codes)
    })
  }

  async getModuleTree() {
    return this.http.get<SystemModule>(Apis.moduleTree)
  }

  async onSave(conf: RightTreeConf, tree: NzTreeComponent) {
    const checked = tree.getCheckedNodeList()
    const halfChecked = tree.getHalfCheckedNodeList()

    const allCheckedIds = [
      ...this.getTreeNodeIds(checked),
      ...halfChecked.map(it => +it.key)
    ]

    await this.util.submitConfirm()

    const res = await this.commSer.paramsUpdate(
      conf.key,
      JSON.stringify(allCheckedIds)
    ).toPromise()

    if (res.code === 0) {
      this.msg.success(res.message)
      conf.showSaveBt = false
    }
  }

  private convertNodes(modules: SystemModule[], checkedNodes: number[]): NzTreeNodeOptions[] {
    return modules.map(item => {
      let children: NzTreeNodeOptions[] = []
      if (item.children && item.children.length > 0) {
        children = this.convertNodes(item.children, checkedNodes)
      }

      const isLeaf = children.length === 0
      
      isLeaf && DebugLog('叶子节点', item.id)

      return {
        title: item.module_name,
        key:   item.id + '',
        children,
        selectable: false,
        isLeaf,
        checked: isLeaf && checkedNodes.includes(item.id)
        // module: item
      } as NzTreeNodeOptions
    })
  }

  private getTreeNodeIds(nodes: NzTreeNode[], _result = []): string[] {

    nodes.forEach(node => {
      _result.push(+node.key)
      if (node.children && node.children.length > 0) {
        _result = [ ..._result, ...this.getTreeNodeIds(node.children)]
      }
    })

    return _result
  }
}
