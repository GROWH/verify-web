import { SharedModule } from './../../shared/shared.module';
import { FacilityRoutes } from './facility.routing';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThermometerFormComponent } from './thermometer/thermometer-form/thermometer-form.component';
import { ThermometerComponent } from './thermometer/thermometer.component';
import { ThermManageComponent } from './therm-manage/therm-manage.component';
import { ThermManageFormComponent } from './therm-manage/therm-manage-form/therm-manage-form.component';
import { ParamDesginFormComponent } from './thermometer/param-desgin-form/param-desgin-form.component';
import { ReuploadFormComponent } from './thermometer/reupload-form/reupload-form.component';
import { EquipmentFormComponent } from './equipment/equipment-form/equipment-form.component';
import { EquipmentComponent } from './equipment/equipment.component';
import { EquipmentRecordComponent } from './equipment-record/equipment-record.component';
import { RecordFormComponent } from './equipment-record/record-form/record-form.component';


@NgModule({
  imports: [
    CommonModule,
    FacilityRoutes,
    SharedModule
  ],
  declarations: [
    ThermometerComponent,
    ThermometerFormComponent,
    ThermManageComponent,
    ThermManageFormComponent,
    ParamDesginFormComponent,
    ReuploadFormComponent,
    EquipmentFormComponent,
    EquipmentComponent,
    EquipmentRecordComponent,
    RecordFormComponent
  ],
  entryComponents:[
    ThermometerFormComponent,
    ThermManageFormComponent,
    ParamDesginFormComponent,
    ReuploadFormComponent,
    EquipmentFormComponent,
    RecordFormComponent,
  ]
})
export class FacilityModule { }
