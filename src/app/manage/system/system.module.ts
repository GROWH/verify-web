import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SharedModule } from '@shared/shared.module';

import { ModuleManageComponent } from './module-manage/module-manage.component';
import { ModuleManageFormComponent } from './module-manage-form/module-manage-form.component';
import { ParamSettingComponent } from './param-setting/param-setting.component';
import { ParamFormComponent } from './param-setting/param-form/param-form.component';
import { UnitAuditComponent } from './unit-audit/unit-audit.component';
import { ManageFormComponent } from './unit-manage/manage-form/manage-form.component';
import { AuditFormComponent } from './unit-audit/audit-form/audit-form.component';
import { UnitManageComponent } from './unit-manage/unit-manage.component';
import { AdminRightComponent } from './admin-right/admin-right.component';

@NgModule({
  declarations: [
    ModuleManageComponent,
    ModuleManageFormComponent,
    ParamSettingComponent,
    ParamFormComponent,
    UnitManageComponent,
    ManageFormComponent,
    UnitAuditComponent,
    AuditFormComponent,
    AdminRightComponent,
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
        path:'unitmanage',
        component:UnitManageComponent
      },
      {
        path:'unitaudit',
        component:UnitAuditComponent
      },
      {
        path: 'admin-right',
        component: AdminRightComponent,
      }
    ])
  ],
  entryComponents: [
    ModuleManageFormComponent,
    ParamFormComponent,
    ManageFormComponent,
    AuditFormComponent
  ]
})
export class SystemModule { }
