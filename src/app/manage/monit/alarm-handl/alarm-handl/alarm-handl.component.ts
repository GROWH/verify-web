import { Component, OnInit } from '@angular/core';
import {GridAction} from '@/model/GridAction';
import {buttonAccess} from "@/config.const";

@Component({
  selector: 'app-alarm-handl',
  templateUrl: './alarm-handl.component.html',
  styleUrls: ['./alarm-handl.component.scss']
})
export class AlarmHandlComponent implements OnInit {

  listOfData: TableList[] = [
    {
      name: 'stringstring',
      pointer: 'string',
      start_time: '2021-01-04 15:38',
      end_time: '2021-01-04 15:45',
      type: 'string',
      temp_up: 'string',
      temp_down: 'string',
      humi_up: 'string',
      humi_down: 'string',
      state: '审核中',
    }, {
      name: 'strinstring',
      pointer: 'string',
      start_time: '2021-01-04 15:38',
      end_time: '2021-01-04 15:45',
      type: 'string',
      temp_up: 'string',
      temp_down: 'string',
      humi_up: 'string',
      humi_down: 'string',
      state: '审核未通过',
    },
    {
      name: 'strinstring',
      pointer: 'string',
      start_time: '2021-01-04 15:38',
      end_time: '2021-01-04 15:45',
      type: 'string',
      temp_up: 'string',
      temp_down: 'string',
      humi_up: 'string',
      humi_down: 'string',
      state: '审核通过',
    },
  ];
  page = 1;
  size = 10;
  total = 1;
  tableHeight:number = 0;
  gridActions: GridAction[] = [];
  constructor() { }

  ngOnInit() {
    this.tableHeight = document.body.offsetHeight - 300;
    this.actionInit();
  }

  actionInit() {
    this.gridActions = [
      {
        name: '刷新',
        icon: 'download',
        code: 'alarm-handl_reload',
        type: 'default',
        click: () => {
          // this.exportFun();
        },
        isExist: buttonAccess('alarm-handl_reload'),
      }, {
        name: '查询',
        icon: 'search',
        code: 'alarm-handl_search',
        type: 'primary',
        click: () => {
          // this.getTableData();
        },
        isExist: buttonAccess('alarm-handl_search'),
      },
    ];
  }

  changePageIndex(pageIndex) {
    this.page = pageIndex;
    // this.getTableData();
  }

  changePageSize(pageSize) {
    this.size = pageSize;
    // this.getTableData();
  }

  timeGap(record) {
    return 'N/N';
  }
}
export class TableList {
  name: string;
  pointer: string;
  start_time: string;
  end_time: string;
  type: string;
  temp_up: string;
  temp_down: string;
  humi_up: string;
  humi_down: string;
  state: string;
}
