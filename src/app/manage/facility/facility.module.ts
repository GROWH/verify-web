import { SharedModule } from './../../shared/shared.module';
import { FacilityRoutes } from './facility.routing';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThermometerFormComponent } from './thermometer/thermometer-form/thermometer-form.component';
import { ThermometerComponent } from './thermometer/thermometer.component';


@NgModule({
  imports: [
    CommonModule,
    FacilityRoutes,
    SharedModule
  ],
  declarations: [
    ThermometerComponent,
    ThermometerFormComponent
  ],
  entryComponents:[
    ThermometerFormComponent,
  ]
})
export class FacilityModule { }
