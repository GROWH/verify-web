import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@/shared/shared.module';

import { SafeRoutes, RoleUniSerToken } from './safe.routing';
import { AccountComponent } from './account/account.component';
import { AccountFormComponent } from './account/account-form/account-form.component';
import { RoleComponent } from './role/role.component';
import { RoleFormComponent } from './role/role-form/role-form.component';
import { RoleService } from './role/role.service';
import { RoleViewComponent } from './role/role-view/role-view.component';
import { RoleSelectControlComponent } from './role/role-select-control/role-select-control.component';
import { PersonnelComponent } from './personnel/personnel.component';
import { PersonnelFormComponent } from './personnel/personnel-form/personnel-form.component';

@NgModule({
  declarations: [
    AccountComponent,
    AccountFormComponent,
    RoleComponent,
    RoleFormComponent,
    RoleViewComponent,
    RoleSelectControlComponent,
    PersonnelComponent,
    PersonnelFormComponent,
  ],
  imports: [
    CommonModule,
    SafeRoutes,
    SharedModule,
  ],
  entryComponents: [
    AccountFormComponent,
    RoleFormComponent,
    RoleViewComponent,
    PersonnelFormComponent,
  ],
  providers: [
    {
      provide: RoleUniSerToken,
      useClass: RoleService,
    }
  ]
})
export class SafeModule { }
