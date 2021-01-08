import { Component, OnInit } from '@angular/core';

import { NzModalService, NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { TongchangHttpService } from 'tongchang-lib';
import { PointRecordComponent } from '../../../../shared/components/point-record/point-record.component';
import { HandleStateFormComponent } from '../handle-state-form/handle-state-form.component';

import { GridAction } from '@/model/GridAction';
import { buttonAccess } from '@/config.const';
import { format } from 'date-fns';

@Component({
  selector: 'app-alarm-handl',
  templateUrl: './alarm-handl.component.html',
  styleUrls: ['./alarm-handl.component.scss'],
})
export class AlarmHandlComponent implements OnInit {
  // 表格
  listOfData: TableList[] = [];

  unitList = []; // 库房名称
  page = 1;
  size = 10;
  loading = true;
  total = 1;
  houseNameUrl = '/storehouse'; // 库房名称
  baseUrl = '/alarmrecord'; // 初始出请求
  tableHeight = 0;
  gridActions: GridAction[] = [];
  condition = {
    cId: '',
    start: new Date(),
    end: new Date(),
    type: '温度',
    status: 'false',
  };
  constructor(
    private modal: NzModalService,
    private msg: NzMessageService,
    private http: TongchangHttpService
  ) {}

  ngOnInit() {
    this.tableHeight = document.body.offsetHeight - 300;
    this.actionInit();
    this.getunit();
  }
  // 页面按钮
  actionInit() {
    this.gridActions = [
      {
        name: '刷新',
        icon: 'download',
        code: 'alarm-handl_reload',
        type: 'default',
        click: () => {
          this.getData();
        },
        isExist: buttonAccess('alarm-handl_reload'),
      },
      {
        name: '查询',
        icon: 'search',
        code: 'alarm-handl_search',
        type: 'primary',
        click: () => {
          this.getData();
        },
        isExist: buttonAccess('alarm-handl_search'),
      },
    ];
  }

  changePageIndex(pageIndex) {
    this.page = pageIndex;
    this.getData();
  }

  changePageSize(pageSize) {
    this.size = pageSize;
    this.getData();
  }
  // 持续时间
  timeGap(record) {
    const end = new Date(record.alarm_time_end).getTime();
    const start = new Date(record.alarm_time).getTime();
    const milliseconds = end - start;
    let timeSpanStr;
    if (milliseconds <= 1000 * 60 * 1) {
      timeSpanStr = '刚刚';
    } else if (1000 * 60 * 1 < milliseconds && milliseconds <= 1000 * 60 * 60) {
      timeSpanStr = Math.round(milliseconds / (1000 * 60)) + '分钟';
    } else if (
      1000 * 60 * 60 * 1 < milliseconds &&
      milliseconds <= 1000 * 60 * 60 * 24
    ) {
      timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60)) + '小时';
    } else if (
      1000 * 60 * 60 * 24 < milliseconds &&
      milliseconds <= new Date().getTime()
    ) {
      timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60 * 24)) + '天';
    }
    return timeSpanStr;
  }

  // 处理状态
  handles(house: TableList) {
    const modalRef: NzModalRef = this.modal.create({
      nzTitle: '处理状态',
      nzContent: HandleStateFormComponent,
      nzComponentParams: { house },
      nzMaskClosable: false,
      nzWrapClassName: 'modal-vertical-center',
      nzWidth: 900,
      nzFooter: [
        {
          label: '取消',
          onClick: () => modalRef.close(),
        },
        {
          label: '确定',
          type: 'primary',
          disabled: (comp) => !comp.form.valid,
          onClick: (comp) => {
            const formVal = comp.form.getRawValue();
            this.modal.confirm({
              nzTitle: '提交',
              nzContent: '确认提交?',
              nzOnOk: () => {
                const params = formVal;
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
    });
  }

  // 初始出请求
  getData() {
    const params = this.condition;
    const start = '\'' + format(params.start, 'YYYY-MM-DD HH:mm:ss.SSS') + '\'';
    const end = '\'' + format(params.end, 'YYYY-MM-DD HH:mm:ss.SSS') + '\'';
    const searchParam =
      '&pid=' +
      params.cId +
      '&start_time=' +
      start +
      '&end_time=' +
      end +
      '&alarm_type=' +
      params.type +
      '&processing=' +
      params.status;
    this.loading = true;
    this.http
      .get<any>(
        `${this.baseUrl}?page=${this.page}&size=${this.size}${searchParam}`
      )
      .subscribe((res) => {
        this.loading = false;
        if (res.code === 0) {
          this.listOfData = res.data.list;
        }
      });
  }
  // 库房名称
  getunit() {
    this.http.get<any>(this.houseNameUrl).subscribe((res) => {
      if (res.code === 0) {
        this.unitList = res.data;
        this.condition.cId = res.data[0].id;
        this.getData();
      }
    });
  }

  // 曲线图
  pointChers(record) {
    const modalRef: NzModalRef = this.modal.create({
      nzTitle: record.pname,
      nzContent: PointRecordComponent,
      nzComponentParams: {
        posId: record.id,
      },
      nzMaskClosable: false,
      nzWrapClassName: 'test-modal',
      nzWidth: 1200,
      nzFooter: null,
    });
  }

  storeChange(value, type) {
    this.condition[type] = value;
  }
}
export class TableList {
  cname: string; // 库房名称
  pname: string; // 测点位置
  alarm_time: string; // 开始时间
  alarm_time_end: string; // 结束时间
  alarm_type: string; // 类型
  temp_up: string; // 温度范围(℃)
  temp_down: string; // 温度范围(℃)
  humi_up: string; // 湿度范围(%)
  humi_down: string; // 湿度范围(%)
  state: string; // 处理状态
  cause: string; // 报警原因
  method: string; // 处理方法
  remarks: string; // 处理人
  processor: string; // 备注
}
