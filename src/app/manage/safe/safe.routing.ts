import { Routes, RouterModule } from '@angular/router';

import { RoleComponent } from './role/role.component';
import { AccountComponent } from './account/account.component';
import { PersonnelComponent } from './personnel/personnel.component';
import { InjectionToken } from '@angular/core';
import { RoleService } from './role/role.service';

export const RoleUniSerToken = new InjectionToken<RoleService>('ROLE_MANAGEMENT')

const routes: Routes = [
  {
    path: 'account',
    component: AccountComponent,
  },
  {
    path: 'role',
    component: RoleComponent,
    data: {
      REQUIRED_SERCVICE: RoleUniSerToken
    }
  },
  {
    path: 'personnel',
    component: PersonnelComponent,
  },
];

export const SafeRoutes = RouterModule.forChild(routes);
