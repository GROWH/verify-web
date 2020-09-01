import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { BaseInfo } from '@/model/Verify';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { TongchangLibService, TongchangHttpService } from 'tongchang-lib';
import { BaseInfoSerToken } from '../../verify.routing.token';
import { BaseInfoService } from '../base-info.service';
import { Apis } from '@/shared/urls.const';
import {LOGINED_USER_UNIT_KEY} from "@/config.const";

@Component({
  selector: 'app-base-info-add-system',
  templateUrl: './base-info-add-system.component.html',
  styleUrls: ['./base-info-add-system.component.scss']
})
export class BaseInfoAddSystemComponent implements OnInit {

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
    this.pointsFormInit()
  }


  step = 0
  stepMax = 0
  pointsForm: FormGroup;
  get pointsConf() {
    return this.pointsForm.getRawValue()
  }

  get formVal(): BaseInfo {
    return this.baseInfo

    // const pointsConf = this.pointsForm.getRawValue()
    // return {
    //   ...this.baseInfo,
    //   point_conf: JSON.stringify(pointsConf)
    // }
  }

  async onSubmit() {
    await this.util.submitConfirm();
    const uid = localStorage.getItem(LOGINED_USER_UNIT_KEY);
    const params = Object.assign({},this.formVal,{implement_id:uid});
    const res = await this.http.post(Apis.verifyBaseInfo, params).toPromise()

    if (res.code === 0) {
      this.afterDone()
    }
  }


  pointsFormInit() {
    this.pointsForm = this.fb.group({
      others: this.fb.array([])
    })
  }

  next() {
    this.step++
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
