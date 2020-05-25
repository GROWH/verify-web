import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { BaseInfo } from '@/model/Verify';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { DebugLog, TongchangLibService, TongchangHttpService } from 'tongchang-lib';
import { BaseInfoSerToken } from '../../verify.routing.token';
import { BaseInfoService } from '../base-info.service';
import { Apis } from '@/shared/urls.const';

@Component({
  selector: 'app-base-info-add-incubator',
  templateUrl: './base-info-add-incubator.component.html',
  styleUrls: ['./base-info-add-incubator.component.scss']
})
export class BaseInfoAddIncubatorComponent implements OnInit {

  @Input() baseInfo: BaseInfo;
  @Input() afterDone: () => void = () => 1
  @Output() outerPrev = new EventEmitter()

  constructor(
    private fb: FormBuilder,
    private util: TongchangLibService,
    private http: TongchangHttpService,
    @Inject(BaseInfoSerToken) private baseInfoSer: BaseInfoService,
  ) { }

  step = 0
  stepMax = 2
  form: FormGroup;
  pointsForm: FormGroup;

  ngOnInit() {
    this.formInit()
  }

  get params() {
    return this.form.getRawValue()
  }

  get pointsConf() {
    return this.pointsForm.getRawValue()
  }

  get formVal(): BaseInfo {
    const params = this.form.getRawValue()
    const pointsConf = this.pointsForm.getRawValue()
    return {
      ...this.baseInfo,
      ...params,
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

  /**
   * 验证对象参数设定
   * @param target_type 验证对象类型
   */
  formInit() {
    const form = this.fb.group({
      box_count: [ null, [ Validators.required ] ],
    })

    this.form = form
  }

  pointsFormInit() {
    const stockBaseInfo: BaseInfo = this.form.getRawValue()

    const REC_INCUBATOR = 5

    this.pointsForm = this.fb.group({
      cube_cooler:  [ 1, [ Validators.required ] ],
      cube_heater:  [ 1, [ Validators.required ] ],
      cooler:       [ 1, [ Validators.required ] ],
      trans_env:    [ 1, [ Validators.required ] ],
      boxes: this.fb.array(
        Array(stockBaseInfo.box_count).fill(0)
          .map((it, index) => {
            return this.fb.group({
              name:  [ `${index + 1} 号保温箱`, [ Validators.required ] ],
              count: [ REC_INCUBATOR, [ Validators.required ] ],
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
