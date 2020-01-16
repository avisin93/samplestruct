import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SessionService } from '../../modules/shared/providers/session.service';
import { EmitterService } from '../../modules/shared/providers/emitter.service';
import { StorageService } from '../../modules/shared/providers/storage.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UrlDetails } from 'src/app/models/url/url-details.model';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class RoleComponent implements OnInit, OnDestroy {

  menus: Array<any> = [];
  role: string = '';
  validRoles: Array<any> = ['super-admin', 'client-admin', 'client-user'];
  preDefinedRoles: Array<any> = ['SUPERADMIN', 'CLIENTADMIN', 'PRODUCTADMIN'];

  constructor (private httpClient: HttpClient,private _route: ActivatedRoute) { }

  ngOnInit () {
    this._route.params.subscribe(async (dataParams: any) => {
      this.role = dataParams.role;
      SessionService.set('base-role', this.role);
      EmitterService.get('base-role').emit(true);
      const userRoles = JSON.parse(StorageService.get(StorageService.userRoles));
      const roleId = userRoles.filter(userRole => userRole.roleName === StorageService.get(StorageService.userRole)).map(role => role.roleId);
      let headers = new HttpHeaders();
      headers = headers.append('Authorization', 'Bearer ' + StorageService.get(StorageService.exelaAuthToken));
      await this.httpClient.post(`${UrlDetails.$exelaGetRoleUrl}/${roleId}`, undefined, { headers: headers, observe: 'response' }).toPromise().then((response: any) => {
        if (response.status === 200) {
          let moduleMenusOfRole;
          moduleMenusOfRole = response.body.menus;
          if (response.body.roleName === 'CLIENTADMIN') {
            moduleMenusOfRole = moduleMenusOfRole.filter(modelMenu => modelMenu.name !== 'Dashboard');
          }
          if (!moduleMenusOfRole) {
            const userModules = JSON.parse(StorageService.get(StorageService.userModules));
            const tmpMenus = [];
            userModules.forEach((userModule) => {
              tmpMenus.push(...userModule.menus);
            });
            this.menus = this.removeDuplicateMenu(tmpMenus);
          } else {
            this.menus = this.removeDuplicateMenu(moduleMenusOfRole);
          }
        }
      });
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
