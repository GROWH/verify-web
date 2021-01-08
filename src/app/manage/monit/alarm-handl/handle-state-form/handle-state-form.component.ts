import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-handle-state-form',
  templateUrl: './handle-state-form.component.html',
  styleUrls: ['./handle-state-form.component.scss'],
})
export class HandleStateFormComponent implements OnInit {
  @Input() house: {};
  form: FormGroup;
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
      processor: [house.processor, [Validators.required]],
    });
  }
}
