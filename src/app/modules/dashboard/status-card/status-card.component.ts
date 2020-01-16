import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from '../../shared/providers/session.service';

@Component({
  selector: 'cm-status-card',
  templateUrl: './status-card.component.html',
  styleUrls: ['./status-card.component.scss']
})
export class StatusCardComponent {
  @Input() num: number;
  @Input() status: string;
  @Input() color: string;
  @Input() name: string;

  constructor (private router: Router) {}

  navigateToContractList () {
    let base = SessionService.get('base-role');
    this.router.navigate([base + '/contract-list', { 'search': this.status }]).then(nav => {
      console.log(nav);
    }, err => {
      console.log(err);
    });
  }
}
