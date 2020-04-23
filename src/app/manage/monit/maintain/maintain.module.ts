import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@/shared/shared.module';

import { MaintainComponent } from './maintain/maintain.component';
import { HouseAddComponent } from './house-add/house-add.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    MaintainComponent,
    HouseAddComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    FormsModule,
  ]
})
export class MaintainModule { }
