import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BreadCrumb } from './breadcrumb';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'cm-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BreadcrumbComponent implements OnInit {
  breadcrumbs: BreadCrumb[];
  title: string;
  // Build your breadcrumb starting with the root route of your current activated route

  constructor (private activatedRoute: ActivatedRoute,
              private router: Router) {
    this.breadcrumbs = [];
  }

  ngOnInit () {
    let root: ActivatedRoute = this.activatedRoute;
    this.breadcrumbs = this.buildBreadCrumb(root);

    this.router.events.pipe(filter(event => event instanceof NavigationEnd))
    .subscribe(event => {
      let root: ActivatedRoute = this.activatedRoute;
      this.breadcrumbs = this.buildBreadCrumb(root);
    });
  }

  buildBreadCrumb (route: ActivatedRoute, url: string = '',
                  breadcrumbs: Array<BreadCrumb> = []): Array<BreadCrumb> {
    const ROUTE_DATA_BREADCRUMB = 'breadcrumb';
    // If no routeConfig is avalailable we are on the root path
    const label = route.routeConfig ? route.routeConfig.data['breadcrumb'] : 'Home';
    const path = route.routeConfig ? route.routeConfig.path : '';
    let title = route.routeConfig ? route.routeConfig.data['title'] : '';
    let clickable = path !== '';
    const nextUrl = `${url}${path}/`;
    const breadcrumb = {
      label: label,
      url: nextUrl,
      clickable: clickable
    };
    let newBreadcrumbs = [];

    if (label === '') {
      newBreadcrumbs = [...breadcrumbs];
    } else {
      newBreadcrumbs = [...breadcrumbs, breadcrumb];
    }

    if (title !== '') {
      this.title = title;
    }

    if (route.firstChild) {
        // If we are not on our current path yet,
        // there will be more children to look after, to build our breadcumb
      return this.buildBreadCrumb(route.firstChild, nextUrl, newBreadcrumbs);
    }

    return newBreadcrumbs;
  }
}
