import { Component, OnInit } from '@angular/core';
import { ROUTER_LINKS_FULL_PATH } from '../../../../../config';
import { Ng2DataTableMethods } from '../../../../../common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomValidators } from 'ng2-validation';
import { CookieService } from 'ngx-cookie-service';
import { LocalStorageService } from 'angular-2-local-storage';
import { SharedData } from '../../../../../shared/shared.data';

@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.scss']
})
export class PurchaseOrderComponent implements OnInit {
  ROUTER_LINKS_FULL_PATH = ROUTER_LINKS_FULL_PATH;
  constructor(){}
 ngOnInit(){}
}
