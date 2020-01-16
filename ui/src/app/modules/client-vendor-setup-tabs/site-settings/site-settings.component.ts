import {
    Component, OnInit, AfterViewInit,
    Input, ViewEncapsulation, ViewChild, ElementRef
} from '@angular/core';

@Component({
  selector: 'app-site-settings',
  templateUrl: './site-settings.component.html',
  styleUrls: ['./site-settings.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class SiteSettingsComponent implements OnInit, AfterViewInit {

  @Input('type') type = '';

  @Input('mode') mode = '';

  @ViewChild('tabCol') _tabCol: ElementRef;

  @ViewChild('infoCol') _infoCol: ElementRef;

  tabs: Array<any> = [
    'Basic',
    'Email Settings',
    'User Profile Fields'
  ];

  selectedTabIndex: number = 0;

  constructor () {

  }

  ngOnInit () {
    console.log(this.mode);
  }

  ngAfterViewInit () {
    this.addEqualHeight();
  }

  onTabSelect (tabIndex: number) {
    this.selectedTabIndex = tabIndex;
    setTimeout(() => {
      this.addEqualHeight();
    }, 5);
  }

  addEqualHeight () {
    let infoColHeight = this._infoCol.nativeElement.offsetHeight;
    this._tabCol.nativeElement.style.height = infoColHeight + 'px';
  }

}
