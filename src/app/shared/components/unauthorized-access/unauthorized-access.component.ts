import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-unauthorized-access',
  templateUrl: './unauthorized-access.component.html',
  styleUrls: ['./unauthorized-access.component.scss']
})
export class UnauthorizedAccessComponent implements OnInit {
  @Input() errorMessage: Boolean = false;
  constructor() { }

  ngOnInit() {
  }

}
