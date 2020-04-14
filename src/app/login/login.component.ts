import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  isSpinning = false;
  submitForm(): void {
    this.isSpinning = true;

    for (const i in this.form.controls) {
      this.form.controls[i].markAsDirty();
      this.form.controls[i].updateValueAndValidity();
    }
    if(this.form.invalid) {
      return
    } else {
      let _this =this
      setTimeout(function () {
        _this.isSpinning = false;
        _this.router.navigateByUrl('/manage')
      },500)
  
    }
  }
  constructor(
    private fb: FormBuilder,
    private router: Router,
  ) { }


  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.form = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
  }
}
