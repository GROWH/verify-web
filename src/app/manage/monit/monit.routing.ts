import { Routes, RouterModule } from '@angular/router';

import { MaintainComponent } from './maintain/maintain/maintain.component';
import { HouseAddComponent } from './maintain/house-add/house-add.component';
import { HouseDetailComponent } from './maintain/house-detail/house-detail.component';
import { HandRecordComponent } from './maintain/hand-record/hand-record.component';
import { MaintainSerToken, HandRecordSerToken, MyHouseSerToken, AlarmHandlSerToken } from './monit.routing.token';
import { MyHouseComponent } from './my-house/my-house/my-house.component';
import { AlarmHandlComponent } from './alarm-handl/alarm-handl/alarm-handl.component';

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
    data: { maintainMode: true },
    children: [
      {
        path: '',
        component: HandRecordComponent,
        data: {
          REQUIRED_SERCVICE: HandRecordSerToken,
          data: { maintainMode: true }
        }
      }
    ]
  },
  {
    path: 'my-house',
    component: MyHouseComponent,
    data: {
      REQUIRED_SERCVICE: MyHouseSerToken,
    },
  },
  {
    path: 'my-house/detail/:hosid',
    component: HouseDetailComponent,
    data: { maintainMode: false },
    children: [
      {
        path: '',
        component: HandRecordComponent,
        data: {
          REQUIRED_SERCVICE: HandRecordSerToken,
          maintainMode: false,
        }
      }
    ]

  },
  {
    path: 'alarm-handl',
    component: AlarmHandlComponent,
    data: {
      REQUIRED_SERCVICE: AlarmHandlSerToken,
    },
  },
];

export const MonitRoutes = RouterModule.forChild(routes);
