import { Component, OnInit, Input } from '@angular/core';
import { DebugLog, TongchangHttpService } from 'tongchang-lib';
import { Apis } from '@/shared/urls.const';
import { Pagination } from '@/model/Types';
import { Unit } from '@/model/Unit';

@Component({
  selector: 'app-unit-select',
  templateUrl: './unit-select.component.html',
  styleUrls: ['./unit-select.component.scss']
})
export class UnitSelectComponent implements OnInit {

  @Input() onSelect: (unit: Unit) => void

  constructor(
    private http: TongchangHttpService,
  ) { }

  ngOnInit() {
    this.onSearch()
  }
  
  keyword = ''
  datas: Unit[] = []
  total = 0
  page  = 1
  size  = 10

  async onSearch() {
    DebugLog(this.keyword)
    const res = await this.http.get<Pagination<Unit>>(
      Apis.unitSearch,
      {
        value: this.keyword,
        page: `${this.page}`,
        size: `${this.size}`
      }
    ).toPromise()

    if (res.code === 0) {
      this.datas = res.data.list
      this.total = res.data.totalRow
    }
  }
}
