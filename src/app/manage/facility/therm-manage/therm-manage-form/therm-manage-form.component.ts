import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { TongchangHttpService } from 'tongchang-lib';

@Component({
  selector: 'app-therm-manage-form',
  templateUrl: './therm-manage-form.component.html',
  styleUrls: ['./therm-manage-form.component.scss']
})

export class ThermManageFormComponent implements OnInit {
  @Input() param:{};
  roleUrl ='/role' //角色接口
  auditUrl = '/unit/queryAuditPass' //查询审核通过
  roleOptions = [];
  auditOptions = [];
  isTrail = false;
  validateForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private http: TongchangHttpService,
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

  creatForm(param) {
    this.validateForm = this.fb.group({
      info_record_time: [param.info_record_time ,[ Validators.required ]],
      manage_type: [param.manage_type, [ Validators.required ]],
      exp_person: [param.exp_person, [ Validators.required ]],
      mark: [param.mark, [ Validators.required ]],
      aline_cer_code: [param.aline_cer_code, [ Validators.required ]],
      aline_unit: [param.aline_unit ,[ Validators.required ]],
      inspect_time: [param.inspect_time ,[ Validators.required ]],
      inspect_person: [param.inspect_person ,[ Validators.required ] ],
      aline_tine: [param.aline_tine ,[ Validators.required ]],
      aline_expire_time: [param.aline_expire_time],
      next_aline_remind_time: [param.next_aline_remind_time ,[ Validators.required ]],
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

