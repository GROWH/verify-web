import { Component, OnInit } from '@angular/core';
import { NzModalService, NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { TongchangHttpService } from 'tongchang-lib';
import { FacilityBaseFormComponent } from './facility-base-form/facility-base-form.component';

import {GridAction} from '@/model/GridAction';
import {buttonAccess} from '../../../config.const';

@Component({
  selector: 'app-facility-base',
  templateUrl: './facility-base.component.html',
  styleUrls: ['./facility-base.component.scss']
})


export class FacilityBaseComponent implements OnInit {

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
  baseUrl='/infrastructure'
  submitAudit='/unit/submitAudit'

  constructor(
    private modal: NzModalService,
    private msg: NzMessageService,
    private http: TongchangHttpService,
  ) {
    // this.http.addHeader('account_id','14');
    // this.http.addHeader('unit_id','10');
   }

  gridActions: GridAction[];

  ngOnInit() {
    this.actionInit()
    this.getData()
  }

  actionInit() {
    this.gridActions = [
      {
        name: '新增',
        icon: 'plus',
        code: 'facility-base_add',
        type: 'primary',
        click: () => {
          this.Add()
        },
        isExist: buttonAccess('facility-base_add'),
      }, {
        name: '修改',
        icon: 'edit',
        code: 'facility-base_edit',
        type: 'default',
        click: () => {
          this.Edit()
        },
        isExist: buttonAccess('facility-base_edit'),
      }, {
        name: '删除',
        icon: 'delete',
        code: 'facility-base_delete',
        type: 'danger',
        click: () => {
          this.Delete()
        },
        isExist: buttonAccess('facility-base_delete'),
      },
      {
        name: '刷新',
        icon: 'redo',
        code: 'facility-base_reload',
        type: 'dashed',
        click: () => {
          this.Query()
        },
        isExist: buttonAccess('facility-base_reload'),
      }
    ]
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
      nzContent:FacilityBaseFormComponent,
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
      nzContent:FacilityBaseFormComponent,
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
    this.modal.confirm({
      nzTitle:'删除',
      nzContent:'确认删除?',
      nzOnOk:() => {
        this.http.delete(`${this.baseUrl}/${selectedIds}`).subscribe(res => {
          if(res.code !==0) {
            this.msg.error(res.message);
            return
          }
          this.msg.success(res.message);
          this.getData();
        })
      }
    })
  }
  //提交审核

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
  goods_no:string;  //货号
  name:string;     //名称
  product_busi:string;    //生产企业
  norms:number;  // 规格
  model_num:string;  // 型号
  quality_period:string;   //保质期
  price:string;  //采购金额
  curing	:string;  // 养护事项
  curing_cycle:string;  // 养护周期
  aline?:string;  //校准/校正事项
  aline_cycle?:string;  // 校准/校正周期
  mark?:string;  //备注
}
