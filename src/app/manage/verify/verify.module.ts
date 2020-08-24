import {NgModule, InjectionToken} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BaseInfoModule} from './base-info/base-info.module';
import {BaseInfoService} from './base-info/base-info.service';
import {VerifyRouteRoutes} from './verify.routing';
import {BaseInfoSerToken} from './verify.routing.token';
import {VerifyTaskComponent} from './verify-task/verify-task.component';
import {ComponentsModule} from "@shared/components/components.module";
import {
  NzButtonModule,
  NzDatePickerModule,
  NzDividerModule, NzEmptyModule, NzIconModule, NzPopoverModule,
  NzRadioModule,
  NzSelectModule,
  NzTableModule, NzTabsModule
} from "ng-zorro-antd";
import {VerifyOperatComponent} from './verify-task/verify-operat/verify-operat.component';
import {NgxEchartsModule} from "ngx-echarts";
import {FormsModule} from "@angular/forms";
import {EchartModalComponent} from './verify-task/verify-operat/echart-modal/echart-modal.component';
import {TaskInfoComponent} from './verify-task/verify-operat/task-info/task-info.component';
import {BaseInfoAddComponent} from "@/manage/verify/base-info/base-info-add/base-info-add.component";


@NgModule({
  declarations: [VerifyTaskComponent, VerifyOperatComponent, EchartModalComponent, TaskInfoComponent,],
  entryComponents: [
    EchartModalComponent,
    TaskInfoComponent,
  ],
  imports: [
    VerifyRouteRoutes,
    CommonModule,
    BaseInfoModule,
    ComponentsModule,
    NzTableModule,
    NzDividerModule,
    NgxEchartsModule,
    NzRadioModule,
    FormsModule,
    NzSelectModule,
    NzDatePickerModule,
    NzButtonModule,
    NzIconModule,
    NzTabsModule,
    NzEmptyModule,
    NzPopoverModule,
  ],
  providers: [
    {
      provide: BaseInfoSerToken,
      useClass: BaseInfoService,
    }
  ]
})
export class VerifyModule {
}
