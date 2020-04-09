import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { registerLocaleData } from '@angular/common';
import { NgZorroAntdModule, NZ_I18N, zh_CN } from 'ng-zorro-antd';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TongchangLibModule } from 'tongchang-lib'


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import zh from '@angular/common/locales/zh';


import * as AllIcons from '@ant-design/icons-angular/icons'
import { IconDefinition } from '@ant-design/icons-angular';
import { SharedModule } from './shared/shared.module';

registerLocaleData(zh);

const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};
const icons: IconDefinition[] = Object.keys(antDesignIcons).map(key => antDesignIcons[key])

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
    })
  ],
  providers: [{ provide: NZ_I18N, useValue: zh_CN }],
  bootstrap: [AppComponent]
})
export class AppModule { }
