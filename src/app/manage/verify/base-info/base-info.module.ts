import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseInfoComponent } from './base-info/base-info.component';
import { BaseInfoAddComponent } from './base-info-add/base-info-add.component';
import { DateEditFormComponent } from './date-edit-form/date-edit-form.component';
import { SharedModule } from '@/shared/shared.module';
import { VerifyRouteRoutes } from '../verify-route.routing';
import { BaseInfoAddStockComponent } from './base-info-add-stock/base-info-add-stock.component';
import { BaseInfoAddIncubatorComponent } from './base-info-add-incubator/base-info-add-incubator.component';
import { BaseInfoAddCarComponent } from './base-info-add-car/base-info-add-car.component';
import { BaseInfoAddFreezerComponent } from './base-info-add-freezer/base-info-add-freezer.component';
import { BaseInfoAddCarFreezerComponent } from './base-info-add-car-freezer/base-info-add-car-freezer.component';
import { BaseInfoAddOthersComponent } from './base-info-add-others/base-info-add-others.component';
import { BaseInfoAddSystemComponent } from './base-info-add-system/base-info-add-system.component';

@NgModule({
  declarations: [
    BaseInfoComponent,
    BaseInfoAddComponent,
    DateEditFormComponent,
    BaseInfoAddStockComponent,
    BaseInfoAddIncubatorComponent,
    BaseInfoAddCarComponent,
    BaseInfoAddFreezerComponent,
    BaseInfoAddCarFreezerComponent,
    BaseInfoAddOthersComponent,
    BaseInfoAddSystemComponent,
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
