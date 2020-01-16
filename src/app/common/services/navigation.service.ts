import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class NavigationService {

  constructor(
    private router: Router
  ) { }

  navigate(path, queryParamsObj?:any) {
    let url = "";
    let pathArr = [];
    if (path instanceof Array) {
      path[0] = this.getUrl(path[0]);
      pathArr = path;
    } else {
      path = this.getUrl(path);
      pathArr = [path];
    }
    if(queryParamsObj) {
      return this.router.navigate(pathArr, queryParamsObj);
    } else {
      return this.router.navigate(pathArr);
    }
  }
  getUrl(urlPath) {
    let str = urlPath.charAt(0);
    if(str != "/") {
      urlPath = "/"+urlPath;
    }
    return urlPath
  }


  navigateByUrl(url, queryParams?:any) {
    url = this.getUrl(url);
    return this.router.navigateByUrl(url);
  }
}

