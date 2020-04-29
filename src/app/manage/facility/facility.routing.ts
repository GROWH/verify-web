import { Routes, RouterModule } from '@angular/router';
import { ThermometerComponent } from './thermometer/thermometer.component';

const routes: Routes = [
  { 
    path:'thermometer',
    component:ThermometerComponent
   },
];

export const FacilityRoutes = RouterModule.forChild(routes);
