import { Component, OnInit, ViewChild } from '@angular/core';
import { ContractsMetaService } from './contracts-meta.service';
import { ActivatedRoute } from '@angular/router';
import { MatTabGroup, MatDialog, MatTabHeader, MatTab } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { PopUpComponent } from '../pop-up/pop-up.component';

@Component({
  selector: 'cm-contracts',
  templateUrl: './contracts-meta.component.html',
  styleUrls: ['./contracts-meta.component.scss']
})
export class ContractsMetaComponent implements OnInit {

  @ViewChild('matGroupTab') matGroupTab: MatTabGroup;
  addContractMetaModelId: String;
  arrayTabs: any[] = [];

  savedGeneralInformation: boolean = false;
  addMode: boolean;
  indexOfHighestOpenedTab: number = 0;
  title = 'Add Contract';
  isDirtyForm: boolean = false;
  selectedIndex = 0;

  breadcrumbs: Array<any> = [
    {
      text: 'Contracts',
      base: true,
      link: '/contract-list',
      active: false
    },
    {
      text: 'Add Contract',
      base: true,
      active: true
    }
  ];

  constructor (
    private contractMetaService: ContractsMetaService,
    public dialog: MatDialog,
    private toastr: ToastrService,
    private route: ActivatedRoute
    ) {
    route.params.subscribe(val => {
      if (val.id === '0') {
        this.contractMetaService.contractId = '0';
        this.contractMetaService.contractData = undefined;
        this.addMode = true;
        this.contractMetaService.addMode = true;
        this.title = 'Add Contract';
        this.breadcrumbs[1].text = 'Add Contract';
      }
    });
    this.contractMetaService.contractId = this.route.snapshot.paramMap.get('id');
    this.contractMetaService.contractData = this.route.snapshot.data['contract'];
    this.addMode = !this.contractMetaService.contractData;
    if (!this.addMode) {
      this.title = 'Edit Contract';
      this.breadcrumbs[1].text = 'Edit Contract';
    }
    this.contractMetaService.addMode = this.addMode;
  }

  ngOnInit () {
    this.contractMetaService.getAddContractMetaModel().subscribe((response: any) => {
      if (response.status === '500') {
        this.toastr.error('Error', `Error while getting contract meta model`);
      } else {
        if (response && response.tabs && response._id) {
          this.arrayTabs = response.tabs.filter(el => {
            return (el.hasOwnProperty('is_deleted') && !el.is_deleted);
          });
          this.arrayTabs.sort((a, b) => (a.position > b.position) ? 1 : -1);
          this.addContractMetaModelId = response._id;
        }
      }
    }, error => {
      this.toastr.error('Error', `${error}`);
    });
    this.matGroupTab._handleClick = this.interceptTabChange.bind(this);
  }

  async interceptTabChange (tab: MatTab, tabHeader: MatTabHeader, idx: number) {
    if (this.route.snapshot.params['id'] === '0' && this.indexOfHighestOpenedTab === 0 && !this.savedGeneralInformation) return;
    if (this.isDirtyForm) {
      let result = await this.openDialog().then(value => {
        return value;
      }).catch();

      if (result) {
        this.selectedIndex = idx;
        this.isDirtyForm = false;
      }
    } else {
      this.selectedIndex = idx;
      this.isDirtyForm = false;
    }
  }

  openDialog () {
    return new Promise(resolve => {
      const dialogRef = this.dialog.open(PopUpComponent, {
        width: '450px',
        data: {
          message: `All changes will be lost?`,
          'yes': 'Ok',
          'no': 'Cancel',
          'fontSize': '20px'
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        setTimeout(() => {
          if (result) {
            resolve(true);
          } else {
            resolve(false);
          }
        });
      });
    });
  }

  onTabChange () {
    if (this.addMode && 0 < this.matGroupTab.selectedIndex) {
      this.matGroupTab._tabs.forEach((matTab, i) => {
        matTab.disabled = false;
      });
      this.indexOfHighestOpenedTab = this.matGroupTab.selectedIndex;
      this.savedGeneralInformation = true;
    }
  }
}
