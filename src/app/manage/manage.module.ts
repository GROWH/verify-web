import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NavComponent } from './nav/nav.component';
import { HomeComponent } from './home/home.component'

import { NgZorroAntdModule } from 'ng-zorro-antd';
import { NzIconModule } from 'ng-zorro-antd/icon';

@NgModule({
  declarations: [
    NavComponent,
    HomeComponent
  ],
  imports: [
    NgZorroAntdModule,
    CommonModule,
    NzIconModule,
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
