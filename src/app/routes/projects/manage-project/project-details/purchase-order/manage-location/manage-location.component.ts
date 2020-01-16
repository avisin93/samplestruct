import { Component, OnInit } from '@angular/core';
import { ROUTER_LINKS_FULL_PATH } from '../../../../../../config';
import { Router, ActivatedRoute } from '@angular/router';
import { Common } from '../../../../../../common';

@Component({
  selector: 'app-manage-location',
  templateUrl: './manage-location.component.html',
  styleUrls: ['./manage-location.component.scss']
})
export class ManageLocationComponent implements OnInit {
  ROUTER_LINKS_FULL_PATH = ROUTER_LINKS_FULL_PATH;
  showFlag:boolean = false
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    Common.scrollTOTop();
    this.route.params.subscribe(params => {
      if (params['id'] != undefined) {
        this.showFlag = true;
      }
    });
  }

}
