import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../shared/providers/http.service';
import { UrlDetails } from '../../models/url/url-details.model';
import { BaseUrl } from '../../models/url/base-url.model';
import { StorageService } from '../shared/providers/storage.service';
import { AddEditExelaLandingPageComponent } from './add-edit-exela-landing-page/add-edit-exela-landing-page.component';
import { SessionService } from '../shared/providers/session.service';
import { EmitterService } from '../shared/providers/emitter.service';
import { LoaderService } from '../shared/components/loader/loader.service';
import { DynamicThemeService } from '../../modules/shared/providers/dynamic-theme.service';
import { MatDialog } from '@angular/material';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-exela-landing-page',
  templateUrl: './exela-landing-page.component.html',
  styleUrls: ['./exela-landing-page.component.scss']
})

export class ExelaLandingPageComponent implements OnInit {

  products = [];

  clients = [];

  selectedProduct: any;

  dialogOptions: any = {
    width: '450px',
    height: '250px'
  };
  constructor (public dialog: MatDialog, private _router: Router,
        private httpService: HttpService,
        private loaderService: LoaderService,
        private toastr: ToastrService) {
  }

  ngOnInit () {
    this.getAllProducts();
    this.getAllClients();
  }

  applyAssignedTheme () {
    // if (StorageService.get(StorageService.isThemeAssigned) !== false && StorageService.get(StorageService.isThemeAssigned) !== 'false') {
    //   let colors = [
    //     StorageService.get(StorageService.mainHeaderColor),
    //     StorageService.get(StorageService.leftPanelColor),
    //     StorageService.get(StorageService.leftNavigationColor),
    //     StorageService.get(StorageService.leftNavigationHoverColor),
    //     StorageService.get(StorageService.headerTextColor),
    //     StorageService.get(StorageService.mainHeadingColor),
    //     StorageService.get(StorageService.bodyTextColor),
    //     StorageService.get(StorageService.primaryButtonColor),
    //     StorageService.get(StorageService.primaryHoverButtonColor)
    //   ];
    //   let styleRules = DynamicThemeService.getThemeStylingRule(colors);

    //   DynamicThemeService.setThemeStyling(styleRules, 'assign-theme');
    // } else {
    // }

    // TODO:Vido Ovo ubaciti u gornju else granu
    DynamicThemeService.removeThemeStyling('assign-theme');
  }

  getAllProducts () {
    let uniqueProducts = [];
    let prodList = [];
    let tmpProducts = JSON.parse(StorageService.get(StorageService.userModules));
    for (let i = 0; i < tmpProducts.length; i++) {
      let prod = tmpProducts[i];
      if (StorageService.get('StorageService.JWTLogin') === 'true') { // TODO: Vido skloniti navodnike kod get-a
        if (prod.productCode === BaseUrl.$getEnvProductCode || prod.productCode === 'Admin' || prod.productCode === 'Super Admin') {
          let index = uniqueProducts.indexOf(prod.productId);
          if (index === -1) {
            uniqueProducts.push(prod.productId);
            prodList.push(prod);
          } else {
            prodList[index].menus = (prodList[index].menus).concat(prod.menus);
          }
        }
      } else {
        let index = uniqueProducts.indexOf(prod.productId);
        if (index === -1) {
          uniqueProducts.push(prod.productId);
          prodList.push(prod);
        } else {
          prodList[index].menus = (prodList[index].menus).concat(prod.menus);
        }
      }
    }
    this.products = prodList;
  }

  getAllClients () {
    this.loaderService.show();
    this.httpService.get(UrlDetails.$exela_getAllClientUrl, {}).subscribe(response => {
      this.clients = response;
      this.loaderService.hide();
    }, () => {
      this.loaderService.hide();
    });
  }

  onProductSelect (product) {
    StorageService.set(StorageService.selectedProduct, JSON.stringify(product));
    this.selectedProduct = product;
    if (product['productName'].toLowerCase() === 'super admin' || product['productName'].toLowerCase() === 'admin') {
      SessionService.set('base-role', product['productName'].toLowerCase());
      EmitterService.get('base-role').emit(true);
      if (product['menus'][1] && product['menus'][1] !== 'no-link') {
        this._router.navigate([product['productName'].toLowerCase() + '/' + product['menus'][1].link]);
      } else {
        this._router.navigate([product['productName'].toLowerCase() + '/' + product['menus'][0].link]);

      }
    } else if (BaseUrl.$getEnvProductCode !== this.selectedProduct.productCode) {
      let url = BaseUrl.$getExelaProducts[this.selectedProduct.productCode];
      if (url) {
        window.open(url + '/#/login/' + StorageService.get('exelaAuthToken'));
      } else {
        this.toastr.error('Product link not exist');
      }
    } else {
      this.addUserPopup();
    }
  }

  addUserPopup () {
    let addUserDialogRef = this.dialog.open(AddEditExelaLandingPageComponent, this.dialogOptions);
    addUserDialogRef.componentInstance.heading = 'Client & Project Selection';
    addUserDialogRef.componentInstance.saveBtnTitle = 'Ok';
    addUserDialogRef.componentInstance.product = this.selectedProduct;
    addUserDialogRef.componentInstance.clients = this.clients;
    addUserDialogRef.componentInstance.isAdmin = this.isAdmin();
  }

  // Either super admin or client admin
  isAdmin () {
    let isAdmin = false;
    this.products.forEach((product) => {
      if (product['productName'].toLowerCase() === 'super admin' || product['productName'].toLowerCase() === 'admin' || product['roles'][0] === 'PRODUCTADMIN') {
        isAdmin = true;
        return;
      }
    });
    return isAdmin;
  }
}
