import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

import {GridAction} from '@/model/GridAction';
import {NzModalRef, NzModalService} from "ng-zorro-antd";
import {EchartModalComponent} from "./echart-modal/echart-modal.component";
import {TaskInfoComponent} from "./task-info/task-info.component";
import * as moment from 'moment';


@Component({
  selector: 'app-verify-operat',
  templateUrl: './verify-operat.component.html',
  styleUrls: ['./verify-operat.component.scss']
})
export class VerifyOperatComponent implements OnInit {

  constructor(
    private router: Router,
    private modal: NzModalService,
  ) {
  }

  page = 1;
  size = 10;
  loading = true;
  total = 1;
  checkVal: '';//环境状态值
  selectVal: '';//验证对象
  gridActions: GridAction[] = [];
  tableData: TableData[] = [];//接口返回后增加no属性
  tableHeight: string = '';
  currDate:any='';

  ngOnInit() {
    this.currDate = moment().format('YYYY-MM-DD HH:mm:ss')
    this.actionInit()
    const allHeight = document.getElementById('allHeight').offsetHeight;
    const optionHeight = document.getElementById('option').offsetHeight * 4;
    this.tableHeight = allHeight - (optionHeight) + 'px';
    // console.log(this.router)
  }

  actionInit() {
    this.gridActions = [
      {
        name: '开始监测',
        icon: 'play-circle',
        code: 'verify-info_start',
        click: () => {
          console.log('开始监测')
        },
        isExist: true,
      },
      {
        name: '停止监测',
        icon: 'pause-circle',
        code: 'verify-info_pause',
        type: 'danger',
        click: () => {
          console.log('停止监测')
        },
        isExist: true,
      },
      {
        name: '数据曲线',
        icon: 'line-chart',
        code: 'verify-info_line-chart',
        click: () => {
          const modalRef: NzModalRef = this.modal.create({
            nzTitle: '数据曲线',
            nzContent: EchartModalComponent,
            nzMaskClosable: false,
            nzWidth: 1250,
            nzFooter: null,
          })
        },
        isExist: true,
      },
      {
        name: '任务信息',
        icon: 'database',
        code: 'verify-info_info',
        click: () => {
          const modalRef: NzModalRef = this.modal.create({
            nzTitle: '任务信息',
            nzContent: TaskInfoComponent,
            nzMaskClosable: false,
            nzWidth: 1250,
            nzFooter: null,
          })
        },
        isExist: true,
      },
    ]
  }

  changePageIndex(pageIndex) {
    this.page = pageIndex;
    // this.getData()
  }

  changePageSize(pageSize) {
    this.size = pageSize
    // this.getData()
  }

}

export class TableData {
  no: number;
  test_point: string;
  facility_no: string;
  temp: string;
  humi: string;
  data_time: string;
  facility_state: string;
}
