import { NzMessageService } from 'ng-zorro-antd';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Router} from '@angular/router';
import { TongchangHttpService } from 'tongchang-lib';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  isSpinning = false;
  loginUrl='/account/login'

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: TongchangHttpService,
    private msg: NzMessageService
  ) { }


  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.form = this.fb.group({
      account: [null, [Validators.required]],
      pass: [null, [Validators.required]],
    });
  }
  
  submitForm(): void {
    localStorage.removeItem('account')
    localStorage.removeItem('unit')
    for (const i in this.form.controls) {
      this.form.controls[i].markAsDirty();
      this.form.controls[i].updateValueAndValidity();
    }
    if(this.form.invalid) {
      return
    } else {
      this.isSpinning = true;
      const params = this.form.getRawValue();
      this.http.get<any>(this.loginUrl,params).subscribe(res => {
        this.isSpinning = false;
        if(res.code !== 0) {
          this.msg.error(res.message);
          return
        }
        this.msg.success(res.message);
        localStorage.setItem('account',res.data.account.id)
        localStorage.setItem('unit',res.data.unit.id)
        this.router.navigateByUrl('/manage')
      })
    }
  }
}
