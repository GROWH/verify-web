import {Component, OnDestroy, OnInit} from '@angular/core';
import {TongchangHttpService} from "tongchang-lib";
import {timeInterval} from "rxjs/operators";
import {SchedulerLike} from "rxjs";

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit, OnDestroy {
  isCollapsed = false;
  menuList: any = [];
  isShow: boolean = false;//提醒框是否显示(block)
  remindUrl: string = "/remind";//接口名
  remindList: any = [];
  setTimer: any = [];//定时器名称
  isShowTip: boolean = false;//是否有提示


  constructor(
    private http: TongchangHttpService,
  ) {
  }

  ngOnInit() {
    const listData = localStorage.getItem('menuAuth');
    this.menuList = JSON.parse(listData)
    this.menuList.map(item => {
      if (item.module_code === 'home') {
        item.icon = 'home';
      } else if (item.module_code === 'system') {
        item.icon = 'setting';
      } else if (item.module_code === 'basic') {
        item.icon = 'database';
      } else if (item.module_code === 'safe') {
        item.icon = 'safety';
      } else if (item.module_code === 'monit') {
        item.icon = 'alert';
      } else if (item.module_code === 'facility') {
        item.icon = 'tool';
      } else if (item.module_code === 'verify') {
        item.icon = 'appstore';
      }
    });
    this.getRemind()
    // this.timer()
  }

  //定时调用提醒
  timer() {
    this.setTimer = setInterval(() => {
      this.getRemind()
    }, 30000)
  }

  ngOnDestroy() {
    //清除定时器
    // clearInterval(this.setTimer);
  }

  getRemind() {
    const findArr: any = [];
    this.http.get<any>(this.remindUrl).subscribe(res => {
      if (res.code === 0) {
        const resDate = res.data || {};
        this.menuList.map(item => {
          item.children.map(iItem => {
            if (iItem.module_code === 'unitaudit') {
              findArr.push({
                name: '新增单位审核提醒',
                code: iItem.module_code,
                url: iItem.module_url,
                count: resDate.unit[0]
              })
            } else if (iItem.module_code === 'my-house') {
              findArr.push({
                name: '温度计需校准提醒',
                code: iItem.module_code,
                url: iItem.module_url,
                count: 0
              })
            } else if (iItem.module_code === 'thermManger') {
              findArr.push({
                name: '监控库房告警提醒',
                code: iItem.module_code,
                url: iItem.module_url,
                count: 0
              })
            } else if (iItem.module_code === 'verify-task') {
              findArr.push({
                name: '验证到期预警提醒',
                code: iItem.module_code,
                url: iItem.module_url,
                count: 0
              })
            }
          })
        })
        const arr = findArr.filter(item => Number(item.count) > 0)
        this.isShowTip = arr.length > 0 ? true : false;
        this.remindList = findArr;
      }
    })
  }

  navScaling() {
    this.isCollapsed = !this.isCollapsed
  }

  noticeClick() {
    this.isShow = !this.isShow;
  }
}
