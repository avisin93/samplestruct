import { Component, OnInit, Input } from '@angular/core';
import { HeaderService } from '../components/header/header.service';

@Component({
  selector: 'app-heading-section',
  templateUrl: './heading-section.component.html',
  styleUrls: ['./heading-section.component.scss']
})

export class HeadingSectionComponent implements OnInit {

  @Input('heading') heading;
  @Input('breadcrumbs') breadcrumbs;

  constructor (
    private headerService: HeaderService
   ) {
  }

  ngOnInit () {
    this.headerService.setHeading(this.heading);
  }

}
