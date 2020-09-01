import {Component, OnInit} from '@angular/core';
import {NzModalService, NzModalRef, NzMessageService, NzTreeNodeOptions, NzTreeComponent} from 'ng-zorro-antd';
import {TongchangHttpService} from 'tongchang-lib';
import {AccountFormComponent} from './account-form/account-form.component';

import {GridAction} from '@/model/GridAction';
import {nodeChildrenAsMap} from "@angular/router/src/utils/tree";
import {buttonAccess} from "@/config.const";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})

export class AccountComponent implements OnInit {

  accountId: string = localStorage.getItem('account') ||'';
  isAllDisplayDataChecked = false;
  isIndeterminate = false;
  position: string = 'bottom'
  listOfDisplayData: params[] = [];
  page = 1;
  size = 10;
  unitId = 0;
  loading = true;
  total = 1;
  listOfAllData: params[] = []
  mapOfCheckedId: { [key: string]: boolean } = {};
  selectItems = []
  baseUrl = '/account'
  checkUrl = '/account/enable/' //启用
  stopUrl = '/account/stop/' //停用
  treeUrl = '/account/queryUnit' //停用
  selectNode

  trees

  constructor(
    private modal: NzModalService,
    private msg: NzMessageService,
    private http: TongchangHttpService,
  ) {
  }

  gridActions: GridAction[];

  ngOnInit() {
    this.actionInit()
    this.getTree()
  }

  actionInit() {
    this.gridActions = [
      {
        name: '新增',
        icon: 'plus',
        code: 'account_add',
        type: 'primary',
        click: () => {
          this.Add()
        },
        isExist: buttonAccess("account_add"),
      }, {
        name: '修改',
        icon: 'edit',
        code: 'account_edit',
        type: 'default',
        click: () => {
          this.Edit()
        },
        isExist: buttonAccess("account_edit"),
      }, {
        name: '启用',
        icon: 'check-circle',
        code: 'account_check',
        type: 'default',
        click: () => {
          this.Check()
        },
        isExist: buttonAccess("account_check"),
      }, {
        name: '停用',
        icon: 'stop',
        code: 'account_stop',
        type: 'default',
        click: () => {
          this.Stop()
        },
        isExist: buttonAccess("account_stop"),
      }, {
        name: '删除',
        icon: 'delete',
        code: 'account_delete',
        type: 'danger',
        click: () => {
          this.Delete()
        },
        isExist: buttonAccess("account_delete"),
      },
      {
        name: '刷新',
        icon: 'redo',
        code: 'account_reload',
        type: 'dashed',
        click: () => {
          this.Query()
        },
        isExist: buttonAccess("account_reload"),
      }
    ]
  }

  refreshStatus(): void {
    this.isAllDisplayDataChecked = this.listOfDisplayData.every((item) => this.mapOfCheckedId[item.id]);
    let checkId = this.mapOfCheckedId
    this.selectItems = this.listOfDisplayData.map((item) => {
      for (let key in checkId) {
        if (checkId[key] && Number(key) === item.id) {
          return item
        }
      }
    }).filter(item => item)
    this.isIndeterminate =
      this.listOfDisplayData.some(item => this.mapOfCheckedId[item.id]) && !this.isAllDisplayDataChecked;
  }

  checkAll(value: boolean): void {
    this.listOfDisplayData.forEach(item => (this.mapOfCheckedId[item.id] = value));
    this.refreshStatus();
  }

  //新增操作
  Add() {
    const param = new params;
    let modalRef: NzModalRef = this.modal.create({
      nzTitle: "参数配置",
      nzContent: AccountFormComponent,
      nzWidth: 700,
      nzComponentParams: {param},
      nzFooter: [
        {
          label: '取消',
          onClick: () => modalRef.close()
        },
        {
          label: '确定',
          type: 'primary',
          disabled: comp => !comp.validateForm.valid,
          onClick: (comp) => {
            let formVal = {
              ...comp.validateForm.getRawValue(),
              unit_id: this.selectNode.key
            }

            this.modal.confirm({
              nzTitle: '提交',
              nzContent: '确认提交?',
              nzOnOk: () => {
                const params = formVal;
                this.http.post(this.baseUrl, params).subscribe(res => {
                  if (res.code !== 0) {
                    this.msg.error(res.message);
                    return
                  }
                  this.msg.success(res.message);
                  modalRef.close()
                  this.getTree()
                })
              }
            })

          }
        }
      ],
      nzWrapClassName: 'modal-vertical-center'
    })
  }

