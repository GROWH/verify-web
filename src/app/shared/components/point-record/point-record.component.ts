import { Component, OnInit, Input } from '@angular/core';
import { EChartOption, ECharts } from 'echarts';
import { addDays, format } from 'date-fns';
import { Subject, merge, of, Observable } from 'rxjs';
import { DebugLog, TongchangHttpService, TongchangLibService } from 'tongchang-lib';

import { Apis } from '@shared/urls.const';
import { PointRecord } from '@/model/HouseMonit';
import {delayWhen} from 'rxjs/operators';
import {NzMessageService, NzModalRef, NzModalService} from 'ng-zorro-antd';
import {GridAction} from '@/model/GridAction';
import {buttonAccess} from '@/config.const';
import * as $ from  'jquery';

const rangeCount = (offset: number) => {
  const end = new Date();
  const start = addDays(end, offset);

  return [
    start, end
  ];
};

@Component({
  selector: 'app-point-record',
  templateUrl: './point-record.component.html',
  styleUrls: ['./point-record.component.scss']
})
export class PointRecordComponent implements OnInit {

  constructor(
    private msg: NzMessageService,
    private http: TongchangHttpService,
    private util: TongchangLibService,
    private modal: NzModalService,
  ) { }

  @Input() posId = -1;
  page = 1;
  size = 20;
  total = 1;
  listOfData: TableList[] = [];
  chartsIns: ECharts;
  gridActions: GridAction[] = [];
  loading = true;

  dateCh$ = new Subject<void>();
  datas = rangeCount(0);
  datas1 = rangeCount(0);
  ranges = {
    今天: rangeCount.bind(null, 0),
    近三天: rangeCount.bind(null, -2),
    近一周: rangeCount.bind(null, -6),
    近30天: rangeCount.bind(null, -30),
  };

