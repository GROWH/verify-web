import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';


@Component({
  selector: 'app-facility-base-form',
  templateUrl: './facility-base-form.component.html',
  styleUrls: ['./facility-base-form.component.scss']
})


export class FacilityBaseFormComponent implements OnInit {
  @Input() param:{};
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
      goods_no: [param.goods_no ,[ Validators.required ]],
      name: [param.name, [ Validators.required ]],
      product_busi: [param.product_busi, [ Validators.required ]],
      norms: [param.norms, [ Validators.required ]],
      model_num: [param.model_num, [ Validators.required]],
      quality_period: [param.quality_period],
      price: [param.price ,[ Validators.required ]],
      curing: [param.curing ,[ Validators.required ]],
      curing_cycle: [param.curing_cycle ,[ Validators.required ]],
      aline: [param.aline ,[ Validators.required ]],
      aline_cycle: [param.aline_cycle ,[ Validators.required ]],
      mark: [param.mark],
    });
  }

}
