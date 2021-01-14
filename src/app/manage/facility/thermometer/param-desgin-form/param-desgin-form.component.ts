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
    // console.log(param);
    this.validateForm = this.fb.group({
      temp_alarm_high: [param.temp_alarm_high,[ Validators.required ]],
      temp_alarm_low: [param.temp_alarm_low,[ Validators.required ]],
      humi_alarm_high: [param.humi_alarm_high,[ Validators.required ]],
      humi_alarm_low: [param.humi_alarm_low,[ Validators.required ]],
      warning_temp_up: [param.warning_temp_up,[ Validators.required ]],
      warning_temp_down: [param.warning_temp_down,[ Validators.required ]],
      warning_humi_up: [param.warning_humi_up,[ Validators.required ]],
      warning_humi_down: [param.warning_humi_down,[ Validators.required ]],
      record_intvl_1: [param.record_intvl_1, [ Validators.required ]],
      upload_intvl_1: [param.upload_intvl_1, [ Validators.required ]],
      record_intvl_2: [param.record_intvl_2, [ Validators.required ]],
      upload_intvl_2: [param.upload_intvl_2, [ Validators.required ]],
      record_intvl_3: [param.record_intvl_3, [ Validators.required ]],
      upload_intvl_3: [param.upload_intvl_3, [ Validators.required ]],
      wifi_ssid: [param.wifi_ssid],
      wifi_pwd: [param.wifi_pwd],
      wifi_ipaddr: [param.wifi_ipaddr],
      wifi_geteway: [param.wifi_geteway],
      wifi_netmask: [param.wifi_netmask],
      sl_alarm_en: [param.sl_alarm_en],
    });
  }

}
