import { Component, OnInit } from '@angular/core';
import { NzModalService, NzModalRef, NzMessageService, NzTreeNodeOptions, NzTreeComponent } from 'ng-zorro-antd';
import { TongchangHttpService } from 'tongchang-lib';
import { ThermManageFormComponent } from './therm-manage-form/therm-manage-form.component';

import {GridAction} from '@/model/GridAction';
import {buttonAccess} from "@/config.const";

@Component({
  selector: 'app-therm-manage',
  templateUrl: './therm-manage.component.html',
  styleUrls: ['./therm-manage.component.scss']
})

export class ThermManageComponent implements OnInit {

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
  thermometeList = [] //温度计列表
  baseUrl='/thermometerRecord'
  thermometerUrl='/thermometerManage' //查询温度计
  selectedItem:params


  constructor(
    private modal: NzModalService,
    private msg: NzMessageService,
    private http: TongchangHttpService,
  ) { }

  gridActions: GridAction[];

  ngOnInit() {
    this.actionInit()
    this.getthermomete()
  }

  actionInit() {
    this.gridActions = [
      {
        name: '新增',
        icon: 'plus',
        code: 'therm-manage_add',
        type: 'primary',
        click: () => {
          this.Add()
        },
        isExist: buttonAccess("therm-manage_add"),
      }, {
        name: '修改',
        icon: 'edit',
        code: 'therm-manage_edit',
        type: 'default',
        click: () => {
          this.Edit()
        },
        isExist: buttonAccess("therm-manage_edit"),
      }, {
        name: '删除',
        icon: 'delete',
        code: 'therm-manage_delete',
        type: 'danger',
        click: () => {
          this.Delete()
        },
        isExist: buttonAccess("therm-manage_delete"),
      },
      {
        name: '刷新',
        icon: 'redo',
        code: 'therm-manage_reload',
        type: 'dashed',
        click: () => {
          this.Query()
        },
        isExist: buttonAccess("therm-manage_reload"),
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
      nzContent:ThermManageFormComponent,
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
                let date = new Date(JSON.parse(JSON.stringify(formVal.aline_tine)));
                const params = {
                  ...formVal,
                  aline_expire_time: date.setFullYear(date.getFullYear()+1)
                };
                this.http.post(`${this.baseUrl}?tid=${this.selectedItem.id}`,params).subscribe(res => {
                  if(res.code !==0) {
                    this.msg.error(res.message);
                    return
                  }
                  this.msg.success(res.message);
                  modalRef.close()
                  this.nodeClick(this.selectedItem);
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
    let modalRef:NzModalRef = this.modal.create({
      nzTitle:"参数配置",
      nzContent:ThermManageFormComponent,
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
                  modalRef.close()
                  this.nodeClick(this.selectedItem);
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
    if(this.selectItems.length === 0 ) {
      this.msg.warning('请先选择数据进行操作!')
      return;
    }
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
          this.nodeClick(this.selectedItem);
        })
      }
    })
  }
  //刷新
  Query() {
    this.nodeClick(this.selectedItem)
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


  getthermomete () {
    this.http.get<any>(this.thermometerUrl).subscribe(res => {
      if(res.code === 0) {
        this.thermometeList = res.data
        this.selectedItem = res.data[0]
        this.nodeClick(this.selectedItem)
      }
    })
  }
  nodeClick(node){
    this.selectedItem = node;
    //查询选中温度计的校准记录
    this.http.get<any>(`${this.thermometerUrl}/${node.id}`).subscribe(res => {
      if(res.code === 0 ) {
        this.listOfDisplayData = res.data.records;
        this.isAllDisplayDataChecked = false;
        this.mapOfCheckedId = {};
      }
    })
  }

}
class params {
  id:number        //编号
  thermometer_code:string;  //温度计编号
  thermometer_id:string;     //温度计id
  info_record_time:string;    //信息记录时间
  manage_type:string;  // 管理类型 (使用中、未使用、维修中、报损、丢失、校准中、停用、转让)
  exp_person:string;     // 经手人
  mark:string;     // 备注
  aline_cer_code:number;  // 校准证书编号
  aline_unit:string;  // 校准单位
  inspect_time	:string;  // 送检时间
  inspect_person:string;  // 送检人
  aline_tine:boolean;  // 校准时间
  aline_expire_time:string;  // 校准到期时间
  next_aline_remind_time:string;  // 下次校准预警提醒时间
}
