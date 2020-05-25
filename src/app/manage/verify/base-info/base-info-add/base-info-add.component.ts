import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { merge } from 'rxjs';
import { filter } from 'rxjs/operators';
import { LOGINED_USER_UNIT_KEY } from '@/config.const';

@Component({
  selector: 'app-base-info-add',
  templateUrl: './base-info-add.component.html',
  styleUrls: ['./base-info-add.component.scss']
})
export class BaseInfoAddComponent implements OnInit {

  @Input() afterDone: () => void = () => 1

  constructor(
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.baseFormInit()
  }

  target_type = ''
  currStp = 1
  steps = [
    '基础信息录入',
    '验证对象参数设定',
    '布点监测点数量设置',
    '基础资料信息确认',
  ]

  client_types = [
    '医疗器械企业',
    '药品企业',
    '医疗机构',
    '食品企业',
    '疾控单位',
    '其他',
  ]

  types = [
    '库房',
    '保温箱',
    '冷藏车',
    '冷柜',
    '车载冰箱',
    '温度监测系统',
    '其他',
  ]

  next(curr: number) {
    this.currStp++
    if (curr === 1) {
      const target_type = this.form.get('target_type').value
      this.target_type = target_type
    }
  }

  prev() {
    this.currStp--
  }

  form: FormGroup
  baseFormInit() {
    const uid = localStorage.getItem(LOGINED_USER_UNIT_KEY)
    
    this.form = this.fb.group({
      client_id:           [ null, [ Validators.required ] ],
      implement_id:        [ uid,  [ Validators.required ] ],
      client_type:         [ null, [ Validators.required ] ],
      target_type:         [ null, [ Validators.required ] ],
      verify_time:         [ null, [ Validators.required ] ],
      verify_invalid_time: [ null, [ Validators.required ] ],
      warn_before:         [ null, [ Validators.required ] ],
    })
  }

}
