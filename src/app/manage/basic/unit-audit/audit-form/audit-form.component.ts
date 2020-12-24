import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-audit-form',
  templateUrl: './audit-form.component.html',
  styleUrls: ['./audit-form.component.scss']
})

export class AuditFormComponent implements OnInit {
  validateForm: FormGroup;
  radioValue: string;
  constructor(
    private fb: FormBuilder
    
  ) { 
    this.radioValue = '通过';
  }

  ngOnInit() {
    this.creatForm();
  }
  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
  }

  creatForm() {
    this.validateForm = this.fb.group({
      state: [null ,[ Validators.required ]],
      audit_mark:  [null],
    });
  }


}

