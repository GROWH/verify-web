import {Component, OnInit} from '@angular/core';
import {NzMessageService, NzModalRef, NzModalService} from "ng-zorro-antd";
import {TongchangHttpService} from "tongchang-lib";

import {GridAction} from '@/model/GridAction';
import {buttonAccess} from "@/config.const";
import {RecordFormComponent} from "@/manage/facility/equipment-record/record-form/record-form.component";

@Component({
  selector: 'app-equipment-record',
  templateUrl: './equipment-record.component.html',
  styleUrls: ['./equipment-record.component.scss']
})
export class EquipmentRecordComponent implements OnInit {
  isAllDisplayDataChecked = false;
  isIndeterminate = false;
  position: string = 'bottom'
  listOfDisplayData: params[] = [];
  page = 1;
  size = 10;
  loading = true;
  total = 1;
  mapOfCheckedId: { [key: string]: boolean } = {};
  selectItems = [];
  baseUrl = '/equipmentRecord';
  equipmentUrl = '/equipment';
  equipmentList = []; //设备列表
  selectedItem: params;

  constructor(
    private modal: NzModalService,
    private msg: NzMessageService,
    private http: TongchangHttpService,
  ) {
  }

  gridActions: GridAction[];
  tableWidth: number = 0;
  tableHeight: number = 0;

  ngOnInit() {
    this.tableWidth = document.body.offsetWidth - 624;
    this.tableHeight = document.body.offsetHeight - 300;
    this.actionInit()
    this.getEquipment()
  }

  //页面按钮
  actionInit() {
    this.gridActions = [
      {
        name: '新增',
        icon: 'plus',
        code: 'record_add',
        type: 'primary',
        click: () => {
          this.paramAdd()
        },
        isExist: buttonAccess("record_add"),
      }, {
        name: '修改',
        icon: 'edit',
        code: 'record_edit',
        type: 'default',
        click: () => {
          this.paramEdit()
        },
        isExist: buttonAccess("record_edit"),
      }, {
        name: '删除',
        icon: 'delete',
        code: 'record_delete',
        type: 'danger',
        click: () => {
          this.paramDelete()
        },
        isExist: buttonAccess("record_delete"),
      },
      {
        name: '刷新',
        icon: 'redo',
        code: 'record_reload',
        type: 'dashed',
        click: () => {
          this.paramQuery()
        },
        isExist: buttonAccess("record_reload"),
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
    this.listOfDisplayData.forEach(item => (this.mapOfCheckedId[item.equipment_id] = value));
    this.refreshStatus();
  }

  //新增操作
  paramAdd() {
    const param = {
      change_type: '',
      curing_period: '',
      curing_date: '',
      next_curing_date: '',
      warn_time: '',
      mark: '',
      picture: '',
    }
    let modalRef: NzModalRef = this.modal.create({
      nzTitle: "添加设备信息",
      nzContent: RecordFormComponent,
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
                params.equipment_id = this.selectedItem.id;
                this.http.post(this.baseUrl, params).subscribe(res => {
                  if (res.code !== 0) {
                    this.msg.error(res.message);
                    return
                  }
                  this.msg.success(res.message);
                  this.nodeClick(this.selectedItem)
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
  paramEdit() {
    const param = this.selectItems[0]
    if (this.selectItems.length !== 1) {
      this.msg.warning('请选择一项数据进行操作!')
      return;
    }
    let modalRef: NzModalRef = this.modal.create({
      nzTitle: "修改设备信息",
      nzContent: RecordFormComponent,
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
                  this.nodeClick(this.selectedItem)
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
  paramDelete() {
    if (this.selectItems.length !== 1) {
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
          this.nodeClick(this.selectedItem)
        })
      }
    })
  }

  //刷新
  paramQuery() {
    this.nodeClick(this.selectedItem)
  }

  getEquipment() {
    this.http.get<any>(this.equipmentUrl).subscribe(res => {
      if (res.code === 0) {
        this.equipmentList = res.data
        this.selectedItem = res.data[0]
        this.nodeClick(this.selectedItem)
      }
    })
  }

  nodeClick(node) {
    this.selectedItem = node;
    //查询选中所属单位的设备操作记录
    this.http.get<any>(`${this.equipmentUrl}/${node.id}`).subscribe(res => {
      if (res.code === 0) {
        this.listOfDisplayData = res.data.record;
        this.isAllDisplayDataChecked = false;
        this.mapOfCheckedId = {};
      }
    })
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
  id: number;
  equipment_id: number;
  change_type: string;
  curing_period: string;
  curing_date: string;
  next_curing_date: string;
  warn_time: string;
  picture: string;
  mark: string;
}
