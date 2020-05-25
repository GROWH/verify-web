import { Routes, RouterModule } from '@angular/router';
import { BaseInfoComponent } from './base-info/base-info/base-info.component';
import { BaseInfoSerToken } from './verify.routing.token';

const routes: Routes = [
  {
    path: 'base-info',
    component: BaseInfoComponent,
    data: {
      REQUIRED_SERCVICE: BaseInfoSerToken,
    }
  },
];

export const VerifyRouteRoutes = RouterModule.forChild(routes);
