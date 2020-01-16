import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatTabGroup, MatDialog, MatTabHeader, MatTab } from '@angular/material';
import { OpenDialogComponent } from './open-dialog/open-dialog.component';
import { AddContractMetaModelService } from './add-contract-meta-model.service';
import { ToastrService } from 'ngx-toastr';
import { PopUpComponent } from '../pop-up/pop-up.component';
import { StorageService } from '../shared/providers/storage.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'cm-add-contract-meta-model',
  templateUrl: './add-contract-meta-model.component.html',
  styleUrls: ['./add-contract-meta-model.component.scss']
})
export class AddContractMetaModelComponent implements OnInit {
  @ViewChild('matGroupTab') matGroupTab: MatTabGroup;
  selectedIndexTab: number = 0;
  selectedIndexSubtab: number = 0;

  addContractMetaModelId: String;
  isDirtyForm: boolean = false;
  arrayTabs: any[] = [];
  isDefaultTab: boolean = false;

  showPanels: any = {
    previewPanel: true,
    addContractMetaModelPanel: false,
    selectedIndexTab: 0,
    selectedIndexSubtab: 0
  };

  breadcrumbs: Array<any> = [
    {
      text: 'Dashboard',
      base: true,
      link: '/dashboard',
      active: this.checkUserIfClientEditor()
    },
    {
      text: 'Contracts',
      link: '/contract-list',
      base: true,
      active: this.checkUserIfClientEditor()
    },
    {
      text: 'Configure Add Contracts',
      link: '/configure-add-contracts',
      base: true,
      active: true
    }
  ];

  constructor (
    private dialogMatDialog: MatDialog,
    private addContractMetaModelService: AddContractMetaModelService,
    private toastr: ToastrService,
    private cdRef: ChangeDetectorRef
  ) {
    this.addContractMetaModelService.addContractMetaModelChange$.subscribe((response: any) => {
      this.arrayTabs = response.tabs.filter(el => {
        return (el.hasOwnProperty('is_deleted') && !el.is_deleted);
      });
      this.arrayTabs.sort((a, b) => (a.position > b.position) ? 1 : -1);
    });

    this.addContractMetaModelService.componentMethodCalledForTab$.subscribe((response: any) => {
      if (this.arrayTabs[this.selectedIndexTab].default_tab) {
        this.openDialogTab('RESET');
      } else {
        this.openDialogTab('DELETE');
      }
    });

    this.addContractMetaModelService.showPanelsChange$.subscribe((response: any) => {
      this.showPanels = response;
    });

    this.addContractMetaModelService.newSubTabChange$.subscribe((response: any) => {
      this.selectedIndexSubtab = response;
    });

    this.addContractMetaModelService.isDefaultTabChange$.subscribe((response: any) => {
      this.isDefaultTab = response;
    });
  }

  ngOnInit () {
    this.getAddContractMetaModel();
    this.isDirtyForm = false;
    this.matGroupTab._handleClick = this.interceptTabChange.bind(this);
  }

  ngAfterViewChecked () {
    this.cdRef.detectChanges();
  }

  async interceptTabChange (tab: MatTab, tabHeader: MatTabHeader, idx: number) {
    if (this.isDirtyForm) {
      let result = await this.openDialog().then(value => {
        return value;
      }).catch();

      if (result) {
        this.selectedIndexTab = idx;
        this.isDirtyForm = false;
      }
    } else {
      this.selectedIndexTab = idx;
      this.isDirtyForm = false;
    }
  }

  openDialog () {
    return new Promise(resolve => {
      const dialogRef = this.dialogMatDialog.open(PopUpComponent, {
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

  isChildDirty (changed: boolean) {
    this.isDirtyForm = changed;
  }

  getAddContractMetaModel (): void {
    this.addContractMetaModelService.getAddContractMetaModel().subscribe((response: any) => {
      if (response.status === '500') {
        this.toastr.error('Error', `Error while getting contract meta model`);
      } else {
        if (response && response.tabs) {
          this.addContractMetaModelService.changedTabs(response);
          this.addContractMetaModelId = response._id;
        }
      }
    }, error => {
      this.toastr.error('Error', `${error}`);
    });
  }

  openDialogTab (typeAction): void {
    const selectedIndex = this.selectedIndexTab;
    const tab = typeAction !== 'CREATE' && selectedIndex !== -1 ? this.arrayTabs[selectedIndex] : {};
    const existTab = tab && Object.keys(tab).length > 0;
    const newIndex = typeAction === 'CREATE' ? this.matGroupTab._tabs.length : selectedIndex;
    const dialogRef = this.dialogMatDialog.open(OpenDialogComponent, {
      width: '300px',
      height: '250px',
      data: {
        tabType: 'TAB',
        action: typeAction,
        tabName: existTab && tab.hasOwnProperty('name') ? tab['name'] : '',
        addContractMetaModelId: this.addContractMetaModelId,
        addContractMetaModelTabId: existTab ? tab['_id'] : '',
        selectedIndex: newIndex,
        createNewSubtab: existTab && tab.hasOwnProperty('create_new_subtab') ? tab['create_new_subtab'] : true,
        defaultTab: existTab && tab.hasOwnProperty('default_tab') ? tab['default_tab'] : false
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.addContractMetaModel) {
        this.addContractMetaModelId = result.addContractMetaModel._id;
        this.addContractMetaModelService.changedTabs(result.addContractMetaModel);
        this.selectedIndexTab = newIndex;
      }
    });
  }

  getAllListTabConnections (index) {
    const connections = [];
    for (let i = 0; i < this.arrayTabs.length; i++) {
      if (i !== index) {
        connections.push('list-' + i);
      }
    }
    return connections;
  }

  dropTab (event: CdkDragDrop<string[]>) {
    const previousIndex = parseInt(event.previousContainer.id.replace('list-',''), 10);
    const newIndex = parseInt(event.container.id.replace('list-',''), 10);
    if (!Number.isNaN(previousIndex) && !Number.isNaN(newIndex) &&
      previousIndex !== undefined && newIndex !== undefined && previousIndex !== newIndex) {
      moveItemInArray(this.arrayTabs, previousIndex, newIndex);
      this.arrayTabs.forEach((element, index) => {
        element['position'] = index;
      });
      const urlParams = {
        addContractMetaModelId: this.addContractMetaModelId
      };
      const objectData = {
        tabs: JSON.parse(JSON.stringify(this.arrayTabs))
      };
      this.addContractMetaModelService.updateAddContractMetaModelTabs(urlParams, objectData).subscribe((response: any) => {
        this.selectedIndexTab = newIndex;
        this.toastr.success('Operation Complete', 'Order of tabs successfully changed');
      }, error => {
        this.toastr.error('Error', `${error.error}`);
      });
    }
  }

  checkUserIfClientEditor () {
    let role = StorageService.get(StorageService.userRole);
    if (role === 'Client Editor' || role === 'Editor') {
      return true;
    } else {
      return false;
    }
  }
}
