import { Routes, RouterModule } from '@angular/router';

import { MaintainComponent } from './maintain/maintain/maintain.component';
import { HouseAddComponent } from './maintain/house-add/house-add.component';
import { HouseDetailComponent } from './maintain/house-detail/house-detail.component';
import { HandRecordComponent } from './maintain/hand-record/hand-record.component';
import { MaintainSerToken, HandRecordSerToken } from './monit.routing.token';

const routes: Routes = [
  {
    path: 'maintain',
    component: MaintainComponent,
    data: {
      REQUIRED_SERCVICE: MaintainSerToken,
    }
  },
  {
    path: 'maintain/add',
    component: HouseAddComponent,
  },
  {
    path: 'maintain/detail/:hosid',
    component: HouseDetailComponent,
    children: [
      {
        path: '',
        component: HandRecordComponent,
        data: {
          REQUIRED_SERCVICE: HandRecordSerToken,
        }
      }
    ]
  }
];

export const MonitRoutes = RouterModule.forChild(routes);
