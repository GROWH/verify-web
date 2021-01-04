import { Component, OnInit } from '@angular/core';
import { TongchangHttpService } from 'tongchang-lib';

export const LOGINED_USER_UNIT_KEY = 'LOGINED_USER_UNIT_KEY';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  userCode = '1';
  // dataList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
  dataList = [1, 2, 3, 4, 5, 6, 7, 8];
  isShow = false;
  listOfData: TableList[] = [
    {
      name: 'stringstring',
      pointer: 'string',
      time: null,
      test_point: 'string',
      temp: 'string',
      temp_up: 'string',
      temp_down: 'string',
      humi: 'string',
      humi_up: 'string',
      humi_down: 'string',
      state: 'string',
    }, {
      name: 'strinstring',
      pointer: 'string',
      time: null,
      test_point: 'string',
      temp: 'string',
      temp_up: 'string',
      temp_down: 'string',
      humi: 'string',
      humi_up: 'string',
      humi_down: 'string',
      state: 'string',
    },
  ];
  page = 1;
  size = 10;
  total = 1;
  tableHeight:number = 0;
  constructor(
    private http: TongchangHttpService
  ) {
  }

  ngOnInit() {
    this.tableHeight = document.body.offsetHeight - 300;
    this.userCode = localStorage.getItem('LOGINED_USER_UNIT_KEY');
    console.log(this.userCode);
  }

  showStyle(value) {
    this.isShow = value;
  }

  changePageIndex(pageIndex) {
    this.page = pageIndex;
    // this.getTableData();
  }

  changePageSize(pageSize) {
    this.size = pageSize;
    // this.getTableData();
  }
}
export class TableList {
  name: string;
  pointer: string;
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
