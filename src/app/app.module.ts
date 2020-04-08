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

registerLocaleData(zh);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgZorroAntdModule,
    BrowserAnimationsModule,
    TongchangLibModule.forRoot({
      apiBase: '/',
      fileApi: '/api/file',
      headers: {},
      authRequireCode: -9,
    })
  ],
  providers: [{ provide: NZ_I18N, useValue: zh_CN }],
  bootstrap: [AppComponent]
})
export class AppModule { }
