import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  exports: [
    NgZorroAntdModule,
    ReactiveFormsModule,
    
  ]
})
export class SharedModule { }
