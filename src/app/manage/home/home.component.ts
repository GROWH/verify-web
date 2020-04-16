import { Component, OnInit } from '@angular/core';
import { TongchangHttpService } from 'tongchang-lib';

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
  }

}
