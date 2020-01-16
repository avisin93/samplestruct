import { Component, OnInit, Input } from '@angular/core';
import { AddContractMetaModelService } from '../add-contract-meta-model.service';

@Component({
  selector: 'cm-preview-add-contract-meta-model',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewContractMetaModelComponent implements OnInit {

  @Input() arrayTabs: [];
  @Input() selectedIndexTab: number;
  @Input() selectedIndexSubtab: number;

  constructor (
    private addContractMetaModelService: AddContractMetaModelService
  ) {}

  ngOnInit () {
  }

  backAction (): void {
    this.addContractMetaModelService.changedPanels({
      previewPanel: true,
      addContractMetaModelPanel: false,
      selectedIndexTab: 0,
      selectedIndexSubtab: 0
    });
  }
}
