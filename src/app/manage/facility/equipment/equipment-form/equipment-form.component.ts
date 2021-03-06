import {Component, OnInit, Input, ViewChild, ElementRef} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzMessageService} from "ng-zorro-antd";

import {DebugLog} from 'tongchang-lib';

@Component({
  selector: 'app-equipment-form',
  templateUrl: './equipment-form.component.html',
  styleUrls: ['./equipment-form.component.scss']
})
export class EquipmentFormComponent implements OnInit {
  @Input() param: {};

  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;

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
      //赋值给picture
      Object.assign(this.validateForm.get('picture'), {value: reader.result as string})
      DebugLog(reader.result)
    }
  }

  creatForm(param) {
    this.signImageUrl = param.picture;
    this.validateForm = this.fb.group({
      supplier:     [param.supplier, [Validators.required]],
      pur_price:    [param.pur_price, [Validators.required]],
      pur_person:   [param.pur_person, [Validators.required]],
      location:     [param.location, [Validators.required]],
      unit:         [param.unit, [Validators.required]],
      curator:      [param.curator, [Validators.required]],
      product_date: [param.product_date, [Validators.required]],
      expect_date:  [param.expect_date, [Validators.required]],
      state:        [param.state, [Validators.required]],
      picture:      [param.picture],
      mark:         [param.mark],
    });
  }
}
