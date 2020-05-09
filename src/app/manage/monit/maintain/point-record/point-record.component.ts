import { Component, OnInit, Input } from '@angular/core';
import { EChartOption, ECharts } from 'echarts'
import { addDays, format } from 'date-fns'
import { Subject, merge, of, Observable } from 'rxjs';
import { DebugLog, TongchangHttpService, TongchangLibService } from 'tongchang-lib';

import { Apis } from '@/shared/urls.const';
import { PointRecord } from '@/model/HouseMonit';
import { delayWhen } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd';

const rangeCount = (offset: number) => {
  const end = new Date()
  const start = addDays(end, offset)

  return [
    // new Date(start.getFullYear(), start.getMonth(), start.getDate()),
    // new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59, 999),
    start, end
  ]
}

@Component({
  selector: 'app-point-record',
  templateUrl: './point-record.component.html',
  styleUrls: ['./point-record.component.scss']
})
export class PointRecordComponent implements OnInit {

  @Input() posId: number = -1

  constructor(
    private msg: NzMessageService,
    private http: TongchangHttpService,
    private util: TongchangLibService,
  ) { }

  ngOnInit() {
    DebugLog(this.datas)
    
    merge(
      of(1).pipe(
        delayWhen(() => this.chartsReady$.asObservable())
      ),
      this.dateCh$
    )
    .subscribe(() => this.dateCh())
  }
  
  chartsIns: ECharts

  dateCh$ = new Subject<void>()
  datas = rangeCount(0)
  ranges = {
    '今天': rangeCount.bind(null, 0),
    '近三天': rangeCount.bind(null, -2),
    '近一周': rangeCount.bind(null, -6),
    '近30天': rangeCount.bind(null, -30),
  }

  rangeDisableDate = (now: Date) => {
    const today = new Date()
    today.setHours(23, 59, 59, 999)

    return now.getTime() > today.getTime()
  }

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
            this.dateCh$.next()
          }
        },
        saveAsImage: {
          backgroundColor: "#fff",
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
  }

  private chartsReady$ = new Subject()

  chartInit(charts: ECharts) {
    this.chartsIns = charts
    this.chartsReady$.next()
  }

  async dateCh() {
    DebugLog(this.datas)
    const [ start, end ] = this.datas

    start.setHours(0, 0, 0, 0)
    end.setHours(23, 59, 59, 999)
    
    const { messageId: msgID } = this.msg.loading('数据加载中...', {nzDuration: 0})
    const res = await this.http.get<PointRecord[]>(Apis.pointRecord, {
      pid: this.posId + '',
      start_time: format(start, 'YYYY-MM-DD HH:mm:ss.SSS'),
      end_time:   format(end,   'YYYY-MM-DD HH:mm:ss.SSS'),
    }).toPromise()
    this.msg.remove(msgID)

    if (res.code !== 0) return
    this.msg.success('数据已加载')

    const [time, temp, humi] = res.data.reduce((acc, it) => {
      const time = acc[0]
      const temp = acc[1]
      const humi = acc[2]
      
      time.push(it.time)
      temp.push(it.temp)
      humi.push(it.humi)

      return acc
    }, [[], [], []])
    
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
    })
  }
}
