import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-reupload-form',
  templateUrl: './reupload-form.component.html',
  styleUrls: ['./reupload-form.component.scss']
})

export class ReuploadFormComponent implements OnInit {
  @Input() param:{};


  validateForm: FormGroup;
  constructor(
    private fb: FormBuilder,
  ) {}

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
      re_start_time: [param.re_start_time,[ Validators.required ]],
      re_end_time: [param.re_end_time,[ Validators.required ]],
      reset: [param.reset,[ Validators.required ]],
    });
  }


}

