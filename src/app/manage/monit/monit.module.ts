import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MonitRoutes } from './monit.routing';
import { MaintainModule } from './maintain/maintain.module';
import { MaintainService } from './maintain/maintain.service';
import { MaintainSerToken, HandRecordSerToken } from './monit.routing.token';
import { HandRecordService } from './maintain/hand-record.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MonitRoutes,
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
  ]
})
export class MonitModule { }
