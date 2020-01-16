import { Component, OnInit, ViewChild } from '@angular/core';
import { ContractService } from './contracts.service';
import { ActivatedRoute } from '@angular/router';
import { MatTabGroup, MatDialog, MatTab, MatTabHeader } from '@angular/material';
import { GeneralInformationComponent } from './general-information/general-information.component';
import { TermComponent } from './term/term.component';
import { CommercialsComponent } from './commercials/commercials.component';
import { OtherCommercialTermsComponent } from './other-commercial-terms/other-commercial-terms.component';
import { SlaComponent } from './sla/sla.component';
import { PopUpComponent } from '../pop-up/pop-up.component';
import { ToastrService } from 'ngx-toastr';
import { IClientSpecific } from 'src/app/interfaces/client-specific.interface';

@Component({
  selector: 'cm-contracts',
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.scss']
})
export class ContractsComponent implements OnInit {
  @ViewChild('matgroup') matgroup: MatTabGroup;
  @ViewChild('generalInformation') generalInformation: GeneralInformationComponent;
  @ViewChild('term') term: TermComponent;
  @ViewChild('commercials') commercials: CommercialsComponent;
  @ViewChild('otherCommercialTerms') otherCommercialTerms: OtherCommercialTermsComponent;
  @ViewChild('sla') sla: SlaComponent;

  savedGeneralInformation: boolean = false;
  addMode: boolean;
  indexOfHighestOpenedTab: number = 0;
  title = 'Add Contract';
  contractId: String;
  generalInfoLocation: string;

  selectedIndex = 0;

  isDirtyForm: boolean = false;

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

  constructor (private route: ActivatedRoute,
    private contractService: ContractService,
    private toastr: ToastrService,
    public dialog: MatDialog) {
    route.params.subscribe(val => {
      if (val.id === '0') {
        this.contractService.contractId = '0';
        this.contractService.contractData = undefined;
        if (this.matgroup) {
          this.matgroup.selectedIndex = 0;
        }
        this.addMode = true;
        this.contractService.addMode = true;
        this.contractService.indexOfHighestOpenedTabCommercials = 0;
        this.contractService.indexOfHighestOpenedTabOtherCommercialTerms = 0;
        this.contractService.indexOfHighestOpenedTabSla = 0;
        this.title = 'Add Contract';
        this.breadcrumbs[1].text = 'Add Contract';
        if (this.generalInformation) {
          this.generalInformation.ngOnInit();
        }
      }
    });
    this.contractService.contractId = this.route.snapshot.paramMap.get('id');
    this.contractService.contractData = this.route.snapshot.data['contract'];
    this.contractService.billingCurrency = this.contractService.contractData ? this.contractService.contractData.billing_currency_type : null;
    this.addMode = !this.contractService.contractData;

    if (this.contractService.contractId !== undefined &&
      this.contractService.contractId !== null &&
      this.contractService.contractId !== '0') {
      this.title = 'Edit Contract';
      this.breadcrumbs[1].text = 'Edit Contract';

      if (this.contractService.contractData.extraction_in_jet && !this.contractService.contractData.extraction_successful) {
        this.toastr.warning('Operation failure','Jet Extraction failed');
      }
    }
    this.contractService.addMode = this.addMode;
  }

  ngOnInit () {
    this.contractId = this.route.snapshot.params['id'];
    this.matgroup._handleClick = this.interceptTabChange.bind(this);
  }

  async interceptTabChange (tab: MatTab, tabHeader: MatTabHeader, idx: number) {
    if (this.contractId === '0' && this.indexOfHighestOpenedTab === 0 && !this.savedGeneralInformation) return;
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

  isChildDirty (changed: boolean) {
    this.isDirtyForm = changed;
  }

  setLocation (location: string) {
    this.generalInfoLocation = location;
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
    if (this.addMode && 0 < this.matgroup.selectedIndex) {
      this.matgroup._tabs.forEach((matTab, i) => {
        // if (i <= this.matgroup.selectedIndex) {
        matTab.disabled = false;
        // }
      });
      this.indexOfHighestOpenedTab = this.matgroup.selectedIndex;
      this.savedGeneralInformation = true;
    }
  }

}
