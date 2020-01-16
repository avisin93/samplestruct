import { Component, OnInit } from '@angular/core';

import { SessionService } from '@app/common';
import { COOKIES_CONSTANTS } from '@app/config';

@Component({
  selector: 'app-payment',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent implements OnInit {

  constructor(
    private sessionService: SessionService
  ) { }

  ngOnInit() {
  
  }

}
