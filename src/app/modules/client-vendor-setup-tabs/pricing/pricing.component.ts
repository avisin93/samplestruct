import { Component, OnInit, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { NgDataTablesComponent } from '../../shared/modules/ng-data-tables/ng-data-tables.component';
import { PriceDetailsComponent } from '../../common-components/price-details/price-details.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss']
})

export class PricingComponent implements OnInit {

  @ViewChild(NgDataTablesComponent)
    private dataTableComp: NgDataTablesComponent;

  @Input('type') type = '';

  @Input('mode') mode: string = '';

  columns: Array<any> = [
    {
      title: 'VENDOR NAME',
      key: 'vendorName',
      sortable: true,
      filter: true,
      link: true
    },
    {
      title: 'PRODUCT NAME',
      key: 'productName',
      sortable: true,
      filter: true
    },
    {
      title: 'PRICE DETAILS',
      key: 'priceDetails',
      sortable: false,
      link: true,
      defaultValue: 'VIEW'
    }
  ];

  records: Array<any> = [];

  totalRows: number = 0;

  searchBox: boolean = true;

  constructor (private _router: Router,
    private http: HttpClient,
    public dialog: MatDialog) {
    console.log(this.mode);
  }

  ngOnInit () {
    this.getAllPricing();
  }

  getAllPricing () {
        // fake api
    this.http.get('http://www.json-generator.com/api/json/get/cedkEcmdKa?indent=2')
            .subscribe((data: any) => {
              this.records = data;
              this.totalRows = this.records.length;
              this.dataTableComp.setPage(1);
            }, (error) => {
              console.log(error);
              this.dataTableComp.setPage(1);
            });
  }

  gotoLink (data: any) {
    console.log(data);
    if (data.columnKey === 'priceDetails') {
      console.log('open popup');
      this.openPriceDetails(data.row);
    }
  }

  openPriceDetails (info) {
    let priceDetailsDialogRef = this.dialog.open(PriceDetailsComponent, {
      width: '550px',
      height: '285px',
      panelClass: 'appModalPopup'
    });
    priceDetailsDialogRef.componentInstance.info = info;
  }

}
