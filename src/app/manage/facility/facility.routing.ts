import { Routes, RouterModule } from '@angular/router';
import { ThermometerComponent } from './thermometer/thermometer.component';
import { ThermManageComponent } from './therm-manage/therm-manage.component';

const routes: Routes = [
  { 
    path:'thermometer',
    component:ThermometerComponent
  },
  { 
    path:'thermManger',
    component:ThermManageComponent
  },
];

export const FacilityRoutes = RouterModule.forChild(routes);
