import {Component, OnInit, Input} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UploadFile, UploadChangeParam} from 'ng-zorro-antd/upload';
import {NzMessageService} from "ng-zorro-antd";

@Component({
  selector: 'app-rule-form',
  templateUrl: './rule-form.component.html',
  styleUrls: ['./rule-form.component.scss']
})
export class RuleFormComponent implements OnInit {
  @Input() param: {};

  validateForm: FormGroup;
  filename: string = '';

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

  //上传前校验
  beforeUpload = (file: UploadFile): boolean => {
    //赋值给uploadName
    // Object.assign(this.validateForm.get('uploadName'),{value:file.name})
    if (file.name.lastIndexOf(".", (file.name).length) != -1) {
      var prefix = (file.name).substring((file.name).lastIndexOf(".", (file.name).length));
      if (prefix === '.doc' || prefix === '.docx') {
        return true;
      }
    } else {
      this.msg.error(`文件格式错误，请重新上选择！`);
      return false;
    }
  };

  //上传成功返回提示
  handleChange(info: UploadChangeParam): void {
    if (info.file.status === 'done') {
      this.filename = info.file.name;
      this.msg.success(`${info.file.name} 文件上传成功！`);
    } else if (info.file.status === 'error') {
      this.filename = '';
      this.msg.error(`${info.file.name} 文件上传失败,重新选择！`);
    }
  }

  creatForm(param) {
    this.validateForm = this.fb.group({
      uploadName: [param.uploadName],
      filename: [param.filename, [Validators.required]],
      filedesc: [param.filedesc],
    });
  }

}
