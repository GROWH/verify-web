import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UniversalForm } from 'tongchang-lib';

@Component({
  selector: 'app-device-select',
  templateUrl: './device-select.component.html',
  styleUrls: ['./device-select.component.scss']
})
export class DeviceSelectComponent extends UniversalForm {

  originData = {}

  constructor(
    private fb: FormBuilder,
  ) {
    super()
  }

  form: FormGroup
  formInit() {
    this.form = this.fb.group({
      code: [ '', [ Validators.required ] ],
      name: [ '', [ Validators.required ] ],
    })
  }

}
