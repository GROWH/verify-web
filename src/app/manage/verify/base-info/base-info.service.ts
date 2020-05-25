import { Injectable } from '@angular/core';
import { UniversalService, TongchangHttpService, TongchangLibService } from 'tongchang-lib';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { CommonService } from '@/core/common.service';
import { ResTrans, Apis } from '@/shared/urls.const';

@Injectable()
export class BaseInfoService extends UniversalService {

  constructor(
    public modal: NzModalService,
    public msg: NzMessageService,
    public http: TongchangHttpService,
    public util: TongchangLibService,
    private commSer: CommonService,
  ) {
    super()
  }

  pageMinus = 0
  resTrans = ResTrans
  crudUrl = Apis.verifyBaseInfo
  formComp = null
}
