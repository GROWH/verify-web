import {Component, OnInit} from '@angular/core';
import {TongchangHttpService} from "tongchang-lib";

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  isCollapsed = false;
  menuList: any = [];
  isAlert: boolean = false;
  remindUrl:string = "/remind";
  remindList:any = [];


  constructor(
    private http: TongchangHttpService,
  ) {
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
    this.getRemind()
  }

  getRemind() {
    const findArr: any = [];
    this.http.get<any>(this.remindUrl).subscribe(res => {
      if(res.code === 0) {
        const resDate = res.data || {};
        this.menuList.map(item=>{
          item.children.map(iItem=>{
            if(iItem.module_code ==='unitaudit'){
              findArr.push({name:'新增单位审核提醒',code:iItem.module_code,url:iItem.module_url,count:resDate.unit[0].count})
            }else if (iItem.module_code ==='my-house'){
              findArr.push({name:'温度计需校准提醒',code:iItem.module_code,url:iItem.module_url,count:resDate.unit[0].count})
            }else if (iItem.module_code ==='thermManger'){
              findArr.push({name:'监控库房告警提醒',code:iItem.module_code,url:iItem.module_url,count:resDate.unit[0].count})
            }else if (iItem.module_code ==='verify-task'){
              findArr.push({name:'验证到期预警提醒',code:iItem.module_code,url:iItem.module_url,count:resDate.unit[0].count})
            }
          })
        })
        this.remindList = findArr;
      }
    })
  }

  navScaling() {
    this.isCollapsed = !this.isCollapsed
  }

  noticeClick() {
    this.isAlert = !this.isAlert;
  }
}
