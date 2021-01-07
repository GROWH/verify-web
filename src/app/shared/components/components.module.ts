import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';

import { DirectiveModule } from '@shared/directive/directive.module';

import { GridActionsComponent } from './grid-action/grid-actions.component';
import { PointRecordComponent } from './point-record/point-record.component';
import {FormsModule} from '@angular/forms';
import {NgxEchartsCoreModule} from 'ngx-echarts/core';

@NgModule({
  declarations: [
    GridActionsComponent,
    PointRecordComponent,
  ],
  imports: [
    CommonModule,
    DirectiveModule,
    NgZorroAntdModule,
    FormsModule,
    NgxEchartsCoreModule,
  ],
  exports: [
    GridActionsComponent,
    PointRecordComponent,
  ]
})
export class ComponentsModule { }
