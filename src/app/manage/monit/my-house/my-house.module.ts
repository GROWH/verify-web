import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyHouseComponent } from './my-house/my-house.component';
import { SharedModule } from '@/shared/shared.module';

@NgModule({
  declarations: [MyHouseComponent],
  imports: [
    CommonModule,
    SharedModule,
  ]
})
export class MyHouseModule { }
