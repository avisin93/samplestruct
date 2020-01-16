import { Component, OnInit } from '@angular/core';
import { ROUTER_LINKS } from '../../../../../config';
import { Common, NavigationService } from '../../../../../common';
import { ProjectsData } from '../../../projects.data';
declare var $: any;

@Component({
  selector: 'app-advances',
  templateUrl: './advances.component.html',
  styleUrls: ['./advances.component.scss']
})
export class AdvancesComponent implements OnInit {
  ROUTER_LINKS = ROUTER_LINKS;
  projectId: any;

  constructor(private projectsData: ProjectsData, private navigationService: NavigationService) { }

  ngOnInit() {
    $("#advances-tab").addClass("active");
    this.projectId = this.projectsData.projectId;
  }

  ngOnDestroy() {
    $("#advances-tab").removeClass("active");
  }
  navigateTo(link) {
    this.navigationService.navigate([Common.sprintf(link, [this.projectId])]);
  }
}
