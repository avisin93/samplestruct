import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { MatTabGroup, MatDialog, MatTab, MatTabHeader } from '@angular/material';
import { OpenDialogComponent } from '../open-dialog/open-dialog.component';
import { FormGroup } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { AddContractMetaModelService } from '../add-contract-meta-model.service';
import { ToastrService } from 'ngx-toastr';
import { PopUpComponent } from '../../pop-up/pop-up.component';
import { moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'cm-add-contract-meta-model-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss']
})
export class AddContractMetaModelTabComponent implements OnInit {
  @Input() matGroupTab: MatTabGroup;
  @Input() selectedIndexSubtab: number;
  @ViewChild('matGroupSubTab') matGroupSubTab: MatTabGroup;

  @Output() isDirty: EventEmitter<boolean> = new EventEmitter();
  formGroup: FormGroup;

  @Input() tab: any;
  @Input() addContractMetaModelId: String;

  @Input() arrayTabs: boolean;
  @Output() addContractMetaModelChange = new EventEmitter<boolean>();

  arraySubtabs: any[];
  addContractMetaModelTabId: String;
  addContractMetaModelSubtabId: String;
  selection = new SelectionModel<any>(true, []);
  atLeastOneWithoutFixedVisibility: Boolean = false;
  isDirtyForm: boolean = false;

  constructor (
    private dialogMatDialog: MatDialog,
    private addContractMetaModelService: AddContractMetaModelService,
    private toastr: ToastrService

  ) {
  }

  ngOnInit () {
    this.matGroupSubTab._handleClick = this.interceptTabChange.bind(this);

    this.arraySubtabs = this.tab.subtabs.filter(el => {
      return (el.hasOwnProperty('is_deleted') && !el.is_deleted);
    });
    this.arraySubtabs.sort((a, b) => (a.position > b.position) ? 1 : -1);
    this.arraySubtabs.forEach(el => {
      if (!(el.hasOwnProperty('visibility')) || el.visibility) {
        this.selection.toggle(el);
      }
      if (!this.atLeastOneWithoutFixedVisibility && (el.hasOwnProperty('fixed_visibility') && !el.fixed_visibility)) {
        this.atLeastOneWithoutFixedVisibility = true;
      }
    });
    this.addContractMetaModelTabId = this.tab._id;
    this.addContractMetaModelService.changedIsDefaultTab(this.tab.default_tab);
  }

  async interceptTabChange (tab: MatTab, tabHeader: MatTabHeader, idx: number) {
    if (tab.disabled) {
      return;
    } else if (this.isDirtyForm) {
      let result = await this.openDialog().then(value => {
        return value;
      }).catch();

      if (result) {
        this.selectedIndexSubtab = idx;
        this.isDirtyForm = false;
        this.isDirty.emit(false);
      }
    } else {
      this.selectedIndexSubtab = idx;
      this.isDirtyForm = false;
    }
  }

  isChildDirty (changed: boolean) {
    this.isDirtyForm = changed;
    this.isDirty.emit(changed);
  }

