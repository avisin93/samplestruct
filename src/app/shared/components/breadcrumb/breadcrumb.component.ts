import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Ibreadcrumb } from './ibreeadcrumb';
import { Router } from '@angular/router';

@Component({
  selector: 'breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {
  @Input() breadcrumbData: Ibreadcrumb;
  @Output() onClick: EventEmitter<any> = new EventEmitter<any>();
  constructor(private router: Router) { }

  ngOnInit() {
  }
  navigateToLink(data) {
    if (data.isCurrentUrl) {
      this.onClick.emit();
    } else {
      this.router.navigate([data.link]);
    }
  }
}
