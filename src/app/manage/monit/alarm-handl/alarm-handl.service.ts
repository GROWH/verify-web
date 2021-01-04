import { Injectable } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { UniversalService, TongchangHttpService, TongchangLibService } from 'tongchang-lib';

import { Apis, ResTrans } from '@shared/urls.const';

@Injectable({
  providedIn: 'root'
})
export class AlarmHandlService extends UniversalService {

  crudUrl = '';
  pageMinus = 0;
  resTrans = ResTrans;

  formComp = null;

  constructor(
    public msg: NzMessageService,
    public util: TongchangLibService,
    public http: TongchangHttpService,
    public modal: NzModalService,
  ) {
    super();
  }
}
