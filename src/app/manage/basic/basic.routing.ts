import { Routes, RouterModule } from '@angular/router';
import { UnitManageComponent } from './unit-manage/unit-manage.component';
import { UnitAuditComponent } from './unit-audit/unit-audit.component';
import { FacilityBaseComponent } from './facility-base/facility-base.component';

const routes: Routes = [
  {
    path:'unitmanage',
    component:UnitManageComponent
  },
  {
    path:'unitaudit',
    component:UnitAuditComponent
  },
  {
    path:'facilitybase',
    component:FacilityBaseComponent
  },
];

export const BasicRoutes = RouterModule.forChild(routes);
