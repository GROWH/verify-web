import { Component, OnInit } from "@angular/core";
import { NzModalService, NzModalRef, NzMessageService } from "ng-zorro-antd";
import { TongchangHttpService } from "tongchang-lib";
import { ThermometerFormComponent } from "./thermometer-form/thermometer-form.component";
import { ParamDesginFormComponent } from "./param-desgin-form/param-desgin-form.component";
import { ReuploadFormComponent } from "./reupload-form/reupload-form.component";

import { GridAction } from "@/model/GridAction";
import { buttonAccess } from "@/config.const";

@Component({
  selector: "app-thermometer",
  templateUrl: "./thermometer.component.html",
  styleUrls: ["./thermometer.component.scss"],
})
export class ThermometerComponent implements OnInit {
  isAllDisplayDataChecked = false;
  isIndeterminate = false;
  position: string = "bottom";
  listOfDisplayData: params[] = [];
  page = 1;
  size = 10;
  loading = true;
  total = 1;
  listOfAllData: params[] = [];
  mapOfCheckedId: { [key: string]: boolean } = {};
  selectItems = [];
  baseUrl = "/thermometerManage";
  configUrl = "/thermometerManage/updateConfigure";
  uploadUrl = "/thermometerManage/reUploadData";

  constructor(
    private modal: NzModalService,
    private msg: NzMessageService,
    private http: TongchangHttpService
  ) {}

  gridActions: GridAction[];
  tableHeight: number = 0;

  ngOnInit() {
    this.tableHeight = document.body.offsetHeight - 300;
    this.actionInit();
    this.getData();
  }

  actionInit() {
    this.gridActions = [
      {
        name: "新增",
        icon: "plus",
        code: "thermometer_add",
        type: "primary",
        click: () => {
          this.paramAdd();
        },
        isExist: buttonAccess("thermometer_add"),
      },
      {
        name: "修改",
        icon: "edit",
        code: "thermometer_edit",
        type: "default",
        click: () => {
          this.paramEdit();
        },
        isExist: buttonAccess("thermometer_edit"),
      },
      {
        name: "参数设定",
        icon: "edit",
        code: "thermometer_setParam",
        type: "default",
        click: () => {
          this.paramsDesign();
        },
        isExist: buttonAccess("thermometer_setParam"),
      },
      {
        name: "重传",
        icon: "edit",
        code: "thermometer_reUpload",
        type: "default",
        click: () => {
          this.reUpload();
        },
        isExist: buttonAccess("thermometer_reUpload"),
      },
      {
        name: "删除",
        icon: "delete",
        code: "thermometer_delete",
        type: "danger",
        click: () => {
          this.paramDelete();
        },
        isExist: buttonAccess("thermometer_delete"),
      },
      {
        name: "刷新",
        icon: "redo",
        code: "thermometer_reload",
        type: "dashed",
        click: () => {
          this.paramQuery();
        },
        isExist: buttonAccess("thermometer_reload"),
      },
    ];
  }

  refreshStatus(): void {
    this.isAllDisplayDataChecked = this.listOfDisplayData.every(
      (item) => this.mapOfCheckedId[item.id]
    );
    let checkId = this.mapOfCheckedId;
    this.selectItems = this.listOfDisplayData
      .map((item) => {
        for (let key in checkId) {
          if (checkId[key] && Number(key) === item.id) {
            return item;
          }
        }
      })
      .filter((item) => item);
    this.isIndeterminate =
      this.listOfDisplayData.some((item) => this.mapOfCheckedId[item.id]) &&
      !this.isAllDisplayDataChecked;
  }

