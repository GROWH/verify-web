import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StoreHouse } from '@/model/HouseMonit';

@Component({
  selector: 'app-house-edit-form',
  templateUrl: './house-edit-form.component.html',
  styleUrls: ['./house-edit-form.component.scss']
})
export class HouseEditFormComponent implements OnInit {

  @Input() house: StoreHouse;

  constructor(
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.formInit(this.house)
  }
  
  form: FormGroup;
  formInit(house: StoreHouse) {
    this.form = this.fb.group({
      name:      [ house.name,      [ Validators.required ] ],
      temp_up:   [ house.temp_up,   [ Validators.required ] ],
      temp_down: [ house.temp_down, [ Validators.required ] ],
      humi_up:   [ house.humi_up,   [ Validators.required ] ],
      humi_down: [ house.humi_down, [ Validators.required ] ],
      Warning_temp_up:   [ house.Warning_temp_up,   [ Validators.required ] ],
      Warning_temp_down: [ house.Warning_temp_down, [ Validators.required ] ],
      Warning_humi_up:   [ house.Warning_humi_up,   [ Validators.required ] ],
      Warning_humi_down: [ house.Warning_humi_down, [ Validators.required ] ],
    })
  }

  get formVal() {
    return {
      ...this.house,
      ...this.form.getRawValue(),
      message_warn: undefined,
      phone_warn: undefined,
      thermometer: undefined,
    }
  }
}
