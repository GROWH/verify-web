import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TongchangHttpService } from 'tongchang-lib';

@Component({
  selector: 'app-param-desgin-form',
  templateUrl: './param-desgin-form.component.html',
  styleUrls: ['./param-desgin-form.component.scss']
})

export class ParamDesginFormComponent implements OnInit {
  @Input() param:{};

  validateForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private http: TongchangHttpService
  ) {}

  ngOnInit() {
    this.creatForm(this.param);
  }
  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
  }

  creatForm(param) {
    this.validateForm = this.fb.group({
      temp_alarm_high: [param.temp_alarm_high,[ Validators.required ]],
      temp_alarm_low: [param.temp_alarm_low,[ Validators.required ]],
      humi_alarm_high: [param.humi_alarm_high,[ Validators.required ]],
      humi_alarm_low: [param.humi_alarm_low,[ Validators.required ]],
      record_intvl_1: [param.record_intvl_1, [ Validators.required ]],
      upload_intvl_1: [param.upload_intvl_1, [ Validators.required ]],
      record_intvl_2: [param.record_intvl_2, [ Validators.required ]],
      upload_intvl_2: [param.upload_intvl_2, [ Validators.required ]],
      record_intvl_3: [param.record_intvl_3, [ Validators.required ]],
      upload_intvl_3: [param.upload_intvl_3, [ Validators.required ]],
      sl_alarm_en: [param.sl_alarm_en],
    });
  }

}
