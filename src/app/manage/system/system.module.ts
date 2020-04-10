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

@NgModule({
  declarations: [
    ModuleManageComponent,
    ModuleManageFormComponent,
    ParamSettingComponent,
    ParamFormComponent,
    AccountComponent,
    AccountFormComponent,
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
      }
    ])
  ],
  entryComponents: [
    ModuleManageFormComponent,
    ParamFormComponent,
    AccountFormComponent,
  ]
})
export class SystemModule { }
