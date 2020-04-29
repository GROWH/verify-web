import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TongchangHttpService } from 'tongchang-lib';

@Component({
  selector: 'app-thermometer-form',
  templateUrl: './thermometer-form.component.html',
  styleUrls: ['./thermometer-form.component.scss']
})

export class ThermometerFormComponent implements OnInit {
  @Input() param:{};
  auditPassUrl = '/unit/queryAuditPass' //审核通过单位
  unitList = [];
  purposeList =[
    {
      label:'库房检测'
    },
    {
      label:'验证'
    },
    {
      label:'运输'
    },
    {
      label:'其他'
    }
  ]
  usageList =[
    {
      label:'使用中'
    },
    {
      label:'未使用'
    },
    {
      label:'维修中'
    },
    {
      label:'报损'
    },
    {
      label:'丢失'
    },
    {
      label:'校准中'
    },
    {
      label:'停用'
    },
    {
      label:'转让'
    }
  ]

  validateForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private http: TongchangHttpService
  ) {}

  ngOnInit() {
    this.creatForm(this.param);
    this.getunit();
  }
  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
  }

  creatForm(param) {
    this.validateForm = this.fb.group({
      buy_time: [param.buy_time,[ Validators.required ]],
      thermometer_code: [param.thermometer_code,[ Validators.required ]],
      unit_id: [param.unit_id,[ Validators.required ]],
      factory: [param.factory, [ Validators.required ]],
      use_location: [param.use_location, [ Validators.required ]],
      purpose: [param.purpose, [ Validators.required ]],
      usage_state: [param.usage_state, [ Validators.required ]],
      model: [param.model, [ Validators.required ]],
      supplier: [param.supplier, [ Validators.required ]],
      purchase_price: [param.purchase_price, [ Validators.required ]],
      mark: [param.mark],
    });
  }

  getunit () {
    this.http.get<any>(this.auditPassUrl).subscribe(res => {
      if(res.code === 0) {
        this.unitList = res.data
      }
    }) 
  }

}