  openDialog () {
    return new Promise(resolve => {
      const dialogRef = this.dialogMatDialog.open(PopUpComponent, {
        width: '450px',
        data: {
          message: `All changes will be lost?`,
          'yes': 'Ok',
          'no': 'Cancel'
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

  openDialogSubtab (typeAction: string): void {
    const selectedIndex = this.selectedIndexSubtab;
    const subtab = typeAction !== 'CREATE' && selectedIndex !== -1 ? this.arraySubtabs[selectedIndex] : {};
    const existSubtab = subtab && Object.keys(subtab).length > 0;
    const newIndex = typeAction === 'CREATE' ? this.matGroupSubTab._tabs.length - 1 : selectedIndex;
    if (typeAction === 'CREATE' && this.checkIfThereIsEmptySubtab()) {
      this.toastr.error('There is empty subtab without components!');
    } else {
      const dialogRef = this.dialogMatDialog.open(OpenDialogComponent, {
        width: '300px',
        height: '300px',
        data: {
          tabType: 'SUBTAB',
          action: typeAction,
          tabName: existSubtab && subtab.hasOwnProperty('name') ? subtab['name'] : '',
          addContractMetaModelId: this.addContractMetaModelId,
          addContractMetaModelTabId: this.addContractMetaModelTabId,
          addContractMetaModelSubtabId: existSubtab ? subtab._id : null,
          selectedIndex: newIndex,
          fixedVisibility: existSubtab && subtab.hasOwnProperty('fixed_visibility') ? subtab['fixed_visibility'] : false,
          visibility: existSubtab && subtab.hasOwnProperty('visibility') ? subtab['visibility'] : true,
          isTableView: existSubtab && subtab.hasOwnProperty('is_table_view') ? subtab['is_table_view'] : false,
          defaultSubtab: existSubtab && subtab.hasOwnProperty('default_subtab') ? subtab['default_subtab'] : false,
          addNewFields: existSubtab && subtab.hasOwnProperty('add_new_fields') ? subtab['add_new_fields'] : true
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result && result.addContractMetaModel) {
          this.addContractMetaModelService.changedTabs(result.addContractMetaModel);
          this.addContractMetaModelService.changedSubtab(newIndex);
        }
      });
    }
  }

  checkIfThereIsEmptySubtab (): boolean {
    return this.arraySubtabs.find(item => item.components.length === 0);
  }

  saveViewSubtabs (): void {
    let pomArraySubtabs = this.arraySubtabs;
    const pomArraySelected = this.selection.selected;
    pomArraySubtabs = pomArraySubtabs.map(elSub => {
      if (pomArraySelected.some(elSel => elSel === elSub)) {
        elSub.visibility = true;
      } else {
        elSub.visibility = false;
      }
      return elSub;
    });
    const urlParams = {
      addContractMetaModelId: this.addContractMetaModelId,
      addContractMetaModelTabId: this.addContractMetaModelTabId
    };
    const objectData = {
      tab: {
        subtabs: JSON.parse(JSON.stringify(pomArraySubtabs))
      }
    };
    this.addContractMetaModelService.updateAddContractMetaModelTabSubtabs(urlParams, objectData).subscribe((response: any) => {
      if (response.status === '500') {
        this.toastr.error('Error', `Error while update contract meta model subtabs`);
      } else {
        this.addContractMetaModelService.changedTabs(response);
        this.addContractMetaModelService.changedSubtab(this.selectedIndexSubtab);
        this.toastr.success('Success', `Contract meta model subtabs updated`);
      }
    }, error => {
      this.toastr.error('Error', `${error.error}`);
    });
  }

  getAllListSubTabConnections (index) {
    const connections = [];
    for (let i = 0; i < this.arraySubtabs.length; i++) {
      if (i !== index) {
        connections.push('list-vertical' + i);
      }
    }
    return connections;
  }

  dropSubTab (event: CdkDragDrop<string[]>) {
    const previousIndex = parseInt(event.previousContainer.id.replace('list-vertical',''), 10);
    const newIndex = parseInt(event.container.id.replace('list-vertical',''), 10);
    if (!Number.isNaN(previousIndex) && !Number.isNaN(newIndex) &&
      previousIndex !== undefined && newIndex !== undefined && previousIndex !== newIndex) {
      moveItemInArray(this.arraySubtabs, previousIndex, newIndex);
      this.arraySubtabs.forEach((element, index) => {
        element['position'] = index;
      });
      this.selectedIndexSubtab = newIndex;
      this.saveViewSubtabs();
    }
  }

  openDialogTab (typeAction, subtab): void {
    const dialogRef = this.dialogMatDialog.open(OpenDialogComponent, {
      width: '300px',
      height: '250px',
      data: {
        tabType: 'TAB',
        action: typeAction,
        tabName: subtab.name,
        addContractMetaModelId: this.addContractMetaModelId,
        addContractMetaModelTabId: this.addContractMetaModelTabId,
        addContractMetaModelSubtabId: subtab._id
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.addContractMetaModel) {
        this.addContractMetaModelService.changedTabs(result.addContractMetaModel);
        this.addContractMetaModelService.changedSubtab(this.selectedIndexSubtab);
      }
    });
  }
}
