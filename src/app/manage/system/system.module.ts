import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ModuleManageComponent } from './module-manage/module-manage.component';
import { ModuleManageFormComponent } from './module-manage-form/module-manage-form.component';
import { SharedModule } from '@shared/shared.module';
import { ParamSettingComponent } from './param-setting/param-setting.component';
import { ParamFormComponent } from './param-setting/param-form/param-form.component';

@NgModule({
  declarations: [
    ModuleManageComponent,
    ModuleManageFormComponent,
    ParamSettingComponent,
    ParamFormComponent
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
      }
    ])
  ],
  entryComponents: [
    ModuleManageFormComponent,
    ParamFormComponent,
  ]
})
export class SystemModule { }
