import { FormBuilder, Validators } from '@angular/forms';
import { UniversalForm } from 'tongchang-lib';
import { Component, OnInit, Input } from '@angular/core';

import { SystemModule } from '@/model/SystemModule';

@Component({
  selector: 'app-module-manage-form',
  templateUrl: './module-manage-form.component.html',
  styleUrls: ['./module-manage-form.component.scss']
})
export class ModuleManageFormComponent extends UniversalForm {


  @Input() originData = new SystemModule()

  constructor(
    private fb: FormBuilder,
  ) { super() }

  formInit(data: SystemModule) {
    this.form = this.fb.group({
      key_word:     [ data.key_word,     [ Validators.required ] ],
      module_code:  [ data.module_code,  [ Validators.required ] ],
      module_name:  [ data.module_name,  [ Validators.required ] ],
      module_url:   [ data.module_url,   [  ] ],
      order_number: [ data.order_number, [ Validators.required ] ],
      parent_id:    [ data.parent_id,    [ Validators.required ] ],
      type:         [ data.type,         [ Validators.required ] ],
      is_menu:      [ data.is_menu,      [ Validators.required ] ],
    })
  }
  
}
