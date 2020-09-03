import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzMessageService} from "ng-zorro-antd";

import {DebugLog} from 'tongchang-lib';

@Component({
  selector: 'app-record-form',
  templateUrl: './record-form.component.html',
  styleUrls: ['./record-form.component.scss']
})
export class RecordFormComponent implements OnInit {
  @Input() param: {};

  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;
  changeTypes = [{name:'维护'}, {name:'养护'},]
  validateForm: FormGroup;
  signImageUrl: string = '';

  constructor(
    private fb: FormBuilder,
    private msg: NzMessageService,
  ) {
  }

  ngOnInit() {
    this.creatForm(this.param);
  }

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
  }

  async onFileSelect() {
    this.fileInput.nativeElement.click()
  }

  //删除图片重新上传
  delSign() {
    this.signImageUrl = '';
  }

  //选择本地文件方法
  fileCh(e: Event) {
    const file = (e.target as HTMLInputElement).files[0];
    if (!file) return
    if (!/^image\//.test(file.type)) return this.msg.error('请选择图片文件')

    const reader = new FileReader()
    reader.readAsDataURL(file)

    reader.onload = () => {
      this.signImageUrl = reader.result as string;
      //赋值给sign
      Object.assign(this.validateForm.get('picture'), {value: reader.result as string})
      DebugLog(reader.result)
    }
  }

  creatForm(param) {
    this.signImageUrl = param.picture;
    this.validateForm = this.fb.group({
      change_type:      [param.change_type, [Validators.required]],
      curing_period:    [param.curing_period, [Validators.required]],
      curing_date:      [param.curing_date, [Validators.required]],
      next_curing_date: [param.next_curing_date, [Validators.required]],
      warn_time:        [param.warn_time, [Validators.required]],
      mark:             [param.mark],
      picture:          [param.picture],
    });
  }

}
