import { Component, OnInit } from '@angular/core';
import {TongchangHttpService, TongchangLibService} from 'tongchang-lib';
import {format} from 'date-fns';
import {NzMessageService, NzModalRef, NzModalService} from 'ng-zorro-antd';
import {PointRecordComponent} from '../../shared/components/point-record/point-record.component';

export const LOGINED_USER_UNIT_KEY = 'LOGINED_USER_UNIT_KEY';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  userCode = '1';
  isShow = false;
  listOfData: TableList[] = [];
  page = 1;
  size = 22;
  total = 1;
  loading = true;
  tableHeight = 0;
  cardConHeight = 0;
  storehouseUrl = '/home/storehouse'; // 启用
  dataUrl = '/home/queryHistoricalData'; // 启用
  storeList = [];
  checkVal = '';
  alarmData = {
    allNum: 0,
    warnNum: 0,
    alarmNum: 0,
    unproceNum: 0,
    offLineNum: 0,
  };


  constructor(
    private msg: NzMessageService,
    private http: TongchangHttpService,
    private modal: NzModalService,
  ) {
  }

  ngOnInit() {
    this.tableHeight = document.body.offsetHeight - 300;
    this.cardConHeight = document.body.offsetHeight - 146;
    this.userCode = localStorage.getItem('LOGINED_USER_UNIT_KEY');
    this.getStorehouseData();
    this.getAlarmData();
  }
  // 滚动加载事件
  divScrollFun() {
    const cardInnerSH = document.getElementsByClassName('card-inner')[0].scrollHeight;
    const scrollTop = document.getElementsByClassName('card-inner')[0].scrollTop;
    const cardInnerH = document.getElementsByClassName('card-inner')[0].clientHeight;
    if (scrollTop + cardInnerH >= cardInnerSH) {
      this.size += 20;
      this.getData();
    }
  }
  // 获取仓库下拉框
  getStorehouseData() {
    this.loading = true;
    this.http.get<any>(`${this.storehouseUrl}`).subscribe(res => {
      this.loading = false;
      if (res.code === 0) {
        this.storeList = res.data;
        const id = res.data[0].id;
        this.checkVal = id || null;
        this.getData();
      }
    });
  }
  // 获取表格数据
  getData() {
    this.loading = true;
    this.http.get<any>(`${this.dataUrl}?pid=${this.checkVal}&page=${this.page}&size=${this.size}`).subscribe(res => {
      this.loading = false;
      if (res.code === 0) {
        this.total = res.data.totalRow;
        this.listOfData = res.data.list;
      }
    });
  }
  storeChange(value) {
    if (this.isShow) {
      this.page = 1;
      this.size = 20;
    } else {
      this.page = 1;
      this.size = 24;
    }
    this.checkVal = value;
    this.getData();
  }
  
  showStyle(value) {
    this.isShow = value;
    if (value) {
      this.page = 1;
      this.size = 20;
    } else {
      this.page = 1;
      this.size = 24;
    }
    this.getData();
  }

  pointChers(record) {
    const modalRef: NzModalRef = this.modal.create({
      nzTitle: record.bname,
      nzContent: PointRecordComponent,
      nzComponentParams: {
        posId: record.id
      },
      nzMaskClosable: false,
      nzWrapClassName: 'test-modal',
      nzWidth: 1200,
      nzFooter: null,
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

  isState(time) {
    let cbVal = false;
    const dataTime = format(time, 'YYYY-MM-DD HH:mm:ss.SSS');
    const nowTime = format(new Date().getTime() - (10 * 60 * 1000), 'YYYY-MM-DD HH:mm:ss.SSS');
    if (dataTime > nowTime) {
      cbVal = true;
    } else {
      cbVal = false;
    }
    return cbVal;
  }
  isSetColor(record, type) {
    let theColor = 'success-color';
    if (type === 'temp') {
      const tempD = record.temp_down;
      const tempU = record.temp_up;
      const warnD = record.warning_temp_down;
      const warnU = record.warning_temp_up;
      if (record.temp < tempD || record.temp > tempU) {
        theColor = 'error-color';
      } else if (record.temp > warnD && record.temp < warnU) {
        theColor = 'success-color';
      } else {
        theColor = 'warn-color';
      }
    } else {
      const humiD = record.humi_down;
      const humiU = record.humi_up;
      const warnD = record.warning_humi_down;
      const warnU = record.warning_humi_up;
      if (record.humi < humiD || record.humi > humiU) {
        theColor = 'error-color';
      } else if (record.humi > warnD && record.humi < warnU) {
        theColor = 'success-color';
      } else {
        theColor = 'warn-color';
      }
    }
    return theColor;
  }

  getAlarmData() {
    this.http.get<any>(`/home/positions`).subscribe(res => {
      if (res.code === 0) {
        this.alarmData.allNum = res.data;
      }
    });
    this.http.get<any>(`/home/alarm`).subscribe(res => {
      if (res.code === 0) {
        this.alarmData.unproceNum = res.data;
      }
    });
    this.http.get<any>(`/home/AlarmProbe`).subscribe(res => {
      if (res.code === 0) {
        this.alarmData.alarmNum = res.data;
        this.alarmData.warnNum = this.alarmData.alarmNum;
      }
    });
    this.http.get<any>(`/home/Offline`).subscribe(res => {
      if (res.code === 0) {
        this.alarmData.offLineNum = res.data;
      }
    });
  }
}
export class TableList {
  cname: string;
  bname: string;
  time: string;
  test_point: string;
  temp: string;
  temp_up: string;
  temp_down: string;
  humi: string;
  humi_up: string;
  humi_down: string;
  state: string;
}