  checkAll(value: boolean): void {
    this.listOfDisplayData.forEach(
      (item) => (this.mapOfCheckedId[item.id] = value)
    );
    this.refreshStatus();
  }
  //新增操作
  paramAdd() {
    const param = {
      name: "",
      value: "",
      code: "",
    };
    let modalRef: NzModalRef = this.modal.create({
      nzTitle: "参数配置",
      nzContent: ThermometerFormComponent,
      nzWidth: 700,
      nzComponentParams: { param },
      nzMaskClosable: false,
      nzFooter: [
        {
          label: "取消",
          onClick: () => modalRef.close(),
        },
        {
          label: "确定",
          type: "primary",
          disabled: (comp) => !comp.validateForm.valid,
          onClick: (comp) => {
            let formVal = comp.validateForm.getRawValue();
            this.modal.confirm({
              nzTitle: "提交",
              nzContent: "确认提交?",
              nzOnOk: () => {
                const params = formVal;
                this.http.post(this.baseUrl, params).subscribe((res) => {
                  if (res.code !== 0) {
                    this.msg.error(res.message);
                    return;
                  }
                  this.msg.success(res.message);
                  this.getData();
                });
              },
            });
            modalRef.close();
          },
        },
      ],
      nzWrapClassName: "modal-vertical-center",
    });
  }
  //修改操作
  paramEdit() {
    const param = this.selectItems[0];
    if (this.selectItems.length !== 1) {
      this.msg.warning("请选择一项数据进行操作!");
      return;
    }
    let modalRef: NzModalRef = this.modal.create({
      nzTitle: "参数配置",
      nzContent: ThermometerFormComponent,
      nzWidth: 700,
      nzComponentParams: { param },
      nzFooter: [
        {
          label: "取消",
          onClick: () => modalRef.close(),
        },
        {
          label: "确定",
          type: "primary",
          disabled: (comp) => !comp.validateForm.valid,
          onClick: (comp) => {
            let formVal = comp.validateForm.getRawValue();
            this.modal.confirm({
              nzTitle: "提交",
              nzContent: "确认提交?",
              nzOnOk: () => {
                const params = {
                  ...param,
                  ...formVal,
                };
                this.http.put(this.baseUrl, params).subscribe((res) => {
                  if (res.code !== 0) {
                    this.msg.error(res.message);
                    return;
                  }
                  this.msg.success(res.message);
                  this.getData();
                });
              },
            });
            modalRef.close();
          },
        },
      ],
      nzWrapClassName: "modal-vertical-center",
    });
  }
  //删除操作
  paramDelete() {
    if (this.selectItems.length === 0) {
      this.msg.warning("请先选择数据进行操作!");
      return;
    }
    const selectedIds = this.selectItems.map((it) => it.id) + "";
    this.modal.confirm({
      nzTitle: "删除",
      nzContent: "确认删除?",
      nzOnOk: () => {
        this.http.delete(`${this.baseUrl}/${selectedIds}`).subscribe((res) => {
          if (res.code !== 0) {
            this.msg.error(res.message);
            return;
          }
          this.msg.success(res.message);
          this.getData();
        });
      },
    });
  }
  //刷新
  paramQuery() {
    this.getData();
  }
  ///参数设定
  paramsDesign() {
    const param = this.selectItems[0];
    if (this.selectItems.length !== 1) {
      this.msg.warning("请选择一项数据进行操作!");
      return;
    }
    let modalRef: NzModalRef = this.modal.create({
      nzTitle: "参数配置",
      nzContent: ParamDesginFormComponent,
      nzWidth: 900,
      nzComponentParams: { param },
      nzFooter: [
        {
          label: "取消",
          onClick: () => modalRef.close(),
        },
        {
          label: "确定",
          type: "primary",
          disabled: (comp) => !comp.validateForm.valid,
          onClick: (comp) => {
            let formVal = comp.validateForm.getRawValue();
            this.modal.confirm({
              nzTitle: "提交",
              nzContent: "确认提交?",
              nzOnOk: () => {
                const params = {
                  ...param,
                  ...formVal,
                };
                this.http.put(this.configUrl, params).subscribe((res) => {
                  if (res.code !== 0) {
                    this.msg.error(res.message);
                    return;
                  }
                  this.msg.success(res.message);
                  this.getData();
                });
              },
            });
            modalRef.close();
          },
        },
      ],
      nzWrapClassName: "modal-vertical-center",
    });
  }
  // 重传
  reUpload() {
    const param = this.selectItems[0];
    if (this.selectItems.length !== 1) {
      this.msg.warning("请选择一项数据进行操作!");
      return;
    }
    let modalRef: NzModalRef = this.modal.create({
      nzTitle: "参数配置",
      nzContent: ReuploadFormComponent,
      nzWidth: 600,
      nzComponentParams: { param },
      nzFooter: [
        {
          label: "取消",
          onClick: () => modalRef.close(),
        },
        {
          label: "确定",
          type: "primary",
          disabled: (comp) => !comp.validateForm.valid,
          onClick: (comp) => {
            let formVal = comp.validateForm.getRawValue();
            this.modal.confirm({
              nzTitle: "提交",
              nzContent: "确认提交?",
              nzOnOk: () => {
                const params = {
                  ...param,
                  ...formVal,
                };
                this.http.put(this.uploadUrl, params).subscribe((res) => {
                  if (res.code !== 0) {
                    this.msg.error(res.message);
                    return;
                  }
                  this.msg.success(res.message);
                  this.getData();
                });
              },
            });
            modalRef.close();
          },
        },
      ],
      nzWrapClassName: "modal-vertical-center",
    });
  }

  //初始出请求
  getData() {
    this.mapOfCheckedId = {};
    this.loading = true;
    this.http
      .get<any>(`${this.baseUrl}?pageIndex=${this.page}&pageSize=${this.size}`)
      .subscribe((res) => {
        this.loading = false;
        if (res.code === 0) {
          this.listOfDisplayData = res.data;
          this.total = res.data.length;
          this.refreshStatus();
        }
      });
  }

  changePageIndex(pageIndex) {
    this.page = pageIndex;
    this.getData();
  }
  changePageSize(pageSize) {
    this.size = pageSize;
    this.getData();
  }
  //在线状态判断
  isOnlineStatus(status){
    let onStaatus = ''
    if(status == true){
      onStaatus= '在线'
    }else if(status == false){
      onStaatus= '不在线'
    }else if(status == null){
      onStaatus= '未绑定'
    }
    return onStaatus
  }



}
class params {
  id: number;
  buy_time: string; // 购买时间
  thermometer_code: string; // 温度计编号
  factory: string; //厂家
  use_location: string; // 使用位置
  purpose: string; // 用途----(库房监测、验证、运输、其它)
  usage_state: string; // 使用状态---(使用中、未使用、维修中、报损、丢失、校准中、停用、转让)
  model: string; // 型号
  supplier: string; // 供应商
  purchase_price: string; // 采购价格
  nextAline_time?: string; // 下次校准时间
  mark: string; // 备注
  unit_id: string; // 温度计所属单位
  create_time: string;
  update_time: string;
  version: number;
}
