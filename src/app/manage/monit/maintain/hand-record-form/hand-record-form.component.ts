import { UniversalForm } from 'tongchang-lib';
import { Component, Input } from '@angular/core';

import { HandRecord } from '@/model/HouseMonit';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-hand-record-form',
  templateUrl: './hand-record-form.component.html',
  styleUrls: ['./hand-record-form.component.scss']
})
export class HandRecordFormComponent extends UniversalForm {

  @Input() originData: HandRecord;

  constructor(
    private fb: FormBuilder,
  ) { super() }

  formInit(record: HandRecord) {
    this.form = this.fb.group({
      temp:          [ record.temp,          [ Validators.required ] ],
      humi:          [ record.humi,          [ Validators.required ] ],
      position:      [ record.position,      [ Validators.required ] ],
      storehouse_id: [ record.storehouse_id, [ Validators.required ] ],
      record_time:   [ record.record_time,   [ Validators.required ] ],
    })
  }

}
