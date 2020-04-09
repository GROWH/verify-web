import { Component, OnInit } from '@angular/core';
import { NzTreeNodeOptions, NzModalService, NzModalRef, NzTreeNode, NzMessageService } from 'ng-zorro-antd';

import { GridAction } from '@/model/GridAction';
import { SystemModule } from '@/model/SystemModule';

import { ModuleManageFormComponent } from '../module-manage-form/module-manage-form.component';
import { TongchangHttpService, TongchangLibService } from 'tongchang-lib';

@Component({
  selector: 'app-module-manage',
  templateUrl: './module-manage.component.html',
  styleUrls: ['./module-manage.component.scss']
})
export class ModuleManageComponent implements OnInit {

  constructor(
    private msg: NzMessageService,
    private modal: NzModalService,
    private util: TongchangLibService,
    private http: TongchangHttpService,
  ) { }

  ngOnInit() {
    this.actionInit()
  }

  selectedNode: SystemModule;
  gridActions: GridAction[]

  nodes: NzTreeNodeOptions[] = [
    {
      title: '系统设置',
      key: '01',
      children: [
        {
          title: '模块管理',
          key: '0101',
          children: [
            {
              title: '新增',
              key: '010101',
              isLeaf: true,
              selectable: false,
            }
          ],
          module: {
            key_word: 'mkgl',
            module_code: '0101',
            module_name: '模块管理',
            module_url: 'url',
            order_number: 1,
            parent_id: 1,
            type: 2,
            is_menu: true,
          }
        }
      ]
    }
  ]

  actionInit() {
    this.gridActions = [
      {
        name: '新增',
        icon: 'plus',
        code: 'add',
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
            
        }
      }
    ]
  }

  onTreeNodeClick(node: NzTreeNode) {

    if (node.isSelected) {
      this.selectedNode = node.origin['module']
    } else {
      this.selectedNode = undefined
    }
  }

  private async onAddSubmit(modalRef: NzModalRef, formVal: SystemModule) {
    await this.util.submitConfirm()
    const res = await this.http.post('/module', formVal).toPromise()
    if (res.code === 0) {
      this.msg.success(res.message)
      modalRef.close()
    }
  }
}
