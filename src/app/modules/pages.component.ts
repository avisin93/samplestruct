import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
// import { SessionService } from '../../modules/shared/providers/session.service';
import { EmitterService } from './shared/providers/emitter.service';
import { StorageService } from './shared/providers/storage.service';

@Component({
  selector: 'app-role',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class PagesComponent implements OnInit, OnDestroy {

  menus: Array<any> = [];

  role: string = '';

  validRoles: Array<any> = ['super-admin', 'client-admin', 'client-user'];

  preDefinedRoles: Array<any> = ['SUPERADMIN', 'CLIENTADMIN', 'PRODUCTADMIN'];

  constructor (private _route: ActivatedRoute) { }

  ngOnInit () {
    this._route.params.subscribe((dataParams: any) => {
      this.role = dataParams.role;
    //  SessionService.set('base-role', this.role);
      EmitterService.get('base-role').emit(true);
      let module = JSON.parse(StorageService.get(StorageService.selectedProduct));
      if (!module) {
        let modules = JSON.parse(StorageService.get(StorageService.userModules));
        let tmpMenus = [];
        modules.forEach((module) => {
          tmpMenus.push(...module.menus);
        });
        this.menus = this.removeDuplicateMenu(tmpMenus);
      } else {
        this.menus = this.removeDuplicateMenu(module.menus);
      }

    });

  }

  removeDuplicateMenu (menus) {
    let tmpMenus = [];
    for (let i = 0; i < menus.length; i++) {
      let addToMainMenu = true;
      let currentMenuToChk = menus[i];
      for (let j = 0; j < tmpMenus.length; j++) {
        if (tmpMenus[j].key === currentMenuToChk.key && currentMenuToChk.active) {
          addToMainMenu = false;
          break;
        }
      }
      if (addToMainMenu) {
        tmpMenus.push(currentMenuToChk);
      }
    }
    return tmpMenus;
  }

  ngOnDestroy () {
    EmitterService.get('role').unsubscribe();
    EmitterService.destroy('role');
  }
}
