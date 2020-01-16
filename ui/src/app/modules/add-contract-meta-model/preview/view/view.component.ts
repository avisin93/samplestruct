import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatTabGroup } from '@angular/material';

@Component({
  selector: 'cm-preview-add-contract-meta-model-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class PreviewContractMetaModelViewComponent implements OnInit {

  @ViewChild('matGroupPreviewTab') matGroupPreviewTab: MatTabGroup;
  @Input() arrayTabs: [];
  @Input() selectedIndexTab: number;
  @Input() selectedIndexSubtab: number;
  selectedIndexPreviewTab: number = 0;

  constructor () {}

  ngOnInit () {
  }

  ngOnChanges () {
    this.matGroupPreviewTab.selectedIndex = this.selectedIndexTab;
    if (this.matGroupPreviewTab._tabs) {
      this.matGroupPreviewTab._tabs.forEach((matTab, i) => {
        matTab.disabled = true;
      });
    }
  }
}
