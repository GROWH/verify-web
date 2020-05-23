import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BaseInfo } from '@/model/Verify';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { DebugLog } from 'tongchang-lib';

@Component({
  selector: 'app-base-info-add-others',
  templateUrl: './base-info-add-others.component.html',
  styleUrls: ['./base-info-add-others.component.scss']
})
export class BaseInfoAddOthersComponent implements OnInit {

  @Input() baseInfo: BaseInfo;

  @Output() outerPrev = new EventEmitter()

  constructor(
    private fb: FormBuilder,
  ) { }

  step = 0
  stepMax = 1
  pointsForm: FormGroup;

  ngOnInit() {
    this.pointsFormInit()
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
