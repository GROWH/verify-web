import { Component, OnInit, Injector } from '@angular/core';
import { GridAction, UniversalComponent, TongchangHttpService, TongchangLibService } from 'tongchang-lib';
import { Router, ActivatedRoute } from '@angular/router';
import { MaintainService } from '../maintain.service';
import { Apis } from '@/shared/urls.const';
import { HouseAddData, StoreHouse } from '@/model/HouseMonit';
import { NzModalService, NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { WarnEditFormComponent } from '../warn-edit-form/warn-edit-form.component';
import { HouseEditFormComponent } from '../house-edit-form/house-edit-form.component';

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
    this.actionInit()
    this.uniSer.gridConf = {
      queryUrl: Apis.storehouse,
      queryBody: null,
      queryParam: {},
      queryMethod: 'get',
      page: 1,
      size: 50,
    }
  }

  uniSer!: MaintainService;
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
          this.router.navigate(['add'], {relativeTo: this.route})
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

  houseEdit(house: StoreHouse) {
    const modalRef: NzModalRef = this.modal.create({
      nzTitle: '库房编辑',
      nzContent: HouseEditFormComponent,
      nzComponentParams: { house },
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
    })
  }

  warnSet(house: StoreHouse) {
    const modalRef: NzModalRef = this.modal.create({
      nzTitle: '告警设定',
      nzContent: WarnEditFormComponent,
      nzComponentParams: { house },
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
    })
  }

  viewDetail(house: StoreHouse) {
    this.router.navigate([ 'detail', house.id ], { relativeTo: this.route })
  }
    
  private async warnSetSubmit(modalRef: NzModalRef, formVal: any, hosid: number) {
    await this.util.submitConfirm()
    const res = await this.http.post(
      Apis.storehouseWarn,
      formVal,
      { hosid: hosid + '' }
    ).toPromise()
    
    if (res.code === 0) {
      this.msg.success(res.message)
      modalRef.close()
      this.uniSer.onForceReload()
    }
  }


  private async houseEditSubmit(modalRef: NzModalRef, formVal: any) {
    await this.util.submitConfirm()
    const res = await this.http.put(Apis.storehouse, formVal).toPromise()

    if (res.code === 0) {
      this.msg.success(res.message)
      modalRef.close()
      this.uniSer.onForceReload()
    }
  }
}
