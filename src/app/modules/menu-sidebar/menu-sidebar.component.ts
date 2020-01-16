import { Component, OnInit, Input } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Subscription } from 'rxjs';
import { MenuSidebarService } from './menu-sidebar.service';
import { Router } from '@angular/router';

@Component({
  selector: 'cm-menu-sidebar',
  animations: [
    trigger('slideInOut', [
      state('in', style({
        overflow: 'hidden',
        height: '*'
      })),
      state('out', style({
        overflow: 'hidden',
        height: '0'
      })),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out'))])
  ],
  templateUrl: './menu-sidebar.component.html',
  styleUrls: ['./menu-sidebar.component.scss']
})
export class MenuSidebarComponent implements OnInit {
  @Input() items;
  sidebarClass: string;
  subscription: Subscription;

  constructor (private menuSidebarService: MenuSidebarService, private router: Router) {
    this.subscription = this.menuSidebarService.getMessage().subscribe(message => {
      this.sidebarClass = message.sidebarClass;
    });
  }

  toggleSideMenu (elem) {
    let div = elem.closest('.cm-menu-sidebar');
    if (div.classList.contains('compacted')) {
      div.querySelector('ul').querySelectorAll('li').forEach(element => {
        element.classList.remove('expanded');
        let ul = element.querySelector('ul');
        if (ul !== undefined) {
          ul.classList.remove('expanded');
        }
      });
    }
    if (elem.parentElement.classList.contains('expanded')) {
      elem.parentElement.classList.remove('expanded');
      let ul = elem.parentElement.querySelector('ul');
      ul.classList.remove('expanded');
    } else {
      elem.parentElement.classList.add('expanded');
      let ul = elem.parentElement.querySelector('ul');
      ul.classList.add('expanded');
    }
  }

  ngOnInit () {
  }

}
