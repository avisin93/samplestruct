import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { HttpParams } from '@angular/common/http';
import { DocumentService } from './document.service';
import { MatDatepicker, MatDialog, MAT_TOOLTIP_DEFAULT_OPTIONS } from '@angular/material';
import { AddNewDocumentDialogComponent } from './add-new-document-dialog/add-new-document-dialog.component';
import { ContractService } from '../contracts.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { SessionService } from '../../shared/providers/session.service';
import { PopUpComponent } from '../../pop-up/pop-up.component';
import {
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/animations';
import { customTooltipDefaults } from 'src/app/models/constants';
import { environment } from '../../../../environments/environment';

const ACTIVE: string = 'ACTIVE';
const CONTRACT_SUBMIT: string = 'CONTRACT_SUBMIT';

@Component({
  selector: 'cm-document',
  animations: [
    trigger('slideInOut', [
      state(
        'in',
        style({
          overflow: 'hidden',
          height: '*'
        })
      ),
      state(
        'out',
        style({
          overflow: 'hidden',
          height: '0'
        })
      ),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out'))
    ])
  ],
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss'],
  providers: [
    { provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: customTooltipDefaults }
  ]
})
export class DocumentComponent implements OnInit {
  @ViewChild(DatatableComponent) datatable: DatatableComponent;
  @ViewChild('sortableHeaderTemplate') sortableHeaderTemplate: TemplateRef<any>;
  @ViewChild('dateColumnTemplate') dateColumnTemplate: TemplateRef<any>;
  @ViewChild('actionColumnTemplate') actionColumnTemplate: TemplateRef<any>;
  @ViewChild('statusColumnTemplate') statusColumnTemplate: TemplateRef<any>;
  @ViewChild('sortableHeaderTemplateStartDate') sortableHeaderTemplateStartDate: TemplateRef<any>;
  @ViewChild('sortableHeaderTemplateSignedDate') sortableHeaderTemplateSignedDate: TemplateRef<any>;
  @ViewChild('sortableHeaderTemplateUploadDate') sortableHeaderTemplateUploadDate: TemplateRef<any>;
  @ViewChild('sortableHeaderTemplateSelectStatus') sortableHeaderTemplateSelectStatus: TemplateRef<any>;
  @ViewChild('sortableHeaderTemplateSelectDocType') sortableHeaderTemplateSelectDocType: TemplateRef<any>;
  @ViewChild('chkBxTmpl') chkBxTmpl: TemplateRef<any>;
  @ViewChild('chkBxTmplCell') chkBxTmplCell: TemplateRef<any>;

  @ViewChild('startDatePicker') startDatePicker: MatDatepicker<any>;
  @ViewChild('signedDatePicker') signedDatePicker: MatDatepicker<any>;
  @ViewChild('uploadDatePicker') uploadDatePicker: MatDatepicker<any>;

  @Output() isDirty: EventEmitter<boolean> = new EventEmitter();

  selectedStatusFilter = '';
  selectedDocTypeFilter = '';

  rowsTable = [];
  tempRowsTable = [];

  headerCheckBox: boolean = false;

  columnsTable = [];

  isLoadingDataTable: boolean = false;
  arrayStatus = [];
  arrayDocTypes = [];

  public readonly pageLimitOptions = [
    { value: 10 },
    { value: 20 },
    { value: 30 },
    { value: 40 },
    { value: 50 }
  ];

  myMessages = {
    emptyMessage: "<img src='../../../../assets/images/no_data_found.png'>",
    totalMessage: 'Displaying item '
  };

  pageTable = {
    limit: 10,
    count: 0,
    offset: 0
  };

  constructor (
    private documentService: DocumentService,
    private dialogMatDialog: MatDialog,
    private contractService: ContractService,
    private toastr: ToastrService,
    private router: Router,
    private matDialog: MatDialog,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef
  ) {

    this.documentService.valueUpdate$.subscribe((value) => this.isChildDirty(value));

  }

  ngOnInit () {
    this.initDataTable();
    this.fetchDataForTable();

    this.contractService.getAllStatus().subscribe((res: any) => {
      this.arrayStatus = res;
    });

    this.contractService.getAllDocumentTypes().subscribe((res: any) => {
      this.arrayDocTypes = res;
    });
  }

  changePage (e: any) {
    this.pageTable.offset = e.page - 1;
    this.datatable.onFooterPage(e);
  }

  initDataTable () {
    this.columnsTable = [
      {
        name: '',
        prop: 'chcbox',
        sortable: false,
        resizeable: false,
        cellTemplate: this.chkBxTmplCell,
        headerTemplate: this.chkBxTmpl,
        minWidth: 55,
        maxWidth: 55
      },
      {
        name: 'DOC NAME',
        prop: 'document_title',
        sortable: true,
        headerTemplate: this.sortableHeaderTemplate,
        resizeable: false,
        minWidth: 120
      },
      {
        name: 'DOC TYPE',
        prop: 'type.name',
        sortable: true,
        headerTemplate: this.sortableHeaderTemplateSelectDocType,
        resizeable: false,
        minWidth: 120
      },
      {
        name: 'ATTACHMENTS',
        prop: 'name_document_efa',
        sortable: true,
        headerTemplate: this.sortableHeaderTemplate,
        resizeable: false,
        minWidth: 120
      },
      {
        name: 'START DATE',
        prop: 'start_date',
        sortable: true,
        headerTemplate: this.sortableHeaderTemplateStartDate,
        cellTemplate: this.dateColumnTemplate,
        resizeable: false,
        minWidth: 120
      },
      {
        name: 'SIGNED DATE',
        prop: 'signed_date',
        sortable: true,
        headerTemplate: this.sortableHeaderTemplateSignedDate,
        cellTemplate: this.dateColumnTemplate,
        resizeable: false,
        minWidth: 120
      },
      {
        name: 'UPLOAD DATE',
        prop: 'upload_date',
        sortable: true,
        headerTemplate: this.sortableHeaderTemplateUploadDate,
        cellTemplate: this.dateColumnTemplate,
        resizeable: false,
        minWidth: 120
      },
      {
        name: 'STATUS',
        prop: 'status.name',
        sortable: true,
        headerTemplate: this.sortableHeaderTemplateSelectStatus,
        cellTemplate: this.statusColumnTemplate,
        resizeable: false,
        minWidth: 100,
        maxWidth: 100
      },
      {
        name: 'ACTION',
        prop: 'action',
        sortable: false,
        cellTemplate: this.actionColumnTemplate,
        resizeable: false,
        minWidth: 100
      }
    ];
  }

  // ------- Fetch data --------
  fetchDataForTable () {
    if (this.contractService.contractId === '0') {
      return;
    }
    this.isLoadingDataTable = true;
    let urlParams = {
      contractId: `${this.contractService.contractId}`
    };

    this.documentService.getAllDocumentsForContract(urlParams).subscribe(
      (data: any) => {
        this.pageTable.count = data.count;
        this.rowsTable = data.rowsTable;
        this.rowsTable.forEach(item => {
          item.checked = false;
        });
        this.tempRowsTable = [...data.rowsTable];
        this.isLoadingDataTable = false;
        this.cd.markForCheck();
      },
      error => {
        console.log(error);
        this.toastr.error(
          'Error',
          'Something went wrong(Cannot fetch list of documents)'
        );
      }
    );
  }
  // ------ End fetch data --------

  // ------- Filter table ---------
  updateFilter (event, propName) {
    const val = event.target.value !== null ? (propName === 'signed_date' || propName === 'start_date' || propName === 'upload_date' ? event.target.value.toISOString() : event.target.value.toString().toLowerCase()) : '';
    let tempRowsTable;
    tempRowsTable = this.tempRowsTable.filter(d => {
      let dateFromPicker = d[propName].toString().toLowerCase();
      let dateFromTable = val.toLowerCase();
      if (!propName.includes('.')) {
        return dateFromPicker.substr(0, dateFromPicker.indexOf('t'))
          .indexOf(dateFromTable.substr(0, dateFromTable.indexOf('t'))) !== -1 || !val;
      } else {
        // in case we have object
        let objectPro = d[propName.substring(0, propName.indexOf('.'))];
        return (
          objectPro[propName.substring(propName.indexOf('.') + 1)]
            .toLowerCase()
            .indexOf(val) !== -1 || !val
        );
      }
    });
    this.rowsTable = tempRowsTable;
    this.datatable.offset = 0;
  }

  isChildDirty (changed: boolean) {
    this.isDirty.emit(changed);
  }

  resetStartDatePicker (): void {
    this.startDatePicker.select(undefined);
  }

  resetSignedDatePicker (): void {
    this.signedDatePicker.select(undefined);
  }

  resetUploadDatePicker (): void {
    this.uploadDatePicker.select(undefined);
  }

  // -------- End filter table -------

  openAddDocumentDialog (): void {
    let dialogRef = this.dialogMatDialog.open(AddNewDocumentDialogComponent, {
      width: '600px',
      height: 'auto',
      data: {
        updateDocument: false
      }
    });

    dialogRef.componentInstance.onActionDocument.subscribe(() => {
      this.fetchDataForTable();
      dialogRef.close();
    });
  }

  openDialogForEdit (row) {
    let dialogRef = this.dialogMatDialog.open(AddNewDocumentDialogComponent, {
      width: '600px',
      height: 'auto',
      data: {
        id_document: row._id,
        document_title: row.document_title,
        type_code: row.type ? row.type.code : '',
        name_document_efa: row.name_document_efa,
        start_date: row.start_date,
        signed_date: row.signed_date,
        status_code: row.status ? row.status.code : '',
        parent_document: row.parent_document,
        child_document: row.child_document,
        updateDocument: true
      }
    });

    dialogRef.componentInstance.onActionDocument.subscribe(() => {
      this.fetchDataForTable();
      dialogRef.close();
    });
  }

  onSelect (selected) {
    this.headerCheckBox = selected.checked;
    this.rowsTable.forEach(row => {
      row.checked = selected.checked;
    });
    this.rowsTable = [...this.rowsTable];
  }

  onSelectCell (selected, row: any) {
    this.rowsTable[this.rowsTable.indexOf(row)].checked = selected.checked;
    if (selected.checked) {

      if (this.rowsTable.length === this.rowsTable.filter(oneRow => { return oneRow.checked === true; }).length) {
        this.headerCheckBox = true;
      }
    } else {
      this.headerCheckBox = false;
    }
  }

  openDialogForDeleteConfirmation (row) {
    if (row === undefined) {
      if (this.rowsTable.filter(row => row.checked === true).length === 0) {
        alert('Please select atleast one row!');
        return;
      }
    }
    let data = {
      'message': 'Are you sure you want to delete?',
      'heading': 'Document',
      'row': row,
      'component': 'document',
      'yes': 'Yes',
      'no': 'Cancel'
    };

    const dialogRef = this.matDialog.open(PopUpComponent, {
      width: '450px',
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result && result.row && result.component === 'document') {
          this.deleteDocument(result.row);
        } else if (result !== undefined && result.component === 'document') {
          this.deleteSelectedDocuments();
        }
      }
    });
  }

  deleteDocument (row) {
    let urlParams = {
      contractId: `${this.contractService.contractId}`,
      documentId: `${row._id}`
    };
    this.documentService.deleteDocument(urlParams).subscribe((response: any) => {
      if (response.status === '500') {
        this.toastr.error('Error', 'Something went wrong');
      } else {
        this.toastr.success('Operation Complete', 'Document successfully deleted');
        this.fetchDataForTable();
      }
    },
      error => {
        console.log(error);
        this.toastr.error(
          'Error',
          'Something went wrong(Cannot delete document)'
        );
      }
    );
  }

  deleteSelectedDocuments () {
    if (this.rowsTable.filter(row => row.checked === true).length === 0) {
      alert('Please select atleast one row!');
    } else {
      const documentids = this.rowsTable.filter(row => row.checked === true).map(doc => doc._id).join(',');
      const params = new HttpParams().set('documentids', `${documentids}`);
      let urlParams = {
        contractId: `${this.contractService.contractId}`
      };
      this.documentService.deleteDocuments(urlParams, params).subscribe(
        (response: any) => {
          if (response.status === '500') {
            this.toastr.error('Error', 'Something went wrong');
          } else {
            this.toastr.success('Operation Complete', 'Documents successfully deleted');
            this.fetchDataForTable();
          }
        },
        error => {
          console.log(error);
          this.toastr.error(
            'Error',
            'Something went wrong(Cannot delete list of documents)'
          );
        }
      );
    }
  }

  onLimitChange (value) {
    this.pageTable.limit = value;
    this.pageTable.offset = 0;
  }

  submitContract () {
    let objectData = {
      type: CONTRACT_SUBMIT,
      data: {
        status: ACTIVE
      }
    };

    let urlParams = {
      contractId: `${this.contractService.contractId}`
    };
    this.contractService.updateContract(objectData, urlParams).subscribe(
      (response: any) => {
        this.contractService.contractId = response._id;
        this.contractService.contractData = response;
        this.toastr.success(
          'Operation Complete',
          'Contract successfully updated'
        );
        let base = SessionService.get('base-role');
        this.router.navigate([base + '/contract-list']).then(nav => {
          console.log(nav);
        }, err => {
          console.log(err);
        });
      },
      error => {
        console.log(error);
        this.toastr.error(
          'Error',
          'Something went wrong(Cannot update contract)'
        );
      }
    );
  }

  cancel (): void {
    let base = SessionService.get('base-role');
    this.router.navigate([base + '/dashboard/events-and-reminders']).then(nav => {
      console.log(nav);
    }, err => {
      console.log(err);
    });
  }

  getUploadedDocument (idDocumentEfaReference: string, documentName: string, isView: boolean, fileType: string): void {
    if (!idDocumentEfaReference) {
      this.toastr.warning('Document','Document is not stored!');
    } else {
      let queryParams = new HttpParams()
                .set('documentEfaReferenceId', `${idDocumentEfaReference}`)
                .set('documentName', `${documentName}`)
                .set('isView', `${isView}`)
                .set('fileType', `${fileType}`);
      this.documentService.getUploadedDocument(queryParams, 'blob').subscribe((response: any) => {
        if (response.status === 200) {
          if (isView) {
            this.viewFileBlob(response.body, documentName, fileType);
          } else {
            this.downloadFileBlob(response.body, documentName);
          }
        } else {
          this.toastr.error(`Problem with downloading file ${response.error}`);
        }
      }, error => {
        this.toastr.error(`Problem with downloading file ${error}`);
      });
    }
  }

  downloadFileBlob (blob, fileName) {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.append(link);
    link.click();
    link.remove();
    window.addEventListener('focus', e => URL.revokeObjectURL(link.href), { once: true });
  }

  viewFileBlob (fileBlob, documentName, fileType) {
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      let blob = new Blob([fileBlob], { type: fileType });
      window.navigator.msSaveOrOpenBlob(blob, documentName);
    } else {// other browsers
      const file = new File([fileBlob], documentName, { type: fileType });
      const currentUrl = window.location.href;
      const newWindow = window.open(`${currentUrl.substr(0, currentUrl.lastIndexOf('/'))}/loading`);
      newWindow.onload = () => {
        newWindow.location.assign(URL.createObjectURL(file));
      };
    }
  }

  getUploadedDocumentsZip (): void {
    if (this.rowsTable.filter(row => row.checked === true).length === 0) {
      alert('Please select at least one row!');
    } else {
      let arrayDocumentEfaReferenceIds = [];
      let arrayDocumentNames = [];
      for (const row of this.rowsTable.filter(row => row.checked === true)) {
        arrayDocumentEfaReferenceIds.push(row.id_document_efa_reference);
        arrayDocumentNames.push(row.name_document_efa);
      }
      let queryParams = new HttpParams()
      .set('documentEfaReferenceIds', `${arrayDocumentEfaReferenceIds}`)
      .set('documentNames', `${arrayDocumentNames}`);
      this.documentService.getUploadedDocumentInZip(queryParams, 'blob').subscribe((response: any) => {
        if (response.status === 200) {
          this.downloadFileBlob(response.body, 'downloadCM');
        } else {
          this.toastr.error(`Problem with downloading file ${response.error}`);
        }
      }, error => {
        this.toastr.error(`Problem with downloading file ${error}`);
      });
    }
  }
}
