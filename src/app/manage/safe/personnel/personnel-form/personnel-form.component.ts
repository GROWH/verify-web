import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NzMessageService} from "ng-zorro-antd";

import {DebugLog} from 'tongchang-lib';

@Component({
  selector: 'app-personnel-form',
  templateUrl: './personnel-form.component.html',
  styleUrls: ['./personnel-form.component.scss']
})
export class PersonnelFormComponent implements OnInit {
  @Input() param: {
  };
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
  delSign(){
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
      Object.assign(this.validateForm.get('sign'),{value:reader.result as string})
      DebugLog(reader.result)
    }
  }


  creatForm(param) {
    this.signImageUrl = param.sign;
    this.validateForm = this.fb.group({
      name:    [param.name, [Validators.required]],
      unit:    [param.unit, [Validators.required]],
      dept:    [param.dept, [Validators.required]],
      appoint: [param.appoint, [Validators.required]],
      sign:    [param.sign],
      mark:    [param.mark],
    });
  }

}
