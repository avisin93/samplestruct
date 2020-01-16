import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-browser-compatibilty',
  templateUrl: './browser-compatibilty.component.html',
  styleUrls: ['./browser-compatibilty.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BrowserCompatibiltyComponent implements OnInit {
  isSafari: Boolean = false;
  isIE: Boolean = false;
  isEdge: Boolean = false;

  constructor() { }

  ngOnInit() {
    this.isSafari = navigator.vendor && navigator.vendor.indexOf('Apple') > -1 &&
    navigator.userAgent &&
    navigator.userAgent.indexOf('CriOS') == -1 &&
    navigator.userAgent.indexOf('FxiOS') == -1;
    this.isIE = /msie\s|trident\//i.test(window.navigator.userAgent);
    this.isEdge = /edge\//i.test(window.navigator.userAgent);
  }

}
