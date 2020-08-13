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
    this.menuList= JSON.parse(listData)
  }

  navScaling() {
    this.isCollapsed = !this.isCollapsed
  }

  noticeClick() {
    alert("您有一个新的提示")
  }
}
