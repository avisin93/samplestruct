import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { ROUTER_LINKS_FULL_PATH, ROUTER_LINKS } from '../../../../../../config';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedData } from '../../../../../../shared/shared.data';
declare var $:any;
@Component({
  selector: 'app-manage-talent',
  templateUrl: './manage-talent.component.html',
  styleUrls: ['./manage-talent.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ManageTalentComponent implements OnInit {

  ages: any[] = [
    { value: '0', label: '10-00' },
    { value: '1', label: '10-01' },
    { value: '2', label: '10-02' },
];
po: any[] = [
  { value: '0', label: '45751' },
  { value: '1', label: '41462' },
  { value: '2', label: ' 89575 ' },
];
  ROUTER_LINKS_FULL_PATH = ROUTER_LINKS_FULL_PATH;
  ROUTER_LINKS = ROUTER_LINKS;
  budgetline: any = [{
    "id": "1",
    "name": "10-00"
  },
  {
    "id": "2",
    "name": "10-01"
  },
  {
    "id": "3",
    "name": "10-02"
  }

  ]
locations: any = [
    {
      "locationId": 1,
      "locationName": "Christiano Ronaldo",
      "group": "All",
      "contactPersons": []
    },
    {
      "locationId": 2,
      "locationName": "Brad Pitt",
      "group": "All",
      "contactPersons": []
    },
    {
      "locationId": 3,
      "locationName": "Christian Bale",
      "group": "All",
      "contactPersons": []
    },

  ]
  constructor(
    private router: Router,
    private sharedData: SharedData,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    $("#settlement-tab").addClass("active");
    $("#advances-tab").removeClass("active");
  }
  ngOnDestroy() {
    $("#settlement-tab").removeClass("active");
    $("#advances-tab").addClass("active");
  }
  navigateTo(link) {
    this.router.navigate(['../', link], { relativeTo: this.route });
  }


}
