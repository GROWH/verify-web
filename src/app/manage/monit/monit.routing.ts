import { Routes, RouterModule } from '@angular/router';
import { MaintainComponent } from './maintain/maintain/maintain.component';
import { HouseAddComponent } from './maintain/house-add/house-add.component';

const routes: Routes = [
  {
    path: 'maintain',
    component: MaintainComponent,
  },
  {
    path: 'maintain/add',
    component: HouseAddComponent,
  }
];

export const MonitRoutes = RouterModule.forChild(routes);
