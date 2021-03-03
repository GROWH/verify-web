import {Component, OnDestroy, OnInit} from '@angular/core';
import {TongchangHttpService} from 'tongchang-lib';

import {ResetpwdFormComponent} from './resetpwd-form/resetpwd-form.component';
import {NzModalService, NzModalRef, NzMessageService, collapseMotion} from 'ng-zorro-antd';

import { SimpleReuseStrategy } from '../../SimpleReuseStrategy';
import {ActivatedRoute, Router, NavigationEnd, RouterEvent} from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
  providers: [SimpleReuseStrategy]
})
export class NavComponent implements OnInit, OnDestroy {
  isCollapsed = false;
  menuList: any = [];
  isShow = false; // 提醒框是否显示(block)
  remindUrl = '/remind'; // 接口名
  remindList: any = [];
  setTimer: any = []; // 定时器名称
  isShowTip = false; // 是否有提示
  baseUrl = '/account';
  // 路由列表
  tabList: any = [{title: '首页', module: '/manage/home', power: '/manage/home', isSelect: true}];
  conWidth = 0;
  openMap = {};

  constructor(
    private http: TongchangHttpService,
    private modal: NzModalService,
    private msg: NzMessageService,
    private router: Router,
    private route: Router,
    private activatedRoute: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.conWidth = document.body.clientWidth - 269;
    const tabArr = localStorage.getItem('tabList');
    if (tabArr !== null) { this.tabList = JSON.parse(tabArr); }
    this.menuAddIcon();
    this.getRemind();
    this.tabRouter();
    // this.timer()
  }

  // 定时调用提醒
  timer() {
    this.setTimer = setInterval(() => {
      this.getRemind();
    }, 0);
  }

  ngOnDestroy() {
    // 清除定时器
    clearInterval(this.setTimer);
  }
  // 主菜单相关处理
  menuAddIcon() {
    const listData = localStorage.getItem('menuAuth');
    this.menuList = JSON.parse(listData);
    this.menuList.map((item, index) => {
      // 设置主菜单打开状态
      const keyName = 'sub' + index;
      this.openMap[keyName] = false;
      // 给主菜单添加图标
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
  }
  openHandler(value: string): void {
    for (const key in this.openMap) {
      if (key !== value) {
        this.openMap[key] = false;
      }
    }
  }

  // 获取报警信息
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
              });
            } else if (iItem.module_code === 'my-house') {
              findArr.push({
                name: '监控库房告警提醒',
                code: iItem.module_code,
                url: iItem.module_url,
                count: 0
              });
            } else if (iItem.module_code === 'thermManger') {
              findArr.push({
                name: '温度计需校准提醒',
                code: iItem.module_code,
                url: iItem.module_url,
                count: 0
              });
            } else if (iItem.module_code === 'verify-task') {
              findArr.push({
                name: '验证到期预警提醒',
                code: iItem.module_code,
                url: iItem.module_url,
                count: 0
              });
            }
          });
        });
        const arr = findArr.filter(item => Number(item.count) > 0);
        this.isShowTip = arr.length > 0 ? true : false;
        this.remindList = findArr;
      }
    });
  }
  navScaling() {
    if (!this.isCollapsed) {
      this.conWidth = document.body.clientWidth - 108;
    } else {
      this.conWidth = document.body.clientWidth - 284;
    }
    this.isCollapsed = !this.isCollapsed;
  }
  noticeClick() {
    this.isShow = !this.isShow;
  }
  mouseFun(arr) {
    document.getElementById('user-option').style.display = arr;
  }
  // 退出账号
  outSyatem() {
    sessionStorage.clear();  // 清除所有session值
    const url = (window.location.href).split('#')[0];
    window.open(url, '_self');
  }
  // 修改密码
  resetPsw() {
    const param = new params;
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const modalRef: NzModalRef = this.modal.create({
      nzTitle: '修改密码',
      nzContent: ResetpwdFormComponent,
      nzWidth: 700,
      nzComponentParams: {param},
      nzFooter: [
        {
          label: '取消',
          onClick: () => modalRef.close()
        },
        {
          label: '确定',
          type: 'primary',
          disabled: comp => !comp.validateForm.valid,
          onClick: (comp) => {
            const formVal = {
              ...userInfo,
              ...comp.validateForm.getRawValue(),
            };
            this.modal.confirm({
              nzTitle: '提交',
              nzContent: '确认提交?',
              nzOnOk: () => {
                const params = formVal;
                if (params.oldPass != localStorage.getItem('pass')) {
                  this.msg.error('原始密码错误，请重新输入！');
                  return;
                }
                this.http.put(this.baseUrl, params).subscribe(res => {
                  if (res.code !== 0) {
                    this.msg.error(res.message);
                    return;
                  }
                  this.msg.success(res.message);
                  modalRef.close();
                  this.outSyatem();
                });
              }
            });

          }
        }
      ],
      nzWrapClassName: 'modal-vertical-center'
    });
  }


  // 处理tab所需要的menulist
  handArr(menuArr) {
    let cbLiat = [];
    menuArr.map(item => {
      if (!item.module_code.indexOf('home')) {
        cbLiat.push(menuArr[0]);
      }
      cbLiat = cbLiat.concat(item.children);
    });
    return cbLiat;
  }
  // tab-Router
  tabRouter() {
    const menuArr = this.handArr(this.menuList);
    this.router.events.pipe(
      filter(x => x instanceof NavigationEnd)
    ).subscribe((event) => {
      if ((event instanceof RouterEvent)) {
        this.tabList.forEach(p => p.isSelect = false);
        const titArr = menuArr.filter((ele) => {
          return event.url.indexOf(ele.module_url) > -1;
        }); // 获取Tab => title
        const tabArr = this.tabList.filter((ele) => {
          return titArr[0].module_name === ele.title;
        });
        if (tabArr.length === 0) {
          const menu = {title: titArr[0].module_name, module: event.url, power: event.url, isSelect: true};
          this.tabList.push(menu);
        } else {
          tabArr[0].isSelect = true;
        }
      }
      localStorage.setItem('tabList', JSON.stringify(this.tabList));
    });
  }
  // 关闭选项标签
  closeUrl(module: string, isSelect: boolean) {
      // 当前关闭的是第几个路由
      const index = this.tabList.findIndex(p => p.module == module);
      // 如果只有一个不可以关闭
      if (this.tabList.length == 1) { return ; }

      this.tabList = this.tabList.filter(p => p.module != module);
      // 删除复用
      delete SimpleReuseStrategy.handlers[module];
      if (!isSelect) { return; }
      // 显示上一个选中
      let menu = this.tabList[index - 1];
      if (!menu) {// 如果上一个没有下一个选中
        menu = this.tabList[index + 1];
     }
      this.tabList.forEach(p => p.isSelect = p.module == menu.module );
      // 显示当前路由信息
      this.router.navigate(['/' + menu.module]);
    }
}


export class params {
  id: number;
}
