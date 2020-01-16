import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { ROUTER_LINKS_FULL_PATH, ROUTER_LINKS } from '../../../../../../config';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedData } from '../../../../../../shared/shared.data';
declare var $:any;
@Component({
  selector: 'app-manage-location',
  templateUrl: './manage-location.component.html',
  styleUrls: ['./manage-location.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ManageLocationComponent implements OnInit {
  ages: any[] = [
    { value: '0', label: '10-00' },
    { value: '1', label: '10-01' },
    { value: '2', label: '10-02' },
];
po: any[] = [
  { value: '0', label: '11112' },
  { value: '1', label: '86546' },
  { value: '2', label: '57323' }

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
      "locationName": "CALLES AGUASCALIENTES",
      "group": "All",
      "contactPersons": []
    },
    {
      "locationId": 2,
      "locationName": "CASTILLO DOUGLAS",
      "group": "All",
      "contactPersons": []
    },
    {
      "locationId": 3,
      "locationName": "BAHIA DE LOS ANGELES",
      "group": "All",
      "contactPersons": []
    },
    {
      "locationId": 4,
      "locationName": "BAHIA SAN LUIS BONZAGA",
      "group": "All",
      "contactPersons": []
    },
    {
      "locationId": 5,
      "locationName": "CUATRO CASAS",
      "group": "All",
      "contactPersons": []
    },
    {
      "locationId": 6,
      "locationName": "ISLA NATIVIDAD",
      "group": "All",
      "contactPersons": []
    },
    {
      "locationId": 7,
      "locationName": "ISLAS CORONADO",
      "group": "All",
      "contactPersons": []
    },
    {
      "locationId": 8,
      "locationName": "LA FONDA",
      "group": "All",
      "contactPersons": []
    },
    {
      "locationId": 9,
      "locationName": "Seven Sisters",
      "group": "All",
      "contactPersons": []
    },
    {
      "locationId": 10,
      "locationName": "LA BUFADORA",
      "group": "All",
      "contactPersons": []
    },
    {
      "locationId": 11,
      "locationName": "SALSIPUEDES",
      "group": "All",
      "contactPersons": []
    },
    {
      "locationId": 12,
      "locationName": "EL SALTO DE GUADALUPE",
      "group": "All",
      "contactPersons": []
    },
    {
      "locationId": 13,
      "locationName": "LA LAGUNITA",
      "group": "All",
      "contactPersons": []
    },
    {
      "locationId": 14,
      "locationName": "LAGUNA HANSON",
      "group": "All",
      "contactPersons": []
    },
    {
      "locationId": 15,
      "locationName": "BAHIA TODOS SANTOS",
      "group": "All",
      "contactPersons": []
    },
    {
      "locationId": 16,
      "locationName": "CABO SAN QUINTIN",
      "group": "All",
      "contactPersons": []
    }
  ]
  constructor(
    private router: Router,
    private sharedData: SharedData,
    private route: ActivatedRoute
  ) { }


 
  ngOnInit() {
    $("#settlement-tab").removeClass("active");
    $("#advances-tab").addClass("active");
  }
  ngOnDestroy() {
    $("#settlement-tab").removeClass("active");
    $("#advances-tab").addClass("active");
  }
  navigateTo(link) {
    this.router.navigate(['../', link], { relativeTo: this.route });
  }

}
