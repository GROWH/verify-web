import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { BaseInfo } from '@/model/Verify';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { DebugLog, TongchangLibService, TongchangHttpService } from 'tongchang-lib';
import { BaseInfoSerToken } from '../../verify.routing.token';
import { BaseInfoService } from '../base-info.service';
import { Apis } from '@/shared/urls.const';

@Component({
  selector: 'app-base-info-add-others',
  templateUrl: './base-info-add-others.component.html',
  styleUrls: ['./base-info-add-others.component.scss']
})
export class BaseInfoAddOthersComponent implements OnInit {

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
  stepMax = 1
  pointsForm: FormGroup;

  ngOnInit() {
    this.pointsFormInit()
  }

  get formVal(): BaseInfo {
    const pointsConf = this.pointsForm.getRawValue()
    return {
      ...this.baseInfo,
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

  get pointsConf() {
    return this.pointsForm.getRawValue()
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
