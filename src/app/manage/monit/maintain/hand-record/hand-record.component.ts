import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, Injector, Inject } from '@angular/core';
import { GridAction, UniversalComponent } from 'tongchang-lib';

import { Apis } from '@/shared/urls.const';
import { MaintainSerToken } from '../../monit.routing.token';
import { MaintainService } from '../maintain.service';
import { HandRecord } from '@/model/HouseMonit';

@Component({
  selector: 'app-hand-record',
  templateUrl: './hand-record.component.html',
  styleUrls: ['./hand-record.component.scss']
})
export class HandRecordComponent extends UniversalComponent implements OnInit {

  constructor(
    injector: Injector,
    route: ActivatedRoute,
    @Inject(MaintainSerToken) private maintainSer: MaintainService,
  ) {
    super(injector, route)
  }

  ngOnInit() {
    this.actionInit()
    this.uniSer.gridConf = {
      queryUrl: Apis.handRecordDownHouse,
      queryBody: null,
      queryParam: {
        sid: this.maintainSer.detailHosId + '',
      },
      queryMethod: 'get',
      page: 1,
      size: 10,
    }
  }
  gridActions: GridAction[] = []

  actionInit() {
    this.gridActions = [
      {
        name: '新增',
        icon: 'plus',
        code: 'add',
        type: 'primary',
        click: () => {
          this.uniSer.onItemAdd(
            new HandRecord(this.maintainSer.detailHosId)
          )
        }
      },
      {
        name: '刷新',
        icon: 'reload',
        code: 'reload',
        click: () => this.uniSer.onForceReload()
      }
    ]
  }

  itemEdit(data: HandRecord) {
    this.uniSer.selectedData = [data]
    this.uniSer.onItemEdit()
  }
  
  itemDelete(data: HandRecord) {
    this.uniSer.selectedData = [data]
    this.uniSer.onItemRemove()
  }
}
