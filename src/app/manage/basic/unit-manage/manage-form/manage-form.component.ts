import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-manage-form',
  templateUrl: './manage-form.component.html',
  styleUrls: ['./manage-form.component.scss']
})

export class ManageFormComponent implements OnInit {
  @Input() param:{};
  listOptions = [
    {
      name:"验证平台",
      id:1
    },
    {
      name:"验证实施单位",
      id:2
    },
    {
      name:"验证公司客户",
      id:3
    }
  ]
  validateForm: FormGroup;
  constructor(
    private fb: FormBuilder
  ) { }

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
      unit_name: [param.unit_name ,[ Validators.required ]],
      social_code: [param.social_code, [ Validators.required ]],
      unit_type: [param.unit_type, [ Validators.required ]],
      cell_phone: [param.cell_phone, [ Validators.required, telValidator(/^(?:(?:\+|00)86)?1[3-9]\d{9}$/)]],
      unit_email: [param.unit_email, [ Validators.required, Validators.email]],
      fixed_phone: [param.fixed_phone],
      linkman: [param.linkman ,[ Validators.required ]],
      unit_address: [param.unit_address ,[ Validators.required ]],
      fax: [param.fax ,[ Validators.required ]],
      bank: [param.bank ,[ Validators.required ]],
      bank_account: [param.bank_account ,[ Validators.required ]],
      mark: [param.mark],
    });
  }

  trailChange(event) {
      console.log(event)
  }
}
export function telValidator(nameRe: RegExp): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const notPhone = nameRe.test(control.value);
    return notPhone ? null : {'notPhone': {value: control.value}};
  };
}
