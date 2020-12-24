import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators,} from '@angular/forms';
import { TongchangHttpService } from 'tongchang-lib';
@Component({
  selector: 'app-reset-password-form',
  templateUrl: './reset-password-form.component.html',
  styleUrls: ['./reset-password-form.component.scss']
})
export class ResetPasswordFormComponent implements OnInit {
  @Input() param:{};
  validateForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private http: TongchangHttpService,
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
      pass: [param.pass, [ Validators.required ]],
    });
  }
}
