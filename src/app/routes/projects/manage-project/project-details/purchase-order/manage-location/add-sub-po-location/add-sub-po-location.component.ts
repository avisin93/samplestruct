import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ROUTER_LINKS_FULL_PATH } from '../../../../../../../config';

@Component({
  selector: 'app-add-sub-po-location',
  templateUrl: './add-sub-po-location.component.html',
  styleUrls: ['./add-sub-po-location.component.scss']
})
export class AddSubPoLocationComponent implements OnInit {
  ages: any[] = [
    { value: '1000', label: '1000' },
    { value: '1001.0', label: '1001.0' },
    { value: '1002.0', label: '1002.0' },
  ];
  categoryArr: any[] = [
    { value: "PROJECT DEVELOPMENT", label: "PROJECT DEVELOPMENT" },
    { value: "CAST", label: "CAST" }
  ];
  accountsArr: any[] = [
    { value: "Project folder", label: "Project folder" },
    { value: "Budget and folders", label: "Budget and folders" },
    { value: "Production office", label: "Production office" }
  ];
  subAccountsArr: any[] = [
    { value: "Graphic design", label: "Graphic design" },
    { value: "Budget and folders", label: "Budget and folders" },
    { value: "Stationary", label: "Stationary" }
  ];
  currencyArr: any[] = [
    { value: "MXN", label: "MXN" },
    { value: "USD", label: "USD" },
    { value: "EUR", label: "EUR" }
  ];

  location: any[]=[{ value: 'DEPORTIVO 18 DE MARZO',label:'DEPORTIVO 18 DE MARZO'},
  { value: 'DELICATESSEN',label:'DELICATESSEN'},
  { value: 'LA SELECTA SABORES',label:'LA SELECTA SABORES'},
  { value: 'VILLA DE MADRID ABARROTES',label:'VILLA DE MADRID ABARROTES'},
  { value: 'SALON MEXICO',label:'SALON MEXICO'},
  { value: 'HACIENDA DE LOS LEONES',label:'HACIENDA DE LOS LEONES'},
  { value: 'LA SALLE',label:'LA SALLE'},
  { value: 'LOMA DEL VALLE',label:'LOMA DEL VALLE'},
  { value: 'SAYAVEDRA',label:'SAYAVEDRA'},
  { value: 'XOCHITLA',label:'XOCHITLA'},
  {value: 'La Teatrería', label:'La Teatrería'},
  { value: 'Rhodesia',label:'Rhodesia'},
  { value: 'Yuban',label:'Yuban'},
  { value: 'Monumento a la Revolución',label:'Monumento a la Revolución'},

];

scouter: any[] = [
  { value: 'Aurora Salazar Figueroa', label: 'Aurora Salazar Figueroa' },
  { value: 'Sergio Aguilar', label: 'Sergio Aguilar' },
  { value: 'Aleks Lira', label: 'Aleks Lira' },
  { value: 'Charlotte Wegner', label: 'Charlotte Wegner' },
];

locationType: any[]=[
  { value: 'Notice', label: 'Notice' },
  { value: 'Permit', label: 'Permit' },
];

modeOfOperation:any[]=[
  { value: 'Cash', label: 'Cash' },
  { value: 'Cheque', label: 'Cheque' },
  { value: 'Credit card', label: 'Credit card' },
  { value: 'Wire transfer', label: 'Wire transfer' },
];
requestedBy:any=[
   { value: 'Sandra', label: 'Sandra' },
  { value: 'Magali', label: 'Magali' },]
  public subLocationForm: FormGroup;
  ROUTER_LINKS_FULL_PATH = ROUTER_LINKS_FULL_PATH;
  subLocationFormFlag:boolean = true;
  showLinkFlag:boolean=false;
  subPoLocationFlag:boolean=false
  addsubpoArray = [];
  selectedIndex:any
  constructor(private _fb: FormBuilder, private router: Router,
    private route: ActivatedRoute

  ) { }

  ngOnInit() {
    this.initializeForm();
    var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var panel = this.nextElementSibling;
        if (panel.style.display === "block") {
            panel.style.display = "none";
        } else {
            panel.style.display = "block";
        }
    });
}




  }

  initializeForm() {

    this.subLocationForm = this._fb.group({
      budgetline : [],
      country:[],
      scouter:[],
      vatholding:[],
      mode:[],
      operation:[],
      notes:[],
      ISR:[],
      locationType:[]

    })
  }
  navigateTo(link) {
    this.router.navigate(['../', link], { relativeTo: this.route });
  }
  // addData(){
  //   this.addsubpoArray.push(this.subLocationForm.value);
  //   //this.subLocationFormFlag = false;
  // }
  addSubLocation(){
      this.subLocationFormFlag = true;
      this.showLinkFlag=false;
      // this.subPoLocationFlag = false;

    }
  addData(){
    let index = this.selectedIndex;
    if(this.addsubpoArray[index]) {
      this.addsubpoArray[index] = this.subLocationForm.value;
    } else {
      this.addsubpoArray.push(this.subLocationForm.value);
    }
    this.selectedIndex = '';
    this.subLocationFormFlag = false;
    this.subPoLocationFlag = true;
    this.showLinkFlag=true

    this.subLocationForm.reset();
  }
  delete(index){
    this.addsubpoArray.splice(index,1);
    if(this.addsubpoArray.length == 0){
      this.subPoLocationFlag = false;
    }
  }


  edit(index){
    this.selectedIndex = index;
    this.subLocationFormFlag = true;
    this.subPoLocationFlag = false;
    this.showLinkFlag=false;

    this.subLocationForm.patchValue({
      "budgetline": this.addsubpoArray[index].budgetline,
      "country": this.addsubpoArray[index].country,
      "scouter": this.addsubpoArray[index].scouter
  });

  }
  cancel(){
    this.subLocationFormFlag = false;
    this.showLinkFlag=true;
    this.subLocationForm.reset();

    if(this.addsubpoArray.length == 0){
      this.subPoLocationFlag = false;
    }else{
      this.subPoLocationFlag = true;

    }

  }
}
