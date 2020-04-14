import { Routes, RouterModule } from '@angular/router';
import { UnitManageComponent } from './unit-manage/unit-manage.component';
import { UnitAuditComponent } from './unit-audit/unit-audit.component';

const routes: Routes = [
  {
    path:'unitmanage',
    component:UnitManageComponent
  },
  {
    path:'unitaudit',
    component:UnitAuditComponent
  },
];

export const BasicRoutes = RouterModule.forChild(routes);
