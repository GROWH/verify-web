import { AccountComponent } from './account/account.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ModuleManageComponent } from './module-manage/module-manage.component';
import { ModuleManageFormComponent } from './module-manage-form/module-manage-form.component';
import { SharedModule } from '@shared/shared.module';
import { ParamSettingComponent } from './param-setting/param-setting.component';
import { ParamFormComponent } from './param-setting/param-form/param-form.component';
import { AccountFormComponent } from './account/account-form/account-form.component';
import { UnitAuditComponent } from './unit-audit/unit-audit.component';
import { ManageFormComponent } from './unit-manage/manage-form/manage-form.component';
import { AuditFormComponent } from './unit-audit/audit-form/audit-form.component';
import { UnitManageComponent } from './unit-manage/unit-manage.component';

@NgModule({
  declarations: [
    ModuleManageComponent,
    ModuleManageFormComponent,
    ParamSettingComponent,
    ParamFormComponent,
    AccountComponent,
    AccountFormComponent,
    UnitManageComponent,
    ManageFormComponent,
    UnitAuditComponent,
    AuditFormComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: 'module',
        component: ModuleManageComponent,
      },
      {
        path:'param',
        component:ParamSettingComponent
      },
      {
        path:'account',
        component:AccountComponent
      },
      {
        path:'unitmanage',
        component:UnitManageComponent
      },
      {
        path:'unitaudit',
        component:UnitAuditComponent
      }
    ])
  ],
  entryComponents: [
    ModuleManageFormComponent,
    ParamFormComponent,
    AccountFormComponent,
    ManageFormComponent,
    AuditFormComponent
  ]
})
export class SystemModule { }
