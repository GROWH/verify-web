import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  isCollapsed = false;
  menuList: any = [];

  constructor() {
  }

  ngOnInit() {
    const listData = localStorage.getItem('menuAuth');
    this.menuList = JSON.parse(listData)
    this.menuList.map((item, index) => {
      if (index === 0) {
        item.icon = 'home';
      } else if (index === 1) {
        item.icon = 'setting';
      } else if (index === 2) {
        item.icon = 'database';
      } else if (index === 3) {
        item.icon = 'safety';
      } else if (index === 4) {
        item.icon = 'alert';
      } else if (index === 5) {
        item.icon = 'tool';
      } else {
        item.icon = 'appstore';
      }
    });
  }

  navScaling() {
    this.isCollapsed = !this.isCollapsed
  }

  noticeClick() {
    alert("您有一个新的提示")
  }
}
