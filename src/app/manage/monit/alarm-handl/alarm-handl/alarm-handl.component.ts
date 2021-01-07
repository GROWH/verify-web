import { Component, OnInit } from "@angular/core";

import { NzModalService, NzModalRef, NzMessageService } from "ng-zorro-antd";
import { TongchangHttpService } from "tongchang-lib";
import { PointRecordComponent } from "../../../../shared/components/point-record/point-record.component";
import { HandleStateFormComponent } from "../handle-state-form/handle-state-form.component";

import { GridAction } from "@/model/GridAction";
import { buttonAccess } from "@/config.const";

@Component({
  selector: "app-alarm-handl",
  templateUrl: "./alarm-handl.component.html",
  styleUrls: ["./alarm-handl.component.scss"],
})
export class AlarmHandlComponent implements OnInit {
  //表格
  // listOfData: TableList[] = [];
  listOfData: TableList[] = [
    {
      cname: "tring", //库房名称
      pname: "tring", //测点位置
      alarm_time: "2020-10-20", //开始时间
      alarm_time_end: "2020-10-28", //结束时间
      alarm_type: "哈哈", //类型
      temp_up: "tring", //温度范围(℃)
      temp_down: "tring", //温度范围(℃)
      humi_up: "tring", //湿度范围(%)
      humi_down: "tring", //湿度范围(%)
      state: "tring", //处理状态
      cause: "tring", //报警原因
      method: "tring", //处理方法
      remarks: "tring", //处理人
      processor: "tring", //备注
    },
  ];
  unitList = []; //库房名称
  page = 1;
  size = 10;
  loading = true;
  total = 1;
  houseNameUrl = "/storehouse"; //库房名称
  baseUrl = "/alarmrecord"; //初始出请求
  tableHeight: number = 0;
  gridActions: GridAction[] = [];
  constructor(
    private modal: NzModalService,
    private msg: NzMessageService,
    private http: TongchangHttpService
  ) {}

  ngOnInit() {
    this.tableHeight = document.body.offsetHeight - 300;
    this.actionInit();
    this.getunit();
    this.getData();
  }
  //页面按钮
  actionInit() {
    this.gridActions = [
      {
        name: "刷新",
        icon: "download",
        code: "alarm-handl_reload",
        type: "default",
        click: () => {
          this.refreshStatus();
        },
        isExist: buttonAccess("alarm-handl_reload"),
      },
      {
        name: "查询",
        icon: "search",
        code: "alarm-handl_search",
        type: "primary",
        click: () => {
          this.getData();
        },
        isExist: buttonAccess("alarm-handl_search"),
      },
    ];
  }
  // 刷新
  refreshStatus(): void {
    this.loading = true;
    this.http
      .get<any>(`${this.baseUrl}?page=${this.page}&size=${this.size}`)
      .subscribe((res) => {
        this.loading = false;
        if (res.code === 0) {
          this.listOfData = res.data.list;
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
  //持续时间
  timeGap(record) {
    var end = new Date(record.alarm_time_end).getTime();
    var start = new Date(record.alarm_time).getTime();

    return end - start;
  }

  //处理状态
  handles(house: TableList) {
    const modalRef: NzModalRef = this.modal.create({
      nzTitle: "处理状态",
      nzContent: HandleStateFormComponent,
      nzComponentParams: { house },
      nzMaskClosable: false,
      nzWrapClassName: "modal-vertical-center",
      nzWidth: 900,
      nzFooter: [
        {
          label: "取消",
          onClick: () => modalRef.close(),
        },
        {
          label: "确定",
          type: "primary",
          disabled: (comp) => !comp.form.valid,
          onClick: (comp) => {
            let formVal = comp.form.getRawValue();
            this.modal.confirm({
              nzTitle: "提交",
              nzContent: "确认提交?",
              nzOnOk: () => {
                const house = formVal;
                this.http.put(this.baseUrl, house).subscribe((res) => {
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
    });
  }

  //初始出请求
  getData() {
    this.loading = true;
    this.http
      .get<any>(`${this.baseUrl}?page=${this.page}&size=${this.size}`)
      .subscribe((res) => {
        this.loading = false;
        console.log(res);
        if (res.code === 0) {
          // this.listOfData = res.data.list;
        }
      });
  }
  //库房名称
  getunit() {
    this.http.get<any>(this.houseNameUrl).subscribe((res) => {
      if (res.code === 0) {
        this.unitList = res.data;
      }
    });
  }

  //曲线图
  pointChers(record) {
    const modalRef: NzModalRef = this.modal.create({
      nzTitle: record.bname,
      nzContent: PointRecordComponent,
      nzComponentParams: {
        posId: record.id,
      },
      nzMaskClosable: false,
      nzWrapClassName: "test-modal",
      nzWidth: 1200,
      nzFooter: null,
    });
  }
}
export class TableList {
  cname: string; //库房名称
  pname: string; //测点位置
  alarm_time: string; //开始时间
  alarm_time_end: string; //结束时间
  alarm_type: string; //类型
  temp_up: string; //温度范围(℃)
  temp_down: string; //温度范围(℃)
  humi_up: string; //湿度范围(%)
  humi_down: string; //湿度范围(%)
  state: string; //处理状态
  cause: string; //报警原因
  method: string; //处理方法
  remarks: string; //处理人
  processor: string; //备注
}
