import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { SharedData } from '../shared/shared.data';
import { ROUTER_LINKS_FULL_PATH } from '@app/config';


@Injectable()
export class RoleGuard implements CanActivate {

  constructor(private sharedData: SharedData, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const rolePermissions = this.sharedData.getRolePermissionData();

    if (rolePermissions) {
      const moduleId = route.data['moduleID'];
      const actionType = route.data['type'];
      if (moduleId &&  rolePermissions[moduleId] && rolePermissions[moduleId][actionType]) {
        // permitted so return true
        return true;
      }
      // no permissions redirect to 403 page
      this.router.navigate([ROUTER_LINKS_FULL_PATH['403']]);
      return false;
    }
  }
}
