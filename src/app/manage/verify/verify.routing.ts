import { Routes, RouterModule } from '@angular/router';
import { BaseInfoComponent } from './base-info/base-info/base-info.component';
import { VerifyTaskComponent } from './verify-task/verify-task.component';
import { BaseInfoSerToken } from './verify.routing.token';
import { VerifyOperatComponent } from './verify-task/verify-operat/verify-operat.component';

const routes: Routes = [
  {
    path: 'base-info',
    component: BaseInfoComponent,
    data: {
      REQUIRED_SERCVICE: BaseInfoSerToken,
    }
  },{
    path: 'verify-task',
    component: VerifyTaskComponent,
  },{
    path: 'verify-task/detail',
    component: VerifyOperatComponent,
  },
];

export const VerifyRouteRoutes = RouterModule.forChild(routes);
