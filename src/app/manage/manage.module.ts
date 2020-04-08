import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NavComponent } from './nav/nav.component';
import { HomeComponent } from './home/home.component'

@NgModule({
  declarations: [
    NavComponent,
    HomeComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: NavComponent,
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'home',
          },
          {
            path: 'home',
            component: HomeComponent,
          },
          {
            path: 'system',
            loadChildren: './system/system.module#SystemModule'
          }
        ]
      }
    ])
  ]
})
export class ManageModule { }
