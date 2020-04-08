import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';

import { DirectiveModule } from '@shared/directive/directive.module';

import { GridActionsComponent } from './grid-action/grid-actions.component';

@NgModule({
  declarations: [
    GridActionsComponent,
  ],
  imports: [
    CommonModule,
    DirectiveModule,
    NgZorroAntdModule,
  ],
  exports: [
    GridActionsComponent,
  ]
})
export class ComponentsModule { }