  //修改操作
  Edit() {
    const param = this.selectItems[0]
    if (this.selectItems.length !== 1) {
      this.msg.warning('请选择一项数据进行操作!')
      return;
    }
    let modalRef: NzModalRef = this.modal.create({
      nzTitle: "参数配置",
      nzContent: AccountFormComponent,
      nzWidth: 700,
      nzComponentParams: {param},
      nzFooter: [
        {
          label: '取消',
          onClick: () => modalRef.close()
        },
        {
          label: '确定',
          type: 'primary',
          disabled: comp => !comp.validateForm.valid,
          onClick: (comp) => {
            let formVal = comp.validateForm.getRawValue()
            this.modal.confirm({
              nzTitle: '提交',
              nzContent: '确认提交?',
              nzOnOk: () => {
                const params = {
                  ...param,
                  ...formVal
                };
                this.http.put(this.baseUrl, params).subscribe(res => {
                  if (res.code !== 0) {
                    this.msg.error(res.message);
                    return
                  }
                  this.msg.success(res.message);
                  modalRef.close()
                  this.getData();
                })
              }
            })
          }
        }
      ],
      nzWrapClassName: 'modal-vertical-center'
    })

  }

  //删除操作
  Delete() {
    if (this.selectItems.length === 0) {
      this.msg.warning('请先选择数据进行操作!')
      return;
    }
    const selectedIds = this.selectItems.map(it => it.id) + ''
    this.modal.confirm({
      nzTitle: '删除',
      nzContent: '确认删除?',
      nzOnOk: () => {
        this.http.delete(`${this.baseUrl}/${selectedIds}`).subscribe(res => {
          if (res.code !== 0) {
            this.msg.error(res.message);
            return
          }
          this.msg.success(res.message);
          this.getTree();
        })
      }
    })
  }

  //启用
  Check() {
    if (this.selectItems.length === 0) {
      this.msg.warning('请先选择数据进行操作!')
      return;
    }
    const checkStatus = this.selectItems.every(it => !it.enable)
    if (!checkStatus) {
      this.msg.warning('请选择禁用状态的数据进行操作')
      return;
    }
    const selectedIds = this.selectItems.map(it => it.id) + ''
    this.http.get(`${this.checkUrl}?ids=${selectedIds}`).subscribe(res => {
      if (res.code !== 0) {
        this.msg.error(res.message);
        return
      }
      this.msg.success(res.message);
      this.getTree();
    })
  }

  //停用
  Stop() {
    if (this.selectItems.length === 0) {
      this.msg.warning('请先选择数据进行操作!')
      return;
    }
    const checkStatus = this.selectItems.every(it => it.enable)
    if (!checkStatus) {
      this.msg.warning('请选择启用状态的数据进行操作')
      return;
    }
    const selectedIds = this.selectItems.map(it => it.id) + ''
    this.http.get(`${this.stopUrl}?ids=${selectedIds}`).subscribe(res => {
      if (res.code !== 0) {
        this.msg.error(res.message);
        return
      }
      this.msg.success(res.message);
      this.getTree();
    })
  }

  //刷新
  Query() {
    this.getTree()
  }

  //初始出请求
  getData() {
    this.mapOfCheckedId = {}
    this.loading = true;
    this.http.get<any>(`${this.baseUrl}?page=${this.page}&size=${this.size}&unitId=${this.unitId}`).subscribe(res => {
      this.loading = false;
      if (res.code === 0) {
        this.listOfDisplayData = res.data.list;
        this.refreshStatus()
      }
    })
  }

  changePageIndex(pageIndex) {
    this.page = pageIndex;
    this.getData()
  }

  changePageSize(pageSize) {
    this.size = pageSize
    this.getData()
  }

  yesOrno(value) {
    return value === 'true' || value === true || value === '是' ? '是' : '否'
  }

  //账号目录树查询
  getTree() {
    this.loading = true;
    this.http.get<any>(`${this.treeUrl}`, {unit_id: this.accountId}).subscribe(res => {
      this.loading = false;
      if (res.code === 0) {
        let childrenUnits = res.data.childrenUnits;
        let children = childrenUnits.map(item => {
          return {
            title: item.unit_name,
            key: item.id,
            accounts: item.account,
            isLeaf: true,
            selected: this.selectNode && item.id === this.selectNode.key ? true : false,
          }
        })
        let extra = [{
          title: res.data.unit_name,
          key: res.data.id,
          accounts: res.data.accounts,
          selected: !this.selectNode || this.selectNode.key === res.data.id ? true : false,
          children: children
        }]
        this.trees = extra;
        if (this.selectNode) {
          const node = this.trees[0].children.filter(item => item.key === this.selectNode.key)[0]
          this.selectNode = node ? node : this.trees[0]
        } else {
          this.selectNode = this.trees[0]
        }
        this.nzClick(this.selectNode)
      }
    })
  }

  nzClick(nodeItem) {
    const node = Array.isArray(nodeItem) ? nodeItem[0] : nodeItem
    this.unitId = nodeItem.key || node.node.key
    this.getData()
  }

}

class params {
  id: number        //编号
  account: string;  //账号
  pass: string;     //登录密码
  name: string;    //姓名
  unit_id: number;  //所属单位
  phone: string;     //联系电话
  email: string;     //邮箱
  enable: boolean;  //是否启用
  on_trial: boolean;  //是否试用
  trial_end: string;  //试用到期时间
  role_id: string;  //角色
  super: boolean;  //是否为管理员
  manage_host?: string;  //管理主机授权
}
