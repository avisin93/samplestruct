import { Component, OnInit, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SessionService } from '../../shared/providers/session.service';

@Component({
  selector: 'app-feature-setup',
  templateUrl: './feature-setup.component.html',
  styleUrls: ['./feature-setup.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class FeatureSetupComponent implements OnInit {

  @Input('type') type = '';

  @Input('mode') mode: string = '';

  featureSetupForm: FormGroup;

  setupData: Array<any> = [
    {
      id: '123',
      name: 'Setup 1',
      submenus: [
        {
          id: 1,
          name: 'Client Setup',
          features: [
            {
              id: 1,
              name: 'Information',
              permissions: [
                'Add', 'Edit'
              ]
            },
            {
              id: 2,
              name: 'Assign Storefront',
              permissions: [
                'Add'
              ]
            },
            {
              id: 3,
              name: 'Facilities',
              permissions: [
                'Add', 'Edit'
              ]
            }
          ]
        },
        {
          id: 2,
          name: 'Vendor Setup',
          features: [
            {
              id: 1,
              name: 'Information',
              permissions: [
                'Add', 'Edit'
              ]
            },
            {
              id: 2,
              name: 'Assign Storefront',
              permissions: [
                'Add'
              ]
            },
            {
              id: 3,
              name: 'Facilities',
              permissions: [
                'Add', 'Edit'
              ]
            }
          ]
        },
        {
          id: 3,
          name: 'Vendor Mapper',
          features: [
            {
              id: 1,
              name: 'Information 2',
              permissions: [
                'Add', 'Edit'
              ]
            },
            {
              id: 2,
              name: 'Assign Storefront 3',
              permissions: [
                'Add'
              ]
            },
            {
              id: 3,
              name: 'Facilities 5',
              permissions: [
                'Add', 'Edit'
              ]
            }
          ]
        }
      ]
    },
    {
      id: '545',
      name: 'Setup 2',
      submenus: [
        {
          id: 1,
          name: 'Client Setup 2',
          features: [
            {
              id: 1,
              name: 'Information 3',
              permissions: [
                'Add', 'Edit', 'Delete'
              ]
            },
            {
              id: 2,
              name: 'Assign Storefront',
              permissions: [
                'Add'
              ]
            },
            {
              id: 3,
              name: 'Facilities',
              permissions: [
                'Add', 'Edit'
              ]
            }
          ]
        },
        {
          id: 2,
          name: 'Vendor Setup',
          features: [
            {
              id: 1,
              name: 'Information',
              permissions: [
                'Add', 'Edit'
              ]
            },
            {
              id: 2,
              name: 'Assign Storefront',
              permissions: [
                'Add'
              ]
            },
            {
              id: 3,
              name: 'Facilities',
              permissions: [
                'Add', 'Edit'
              ]
            }
          ]
        },
        {
          id: 3,
          name: 'Vendor Mapper',
          features: [
            {
              id: 1,
              name: 'Information 2',
              permissions: [
                'Add', 'Edit'
              ]
            },
            {
              id: 2,
              name: 'Assign Storefront 3',
              permissions: [
                'Add'
              ]
            },
            {
              id: 3,
              name: 'Facilities 5',
              permissions: [
                'Add', 'Edit'
              ]
            }
          ]
        }
      ]
    }
  ];

  selectedSetupName: string = '';

  selectedSubMenuName: string = '';

  selectedFeatureName: string = '';

  subMenus: Array<any> = [];

  features: Array<any> = [];

  permissions: Array<any> = [];

  constructor (private _router: Router,
    private route: ActivatedRoute,
    private _fb: FormBuilder) {
    this.featureSetupForm = this._fb.group({

    });
  }

  ngOnInit () {
    console.log(this.mode);
  }

  save ({ value, valid }: {value: any, valid: boolean}) {
    console.log(value);
  }

  onSetupSelect (data: any) {
    console.log(data);
    this.selectedSetupName = data.name;
    this.subMenus = data.submenus;
    this.features = [];
    this.permissions = [];
  }

  onSubMenuSelect (subMenu: any) {
    this.selectedSubMenuName = subMenu.name;
    this.features = subMenu.features;
  }

  onFeaturesSelect (feature: any) {
    this.selectedFeatureName = feature.name;
    this.permissions = feature.permissions;
  }

  gotoClientVendorSetup () {
    let base = SessionService.get('base-role');
    this.route.parent.url.subscribe((urlPath) => {
      const menuUrl = urlPath[urlPath.length - 1].path;
      this._router.navigate(['/' + base + '/' + menuUrl]);
    });
  }

}
