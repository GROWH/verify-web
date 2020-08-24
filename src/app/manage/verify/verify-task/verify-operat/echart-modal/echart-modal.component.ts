import {Component, OnInit} from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-echart-modal',
  templateUrl: './echart-modal.component.html',
  styleUrls: ['./echart-modal.component.scss']
})
export class EchartModalComponent implements OnInit {

  constructor() {
  }

  checkVal: string = '0';//监测点
  facilityNo: string = '0';//仪器编号
  checkType: string = '0';//曲线类型
  lineType: string = '0';//曲线时间
  stateVal: string = '0';//按操作过程
  selfTime: any = null;//按自定义
  option: any = {};
  xData: any = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
  yData: any = [-110, -100, -90, -80, -70, -60, -50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120];

  ngOnInit() {
    this.drewPic()
  }

  drewPic() {
    this.option = {
      xAxis: {
        name: '时间（单位:h）',
        boundaryGap: false, // 将此属性设置为false即可让其在两侧显示
        type: 'category',
        data: this.xData,
        splitLine: {
          show: true,
          lineStyle: {
            width: 1,
            type: 'dashed'
          }
        }
      },
      yAxis: {
        name: this.checkType === '0' ? '温度（单位:℃）' : '湿度（单位:%RH）',
        type: 'value',
        splitLine: {
          show: true,
          lineStyle: {
            width: 1,
            type: 'dashed'
          }
        }
      },
      series: [{
        data: this.yData,
        type: 'line'
      }]
    };

  }

  //搜索btn
  searchData() {
    const params = {
      checkVal: this.checkVal,
      facilityNo: this.facilityNo,
      checkType: this.checkType,
      lineType: this.lineType,
      stateVal: this.stateVal,
      selfTime: moment(this.selfTime).format('YYYY-MM-DD HH:mm:ss'),
    }
    this.drewPic()
    console.log('params', params)
  }

}
