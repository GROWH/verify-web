import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MonitRoutes } from './monit.routing';
import { MaintainModule } from './maintain/maintain.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MonitRoutes,
    MaintainModule,
  ]
})
export class MonitModule { }
