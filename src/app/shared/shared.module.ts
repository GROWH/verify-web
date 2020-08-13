import { NgModule } from '@angular/core';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { TongchangLibModule } from 'tongchang-lib';
import { ReactiveFormsModule } from '@angular/forms';

import { DirectiveModule } from './directive/directive.module';
import { ComponentsModule } from './components/components.module';
import { PipeModule } from './pipe/pipe.module';

@NgModule({
  declarations: [],
  imports: [
  ],
  exports: [
    NgZorroAntdModule,
    ReactiveFormsModule,
    DirectiveModule,
    ComponentsModule,
    PipeModule,
    TongchangLibModule,
  ]
})
export class SharedModule { }
