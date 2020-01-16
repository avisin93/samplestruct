import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material';

@Component({
  selector: 'cm-preview-add-contract-meta-model-view-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss']
})
export class PreviewContractMetaModelViewTabComponent implements OnInit {
  @ViewChild('matGroupPreviewSubTab') matGroupPreviewSubTab: MatTabGroup;
  @Input() selectedIndexSubtab: number;
  @Input() tab: any;
  arraySubtabs: any[];
  oneSubtab: Boolean = true;

  constructor () {
  }

  ngOnInit () {
    this.arraySubtabs = this.tab.subtabs.filter(el => {
      return (el.hasOwnProperty('is_deleted') && !el.is_deleted) && ((el.hasOwnProperty('fixed_visibility') && el.fixed_visibility) || (!(el.hasOwnProperty('visibility')) || el.visibility));
    });
    this.arraySubtabs.sort((a, b) => (a.position > b.position) ? 1 : -1);
    this.oneSubtab = !(this.tab.subtabs.length > 1);
  }

  ngAfterViewInit () {
    if (this.matGroupPreviewSubTab) {
      this.matGroupPreviewSubTab.selectedIndex = this.selectedIndexSubtab;
      if (this.matGroupPreviewSubTab._tabs) {
        this.matGroupPreviewSubTab._tabs.forEach((matTab, i) => {
          matTab.disabled = true;
        });
      }
    }
  }
}
