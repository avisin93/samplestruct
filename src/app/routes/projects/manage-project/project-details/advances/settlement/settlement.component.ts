import { Component, OnInit } from '@angular/core';
import { Common } from '../../../../../../common';

declare var $ : any;
@Component({
  selector: 'app-settlement',
  templateUrl: './settlement.component.html',
  styleUrls: ['./settlement.component.scss']
})
export class SettlementComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    Common.scrollTOTop();
    $("#settlement-tab").addClass("active");
  }

  ngOnDestroy() {
    $("#settlement-tab").removeClass("active");
  }

}
