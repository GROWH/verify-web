import { Injectable } from '@angular/core';
import { NzModalService, NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { UniversalService, TongchangLibService, TongchangHttpService } from 'tongchang-lib';

import { StoreHouse, HouseAddData } from '@/model/HouseMonit';
import { Apis, ResTrans } from '@shared/urls.const';
import { CommonService } from '@/core/common.service';

import { WarnEditFormComponent } from './warn-edit-form/warn-edit-form.component';
import { DeviceSelectComponent } from './device-select/device-select.component';
import { UnitSelectComponent } from './unit-select/unit-select.component';
import { Unit } from '@/model/Unit';


@Injectable()
export class MaintainService extends UniversalService<HouseAddData> {

  constructor(
    public modal: NzModalService,
    public msg: NzMessageService,
    public http: TongchangHttpService,
    public util: TongchangLibService,
    private commSer: CommonService,

  ) {
    super()
  }

  detailHosId = -1

  pageMinus = 0
  resTrans = ResTrans
  crudUrl = Apis.storehouse

  formComp = null

  dataHandle = (datas: any[]) => {
    datas.forEach(it => {
      it.message_warn.nums = JSON.parse(it.message_warn.nums)
      it.phone_warn.nums   = JSON.parse(it.phone_warn.nums)
      it.message_warn.warning_nums = JSON.parse(it.message_warn.warning_nums)
      it.phone_warn.warning_nums   = JSON.parse(it.phone_warn.warning_nums)
    })
    return datas as HouseAddData[]
  }
  
  deviceSelect(filterCode: string[] = []) {
    return new Promise<{ code: string, name: string }>((resolve, reject) => {
      const modalRef: NzModalRef = this.modal.create({
        nzTitle: '请选择监控设备',
        nzContent: DeviceSelectComponent,
        nzComponentParams: {
          filterCode: filterCode
        },
        nzMaskClosable: false,
        nzWrapClassName: 'modal-vertical-center',
        nzWidth: 900,
        nzOnCancel: () => reject(),
        nzFooter: [
          {
            label: '取消',
            onClick: () => {
              modalRef.close()
              reject()
            }
          },
          {
            label: '确定',
            type: 'primary',
            onClick: comp => {
              modalRef.close()
              resolve(comp.formVal)
            },
            disabled: comp => !comp.form.valid
          }
        ]
      })
    })
  }
  
  /**
   * 选择授权单位
   * @param units 已授权查看单位
   */
  unitSelect(units: Unit[]) {
    return new Promise<Unit>((resolve, reject) => {
      const modalRef: NzModalRef = this.modal.create({
        nzTitle: '请选择单位',
        nzContent: UnitSelectComponent,
        nzComponentParams: {
          onSelect: async (unit: Unit) => {

            if (units.some(it => it.id === unit.id)) {
              return this.msg.warning('该单位已授权')
            }

            await this.util.submitConfirm()
            resolve(unit)
            modalRef.close()
          }
        },
        nzMaskClosable: false,
        nzWrapClassName: 'modal-vertical-center height-fixed',
        nzWidth: 900,
        nzOnCancel: () => reject(),
        nzFooter: null
      })
    })
  }
}
