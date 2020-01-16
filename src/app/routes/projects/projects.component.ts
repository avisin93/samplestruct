import { Component, OnInit, OnDestroy } from '@angular/core';

import { SessionService } from '@app/common';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit, OnDestroy {

  constructor(
    private sessionService: SessionService
  ) { }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

}
