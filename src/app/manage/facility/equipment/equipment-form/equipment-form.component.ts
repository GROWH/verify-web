import { Component, OnInit,Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-equipment-form',
  templateUrl: './equipment-form.component.html',
  styleUrls: ['./equipment-form.component.scss']
})
export class EquipmentFormComponent implements OnInit {
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
      supplier:     [param.supplier,[ Validators.required ]],
      pur_price:    [param.pur_price,[ Validators.required ]],
      pur_person:   [param.pur_person,[ Validators.required ]],
      location:     [param.location,[ Validators.required ]],
      unit:         [param.unit,[ Validators.required ]],
      curator:      [param.curator,[ Validators.required ]],
      product_date: [param.product_date,[ Validators.required ]],
      expect_date:  [param.expect_date,[ Validators.required ]],
      state:        [param.state,[ Validators.required ]],
      mark:         [param.mark],
      picture:      [param.picture,[ Validators.required ]],
    });
  }
}
