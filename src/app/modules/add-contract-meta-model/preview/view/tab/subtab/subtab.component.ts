import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'cm-preview-add-contract-meta-model-view-tab-subtab',
  templateUrl: './subtab.component.html',
  styleUrls: ['./subtab.component.scss']
})
export class PreviewContractMetaModelViewTabSubtabComponent implements OnInit {
  @Input() subtab: any;
  @Input() oneSubtab: Boolean;

  constructor () {}

  ngOnInit (): void {}
}
