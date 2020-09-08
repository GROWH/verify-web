import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

import {GridAction} from '@/model/GridAction';
import {NzModalRef, NzModalService} from "ng-zorro-antd";
import {EchartModalComponent} from "./echart-modal/echart-modal.component";
import {TaskInfoComponent} from "./task-info/task-info.component";
import * as moment from 'moment';
import {buttonAccess} from "@/config.const";


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
  // @ts-ignore
  tableData: TableData[] = [{test_point: '1'}, {test_point: '2'}];//接口返回后增加no属性
  tableHeight: number = 0;
  currDate: any = '';

  isAllDisplayDataChecked = false;
  isIndeterminate = false;
  mapOfCheckedId: { [key: string]: boolean } = {};
  selectItems = [];

  ngOnInit() {
    this.currDate = moment().format('YYYY-MM-DD HH:mm:ss');
    this.tableHeight = document.body.offsetHeight - 445;
    this.actionInit()
  }

  actionInit() {
    this.gridActions = [
      {
        name: '开始监测',
        icon: 'play-circle',
        code: 'verify-operst_start',
        click: () => {
          console.log('开始监测')
        },
        isExist: buttonAccess("verify-operst_start"),
      },
      {
        name: '停止监测',
        icon: 'pause-circle',
        code: 'verify-operst_pause',
        type: 'danger',
        click: () => {
          console.log('停止监测')
        },
        isExist: buttonAccess("verify-operst_pause"),
      },
      {
        name: '数据曲线',
        icon: 'line-chart',
        code: 'verify-operst_line-chart',
        click: () => {
          const modalRef: NzModalRef = this.modal.create({
            nzTitle: '数据曲线',
            nzContent: EchartModalComponent,
            nzMaskClosable: false,
            nzWidth: 1250,
            nzFooter: null,
          })
        },
        isExist: buttonAccess("verify-operst_line-chart"),
      },
      {
        name: '任务信息',
        icon: 'database',
        code: 'verify-operst_info',
        click: () => {
          const modalRef: NzModalRef = this.modal.create({
            nzTitle: '任务信息',
            nzContent: TaskInfoComponent,
            nzMaskClosable: false,
            nzWidth: 1250,
            nzFooter: null,
          })
        },
        isExist: buttonAccess("verify-operst_info"),
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

  refreshStatus(): void {
    this.isAllDisplayDataChecked = this.tableData.every((item) => this.mapOfCheckedId[item.no]);
    let checkId = this.mapOfCheckedId
    this.selectItems = this.tableData.map((item) => {
      for (let key in checkId) {
        if (checkId[key] && Number(key) === item.no) {
          return item
        }
      }
    }).filter(item => item)
    this.isIndeterminate = this.tableData.some(item => this.mapOfCheckedId[item.no]) && !this.isAllDisplayDataChecked;
  }

  checkAll(value: boolean): void {
    this.tableData.forEach(item => (this.mapOfCheckedId[item.no] = value));
    this.refreshStatus();
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
