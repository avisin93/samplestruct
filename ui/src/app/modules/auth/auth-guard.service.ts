import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor (
    public auth: AuthService,
    public router: Router,
    public toastr: ToastrService
  ) { }

  public async canActivate () {
    let haveToken: boolean;
    let canAccessRoute: boolean;
    await this.auth.isAuthenticated().then((data: any) => {
      haveToken = data.haveToken;
      canAccessRoute = data.canAccessRoute;
      if (haveToken) {
        if (!canAccessRoute) {
          this.toastr.error('Info', 'You don\'t have rights to see this page');
          return;
        }
      } else {
        this.router.navigate(['login']).then(nav => {
          console.log(nav);
        }, err => {
          console.log(err);
        });
      }
    });
    return haveToken && canAccessRoute;
  }
}
