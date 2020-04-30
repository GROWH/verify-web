import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MonitRoutes } from './monit.routing';
import { MaintainModule } from './maintain/maintain.module';
import { MaintainService } from './maintain/maintain.service';
import { MaintainSerToken, HandRecordSerToken, MyHouseSerToken } from './monit.routing.token';
import { HandRecordService } from './maintain/hand-record.service';
import { MyHouseModule } from './my-house/my-house.module';
import { MyHouseService } from './my-house/my-house.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MonitRoutes,
    MyHouseModule,
    MaintainModule,
  ],
  providers: [
    {
      provide: MaintainSerToken,
      useClass: MaintainService,
    },
    {
      provide: HandRecordSerToken,
      useClass: HandRecordService,
    },
    {
      provide: MyHouseSerToken,
      useClass: MyHouseService,
    }
  ]
})
export class MonitModule { }
