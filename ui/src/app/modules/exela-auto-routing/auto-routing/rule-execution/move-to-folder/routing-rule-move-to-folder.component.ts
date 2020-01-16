import { Component, OnInit, Input, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material';
import { FileUploadController } from '../../../../shared/controllers/file-uploader.controller';
import { NgDataTablesComponent } from '../../../../shared/modules/ng-data-tables/ng-data-tables.component';
import { HttpService } from '../../../../shared/providers/http.service';
import { PerfectScrollbarComponent, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-routing-rule-move-to-folder',
  templateUrl: './routing-rule-move-to-folder.component.html',
  styleUrls: ['./routing-rule-move-to-folder.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class RoutingRuleMoveToFolderComponent implements OnInit {

  @ViewChild(PerfectScrollbarComponent) componentScroll: PerfectScrollbarComponent;

  @ViewChild(PerfectScrollbarDirective) directiveScroll: PerfectScrollbarDirective;

  @ViewChild(NgDataTablesComponent)
  private dataTableComp: NgDataTablesComponent;

  @Input('heading') heading;

  @Input('saveButtonTitle') saveBtnTitle;

  @Input('folderId') folderId;

  @Input('selectedFolderUsername') selectedFolderUsername;

  @Input('navigatorNodes') navigatorNodes = [];

  @ViewChild('fileCabinetTree') fileCabinetTree;

  @Input('documentData') documentData;

  private selectedTreeNode = null;
  navigatorOptions = {};
  path = [];
  absolutePath: String = '';
  MoveToFolderForm: FormGroup;
  childPath = [];

  constructor (private _router: Router, private _fb: FormBuilder,
    public _dialogRef: MatDialogRef<RoutingRuleMoveToFolderComponent>,
    public httpService: HttpService,
    public _toastCtrl: ToastrService,
    public dialog: MatDialog,
    public fileUploadCtrl: FileUploadController) {
  }

  ngOnInit (): void {
    if (this.folderId !== undefined && this.folderId !== '') {
      this.getNavigatorSummary(this.folderId);
    } else {
      this.getNavigatorSummary(null);
    }
  }

  getNavigatorSummary (nodeId) {
    setTimeout(() => {
      if (this.navigatorNodes.length > 0 && nodeId != null) {
        this.fileCabinetTree.treeModel.getNodeById(0).expand();
        this.fileCabinetTree.treeModel.getNodeById(nodeId).expand();
        this.fileCabinetTree.treeModel.getNodeById(nodeId).setActiveAndVisible();
      }
    }, 200);
  }

  initialize () {
    setTimeout(() => {
      this.fileCabinetTree.treeModel.expandAll();
    }, 200);
  }

  preventDoubleEventTrigger = true;
  navigatorSelectionChange (event) {
    if (this.preventDoubleEventTrigger) {
      this.preventDoubleEventTrigger = false;
      setTimeout(() => {
        this.selectedTreeNode = event.node.data;
        this.preventDoubleEventTrigger = true;
      }, 200);
    }
  }
  moveToFolder () {
    if (this.selectedTreeNode != null) {
      this.folderId = this.selectedTreeNode.id;
      this.selectedFolderUsername = this.selectedTreeNode.userName;
      for (let i = 0;i < this.navigatorNodes.length;i++) {
        this.path = [];
        this.childPath = [];
        this.path.push(this.navigatorNodes[i].name);
        this.extractPath(this.navigatorNodes[i],this.path);
      }

      this._dialogRef.close();
    } else {
      this.selectedTreeNode = null;
      this._toastCtrl.error('Please select folder');
    }
  }

  extractPath (node,path) {
    if (node.children && node.children.length) {
      for (let i = 0; i < node.children.length;i++) {
        if (i > 0) {
          let j = i - 1;
          while (j >= 0) {
            let index = this.childPath.indexOf(node.children[j].name);
            while (index >= 0 && index < this.childPath.length) {
              this.childPath.splice(index);
              index++;
            }
            j--;
          }
        }
        if (node.children[i].id === this.selectedTreeNode.id) {
          this.path.push(node.children[i].name);
          this.absolutePath = this.path[0];
          this.childPath.forEach(element => {
            this.absolutePath = this.absolutePath + '/' + element;
          });
          this.absolutePath = this.absolutePath + '/' + this.path[1];
          break;
        } else if (node.children[i] && node.children[i].children.length) {
          this.childPath.push(node.children[i].name);
          this.extractPath(node.children[i],this.path);
        }
      }
    }
  }

  closePopup () {
    this._dialogRef.close();
  }
}
