import {Component, OnInit} from '@angular/core';
import {NzModalService, NzModalRef, NzMessageService} from 'ng-zorro-antd';
import {RuleFormComponent} from './rule-form/rule-form.component';
import {TongchangHttpService} from 'tongchang-lib';

import {GridAction} from '@/model/GridAction';
import {buttonAccess} from "@/config.const";

@Component({
  selector: 'app-rule-manage',
  templateUrl: './rule-manage.component.html',
  styleUrls: ['./rule-manage.component.scss']
})
export class RuleManageComponent implements OnInit {

  isAllDisplayDataChecked = false;
  isIndeterminate = false;
  position: string = 'bottom'
  listOfDisplayData: params[] = [];
  page = 1;
  size = 10;
  loading = true;
  total = 1;
  listOfAllData: params[] = []
  mapOfCheckedId: { [key: string]: boolean } = {};
  selectItems = []
  baseUrl = '/params'

  constructor(
    private modal: NzModalService,
    private msg: NzMessageService,
    private http: TongchangHttpService,
  ) {
  }


  gridActions: GridAction[];

  ngOnInit() {
    this.actionInit()
    // this.getData()
  }

  actionInit() {
    this.gridActions = [
      {
        name: '新增',
        icon: 'plus',
        code: 'param-setting_add',
        type: 'primary',
        click: () => {
          this.paramAdd()
        },
        isExist: buttonAccess("param-setting_add"),
      }, {
        name: '修改',
        icon: 'edit',
        code: 'param-setting_edit',
        type: 'default',
        click: () => {
          this.paramEdit()
        },
        isExist: buttonAccess("param-setting_edit"),
      }, {
        name: '删除',
        icon: 'delete',
        code: 'param-setting_delete',
        type: 'danger',
        click: () => {
          this.paramDelete()
        },
        isExist: buttonAccess("param-setting_delete"),
      },
      {
        name: '刷新',
        icon: 'redo',
        code: 'param-setting_reload',
        type: 'dashed',
        click: () => {
          this.paramQuery()
        },
        isExist: buttonAccess("param-setting_reload"),
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
  paramAdd() {
    const param = {
      fileurl: "",
      filename: "",
      filedesc: ""
    }
    let modalRef: NzModalRef = this.modal.create({
      nzTitle: "新增相关法规",
      nzContent: RuleFormComponent,
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
                const params = formVal;
                // this.http.post(this.baseUrl, params).subscribe(res => {
                //   if (res.code !== 0) {
                //     this.msg.error(res.message);
                //     return
                //   }
                //   this.msg.success(res.message);
                //   this.getData();
                // })
              }
            })
            modalRef.close()
          }
        }
      ],
      nzWrapClassName: 'modal-vertical-center'
    })
  }

  //修改操作
  paramEdit() {
    const param = this.selectItems[0]
    if (this.selectItems.length !== 1) {
      this.msg.warning('请选择一项数据进行操作!')
      return;
    }
    let modalRef: NzModalRef = this.modal.create({
      nzTitle: "修改相关法规",
      nzContent: RuleFormComponent,
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
                // this.http.put(this.baseUrl, params).subscribe(res => {
                //   if (res.code !== 0) {
                //     this.msg.error(res.message);
                //     return
                //   }
                //   this.msg.success(res.message);
                //   this.getData();
                // })
              }
            })
            modalRef.close()
          }
        }
      ],
      nzWrapClassName: 'modal-vertical-center'
    })

  }

  //删除操作
  paramDelete() {
    if (this.selectItems.length === 0) {
      this.msg.warning('请先选择数据进行操作!')
      return;
    }
    const selectedIds = this.selectItems.map(it => it.id) + ''
    this.modal.confirm({
      nzTitle: '删除',
      nzContent: '确认删除?',
      nzOnOk: () => {
        // this.http.delete(`${this.baseUrl}/${selectedIds}`).subscribe(res => {
        //   if (res.code !== 0) {
        //     this.msg.error(res.message);
        //     return
        //   }
        //   this.msg.success(res.message);
        //   this.getData();
        // })
      }
    })
  }

  //刷新
  paramQuery() {
    // this.getData()
  }

  //初始出请求
  getData() {
    this.mapOfCheckedId = {}
    this.loading = true;
    this.http.get<any>(`${this.baseUrl}?page=${this.page}&size=${this.size}`).subscribe(res => {
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

}

class params {
  filename: string;
  filedesc: string;
  fileurl: string;
  id: number;
  create_time: string;
  update_time: string;
  version: number;
}
