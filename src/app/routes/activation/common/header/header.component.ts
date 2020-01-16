import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-activation-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  /*declare variables above constructor in sequence -imported constants,public variable,private variables*/

  navCollapsed = true; // for horizontal layout
  menuItems = []; // for horizontal layout
  isNavSearchVisible: boolean;
  landingPage: any = '';

  /*declare variables above constructor in sequence -imported constants,public variable,private variables*/

  /*inicialize contructor after declaration of all variables*/

  constructor(
  ) {

  }
  /*inicialize contructor after declaration of all variables*/

  /*all life cycle events whichever required after inicialization of constructor*/
  ngOnInit() {
  }
}
