import { Routes, RouterModule } from '@angular/router';
import { ThermometerComponent } from './thermometer/thermometer.component';
import { ThermManageComponent } from './therm-manage/therm-manage.component';
import { EquipmentComponent } from './equipment/equipment.component';
import { EquipmentRecordComponent } from './equipment-record/equipment-record.component';

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
  {
    path:'equipment-record',
    component:EquipmentRecordComponent
  },
];

export const FacilityRoutes = RouterModule.forChild(routes);
