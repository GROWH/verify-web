import {Component, OnInit, Injector} from '@angular/core';
import {UniversalComponent, TongchangHttpService, TongchangLibService} from 'tongchang-lib';
import {Router, ActivatedRoute} from '@angular/router';
import {MaintainService} from '../maintain.service';
import {Apis} from '@/shared/urls.const';
import {HouseAddData, StoreHouse} from '@/model/HouseMonit';
import {NzModalService, NzModalRef, NzMessageService} from 'ng-zorro-antd';
import {WarnEditFormComponent} from '../warn-edit-form/warn-edit-form.component';
import {HouseEditFormComponent} from '../house-edit-form/house-edit-form.component';

import {GridAction} from '@/model/GridAction';
import {buttonAccess} from "@/config.const";

@Component({
  selector: 'app-maintain',
  templateUrl: './maintain.component.html',
  styleUrls: ['./maintain.component.scss']
})
export class MaintainComponent extends UniversalComponent {

  constructor(
    injector: Injector,
    private msg: NzMessageService,
    private util: TongchangLibService,
    private http: TongchangHttpService,
    private modal: NzModalService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    super(injector, route);
  }

  ngOnInit() {
    this.tableHeight = document.body.offsetHeight - 300;
    this.actionInit();
    this.uniSer.gridConf = {
      queryUrl: Apis.storehouse,
      queryBody: null,
      queryParam: {},
      queryMethod: 'get',
      page: 1,
      size: 50,
    };
  }

  uniSer!: MaintainService;
  gridActions: GridAction[];
  tableHeight:number = 0;

  selectItems = [];
  checkUrl = '/storehouse/enable/'; //启用
  stopUrl = '/storehouse/stop/'; //停用
  isAllDisplayDataChecked = false;
  isIndeterminate = false;
  mapOfCheckedId: { [key: string]: boolean } = {};


  actionInit() {
    this.gridActions = [
      {
        name: '新增',
        icon: 'plus',
        code: 'maintain_add',
        type: 'primary',
        click: () => {
          this.router.navigate(['add'], {relativeTo: this.route});
        },
        isExist: buttonAccess("maintain_add"),
      }, {
        name: '启用库房',
        icon: 'check-circle',
        code: 'maintain_check',
        type: 'default',
        click: () => {
          this.Check();
        },
        isExist: buttonAccess("maintain_check"),
      }, {
        name: '停用库房',
        icon: 'stop',
        code: 'maintain_stop',
        type: 'default',
        click: () => {
          this.Stop();
        },
        isExist: buttonAccess("maintain_stop"),
      },
      {
        name: '刷新',
        icon: 'reload',
        code: 'maintain_reload',
        click: () => this.uniSer.onForceReload(),
        isExist: buttonAccess("maintain_reload"),
      }
    ]
  }

  //启用
  Check() {
    if (this.selectItems.length === 0) {
      this.msg.warning('请先选择数据进行操作!');
      return;
    }
    const checkStatus = this.selectItems.every(it => !it.state);
    if (!checkStatus) {
      this.msg.warning('请选择空库状态的库房进行操作');
      return;
    }
    const selectedIds = this.selectItems.map(it => it.id) + '';
    this.http.get(`${this.checkUrl}?ids=${selectedIds}`).subscribe(res => {
      if (res.code !== 0) {
        this.msg.error(res.message);
        return;
      }
      this.msg.success(res.message);
      this.uniSer.onForceReload();
    });
  }

  //停用
  Stop() {
    if (this.selectItems.length === 0) {
      this.msg.warning('请先选择数据进行操作!');
      return;
    }
    const checkStatus = this.selectItems.every(it => it.state);
    if (!checkStatus) {
      this.msg.warning('请选择使用状态的库房进行操作');
      return;
    }
    const selectedIds = this.selectItems.map(it => it.id) + '';
    this.http.get(`${this.stopUrl}?ids=${selectedIds}`).subscribe(res => {
      if (res.code !== 0) {
        this.msg.error(res.message);
        return;
      }
      this.msg.success(res.message);
      this.uniSer.onForceReload();
    });
  }

  refreshStatus(): void {
    this.isAllDisplayDataChecked = this.uniSer.data.every((item) => this.mapOfCheckedId[item.id]);
    let checkId = this.mapOfCheckedId;
    this.selectItems = this.uniSer.data.map((item) => {
      for (let key in checkId) {
        if (checkId[key] && Number(key) === item.id) {
          return item;
        }
      }
    }).filter(item => item);
    this.isIndeterminate =
      this.uniSer.data.some(item => this.mapOfCheckedId[item.id]) && !this.isAllDisplayDataChecked;
  }
  checkAll(value: boolean): void {
    this.uniSer.data.forEach(item => (this.mapOfCheckedId[item.id] = value));
    this.refreshStatus();
  }

  houseEdit(house: StoreHouse) {
    const modalRef: NzModalRef = this.modal.create({
      nzTitle: '库房编辑',
      nzContent: HouseEditFormComponent,
      nzComponentParams: {house},
      nzMaskClosable: false,
      nzWrapClassName: 'modal-vertical-center',
      nzWidth: 900,
      nzFooter: [
        {
          label: '取消',
          onClick: () => modalRef.close()
        },
        {
          label: '提交',
          type: 'primary',
          onClick: comp => this.houseEditSubmit(
            modalRef, comp.formVal
          ),
          disabled: comp => !comp.form.valid
        }
      ]
    });
  }

  warnSet(house: StoreHouse) {
    const modalRef: NzModalRef = this.modal.create({
      nzTitle: '告警设定',
      nzContent: WarnEditFormComponent,
      nzComponentParams: {house},
      nzMaskClosable: false,
      nzWrapClassName: 'modal-vertical-center',
      nzWidth: 900,
      nzFooter: [
        {
          label: '取消',
          onClick: () => modalRef.close()
        },
        {
          label: '提交',
          type: 'primary',
          onClick: comp => this.warnSetSubmit(
            modalRef, comp.formVal, comp.house.id
          ),
          disabled: comp => !comp.form.valid
        }
      ]
    });
  }

  viewDetail(house: StoreHouse) {
    this.router.navigate(['detail', house.id], {relativeTo: this.route});
  }

  yesOrno(value) {
    return value === 'true' || value === true || value === '使用' ? '使用' : '空库';
  }
  // 告警设定-提交
  private async warnSetSubmit(modalRef: NzModalRef, formVal: any, hosid: number) {
    await this.util.submitConfirm();
    const res = await this.http.post(
      Apis.storehouseWarn,
      formVal,
      {hosid: hosid + ''}
    ).toPromise();

    if (res.code === 0) {
      this.msg.success(res.message);
      modalRef.close();
      this.uniSer.onForceReload();
    }
  }

// 编辑-提交
  private async houseEditSubmit(modalRef: NzModalRef, formVal: any) {
    await this.util.submitConfirm();
    const res = await this.http.put(Apis.storehouse, formVal).toPromise();
    if (res.code === 0) {
      this.msg.success(res.message);
      modalRef.close();
      this.uniSer.onForceReload();
    }
  }
}
