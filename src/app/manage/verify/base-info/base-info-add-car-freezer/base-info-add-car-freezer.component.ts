import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BaseInfo } from '@/model/Verify';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { DebugLog, TongchangHttpService, TongchangLibService } from 'tongchang-lib';
import { Apis } from '@/shared/urls.const';
import {LOGINED_USER_UNIT_KEY} from "@/config.const";

@Component({
  selector: 'app-base-info-add-car-freezer',
  templateUrl: './base-info-add-car-freezer.component.html',
  styleUrls: ['./base-info-add-car-freezer.component.scss']
})
export class BaseInfoAddCarFreezerComponent implements OnInit {

  @Input() baseInfo: BaseInfo;
  @Input() afterDone: () => void = () => 1
  @Output() outerPrev = new EventEmitter()

  constructor(
    private fb: FormBuilder,
    private util: TongchangLibService,
    private http: TongchangHttpService,
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
    const uid = localStorage.getItem(LOGINED_USER_UNIT_KEY);
    const params = Object.assign({},this.formVal,{implement_id:uid});
    const res = await this.http.post(Apis.verifyBaseInfo, params).toPromise()

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
