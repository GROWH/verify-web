import { Injectable } from '@angular/core';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { UniversalService, TongchangHttpService, TongchangLibService } from 'tongchang-lib';

import { Apis, ResTrans } from '@/shared/urls.const'
import { HandRecordFormComponent } from './hand-record-form/hand-record-form.component'

@Injectable()
export class HandRecordService extends UniversalService {

  pageMinus = 0
  crudUrl = Apis.handRecord
  formComp = HandRecordFormComponent
  resTrans = ResTrans


  constructor(
    public msg: NzMessageService,
    public util: TongchangLibService,
    public http: TongchangHttpService,
    public modal: NzModalService,
    
  ) {
    super()
  }
}
