import { NzModalService, NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, Inject } from '@angular/core';
import { merge, timer, Subject, fromEvent, from } from 'rxjs';
import { map, takeUntil, filter, take } from 'rxjs/operators';
import { TongchangHttpService, TongchangLibService, DebugLog } from 'tongchang-lib';
import * as moment from 'moment';

import { WARN_TYPES, WARN_CODE_MAP } from '@/config.const'
import { Apis, Precent } from '@/shared/urls.const';
import { StoreHouse, WarnConf, MonitPointConf, MonitPoint } from '@/model/HouseMonit';
import { WarnEditFormComponent } from '../warn-edit-form/warn-edit-form.component';
import { DOCUMENT } from '@angular/common';
import { MaintainService } from '../maintain.service';
import { MaintainSerToken } from '../../monit.routing.token';
import { Unit } from '@/model/Unit';
import { PointRecordComponent } from '../../../../shared/components/point-record/point-record.component';

moment.locale('zh-cn')

let zIndexInit = 2

@Component({
  selector: 'app-house-detail',
  templateUrl: './house-detail.component.html',
  styleUrls: ['./house-detail.component.scss']
})
export class HouseDetailComponent implements OnInit {

  constructor(
    private msg: NzMessageService,
    private modal: NzModalService,
    private route: ActivatedRoute,
    private http: TongchangHttpService,
    private util: TongchangLibService,
    @Inject(MaintainSerToken) private uniSer: MaintainService,
    @Inject(DOCUMENT) private document: Document,
  ) {
    const maintainMode: boolean = route.snapshot.data['maintainMode']
    this.maintainMode = maintainMode
  }

  ngOnInit() {
    const hosid = this.route.snapshot.paramMap.get('hosid')
    this.uniSer.detailHosId = +hosid
    this.hosid = hosid

    timer(0, 30000).pipe(
      takeUntil(this.destroy$),
      filter(() => this.canReload())
    )
    .subscribe(() => this.reload())
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.destroy$.next()
  }

  /**
   * 维护模式
   */
  maintainMode = false

  house: StoreHouse;
  houseUpdateTimeDisplay = ''
  warnTypes = WARN_TYPES
  warnCodeMap = WARN_CODE_MAP

  pointChanged = false
  pointAdding = false
  pointRemoving = false
  pointEditing  = false

  private hosid: string;
  private destroy$ = new Subject()

  async forceReload() {
    const { messageId: msg } = this.msg.loading('刷新中...')
    const success = await this.reload()
    if (success) this.msg.success('刷新成功')
    this.msg.remove(msg)
  }

  reload() {
    return this.hosReload(this.hosid)
  }

  stopAdd() {
    this.pointAdding = false
  }

  stopRemove() {
    this.pointRemoving = false
  }

  async addPoint(e: MouseEvent) {
    const imgElRect = (e.target as HTMLElement).getBoundingClientRect()
    if (!this.pointAdding) return

    const dev = await this.uniSer.deviceSelect()

    const pos: MonitPointConf = {
      x: Precent(e.offsetX * 100 / imgElRect.width),
      y: Precent(e.offsetY * 100 / imgElRect.height),
      ...dev,
    }

    this.house.thermometer.push(pos)
    this.pointChanged = true
    DebugLog(JSON.stringify(pos))
  }

  /**
   * 监控点位添加按钮点击
   */
   onPointAdd() {
    this.stopRemove()
    this.pointAdding = !this.pointAdding
  }

  /**
   * 监控点位移除按钮点击
   */
  onPointRemove() {
    this.stopAdd()
    this.pointRemoving = !this.pointRemoving
  }

  removePoint(index: number) {
    if (!this.pointRemoving) return
    const points = this.house.thermometer
    this.house.thermometer = [
      ...points.slice(0, index),
      ...points.slice(index + 1),
    ]
    this.pointChanged = true
  }

  /**
   * 监控点位变更
   * @param event
   * @param pointConf
   */
  pointMove(event: MouseEvent, pointConf: MonitPointConf) {
    if (this.pointAdding || this.pointRemoving || !this.maintainMode) return

    const point = event.target as HTMLElement
    const cotin = point.parentElement as HTMLElement

    if (!point.classList.contains('point')) return

    point.style.zIndex = `${zIndexInit++}`
    const pointRect = point.getBoundingClientRect()
    const cotinRect = cotin.getBoundingClientRect()
    const { offsetX, offsetY } = event

    const mouseUp$    = fromEvent<MouseEvent>(this.document, 'mouseup')
    const mouseMove$  = fromEvent<MouseEvent>(cotin, 'mousemove')

    mouseUp$.pipe( take(1) ).subscribe(() => {
      this.pointChanged = true
      point.classList.remove('moving')
      DebugLog('move stopped!')
    })

    mouseMove$.pipe( takeUntil(mouseUp$) ).subscribe(moveEvent => {
      point.classList.add('moving')

      // 接近边界最小距离
      const rangeIn = 5
      const { clientX, clientY } = moveEvent

      let relX = clientX - offsetX - cotinRect.left
      let relY = clientY - offsetY - cotinRect.top

      if (relX < rangeIn) {
        relX = 0
      }
      if (relY < rangeIn) {
        relY = 0
      }
      if (relX + pointRect.width + rangeIn > cotinRect.width) {
        relX = cotinRect.width - pointRect.width
      }
      if (relY + pointRect.height + rangeIn > cotinRect.height) {
        relY = cotinRect.height - pointRect.height
      }

      const x = Precent((relX + pointRect.width / 2) / cotinRect.width * 100)
      const y = Precent((relY + pointRect.height / 2) / cotinRect.height * 100)

      pointConf.x = x
      pointConf.y = y
    })
  }

