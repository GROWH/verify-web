import { DefaultInterceptor } from './core/http-interceptors/default-interceptor';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { registerLocaleData } from '@angular/common';
import { NgZorroAntdModule, NZ_I18N, zh_CN } from 'ng-zorro-antd';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TongchangLibModule } from 'tongchang-lib'
import { HTTP_INTERCEPTORS  } from '@angular/common/http';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import zh from '@angular/common/locales/zh';


import * as AllIcons from '@ant-design/icons-angular/icons'
import { IconDefinition } from '@ant-design/icons-angular';
import { SharedModule } from './shared/shared.module';
import { environment } from 'src/environments/environment';

import {NgxEchartsModule} from "ngx-echarts";

registerLocaleData(zh);

const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};
const icons: IconDefinition[] = Object.keys(antDesignIcons).map(key => antDesignIcons[key])


if (!environment.production) {
  localStorage.setItem('debug', 'TongchangLib*')
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgZorroAntdModule,
    BrowserAnimationsModule,
    SharedModule,
    TongchangLibModule.forRoot({
      apiBase: '/api',
      fileApi: '/api/file',
      headers: {},
      authRequireCode: -9,
    }),
    NgxEchartsModule,
  ],
  providers: [
    { provide: NZ_I18N, useValue: zh_CN },
    { provide: HTTP_INTERCEPTORS, useClass: DefaultInterceptor, multi:true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
