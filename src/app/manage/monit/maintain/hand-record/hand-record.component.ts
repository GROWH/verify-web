import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, Injector, Inject } from '@angular/core';
import { UniversalComponent } from 'tongchang-lib';
import {GridAction} from '@/model/GridAction';
import { Apis } from '@/shared/urls.const';
import { MaintainSerToken } from '../../monit.routing.token';
import { MaintainService } from '../maintain.service';
import { HandRecord } from '@/model/HouseMonit';
import {buttonAccess} from "@/config.const";

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
    super(injector, route);
    const maintainMode: boolean = route.snapshot.data['maintainMode'];
    this.maintainMode = maintainMode;
  }

  /**
   * 维护模式
   */
  maintainMode = false;

  ngOnInit() {
    this.actionInit();
    this.uniSer.gridConf = {
      queryUrl: Apis.handRecordDownHouse,
      queryBody: null,
      queryParam: {
        sid: this.maintainSer.detailHosId + '',
      },
      queryMethod: 'get',
      page: 1,
      size: 10,
    };
  }
  gridActions: GridAction[] = [];

  actionInit() {
    this.gridActions = [
      ...(
        this.maintainMode ?
        [
          {
            name: '新增',
            icon: 'plus',
            code: 'maintain-hand-record_add',
            type: 'primary',
            click: () => {
              this.uniSer.onItemAdd(
                new HandRecord(this.maintainSer.detailHosId)
              );
            },
            isExist: buttonAccess('maintain-hand-record_add'),
          }
        ] : []
      ),
      {
        name: '刷新',
        icon: 'reload',
        code: 'maintain-hand-record_reload',
        type: 'dashed',
        click: () => this.uniSer.onForceReload(),
        isExist: buttonAccess('maintain-hand-record_reload'),
      }
    ];
  }

  itemEdit(data: HandRecord) {
    this.uniSer.selectedData = [data];
    this.uniSer.onItemEdit();
  }

  itemDelete(data: HandRecord) {
    this.uniSer.selectedData = [data];
    this.uniSer.onItemRemove();
  }
}
