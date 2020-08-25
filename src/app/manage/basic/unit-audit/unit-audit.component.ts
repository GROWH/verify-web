import { Component, OnInit } from '@angular/core';
import { NzModalService, NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { TongchangHttpService } from 'tongchang-lib';
import { AuditFormComponent } from './audit-form/audit-form.component';

import {GridAction} from '@/model/GridAction';
import {buttonAccess} from '../../../config.const';

@Component({
  selector: 'app-unit-audit',
  templateUrl: './unit-audit.component.html',
  styleUrls: ['./unit-audit.component.scss']
})

export class UnitAuditComponent implements OnInit {

  isAllDisplayDataChecked = false;
  isIndeterminate = false;
  position:string = 'bottom'
  listOfDisplayData:params[] = [];
  page = 1;
  size = 10;
  loading = true;
  total = 1;
  listOfAllData:params[] = []
  mapOfCheckedId: { [key: string]: boolean } = {};
  selectItems = []
  baseUrl='/unit/unaudit'
  auditUrl='/unit/audit'

  constructor(
    private modal: NzModalService,
    private msg: NzMessageService,
    private http: TongchangHttpService,
  ) { }

  gridActions: GridAction[];

  ngOnInit() {
    this.actionInit()
    this.getData()
  }

  actionInit() {
    this.gridActions = [
       {
        name: '审核',
        icon: 'check',
        code: 'unit-audit_audit',
        type: 'default',
        click: () => {
          this.audit()
        },
         isExist: buttonAccess('unit-audit_audit'),
      },
      {
        name: '刷新',
        icon: 'redo',
        code: 'unit-audit_reload',
        type: 'dashed',
        click: () => {
          this.Query()
        },
        isExist: buttonAccess('unit-audit_reload'),
      }
    ]
  }

  refreshStatus(): void {
    this.isAllDisplayDataChecked = this.listOfDisplayData.length !== 0 && this.listOfDisplayData.every((item) => this.mapOfCheckedId[item.id]);
    let checkId = this.mapOfCheckedId
    this.selectItems = this.listOfDisplayData.map((item) => {
      for(let key in checkId) {
        if(checkId[key] && Number(key) === item.id) {
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

  //审核操作

  audit() {
    if(this.selectItems.length !== 1 ) {
      this.msg.warning('请选择一项数据进行操作!')
      return;
    }
    let modalRef:NzModalRef = this.modal.create({
      nzTitle:"单位审核",
      nzContent:AuditFormComponent,
      nzWidth:700,
      nzFooter:[
        {
          label:'取消',
          onClick:() => modalRef.close()
        },
        {
          label:'确定',
          type:'primary',
          disabled:comp => !comp.validateForm.valid,
          onClick:(comp) => {
            let formVal = comp.validateForm.getRawValue()
            const params = {
              id:this.selectItems[0].id,
              state:formVal.state,
              audit_mark:formVal.audit_mark ? formVal.audit_mark : ''
            }
            this.modal.confirm({
              nzTitle: '提交',
              nzContent: '确认提交?',
              nzOnOk: () => {
                this.http.get(this.auditUrl,params).subscribe(res => {
                  if(res.code !==0) {
                    this.msg.error(res.message);
                    return
                  }
                  this.msg.success(res.message);
                  this.getData();
                })
              }
            })
            modalRef.close()
          }
        }
      ],
      nzWrapClassName: 'modal-vertical-center'
    })
  }
  //刷新
  Query() {
    this.getData()
  }

  //初始出请求
  getData() {
    this.mapOfCheckedId = {}
    this.loading = true;
    this.http.get<any>(`${this.baseUrl}?page=${this.page}&size=${this.size}`).subscribe(res => {
      this.loading = false;
      if(res.code === 0) {
        this.listOfDisplayData = res.data.list;
        this.refreshStatus()
      }
    })
  }

  changePageIndex(pageIndex) {
    this.page = pageIndex;
    this.getData()
  }
  changePageSize (pageSize) {
    this.size = pageSize
    this.getData()
  }
  yesOrno(value) {
    return value === 'true' || value === true || value === '是' ? '是' : '否'
  }

}
class params {
  id:number        //编号
  unit_name:string;  //单位名称
  social_code:string;     //统一社会信用代码
  parent_id:string;    //上级单位
  unit_type:number;  //单位类型
  state:string;     //状态
  fixed_phone:string;     //单位固话
  linkman:boolean;  //联系人
  cell_phone:boolean;  //联系人手机
  unit_address	:string;  //单位地址
  unit_email:string;  //邮箱
  fax:boolean;  //传真
  bank?:string;  //开户银行
  bank_account?:string;  //银行账号
  auditor?:string;  //审核人
  audit_mark?:string;  //审核备注
  audit_time?:string;  //审核时间
  mark?:string;  //备注
}
