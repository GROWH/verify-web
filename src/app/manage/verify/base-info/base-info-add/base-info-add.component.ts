import {Component, OnInit, Input} from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormArray} from '@angular/forms';
import {merge} from 'rxjs';
import {filter} from 'rxjs/operators';
import {LOGINED_USER_UNIT_KEY} from '@/config.const';
import {NzMessageService} from "ng-zorro-antd";
import {el} from "@angular/platform-browser/testing/src/browser_util";

@Component({
  selector: 'app-base-info-add',
  templateUrl: './base-info-add.component.html',
  styleUrls: ['./base-info-add.component.scss']
})
export class BaseInfoAddComponent implements OnInit {

  @Input() afterDone: () => void = () => 1;
  @Input() openType;//打开页面:task->验证任务页面；base->验证基础资料页面

  constructor(
    private fb: FormBuilder,
    private msg: NzMessageService
  ) {
  }

  ngOnInit() {
    console.log(this.openType)
    this.baseFormInit()
  }

  target_type = ''
  currStp = 0
  steps = ['基础信息录入', '验证对象参数设定', '布点监测点数量设置', '基础资料信息确认',]
  client_types = ['医疗器械企业', '药品企业', '医疗机构', '食品企业', '疾控单位', '其他',]
  types = ['库房', '保温箱', '冷藏车', '冷柜', '车载冰箱', '温度监测系统', '其他',]
  house_types = ['冷藏库', '冷冻库', '阴凉库', '恒温库', '其他',]
  verify_class = ['常规验证', '极高温验证', '极低温验证', '其他',]
  verify_type = ['初次使用前验证', '改造后再次使用前验证', '停用超时限再启用前验证', '定期验证', '其他',]

  next(curr: number) {
    if(curr === 0){
      this.currStp++
    }
    if (curr === 1) {
      console.log(this.form)
      console.log(this.form.valid)
      if (!this.form.valid) {
        this.msg.error('存在未填写的项目，请检查！')
      }else{
        this.currStp++
      }
      const target_type = this.form.get('target_type').value
      this.target_type = target_type
    }
  }

  prev() {
    this.currStp--;
  }

  form: FormGroup

  baseFormInit() {
    const unit_name = localStorage.getItem('unitName')

    this.form = this.fb.group({
      client_id: [null, [Validators.required]],
      implement_id: [unit_name, [Validators.required]],
      client_type: [null, [Validators.required]],
      target_type: [null, [Validators.required]],
      house_types: [null, [Validators.required]],
      temp_up: [null, [Validators.required]],
      temp_down: [null, [Validators.required]],
      verify_class: [null, [Validators.required]],
      verify_type: [null, [Validators.required]],
      verify_time: [null, [Validators.required]],
      verify_invalid_time: [null, [Validators.required]],
      warn_before: [null, [Validators.required]],
    })
  }

}
