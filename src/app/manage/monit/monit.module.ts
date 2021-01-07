/*
 * @Author: your name
 * @Date: 2021-01-04 17:50:55
 * @LastEditTime: 2021-01-04 20:22:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /verify-web/src/app/manage/monit/monit.module.ts
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MonitRoutes } from './monit.routing';
import { MaintainModule } from './maintain/maintain.module';
import { MaintainService } from './maintain/maintain.service';
import { MaintainSerToken, HandRecordSerToken, MyHouseSerToken, AlarmHandlSerToken} from './monit.routing.token';
import { HandRecordService } from './maintain/hand-record.service';
import { MyHouseModule } from './my-house/my-house.module';
import { MyHouseService } from './my-house/my-house.service';
import { AlarmHandlModule } from './alarm-handl/alarm-handl.module';
import { AlarmHandlService } from './alarm-handl/alarm-handl.service';
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MonitRoutes,
    MyHouseModule,
    MaintainModule,
    AlarmHandlModule,
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
    },
    {
      provide: AlarmHandlSerToken,
      useClass: AlarmHandlService,
    }
  ]
})
export class MonitModule { }
