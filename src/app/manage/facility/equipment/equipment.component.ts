import {Component, OnInit} from '@angular/core';
import {NzMessageService, NzModalRef, NzModalService} from "ng-zorro-antd";
import {TongchangHttpService} from "tongchang-lib";

import {GridAction} from '@/model/GridAction';
import {buttonAccess} from "@/config.const";
import {EquipmentFormComponent} from "@/manage/facility/equipment/equipment-form/equipment-form.component";

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.scss']
})
export class EquipmentComponent implements OnInit {

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
  baseUrl = '/equipment';

  constructor(
    private modal: NzModalService,
    private msg: NzMessageService,
    private http: TongchangHttpService,
  ) {
  }

  gridActions: GridAction[];
  tableHeight:number=0;

  ngOnInit() {
    this.tableHeight = document.body.offsetHeight - 300;
    this.actionInit()
    this.getData()
  }
  //页面按钮
  actionInit() {
    this.gridActions = [
      {
        name: '新增',
        icon: 'plus',
        code: 'equipment_add',
        type: 'primary',
        click: () => {
          this.paramAdd()
        },
        isExist: buttonAccess("equipment_add"),
      }, {
        name: '修改',
        icon: 'edit',
        code: 'equipment_edit',
        type: 'default',
        click: () => {
          this.paramEdit()
        },
        isExist: buttonAccess("equipment_edit"),
      }, {
        name: '删除',
        icon: 'delete',
        code: 'equipment_delete',
        type: 'danger',
        click: () => {
          this.paramDelete()
        },
        isExist: buttonAccess("equipment_delete"),
      },
      {
        name: '刷新',
        icon: 'redo',
        code: 'equipment_reload',
        type: 'dashed',
        click: () => {
          this.paramQuery()
        },
        isExist: buttonAccess("equipment_reload"),
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
      supplier: '',
      pur_price: '',
      pur_person: '',
      location: '',
      unit: '',
      curator: '',
      product_date: '',
      expect_date: '',
      state: '',
      picture: '',
      mark: '',
    }
    let modalRef: NzModalRef = this.modal.create({
      nzTitle: "添加设备信息",
      nzContent: EquipmentFormComponent,
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
          disabled: comp => {
            console.log(comp)
            return !comp.validateForm.valid
          },
          onClick: (comp) => {
            let formVal = comp.validateForm.getRawValue()
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
  paramEdit() {
    const param = this.selectItems[0]
    if (this.selectItems.length !== 1) {
      this.msg.warning('请选择一项数据进行操作!')
      return;
    }
    let modalRef: NzModalRef = this.modal.create({
      nzTitle: "修改设备信息",
      nzContent: EquipmentFormComponent,
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
        this.http.delete(`${this.baseUrl}/${selectedIds}`).subscribe(res => {
          if (res.code !== 0) {
            this.msg.error(res.message);
            return
          }
          this.msg.success(res.message);
          this.getData();
        })
      }
    })
  }

  //刷新
  paramQuery() {
    this.getData()
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
  supplier: string;
  pur_price: string;
  pur_person: string;
  location: string;
  unit: string;
  curator: string;
  product_date: string;
  expect_date: string;
  state: string;
  mark: string;
  picture: string;
}
