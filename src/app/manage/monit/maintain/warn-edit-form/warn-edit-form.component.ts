import { NzMessageService } from 'ng-zorro-antd';
import { SimpPhoneValidator } from 'tongchang-lib';
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, FormControl } from '@angular/forms';

import { WARN_TYPES } from '@/config.const'
import { HouseAddData, WarnConf, StoreHouse } from '@/model/HouseMonit';

@Component({
  selector: 'app-warn-edit-form',
  templateUrl: './warn-edit-form.component.html',
  styleUrls: ['./warn-edit-form.component.scss']
})
export class WarnEditFormComponent implements OnInit {

  @Input() house: StoreHouse

  form: FormGroup; 

  warnTypes = WARN_TYPES
  
  constructor(
    private fb: FormBuilder,
    private msg: NzMessageService,
  ) { }

  ngOnInit() {
    this.formInit(this.house)
  }

  private formInit(house: StoreHouse) { 
    const numsValidator: ValidatorFn = (ctrl) => {
      const nums: string[] = ctrl.value || []
      return nums.length < 3 ? { count: true } : null
    }
    
    const warnGroupConf = (data: WarnConf) => {
      return ({
        types: [data.types, [ Validators.required ]],
        nums:  [data.nums,  [ numsValidator       ]],
        delay: [data.delay, [ Validators.required ]],
        span:  [data.span,  [ Validators.required ]],
        Warning_type_name: [data.Warning_type_name, [ Validators.required ]],
        Warning_nums:  [data.Warning_nums,  [ numsValidator       ]],
        Warning_delay: [data.Warning_delay, [ Validators.required ]],
        Warning_span:  [data.Warning_span,  [ Validators.required ]],
      })
    }

    this.form = this.fb.group({
      phone_warn:   this.fb.group(warnGroupConf(house.phone_warn)),
      message_warn: this.fb.group(warnGroupConf(house.message_warn)),
    })
  }

  /**
   * 获取告警表单组下所有告警电话
   * @param groupName 表单组名
   */
  getPhoneNums(groupName: string): string[] {
    return this.form.get(groupName).get('nums').value || []
  }
   /**
   * 获取预警表单组下所有告警电话
   * @param groupName 表单组名
   */
  getPhoneNums1(groupName: string): string[] {

    return this.form.get(groupName).get('Warning_nums').value || []
  }

  /**
   * 告警电话添加
   * @param groupName 表单组名
   * @param phoneNoInput 电话输入框 Input
   */
  onPhoneAdd(groupName: string, phoneNoInput: HTMLInputElement) {
    const phoneNo = phoneNoInput.value
    const numsCtrl  = this.form.get(groupName).get('nums') as FormControl
    const inputCtrl = this.fb.control(phoneNo, [ Validators.required, SimpPhoneValidator ])

    if (!inputCtrl.valid) return this.msg.error('请输入正确的手机号')
    const nums: string[] = numsCtrl.value || []
    if (nums.indexOf(phoneNo) > -1) return this.msg.error('手机号已添加')
    numsCtrl.setValue([ ...nums, phoneNo ])
    phoneNoInput.value = ''
  }
    /**
   * 预警电话添加
   * @param groupName 表单组名
   * @param phoneNoInput 电话输入框 Input
   */
  onPhoneAdd1(groupName: string, phoneNoInput: HTMLInputElement) {
    const phoneNo = phoneNoInput.value
    const numsCtrl  = this.form.get(groupName).get('Warning_nums') as FormControl
    const inputCtrl = this.fb.control(phoneNo, [ Validators.required, SimpPhoneValidator ])

    if (!inputCtrl.valid) return this.msg.error('请输入正确的手机号')
    const nums: string[] = numsCtrl.value || []
    if (nums.indexOf(phoneNo) > -1) return this.msg.error('手机号已添加')
    numsCtrl.setValue([ ...nums, phoneNo ])
    phoneNoInput.value = ''
  }

  /**
   * 告警电话移除
   */
  onPhoneRemove(groupName: string, index: number) {
    const numsCtrl = this.form.get(groupName).get('nums') as FormControl
    const nums: string[] = numsCtrl.value

    numsCtrl.setValue([
      ...nums.slice(0, index),
      ...nums.slice(index + 1),
    ])
  }

  get formVal() {
    return this.form.getRawValue()
  }

  /**
   * 预警电话移除
   */
  onPhoneRemove1(groupName: string, index: number) {
    const numsCtrl = this.form.get(groupName).get('Warning_nums') as FormControl
    const nums: string[] = numsCtrl.value

    numsCtrl.setValue([
      ...nums.slice(0, index),
      ...nums.slice(index + 1),
    ])
  }

  get formVal1() {
    return this.form.getRawValue()
  }
}
