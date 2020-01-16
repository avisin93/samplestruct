import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatTabGroup } from '@angular/material';

@Component({
  selector: 'cm-contracts-meta-tab-subtab',
  templateUrl: './subtab.component.html',
  styleUrls: ['./subtab.component.scss']
})
export class ContractsMetaTabSubtabComponent implements OnInit {
  formGroup: FormGroup;
  @Input() addContractMetaModelId: String;
  @Input() addContractMetaModelTabId: String;
  @Input() subtab: any;
  @Input() oneSubtab: Boolean;
  @Input() tab: any;
  @Input('matGroupTab') matGroupTab: MatTabGroup;
  @Input('matGroupSubTab') matGroupSubTab: MatTabGroup;

  constructor () {}

  ngOnInit (): void {}
}
