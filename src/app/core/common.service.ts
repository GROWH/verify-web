import { Injectable } from '@angular/core';
import { TongchangHttpService, ServerRes } from 'tongchang-lib';
import { Apis } from '@/shared/urls.const';
import { SystemModule } from '@/model/SystemModule';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(
    private http: TongchangHttpService,

  ) { }

  getModuleTree() {
    return this.http.get<SystemModule[]>(Apis.moduleTree);
  }

  getParamsByKey(...keys: string[]) {
    return this.http.get<{ [key: string]: string }>(
      Apis.paramsByKey,
      { code: keys.join(',') }
    )
    .pipe(
      map(res => {
        if (res.code === 0) {
          Object.keys(res.data || {}).forEach(key => res.data[key] = res.data[key]);
        }
        return res as ServerRes<{ [key: string]: any }>;
      }),
    );
  }

  paramsUpdate(key: string, value: string) {
    return this.http.get(
      Apis.paramsUpdateByCode,
      {
        code: key,
        value,
      }
    );
  }
}
