import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-param-form',
  templateUrl: './param-form.component.html',
  styleUrls: ['./param-form.component.css']
})
export class ParamFormComponent implements OnInit {

  validateForm: FormGroup;
  constructor(
    private fb: FormBuilder
  ) { }

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
      value: [null],
      name: [null],
    });
  }

}
