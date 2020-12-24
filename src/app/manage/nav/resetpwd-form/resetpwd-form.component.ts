import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators,} from '@angular/forms';
import { TongchangHttpService } from 'tongchang-lib';

@Component({
  selector: 'app-resetpwd-form',
  templateUrl: './resetpwd-form.component.html',
  styleUrls: ['./resetpwd-form.component.scss']
})
export class ResetpwdFormComponent implements OnInit {
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
