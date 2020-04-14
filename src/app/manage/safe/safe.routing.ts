import { Routes, RouterModule } from '@angular/router';
import { AccountComponent } from './account/account.component';

const routes: Routes = [
  {
    path: 'account',
    component: AccountComponent,
  },
];

export const SafeRoutes = RouterModule.forChild(routes);
