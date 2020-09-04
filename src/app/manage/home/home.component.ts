import { Component, OnInit } from '@angular/core';
import { TongchangHttpService } from 'tongchang-lib';

export const LOGINED_USER_UNIT_KEY = 'LOGINED_USER_UNIT_KEY';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private http:TongchangHttpService
  ) {
  }

  ngOnInit() {
    console.log(localStorage.getItem('LOGINED_USER_UNIT_KEY'))
  }

}
