import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'cm-pending-updates',
  templateUrl: './pending-updates.component.html',
  styleUrls: ['./pending-updates.component.scss']
})
export class PendingUpdatesComponent implements OnInit {

  @Input() displayedColumns;
  @Input() dataSource;

  constructor() { }

  ngOnInit() {
  }

}
