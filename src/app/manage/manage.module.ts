import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent } from './nav/nav.component';

import { RouterModule } from '@angular/router'

@NgModule({
  declarations: [
    NavComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: NavComponent,
        children: []
      }
    ])
  ]
})
export class ManageModule { }
