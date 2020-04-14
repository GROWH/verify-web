import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@/shared/shared.module';

import { SafeRoutes } from './safe.routing';
import { AccountComponent } from './account/account.component';
import { AccountFormComponent } from './account/account-form/account-form.component';

@NgModule({
  declarations: [
    AccountComponent,
    AccountFormComponent,
  ],
  imports: [
    CommonModule,
    SafeRoutes,
    SharedModule,
  ],
  entryComponents: [
    AccountFormComponent,
  ]
})
export class SafeModule { }
