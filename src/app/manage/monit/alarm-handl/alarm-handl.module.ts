import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlarmHandlComponent } from './alarm-handl/alarm-handl.component';
import { SharedModule } from '@/shared/shared.module';

@NgModule({
  declarations: [AlarmHandlComponent],
  imports: [
    CommonModule,
    SharedModule,
  ]
})
export class AlarmHandlModule { }
