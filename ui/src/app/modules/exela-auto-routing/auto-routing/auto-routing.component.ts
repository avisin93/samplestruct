import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../../shared/providers/http.service';
import { UrlDetails } from '../../../models/url/url-details.model';
import { StorageService } from '../../shared/providers/storage.service';

@Component({
  selector: 'app-auto-routing',
  templateUrl: './auto-routing.component.html',
  styleUrls: ['./auto-routing.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class AutoRoutingComponent implements OnInit {

  breadcrumbs: Array<any> = [
    {
      text: 'Home',
      base: true,
      link: '/home',
      active: false
    },
    {
      text: 'Routing Rule',
      base: true,
      link: '/nQube-autorouting-rule/' + StorageService.get(StorageService.autoRoutingRuleFor),
      active: false
    },
    {
      text: 'Add Rule',
      base: false,
      link: '',
      active: true
    }
  ];
  moveToFolder = 'Move To Folder';
  deliverTo = 'Deliver To';
  autoRoutingId = '';
  autoRoutingForm: FormGroup;
  heading = 'Edit Auto Routing';
  mode = '';
  currentStep: number = 1;
  records: any = [];
  organizationId = null;

  constructor (private httpService: HttpService, private _fb: FormBuilder, private _route: ActivatedRoute) {
    this.autoRoutingForm = this._fb.group({
      projectCode: new FormControl('', Validators.required),
      ruleName: new FormControl('', Validators.required),
      invocationTrigger: new FormControl('', Validators.required),
      conditions: new FormControl(''),
      eventType: new FormControl('', Validators.required),
      email: new FormControl(''),
      folderId: new FormControl(''),
      absolutePath: new FormControl(''),
      selectedFolderUsername: new FormControl(''),
      lookupInput: new FormControl('Select Email')
    });
  }

  ngOnInit () {
    this._route.data.subscribe((dataParams: any) => {
      this.mode = dataParams.mode;
      if (this.mode === 'edit') {
        this.heading = 'Edit Rule';
        this._route.params.subscribe((params: any) => {
          this.autoRoutingId = params.id;
          this.organizationId = params.organizationId;
        });
        this.breadcrumbs[2].text = 'Edit Rule';
        this.getAutoRoutingDetails();
      } else {
        this.heading = 'Add Rule';
        this._route.params.subscribe((params: any) => {
          this.organizationId = params.organizationId;
        });
      }
    });
  }

  getAutoRoutingDetails () {
    this.httpService.getAll(UrlDetails.$getAutoRoutingDetailsUrl + this.autoRoutingId + '?' + Date.now()).subscribe(details => {
      this.autoRoutingForm.controls['eventType'].setValue(details.event.params.action.name);
      if (details.event.params.action.name === this.moveToFolder) {
        this.autoRoutingForm.controls['folderId'].setValue(details.event.params.action.value);
        this.autoRoutingForm.controls['selectedFolderUsername'].setValue(details.event.params.action.username);
      } else {
        this.autoRoutingForm.controls['email'].setValue(details.event.params.action.value);
      }
      this.autoRoutingForm.patchValue(details);
    }, error => {
      console.log(error);
    });
  }

  onStepChange (step: number) {
    this.currentStep = step;
  }
}
