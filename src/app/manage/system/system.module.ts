import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ModuleManageComponent } from './module-manage/module-manage.component';
import { ModuleManageFormComponent } from './module-manage-form/module-manage-form.component';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [
    ModuleManageComponent,
    ModuleManageFormComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: 'module',
        component: ModuleManageComponent,
      }
    ])
  ],
  entryComponents: [
    ModuleManageFormComponent,
  ]
})
export class SystemModule { }