  chartOption: EChartOption = {
    title: {
      text: '温度&湿度曲线图',
      left: 'center',
      padding: 20,
    },
    grid: [
      {left: '7%', top: '20%', width: '38%', height: '270'},
      {left: '57%', top: '20%', width: '38%', height: '270'},
    ],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      },
      backgroundColor: 'rgba(245, 245, 245, 0.8)',
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 10,
      textStyle: {
          color: '#000'
      },
      formatter: '{a}: {c}',
    },
    toolbox: {
      feature: {
        myTool1: {
          show: true,
          title: '刷新数据',
          icon: 'path://M7 9h-7v-7h1v5.2c1.853-4.237 6.083-7.2 11-7.2 6.623 0 12 5.377 12 12s-5.377 12-12 12c-6.286 0-11.45-4.844-11.959-11h1.004c.506 5.603 5.221 10 10.955 10 6.071 0 11-4.929 11-11s-4.929-11-11-11c-4.66 0-8.647 2.904-10.249 7h5.249v1z',
          onclick: () => {
            this.dateCh$.next();
          }
        },
        saveAsImage: {
          backgroundColor: '#fff',
        }
      }
    },
    xAxis: [
      {
        type: 'category',
        axisTick: {
          alignWithLabel: true,
        },
        gridIndex: 0,
        axisLine: {
          onZero: false,
        },
        data: []
      },
      {
        type: 'category',
        axisTick: {
          alignWithLabel: true,
        },
        gridIndex: 1,
        axisLine: {
          onZero: false,
        },
        data: []
      }
    ],
    yAxis: [
      {
        name: '温度(℃)',
        type: 'value',
        axisLabel: {
          formatter: '{value} °C'
        },
        gridIndex: 0,
        axisPointer: {
          show: false,
        }
      },
      {
        name: '湿度(%)',
        type: 'value',
        axisLabel: {
          formatter: '{value} %'
        },
        gridIndex: 1,
        axisPointer: {
          show: false,
        }
      },

    ],

    series: [
      {
        name: '温度(℃)',
        data: [],
        type: 'line',
        smooth: true,
        xAxisIndex: 0,
        yAxisIndex: 0,
      },
      {
        name: '湿度(%)',
        data: [],
        type: 'line',
        smooth: true,
        xAxisIndex: 1,
        yAxisIndex: 1,
      }
    ]
  };

  private chartsReady$ = new Subject();

  ngOnInit() {
    this.actionInit();
    this.getTableData();
    DebugLog(this.datas);

    merge(
      of(1).pipe(
        delayWhen(() => this.chartsReady$.asObservable())
      ),
      this.dateCh$
    )
    .subscribe(() => this.dateCh());
  }

  actionInit() {
    this.gridActions = [
      {
        name: '查询',
        icon: 'search',
        code: 'point-record_search',
        type: 'primary',
        click: () => {
          this.getTableData();
        },
        isExist: buttonAccess('point-record_search'),
      }, {
        name: '下载',
        icon: 'download',
        code: 'point-record_download',
        type: 'default',
        click: () => {
        this.exportFun();
        },
        isExist: buttonAccess('point-record_download'),
      },
    ];
  }

  rangeDisableDate = (now: Date) => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    return now.getTime() > today.getTime();
  }

  chartInit(charts: ECharts) {
    this.chartsIns = charts;
    this.chartsReady$.next();
  }

  async dateCh() {
    DebugLog(this.datas);
    const [ start, end ] = this.datas;

    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    const { messageId: msgID } = this.msg.loading('数据加载中...', {nzDuration: 0});
    const res = await this.http.get<PointRecord[]>(Apis.pointRecord, {
      pid: this.posId + '',
      start_time: format(start, 'YYYY-MM-DD HH:mm:ss.SSS'),
      end_time:   format(end,   'YYYY-MM-DD HH:mm:ss.SSS'),
    }).toPromise();
    this.msg.remove(msgID);

    if (res.code !== 0) { return; }
    this.msg.success('数据已加载');

    const [time, temp, humi] = res.data.reduce((acc, it) => {
      const time = acc[0];
      const temp = acc[1];
      const humi = acc[2];

      time.push(it.time);
      temp.push(it.temp);
      humi.push(it.humi);

      return acc;
    }, [[], [], []]);

    this.chartsIns.setOption({
      xAxis: [
        {
          data: time,
        },
        {
          data: time,
        }
      ],
      series: [
        {
          data: temp,
        },
        {
          data: humi,
        }
      ]
    });
  }

  // 初始出请求
  getTableData() {
    const [ start, end ] = this.datas1;
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    const baseUrl = '/position/queryHistoricalData';
    this.loading = true;
    const params = {
      pid: this.posId + '',
      start_time: "'" + format(start, 'YYYY-MM-DD HH:mm:ss.SSS') + "'" ,
      end_time: "'" + format(end,   'YYYY-MM-DD HH:mm:ss.SSS') + "'",
    };
    this.http.get<any>(`${baseUrl}?page=${this.page}&size=${this.size}`, params).subscribe(res => {
      this.loading = false;
      if (res.code === 0) {
        this.total = res.data.totalRow;
        this.listOfData = res.data.list;
      }
    });
  }

  //
  exportFun() {
    const [ start, end ] = this.datas1;
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    const starTime = "'" + format(start, 'YYYY-MM-DD HH:mm:ss.SSS') + "'";
    const endTime = "'" + format(end,   'YYYY-MM-DD HH:mm:ss.SSS') + "'";
    const downloadUrl = 'api/position/download?pid=' + this.posId + '&start_time=' + starTime + '&end_time=' + endTime;
    const fileName = '温湿度监控数据(' + format(new Date(), 'YYYY-MM-DD HH:mm') + ').xls';
    const modalRef: NzModalRef = this.modal.create({
      nzTitle: '请确认是否下载?',
      nzWidth: 400,
      nzClosable: false,
      nzContent: `<div style="font-size: 18px!important;font-width: 600!important;">
            <a href="${downloadUrl}">下载 ${fileName}</a>
          </div>`,
      nzFooter: [{label: '取消', onClick: () => modalRef.close()}],
    });
  }

  changePageIndex(pageIndex) {
    this.page = pageIndex;
    this.getTableData();
  }

  changePageSize(pageSize) {
    this.size = pageSize;
    this.getTableData();
  }
}
export class TableList {
  time: string;
  test_point: string;
  temp: string;
  temp_up: string;
  temp_down: string;
  humi: string;
  humi_up: string;
  humi_down: string;
}
