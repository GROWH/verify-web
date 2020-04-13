import { Component, OnInit } from '@angular/core';
import { NzModalService, NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { TongchangHttpService } from 'tongchang-lib';
import { ManageFormComponent } from './manage-form/manage-form.component';

@Component({
  selector: 'app-unit-manage',
  templateUrl: './unit-manage.component.html',
  styleUrls: ['./unit-manage.component.scss']
})

export class UnitManageComponent implements OnInit {

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
  baseUrl='/unit'
  submitAudit='/unit/submitAudit'

  constructor(
    private modal: NzModalService,
    private msg: NzMessageService,
    private http: TongchangHttpService,
  ) { }

  ngOnInit() {
    this.getData()
  }

  refreshStatus(): void {
    this.isAllDisplayDataChecked = this.listOfDisplayData.every((item) => this.mapOfCheckedId[item.id]);
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
  //新增操作
  Add() {
    const param = new params;
    let modalRef:NzModalRef = this.modal.create({
      nzTitle:"参数配置",
      nzContent:ManageFormComponent,
      nzWidth:700,
      nzComponentParams:{param},
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
            this.modal.confirm({
              nzTitle: '提交',
              nzContent: '确认提交?',
              nzOnOk: () => {
                const params = formVal;
                this.http.post(this.baseUrl,params).subscribe(res => {
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
  //修改操作
  Edit() {
    const param = this.selectItems[0]
    if(this.selectItems.length !== 1 ) {
      this.msg.warning('请选择一项数据进行操作!')
      return;
    }
    if(this.selectItems[0].state === '待审核' || this.selectItems[0].state ==='审核通过') {   this.msg.warning("请选择状态为'草稿'或'审核不通过'的数据项进行操作!");return;}
    let modalRef:NzModalRef = this.modal.create({
      nzTitle:"参数配置",
      nzContent:ManageFormComponent,
      nzWidth:700,
      nzComponentParams:{param},
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
            this.modal.confirm({
              nzTitle: '提交',
              nzContent: '确认提交?',
              nzOnOk: () => {
                const params = {
                  ...param,
                  ...formVal
                };
                this.http.put(this.baseUrl,params).subscribe(res => {
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
  //删除操作
  Delete() {
    if(this.selectItems.length === 0 ) {
      this.msg.warning('请先选择数据进行操作!')
      return;
    }
    const flag = this.selectItems.every(item => item.state !== '待审核' && item.state !== '审核通过')
    if( !flag) {this.msg.warning("请选择状态为'草稿'或'审核不通过'的数据项进行操作!"); return;}
    const selectedIds = this.selectItems.map(it => it.id) + ''
    this.http.delete(`${this.baseUrl}/${selectedIds}`).subscribe(res => {
      if(res.code !==0) {
        this.msg.error(res.message);
        return
      }
      this.msg.success(res.message);
      this.getData();
    })
  }
  //提交审核
  submitCheck() {
    if(this.selectItems.length === 0 ) {
      this.msg.warning('请先选择数据进行操作!')
      return;
    }
    const flag = this.selectItems.every(it => it.state === '草稿')
    if(!flag) {
      this.msg.warning('请选择草稿状态的数据项进行操作')
      return;
    }
    const selectedIds = this.selectItems.map(it => it.id) + ''
    this.http.get(`${this.submitAudit}?ids=${selectedIds}`).subscribe(res => {
      if(res.code !== 0) {
        this.msg.error(res.message);
        return
      }
      this.msg.success(res.message);
      this.getData();
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
