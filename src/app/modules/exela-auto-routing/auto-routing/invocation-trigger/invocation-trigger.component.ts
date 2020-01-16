import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UrlDetails } from '../../../../models/url/url-details.model';
import { HttpService } from '../../../shared/providers/http.service';
import { StorageService } from '../../../shared/providers/storage.service';
import { SessionService } from '../../../shared/providers/session.service';

declare var $;

@Component({
  selector: 'app-invocation-trigger',
  templateUrl: './invocation-trigger.component.html',
  styleUrls: ['./invocation-trigger.component.scss']
})

export class InvocationTriggerComponent implements OnInit {

  @Input('form') autoRoutingForm: FormGroup;

  @Output('stepChange') stepChange = new EventEmitter<any>();

  @Input('organizationId') organizationId = null;
  projectList = [];

  invocationTriggers: Array<any> = [];

  constructor (private httpService: HttpService, private _fb: FormBuilder, private _router: Router) {
    this.autoRoutingForm = this._fb.group({
      ruleName: new FormControl('', Validators.required),
      invocationTrigger: new FormControl('', Validators.required)
    });
  }

  next () {
    this.stepChange.emit(2);
  }
  ngOnInit () {
    this.getProjectList();
    if (StorageService.get(StorageService.autoRoutingRuleFor) === 'organization') {
      this.invocationTriggers.push({ value: 'On Ingestion', text: 'On Ingestion' },{ value: 'On Not My Mail Action', text: 'On Not My Mail Action' });
    } else {
      this.invocationTriggers.push({ value: 'On Mailbox Assignment', text: 'On Mailbox Assignment' });
    }
  }

  getProjectList () {
    this.httpService.get(UrlDetails.$exela_getAllProjectsUrl, { 'organizationId': this.organizationId }).subscribe(response => {
      response.forEach(element => {
        this.projectList.push(element);
      });
    });
  }

  gotoRoutingRuleList () {
    let base = SessionService.get('base-role');
    this._router.navigate(['/' + base + '/nQube-autorouting-rule', StorageService.get(StorageService.autoRoutingRuleFor)]);
  }
}
