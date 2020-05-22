import { Component, OnInit, Injector } from '@angular/core';
import { GridAction, TongchangLibService, TongchangHttpService } from 'tongchang-lib';
import { NzMessageService, NzModalService, NzModalRef } from 'ng-zorro-antd';
import { Router, ActivatedRoute } from '@angular/router';
import { BaseInfoService } from '../base-info.service';
import { BaseInfoAddComponent } from '../base-info-add/base-info-add.component';

@Component({
  selector: 'app-base-info',
  templateUrl: './base-info.component.html',
  styleUrls: ['./base-info.component.scss']
})
export class BaseInfoComponent implements OnInit {

  constructor(
    injector: Injector,
    private msg: NzMessageService,
    private util: TongchangLibService,
    private http: TongchangHttpService,
    private modal: NzModalService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.actionInit()
  }


  uniSer!: BaseInfoService;
  gridActions: GridAction[] = []
  tableHeight = '500px'


  actionInit() {
    this.gridActions = [
      {
        name: '新增',
        icon: 'plus',
        code: 'add',
        type: 'primary',
        click: () => {
          this.onAdd()
        }
      },
      {
        name: '刷新',
        icon: 'reload',
        code: 'reload',
        click: () => this.uniSer.onForceReload()
      }
    ]
  }

  private onAdd() {
    const modalRef: NzModalRef = this.modal.create({
      nzTitle: '验证对象基础资料新建向导',
      nzContent: BaseInfoAddComponent,
      nzComponentParams: {
        afterDone: () => modalRef.close()
      },
      nzMaskClosable: false,
      nzWrapClassName: 'modal-vertical-center height-fixed no-padding',
      nzWidth: 900,
      nzFooter: null,
    })
  }
}
