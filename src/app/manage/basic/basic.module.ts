
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@/shared/shared.module';

import { BasicRoutes } from './basic.routing';

import { UnitAuditComponent } from './unit-audit/unit-audit.component';
import { AuditFormComponent } from './unit-audit/audit-form/audit-form.component';
import { ManageFormComponent } from './unit-manage/manage-form/manage-form.component';
import { UnitManageComponent } from './unit-manage/unit-manage.component';
import { FacilityBaseComponent } from './facility-base/facility-base.component';
import { FacilityBaseFormComponent } from './facility-base/facility-base-form/facility-base-form.component';

@NgModule({
  declarations: [
    UnitAuditComponent,
    UnitManageComponent,
    AuditFormComponent,
    ManageFormComponent,
    FacilityBaseComponent,
    FacilityBaseFormComponent
  ],
  imports: [
    CommonModule,
    BasicRoutes,
    SharedModule
  ],
  entryComponents: [
    AuditFormComponent,
    ManageFormComponent,
    FacilityBaseFormComponent
  ],

})
export class BasicModule { }



