import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { BaseInfo } from '@/model/Verify';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { DebugLog, TongchangLibService, TongchangHttpService } from 'tongchang-lib';
import { filter } from 'rxjs/operators';
import { BaseInfoService } from '../base-info.service';
import { BaseInfoSerToken } from '../../verify.routing.token';
import { Apis } from '@/shared/urls.const';

@Component({
  selector: 'app-base-info-add-car',
  templateUrl: './base-info-add-car.component.html',
  styleUrls: ['./base-info-add-car.component.scss']
})
export class BaseInfoAddCarComponent implements OnInit {

  @Input() baseInfo: BaseInfo;
  @Input() afterDone: () => void = () => 1
  @Output() outerPrev = new EventEmitter()

  constructor(
    private fb: FormBuilder,
    private util: TongchangLibService,
    private http: TongchangHttpService,
    @Inject(BaseInfoSerToken) private baseInfoSer: BaseInfoService,
  ) { }

  ngOnInit() {
    this.formInit()
  }

  step = 0
  stepMax = 2

  pointsForm: FormGroup;
  form: FormGroup;

  /**
   * 验证对象参数设定
   * @param target_type 验证对象类型
   */
  formInit() {
    const form = this.fb.group({
      temp_up:     [ null, [ Validators.required ] ],
      temp_down:   [ null, [ Validators.required ] ],
      fan:         [ null, [ Validators.required ] ],
      blind_point: [ null, [ Validators.required ] ],
      monit_point: [ null, [ Validators.required ] ],
      door:        [ null, [ Validators.required ] ],
      car_vol:     [ null, [ Validators.required ] ],
      car_area:    [ null, [ Validators.required ] ],

      fan_conf:    this.fb.array([]),
    })

    const fanCtrl = form.get('fan')
    const fanConfCtrl = form.get('fan_conf') as FormArray

    fanCtrl.valueChanges.pipe(
      filter(() => fanCtrl.valid),
    ).subscribe((count: number) => {
      const fanConfs = fanConfCtrl.controls

      if (count < 2) return fanConfCtrl.controls = []

      if (fanConfs.length > count) {
        for (let i = count; i < fanConfs.length; i++) {
          fanConfCtrl.removeAt(i)
        }
      } else {
        for (let i = fanConfCtrl.length; i < count; i++) {
          fanConfCtrl.push(this.fb.group({
            type: [ null, [ Validators.required ]]
          }))
        }
      }
    })

    this.form = form
  }

  get params() {
    return this.form.getRawValue()
  }

  get pointsConf() {
    return this.pointsForm.getRawValue()
  }

  get fanConfCtrls() {
    return (this.form.get('fan_conf') as FormArray).controls
  }

  get formVal(): BaseInfo {
    const params = this.form.getRawValue()
    const pointsConf = this.pointsForm.getRawValue()
    return {
      ...this.baseInfo,
      ...params,
      fan_conf: JSON.stringify(params.fan_conf),
      point_conf: JSON.stringify(pointsConf)
    }
  }

  async onSubmit() {
    DebugLog(this.formVal)
    await this.util.submitConfirm()

    const res = await this.http.post(Apis.verifyBaseInfo, this.formVal).toPromise()

    if (res.code === 0) {
      this.afterDone()
    }
  }

  pointsFormInit() {
    const stockBaseInfo: BaseInfo = this.form.getRawValue()

    const REC_DOOR = 5
    const REC_FAN_OUT = 5
    const REC_BLAND = 3
    const REC_FAN_IN = 5
    const REC_PER_VOL = 9
    const PER_VOL = 20

    const matrixCount = Math.ceil(stockBaseInfo.car_vol / PER_VOL) * REC_PER_VOL

    this.pointsForm = this.fb.group({
      env:     [ 1,                         [ Validators.required ] ],
      matrix:  [ matrixCount,               [ Validators.required ] ],
      monit:   [ stockBaseInfo.monit_point, [ Validators.required ] ],
      door:    this.fb.array(
        Array(stockBaseInfo.door).fill(0)
          .map((it, index) => {
            return this.fb.group({
              name: `${index + 1} 号出入口`,
              count: REC_DOOR,
            })
          })
      ),
      fan_out: this.fb.array(
        Array(stockBaseInfo.fan).fill(0)
          .map((it, index) => {
            return this.fb.group({
              name: `${index + 1} 号出风口`,
              count: REC_FAN_OUT,
            })
          })
      ),
      fan_in: this.fb.array(
        Array(stockBaseInfo.fan).fill(0)
          .map((it, index) => {
            return this.fb.group({
              name: `${index + 1} 号回风口`,
              count: REC_FAN_IN,
            })
          })
      ),
      bland: this.fb.array(
        Array(stockBaseInfo.blind_point).fill(0)
          .map((it, index) => {
            return this.fb.group({
              name: `${index + 1} 号死角`,
              count: REC_BLAND,
            })
          })
      ),
      others: this.fb.array([])
    })
  }

  next() {
    this.step++
    const POINT_CONF_STEP = 1
    const STOCK_VIEW_STEP = 2
    if (this.step === POINT_CONF_STEP) this.pointsFormInit()

    if (this.step === STOCK_VIEW_STEP) {
      DebugLog(this.baseInfo)
      DebugLog(this.form.getRawValue())
      DebugLog(this.pointsForm.getRawValue())
    }
  }

  prev() {
    if (this.step === 0) return this.outerPrev.next()
    this.step--
  }

  onOtherAdd() {
    const othersCtrl = this.pointsForm.get('others') as FormArray

    othersCtrl.push(
      this.fb.group({
        name: [ null, [ Validators.required ] ],
        count: [ null, [ Validators.required ] ],
      })
    )
  }

  onOtherDel(i: number) {
    const othersCtrl = this.pointsForm.get('others') as FormArray

    othersCtrl.removeAt(i)
  }
}
