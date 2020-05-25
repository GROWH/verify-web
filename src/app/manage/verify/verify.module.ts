import { NgModule, InjectionToken } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseInfoModule } from './base-info/base-info.module';
import { BaseInfoService } from './base-info/base-info.service';
import { VerifyRouteRoutes } from './verify.routing';
import { BaseInfoSerToken } from './verify.routing.token';


@NgModule({
  declarations: [],
  imports: [
    VerifyRouteRoutes,
    CommonModule,
    BaseInfoModule,
  ],
  providers: [
    {
      provide: BaseInfoSerToken,
      useClass: BaseInfoService,
    }
  ]
})
export class VerifyModule { }
