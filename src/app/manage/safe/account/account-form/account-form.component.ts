import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { TongchangHttpService } from 'tongchang-lib';

@Component({
  selector: 'app-account-form',
  templateUrl: './account-form.component.html',
  styleUrls: ['./account-form.component.scss']
})

export class AccountFormComponent implements OnInit {
  @Input() param:{};
  roleUrl ='/role' //角色接口
  auditUrl = '/unit/queryAuditPass' //查询审核通过
  roleOptions = [];
  auditOptions = [];
  validateForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private http: TongchangHttpService,
  ) {
    this.getRoles();
    this.getAudits();
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

  creatForm(param) {
    this.validateForm = this.fb.group({
      account: [param.account ,[ Validators.required ]],
      pass: [param.pass, [ Validators.required ]],
      name: [param.name, [ Validators.required ]],
      unit_id: [param.unit_id, [ Validators.required ]],
      phone: [param.phone, [ Validators.required, telValidator(/^(?:(?:\+|00)86)?1[3-9]\d{9}$/)]],
      email: [param.email, [ Validators.required, Validators.email]],
      on_trial: [param.on_trial ,[ Validators.required ]],
      trial_end: [param.trial_end],
      role_id: [param.role_id ,[ Validators.required ]],
      is_super: [param.is_super ,[ Validators.required ]],
    });
  }
  
  getRoles() {
    this.http.get<any>(this.roleUrl).subscribe(res => {
      if(res.code === 0) {
        this.roleOptions = res.data
      }
    })
  }
  getAudits() {
    this.http.get<any>(this.auditUrl).subscribe(res => {
      if(res.code ===0 ) {
        this.auditOptions = res.data
      }
    })
  }


}
export function telValidator(nameRe: RegExp): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const notPhone = nameRe.test(control.value);
    return notPhone ? null : {'notPhone': {value: control.value}};
  };
}

