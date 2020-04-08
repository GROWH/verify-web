import { Component, OnInit } from '@angular/core';
import { GridAction } from '@/model/GridAction';

@Component({
  selector: 'app-module-manage',
  templateUrl: './module-manage.component.html',
  styleUrls: ['./module-manage.component.scss']
})
export class ModuleManageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    this.actionInit()
  }

  gridActions: GridAction[]

  actionInit() {
    this.gridActions = [
      {
        name: '新增',
        icon: 'plus',
        code: 'add',
        type: 'primary',
      }
    ]
  }
}
