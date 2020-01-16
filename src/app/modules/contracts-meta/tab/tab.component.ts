import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatTabGroup } from '@angular/material';

@Component({
  selector: 'cm-contracts-meta-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss']
})
export class ContractsMetaTabComponent implements OnInit {
  formGroup: FormGroup;
  @Input('matGroupTab') matGroupTab: MatTabGroup;
  @Input('matGroupSubTab') matGroupSubTab: MatTabGroup;
  @Input() tab: any;
  @Input() addContractMetaModelId: String;
  arraySubtabs: any[];
  oneSubtab: Boolean = true;

  constructor () {
  }

  ngOnInit () {
    this.arraySubtabs = this.tab.subtabs.filter(el => {
      return (el.hasOwnProperty('is_deleted') && !el.is_deleted) && ((el.hasOwnProperty('fixed_visibility') && el.fixed_visibility) || (!(el.hasOwnProperty('visibility')) || el.visibility));
    });
    this.oneSubtab = !(this.tab.subtabs.length > 1);
  }
}
