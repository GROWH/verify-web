import { Routes, RouterModule } from '@angular/router';
import { BaseInfoComponent } from './base-info/base-info/base-info.component';

const routes: Routes = [
  {
    path: 'base-info',
    component: BaseInfoComponent,
  },
];

export const VerifyRouteRoutes = RouterModule.forChild(routes);
