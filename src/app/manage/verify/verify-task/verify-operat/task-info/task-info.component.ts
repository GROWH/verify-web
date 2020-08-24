import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-task-info',
  templateUrl: './task-info.component.html',
  styleUrls: ['./task-info.component.scss']
})
export class TaskInfoComponent implements OnInit {

  constructor() {
  }

  page = 1;
  size = 10;
  loading = true;
  total = 1;
  listOfData: TableList[] = [{
    item_name: '2020-07-21',
    test_point: '满载',
    temp: '2020-07-21',
    facility_no: '2020-07-21',
    humi: '2020-07-21 15:28:33',
    data_time: '2020-07-21 15:28:33',
    facility_state: '2020-07-21 15:28:33',
  },];

  ngOnInit() {
  }

  addChildItem(record, e) {
    console.log('add', record)
  }

  editChildItem(record, e) {
    console.log('edit', record)
  }

  delChildItem(record, e) {
    console.log('del', record)
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

export class TableList {
  item_name: string;
  test_point: string;
  temp: string;
  facility_no: string;
  humi: string;
  data_time: string;
  facility_state: string;
}
