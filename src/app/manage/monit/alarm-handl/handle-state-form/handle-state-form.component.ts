import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {LOGGER_SERVICE_PROVIDER} from "ng-zorro-antd";

@Component({
  selector: 'app-handle-state-form',
  templateUrl: './handle-state-form.component.html',
  styleUrls: ['./handle-state-form.component.scss'],
})
export class HandleStateFormComponent implements OnInit {
  @Input() house: {};
  form: FormGroup;
  processorB = JSON.parse(localStorage.getItem('userInfo')).account;
  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.formInit(this.house);
  }

  submitForm(): void {
    for (const i in this.form.controls) {
      this.form.controls[i].markAsDirty();
      this.form.controls[i].updateValueAndValidity();
    }
  }
  // 弹框中表单的初始化
  formInit(house) {
    this.form = this.fb.group({
      cause: [house.cause, [Validators.required]],
      method: [house.method, [Validators.required]],
      remarks: [house.remarks],
      processor: [house.processor === '' ? this.processorB : house.processor, [Validators.required]],
    });
  }
}
