import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from '../../shared/providers/http.service';

@Component({
  selector: 'add-edit-exela-product',
  templateUrl: './add-edit-exela-product.component.html',
  styleUrls: ['./add-edit-exela-product.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class AddEditExelaProductComponent implements OnInit {

  type: string = 'client';

  mode: string = '';

  productId: string = '';

  heading: string = 'Add Product';

  tabs: Array<any> = [
        { key: 'information-tab', name : 'Information' },
        { key: 'menu-tab', name : 'Menu' },
        { key: 'action-tab', name : 'Action' }];

  breadcrumbs: Array<any> = [
    {
      text: 'Home',
      base: true,
      link: '/home',
      active: false
    },
    {
      text: 'Product Setup',
      base: true,
      link: '/exela-product-setup',
      active: false
    }
  ];

  currentTab: string = 'information-tab';

  constructor (private _route: ActivatedRoute, public httpService: HttpService) {

  }

  ngOnInit () {
    this._route.data.subscribe((dataParams: any) => {
      this.mode = dataParams.mode;
      if (this.mode === 'edit') {
        this.heading = 'Edit Product';
        this._route.params.subscribe((params: any) => {
          this.productId = params.id;
        });
      } else if (this.mode === 'add') {
        this.tabs[1].visible = false;
      }

      this.breadcrumbs.push({
        text: this.heading,
        base: false,
        link: '',
        active: true
      });
    });
    console.log(this.tabs);
  }

  onSelectTab (tab: string) {
    this.currentTab = tab;
  }
}
