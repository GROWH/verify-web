import { Component, OnInit, Input } from '@angular/core';

import { UniversalForm } from 'tongchang-lib';
import { Role } from '@/model/Role';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SystemModule } from '@/model/SystemModule';

@Component({
  selector: 'app-role-form',
  templateUrl: './role-form.component.html',
  styleUrls: ['./role-form.component.scss']
})
export class RoleFormComponent extends UniversalForm {

  @Input() originData: Role;

  constructor(
    private fb: FormBuilder,
  ) {
    super()
  }

  form: FormGroup;
  formInit(data: Role) {
    this.form = this.fb.group({
      role_name: [ data.role_name, [ Validators.required ] ],
      resource:  [ data.resource,  [ Validators.required ] ],
    })
  }
}
