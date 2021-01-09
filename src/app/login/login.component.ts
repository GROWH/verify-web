import { NzMessageService } from 'ng-zorro-antd';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Router} from '@angular/router';
import { TongchangHttpService } from 'tongchang-lib';
import { LOGINED_USER_UNIT_KEY } from '@/config.const';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  isSpinning = false;
  loginUrl = '/account/login';

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
    localStorage.removeItem('tabList');
    localStorage.removeItem('account');
    localStorage.removeItem('unit');
    for (const i in this.form.controls) {
      this.form.controls[i].markAsDirty();
      this.form.controls[i].updateValueAndValidity();
    }
    if (this.form.invalid) {
      return;
    } else {
      this.isSpinning = true;
      const params = this.form.getRawValue();
      this.http.get<any>(this.loginUrl, params).toPromise().then(res => {
        this.isSpinning = false;
        if (res.code !== 0) {
          this.msg.error(res.message);
          return;
        }
        this.msg.success(res.message);
        localStorage.setItem('pass', params.pass);//用户ID
        localStorage.setItem('account', res.data.account.id);//用户ID
        localStorage.setItem('userInfo', JSON.stringify(res.data.account));//用户信息
        localStorage.setItem('menuAuth', JSON.stringify(res.data.moduleTree));//用户菜单权限
        localStorage.setItem('btnAuth', JSON.stringify(res.data.resources));//用户按钮权限
        localStorage.setItem(LOGINED_USER_UNIT_KEY, res.data.unit.id);//单位ID
        localStorage.setItem('unitName', res.data.unit.unit_name);//单位名称
        this.router.navigateByUrl('/manage');
      }).catch((err) => {
        this.isSpinning = false;
        console.log(err);
      });
    }
  }
}
