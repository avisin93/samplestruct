import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'cm-renewals-due',
  templateUrl: './renewals-due.component.html',
  styleUrls: ['./renewals-due.component.scss']
})
export class RenewalsDueComponent implements OnInit {

  @Input() displayedColumnsRenewalsDue;
  @Input() dataSource;

  constructor() { }

  ngOnInit() {
  }

}
