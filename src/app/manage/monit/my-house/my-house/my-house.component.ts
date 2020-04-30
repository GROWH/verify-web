import { ActivatedRoute, Router } from '@angular/router';
import { UniversalComponent, GridAction } from 'tongchang-lib';
import { Component, OnInit, Injector } from '@angular/core';

import { Apis } from '@/shared/urls.const';
import { StoreHouse } from '@/model/HouseMonit';

@Component({
  selector: 'app-my-house',
  templateUrl: './my-house.component.html',
  styleUrls: ['./my-house.component.scss']
})
export class MyHouseComponent extends UniversalComponent {

  constructor(
    injector: Injector,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    super(injector, route)
  }

  ngOnInit() {
    this.uniSer.gridConf = {
      queryUrl: Apis.storehouseDownUnit,
      queryBody: null,
      queryParam: { uid: 10 + '' },
      queryMethod: 'get',
      page: 1,
      size: 10,
    }
  }
  
  gridActions: GridAction[] = [
    {
      code: 'reload',
      icon: 'reload',
      name: '刷新',
      click: () => this.uniSer.onForceReload()
    }
  ]

  viewDetail(house: StoreHouse) {
    this.router.navigate([ 'detail', house.id ], { relativeTo: this.route })
  }
}
