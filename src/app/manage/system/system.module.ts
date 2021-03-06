import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SharedModule } from '@shared/shared.module';

import { ModuleManageComponent } from './module-manage/module-manage.component';
import { ModuleManageFormComponent } from './module-manage-form/module-manage-form.component';
import { ParamSettingComponent } from './param-setting/param-setting.component';
import { ParamFormComponent } from './param-setting/param-form/param-form.component';
import { AdminRightComponent } from './admin-right/admin-right.component';
import { RuleManageComponent } from './rule-manage/rule-manage.component';
import { RuleFormComponent } from './rule-manage/rule-form/rule-form.component';

@NgModule({
  declarations: [
    ModuleManageComponent,
    ModuleManageFormComponent,
    ParamSettingComponent,
    ParamFormComponent,
    AdminRightComponent,
    RuleManageComponent,
    RuleFormComponent,
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
        component:ParamSettingComponent,
      },
      {
        path: 'admin-right',
        component: AdminRightComponent,
      },
      {
        path: 'rule-manage',
        component: RuleManageComponent,
      }
    ])
  ],
  entryComponents: [
    ModuleManageFormComponent,
    ParamFormComponent,
    RuleFormComponent,
  ]
})
export class SystemModule { }