  /**
   * 更换设备
   */
  async chDevice(point: MonitPointConf) {
    this.pointEditing = true
    try {
      const hasSelect = this.house.thermometer.map(it => it.code)
      const dev = await this.uniSer.deviceSelect(hasSelect)
      point.code = dev.code
      point.name = dev.name
      this.pointChanged = true
      this.pointEditing = false

    } catch (error) {
      DebugLog(error)
      this.pointEditing = false
    }
  }

  /**
   * 保存点位编辑
   */
  async savePointConf() {
    const points = this.house.thermometer

    const res = await this.http.post(
      Apis.storehousePoint,
      points,
      { hosid: this.house.id + ''}
    ).toPromise()

    if (res.code === 0) {
      this.msg.success(res.message)
      this.pointChanged = false
      this.pointEditing = false
      this.pointRemoving = false
      this.pointAdding = false
      this.reload()
    }
  }

  async authDel(unit: Unit) {
    const units = this.house.units
    await this.util.submitConfirm(
      null,
      `
        确定撤销对单位 <b>${unit.unit_name}</b> 的授权?
      `
    )
    const { messageId } = this.msg.loading('提交中...')
    const newUnits = units.filter(it => it.id !== unit.id)
    const uids     = newUnits.map(it => it.id).join(',')
    const res = await this.houseAuth(uids).toPromise()

    if (res.code === 0) {
      this.msg.success(res.message)
      this.house.units = newUnits
    }
    this.msg.remove(messageId)

  }

  async authAdd() {
    const units = this.house.units
    const unit = await this.uniSer.unitSelect(units)
    const { messageId } = this.msg.loading('提交中...')
    const res = await this.houseAuth(
      [
        ...units,
        unit
      ].map(it => it.id).join(',')
    ).toPromise()

    if (res.code === 0) {
      this.msg.success(res.message)
      this.house.units.push(unit)
    }
    this.msg.remove(messageId)
  }

  /**
   * 告警信息显示用
   */
   warnConfForShow(data: WarnConf) {
    return {
      types: data.types.map(it => this.warnCodeMap[it]).join(','),
      nums:  data.nums.join(','),
      delay: data.delay + '秒',
      span:  data.span + '秒',
      warning_type_name: data.types.map(it => this.warnCodeMap[it]).join(','),
      warning_nums: data.warning_nums.join(','),
      warning_delay: data.warning_delay + '秒',
      warning_span:  data.warning_span + '秒',
    }
  }

  showWarnRec(point: MonitPoint) {
    const modalRef: NzModalRef = this.modal.create({
      nzTitle: point.name,
      nzContent: PointRecordComponent,
      nzComponentParams: {
        posId: point.id
      },
      nzMaskClosable: false,
      nzWrapClassName: 'test-modal',
      nzWidth: 1200,
      nzFooter: null,
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

  private canReload() {
    return !(
      this.pointChanged  ||
      this.pointAdding   ||
      this.pointEditing  ||
      this.pointRemoving
    )
  }

  private houseAuth(uids: string) {
    return this.http.put(
      Apis.storehouseAuth,
      null,
      {
        sid: this.house.id + '',
        uids
      }
    )
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
      this.reload()
    }
  }

  private async hosReload(hosid: string) {
    if (this.pointChanged) {
      await this.util.submitConfirm(null, '未保存的监控点编辑即将丢失, 是否继续?')
    }

    const res = await this.http.get<StoreHouse>(
      `${Apis.storehouse}/${hosid}`
    )
    .pipe(
      map(it => {
        if (it.code === 0) {
          it.data.message_warn.nums = JSON.parse(it.data.message_warn.nums as any)
          it.data.phone_warn.nums = JSON.parse(it.data.phone_warn.nums as any)
          it.data.message_warn.warning_nums = JSON.parse(it.data.message_warn.warning_nums as any)
          it.data.phone_warn.warning_nums = JSON.parse(it.data.phone_warn.warning_nums as any)
        }
        return it
      })
    )
    .toPromise()

    if (res.code === 0) {
      const house = res.data
      this.house = house
      this.pointChanged = false

      this.houseUpdateTimeDisplay = (
        house.new_uptime ?
        moment(house.new_uptime).fromNow() :
        'N/A'
      )
      return 1
    }
    return 0
  }
}
