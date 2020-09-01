import { Routes, RouterModule } from '@angular/router';
import { ThermometerComponent } from './thermometer/thermometer.component';
import { ThermManageComponent } from './therm-manage/therm-manage.component';
import { EquipmentComponent } from './equipment/equipment.component';

const routes: Routes = [
  {
    path:'thermometer',
    component:ThermometerComponent
  },
  {
    path:'thermManger',
    component:ThermManageComponent
  },
  {
    path:'equipment',
    component:EquipmentComponent
  },
];

export const FacilityRoutes = RouterModule.forChild(routes);
