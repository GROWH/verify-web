
import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest,HttpResponse,HttpErrorResponse,
} from '@angular/common/http';

import {Router} from '@angular/router';

import { Observable, of } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators';
import { TongchangHttpService, HttpServiceConfig } from 'tongchang-lib';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class DefaultInterceptor  implements HttpInterceptor {

  constructor(
    private http:TongchangHttpService,
    private confg:HttpServiceConfig,
    private router:Router
  ){

  }

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
      let baseHeader = this.confg.headers
      if (localStorage.getItem('unit') && localStorage.getItem('account')) {
        this.http.addHeader('unit_id',localStorage.getItem('unit'));
        this.http.addHeader('account_id',localStorage.getItem('account'));
      }
      const newReq = req.clone({
        setHeaders: baseHeader
    });
      return next.handle(newReq).pipe( mergeMap((event: any) => {
        // 正常返回，处理具体返回参数
        if (event instanceof HttpResponse && event.status === 200)
            return this.handleData(event);//具体处理请求返回数据
            return of(event);
          
    }),
    catchError((err: HttpErrorResponse) => this.handleData(err)))
 
    }
    

  private handleData(
    event: HttpResponse<any> | HttpErrorResponse,
  ): Observable<any> {
    // 业务处理：一些通用操作
    switch (event.status) {
      case 200:
        if (event instanceof HttpResponse) {
          return of(event)
        }
        break;
      case 401: // 未登录状态码
        this.router.navigateByUrl('/login')
        break;
      case 404:
      case 500:
      break;
      default:
      return of(event);
    }
  }
}
