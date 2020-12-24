import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NavComponent } from './nav/nav.component';
import { HomeComponent } from './home/home.component'

import { SharedModule } from '@/shared/shared.module';
import { ResetpwdFormComponent } from './nav/resetpwd-form/resetpwd-form.component';

@NgModule({
  declarations: [
    NavComponent,
    HomeComponent,
    ResetpwdFormComponent,
  ],
  imports: [
    SharedModule,
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: NavComponent,
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'home',
          },
          {
            path: 'home',
            component: HomeComponent,
          },
          {
            path: 'system',
            loadChildren: './system/system.module#SystemModule'
          },
          {
            path: 'safe',
            loadChildren: './safe/safe.module#SafeModule'
          },
          {
            path:'basic',
            loadChildren:'./basic/basic.module#BasicModule'
          },
          {
            path: 'monit',
            loadChildren: './monit/monit.module#MonitModule'
          },
          {
            path: 'verify',
            loadChildren: './verify/verify.module#VerifyModule'
          },
          {
            path:'facility',
            loadChildren:'./facility/facility.module#FacilityModule'
          }
        ]
      }
    ])
  ],
  entryComponents: [
    ResetpwdFormComponent,
  ],
})
export class ManageModule { }
