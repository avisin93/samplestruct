import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { SessionService } from '../../providers/session.service';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html'
})

export class BreadcrumbsComponent implements OnInit, OnChanges {

  @Input('breadcrumbs') _breadcrumbs: Array<any> = [];

  @Output('breadcrumbSelected') breadcrumbSelectedEvent = new EventEmitter<any>();

  constructor () {

  }

  ngOnInit () {

  }

  ngOnChanges () {
    this.updateItemLinks();
  }

  updateItemLinks () {
    let base = SessionService.get('base-role');
    if (this._breadcrumbs.length > 0) {
      this._breadcrumbs.forEach((item) => {
        if (item.base === true && item.text !== 'Home') {
          item.link = '/' + base + item.link;
        }
      });
    }
  }

  breadcrumbSelected (link) {
    this.breadcrumbSelectedEvent.emit(link);
  }
}
