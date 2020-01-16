import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgDataTablesComponent } from '../shared/modules/ng-data-tables/ng-data-tables.component';
import { SweetAlertController } from '../shared/controllers/sweet-alert.controller';
import { LexiconService } from './lexicon.service';
import { LoaderService } from '../shared/components/loader/loader.service';
import { Lexicon } from './lexicon';
import { MatDialog } from '@angular/material';
import { AddEditLexiconComponent } from './add-edit-lexicon/add-edit-lexicon.component';
import { UploadLexiconListComponent } from './add-edit-lexicon/upload-lexicon-list.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-lexicon',
  templateUrl: './lexicon.component.html',
  providers: [LexiconService],
  styleUrls: ['./lexicon.component.scss']
})

export class LexiconComponent implements OnInit {
  lexicons: Lexicon[];
  errorMessage: any;
  displayStatus: boolean = false;
  showDeactivateButton: boolean = true;
  deactivateStatus: boolean = false;
  showCheckbox: boolean = false;

  @ViewChild(NgDataTablesComponent)
    private dataTableComp: NgDataTablesComponent;

  columns: Array<any> = [
        { title: 'SENTIMENT', key: 'lexicon', sortable: true, filter: true, link: false },
        { title: 'TRANSLATED SENTIMENT', key: 'tslexicon', sortable: true, filter: true, link: false },
        { title: 'WEIGHT', key: 'weight', sortable: true, filter: true, link: false }
  ];

  records: Array<any> = [];
  selectedEntities: any[];
  status: any[];
  totalRows: number = 0;
  searchBox: boolean = true;
  hasActionButtons: boolean = true;
  breadcrumbs: Array<any> = [
        { text: 'Home', base: true, link: '/home', active: false },
        { text: 'Lexicon', base: false, link: '', active: true } ];
  dialogOptions: any = { width: '450px' };

  constructor (
      public dialog: MatDialog,
      private _router: Router,
      private loaderService: LoaderService,
      private route: ActivatedRoute,
      private lexiconService: LexiconService,
      public toaster: ToastrService) { }

  ngOnInit () {
    this.loaderService.show();
    this.getLexiconList();
  }

  checkBoxSelectionChange (data: any) {
    this.selectedEntities = data;
  }

  getLexiconList () {
    this.loaderService.show();
    this.lexiconService.getLexicons().subscribe(lexicons => {
      this.records = lexicons;
      this.dataTableComp.setPage(1);
      this.totalRows = this.records.length;
      if (this.totalRows > 0) {
        this.showCheckbox = true;
      } else {
        this.showCheckbox = false;

      }
      this.loaderService.hide();
    }, () => {
      this.dataTableComp.setPage(1);
      this.loaderService.hide();
      this.toaster.error('Something went wrong');

    });
    this.loaderService.hide();
  }

  gotoLink (data: any) {
    this._router.navigate(['edit/' + data.row._id], { relativeTo: this.route });

  }

  saveLexicon (lexicon: Lexicon) {
    this.lexiconService.saveLexicon(lexicon).subscribe(
      lexicons => this.lexicons = lexicons,
      error => this.errorMessage = error as any
    );
  }

  addOrUpdateLexicon (lexicon: Lexicon) {
    this.lexiconService.addOrUpdateLexicon(lexicon).subscribe(
      lexicons => this.lexicons = lexicons,
      error => this.errorMessage = error as any
    );
  }
  showLaxicon () {
    this.lexiconService.getLexicons().subscribe(
      lexicons => this.lexicons = lexicons,
      error => this.errorMessage = error as any
    );
  }

  addSentimentPopup () {
    let addUserDialogRef = this.dialog.open(AddEditLexiconComponent, this.dialogOptions);
    addUserDialogRef.afterClosed().subscribe((result) => {
      this.loaderService.show();
      this.getLexiconList();
    });
  }

  uploadSentiment () {
    let uploadLexiconDialog = this.dialog.open(UploadLexiconListComponent, this.dialogOptions);
    uploadLexiconDialog.componentInstance.mode = 'Add';
    uploadLexiconDialog.afterClosed().subscribe(
      result => {
        this.getLexiconList();
      }
    );
  }

  editLexiconPopup (data: any) {
    let editUserDialogRef = this.dialog.open(AddEditLexiconComponent, this.dialogOptions);
    editUserDialogRef.componentInstance.heading = 'Edit Sentiments';
    editUserDialogRef.componentInstance.setEditFormValues(data);

    editUserDialogRef.afterClosed().subscribe(result => {
      this.getLexiconList();
    });

  }

  deleteLexicon (data: any) {
    let txtMsg = 'Do you want to delete the ' + data.lexicon + ' ?';
    this.showConfirmationMsg(txtMsg, () => {
      this.loaderService.show();
      this.lexiconService.deleteLexicon(data) .subscribe(lexicons => {
        this.getLexiconList();
        this.toaster.success('Lexicon successfully removed');
      }, (error) => {
        this.errorMessage = error as any,
        this.toaster.error('Something went wrong');
      }, () => {
        this.loaderService.hide();
      });
    }, () => {});
  }

  activateDeactivateLexicon (data: any) {
    let txtMsg = '';
    if (!(data.active)) {
      txtMsg = 'Do you want to deactivate the ' + data.lexicon + ' ?';
    } else {
      txtMsg = 'Do you want to activate the ' + data.lexicon + ' ?';
    }

    this.showConfirmationMsg(txtMsg,() => {
      this.loaderService.show();
      this.lexiconService.activateDeactivateLexicon(data) .subscribe(lexicons => {
        this.loaderService.show();
        this.getLexiconList();
        this.toaster.success('Lexicon successfully updated');
      }, (error) => {
        this.errorMessage = error as any,
                this.loaderService.hide();
        this.toaster.error('Something went wrong');
      }, () => {
        this.loaderService.hide();
      });
    }, () => {
      data.active = !(data.active);
    });
  }

  showConfirmationMsg (textMsg,callbackfn,noCallbackfn) {
    let confimMsg = new SweetAlertController();
    let options = {
      title: 'Confirm Message',
      text: textMsg,
      type: 'warning',
      width: '370px',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    };
    confimMsg.deleteConfirm(options,callbackfn,noCallbackfn);
  }
}
