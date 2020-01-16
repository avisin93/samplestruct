import { Component, OnInit, Input, SimpleChanges, OnChanges, SimpleChange, ChangeDetectorRef, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { MAT_TOOLTIP_DEFAULT_OPTIONS, MatDialog } from '@angular/material';
import { customTooltipDefaults } from 'src/app/models/constants';
import { environment } from '../../../../../environments/environment';
import { SelectionModel } from '@angular/cdk/collections';
import { ToastrService } from 'ngx-toastr';
import { HttpParams } from '@angular/common/http';
import { DocSearchService } from '../../doc-search.service';
import { UpdateCommentDialogComponent } from '../dialog-components/update-comment-dialog/update-comment-dialog.component';

/* Height of row in rems - important for treeview */
const ROW_HEIGHT = 4;

/* Height of row content in rems - important for treeview */
const CONTENT_ROW_HEIGHT = 2;

/* Width of row content in rems - important for treeview */
const CONTENT_ROW_WIDTH = 6;

@Component({
  selector: 'cm-graph-view',
  templateUrl: './graph-view.component.html',
  styleUrls: ['./graph-view.component.scss'],
  providers: [
    { provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: customTooltipDefaults }
  ]
})
export class GraphViewComponent implements OnChanges, OnInit {
  @ViewChild('scrollable', { read: ElementRef }) public panel: ElementRef<any>;

  @Input() dataInput = [];
  @Input()
  set _dataInput (dataInput: Array<Object>) {
    this.dataInput = dataInput;
    this.data = [];
    if (dataInput.length > 0) {
      let rootDocuments = _.filter(this.dataInput, (o) => {
        return !o.parent || !_.find(this.dataInput, { document_id: o.parent });
      });
      rootDocuments.map((rd) => {
        this.data.push(rd);
        this.pushAllChildren(rd.document_id);
      });
      this.data.map(d => {
        delete d.height;
        delete d.marginLeft;
        delete d.initStyle;
      });
    }
  }

  filter;
  @Input() _filter;
  data = [];
  documentId;
  @Output() commentCreated = new EventEmitter<any>();

  constructor (
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private docSearchService: DocSearchService,
    private dialogMatDialog: MatDialog
  ) {
    this.route.queryParams.subscribe(params => {
      this.documentId = params['id'];
    });
  }

  ngOnChanges (changes: SimpleChanges) {
    const filter: SimpleChange = changes._filter;
  }

  ngOnInit () {
    if (this.dataInput.length > 0) {
      this.data = [];
      let rootDocuments = _.filter(this.dataInput, (o) => {
        return !o.parent || !_.find(this.dataInput, { parent: o.parent });
      });
      rootDocuments.map((rd) => {
        this.data.push(rd);
        this.pushAllChildren(rd.document_id);
      });
    }
  }

  public onPreviousSearchPosition (): void {
    this.panel.nativeElement.scrollTop -= 42;
  }

  public onNextSearchPosition (): void {
    this.panel.nativeElement.scrollTop += 42;
  }

  pushAllChildren (parentId) {
    let children = _.filter(this.dataInput, { parent: parentId });
    if (children && children.length > 0) {
      children = _.sortBy(children, ['start_date']);
      children.map((child) => {
        this.data.push(child);
        this.pushAllChildren(child.document_id);
      });
    }
  }

  calculateStyle (index, parentId, tail) {
    let marginLeft = 0;
    let parent = _.find(this.data, { 'document_id': parentId });
    let parentIndex = _.findIndex(this.data, { 'document_id': parentId });
    if (!tail) {
      if (parent && this.data[index].initStyle !== true) {
        marginLeft = CONTENT_ROW_WIDTH + (parent.marginLeft ? parent.marginLeft : 0);
        this.data[index].marginLeft = marginLeft;
        this.data[index].initStyle = true;
      }

      return { 'margin-left.rem': this.data[index].marginLeft };
    } else {
      this.data[index].height = (index - parentIndex) * ROW_HEIGHT - CONTENT_ROW_HEIGHT / 2;

      return { 'height.rem': this.data[index].height };
    }
  }

  hasFilteredParent (parent) {
    let hasParent = _.find(this.data, { 'document_id': parent }) ? true : false;

    return hasParent;
  }

  selection = new SelectionModel<any>(true, []);
  isAllSelected () {
    const numSelected = this.selection.selected.length;
    const numRows = this.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle () {
    this.isAllSelected() ? this.selection.clear() : this.data.forEach(row => this.selection.select(row));
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
      this.docSearchService.getUploadedDocument(queryParams, 'blob').subscribe((response: any) => {
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
    if (this.selection.selected.length === 0) {
      alert('Please select at least one row!');
    } else {
      let arrayDocumentEfaReferenceIds = [];
      let arrayDocumentNames = [];
      for (const row of this.selection.selected) {
        arrayDocumentEfaReferenceIds.push(row.id_document_efa_reference);
        arrayDocumentNames.push(row.name_document_efa);
      }
      let queryParams = new HttpParams()
      .set('documentEfaReferenceIds', `${arrayDocumentEfaReferenceIds}`)
      .set('documentNames', `${arrayDocumentNames}`);
      this.docSearchService.getUploadedDocumentInZip(queryParams, 'blob').subscribe((response: any) => {
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

  updateComment (row, titleText): void {
    const dialogRef = this.dialogMatDialog.open(UpdateCommentDialogComponent, {
      width: '475px',
      height: 'auto',
      data: {
        row,
        titleText
      }
    });
    dialogRef.componentInstance.onCreateComment.subscribe((res) => {
      this.commentCreated.emit();
    });
  }
}
