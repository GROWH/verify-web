import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseInfoComponent } from './base-info/base-info.component';
import { BaseInfoAddComponent } from './base-info-add/base-info-add.component';
import { DateEditFormComponent } from './date-edit-form/date-edit-form.component';
import { SharedModule } from '@/shared/shared.module';
import { VerifyRouteRoutes } from '../verify-route.routing';
import { BaseInfoAddStockComponent } from './base-info-add-stock/base-info-add-stock.component';
import { BaseInfoAddIncubatorComponent } from './base-info-add-incubator/base-info-add-incubator.component';

@NgModule({
  declarations: [
    BaseInfoComponent, 
    BaseInfoAddComponent, 
    DateEditFormComponent, BaseInfoAddStockComponent, BaseInfoAddIncubatorComponent,
  ],
  entryComponents: [
    BaseInfoAddComponent,
  ],
  imports: [
    VerifyRouteRoutes,
    CommonModule,
    SharedModule,
  ]
})
export class BaseInfoModule { }
