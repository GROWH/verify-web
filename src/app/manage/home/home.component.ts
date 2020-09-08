import { Component, OnInit } from '@angular/core';
import { TongchangHttpService } from 'tongchang-lib';

export const LOGINED_USER_UNIT_KEY = 'LOGINED_USER_UNIT_KEY';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  userCode:string = '1';
  constructor(
    private http:TongchangHttpService
  ) {
  }

  ngOnInit() {
    this.userCode = localStorage.getItem('LOGINED_USER_UNIT_KEY');
    console.log(this.userCode)
  }

}
