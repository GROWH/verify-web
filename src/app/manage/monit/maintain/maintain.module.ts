import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgxEchartsModule } from 'ngx-echarts'

import { SharedModule } from '@/shared/shared.module';

import { MaintainComponent } from './maintain/maintain.component';
import { HouseAddComponent } from './house-add/house-add.component';
import { HouseEditFormComponent } from './house-edit-form/house-edit-form.component';
import { WarnEditFormComponent } from './warn-edit-form/warn-edit-form.component';
import { HouseDetailComponent } from './house-detail/house-detail.component';
import { DeviceSelectComponent } from './device-select/device-select.component';
import { UnitSelectComponent } from './unit-select/unit-select.component';
import { HandRecordComponent } from './hand-record/hand-record.component';
import { HandRecordFormComponent } from './hand-record-form/hand-record-form.component';

@NgModule({
  declarations: [
    MaintainComponent,
    HouseAddComponent,
    HouseEditFormComponent,
    WarnEditFormComponent,
    HouseDetailComponent,
    DeviceSelectComponent,
    UnitSelectComponent,
    HandRecordComponent,
    HandRecordFormComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    FormsModule,
    NgxEchartsModule,
  ],
  entryComponents: [
    HouseEditFormComponent,
    WarnEditFormComponent,
    DeviceSelectComponent,
    UnitSelectComponent,
    HandRecordFormComponent,
  ],
})
export class MaintainModule { }
