import { Component, OnInit, Inject, ViewChild, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { ContractService } from '../contracts.service';
import { ToastrService } from 'ngx-toastr';
import { SessionService } from '../../shared/providers/session.service';
import { Router } from '@angular/router';
import { LoaderService } from '../../shared/components/loader/loader.service';

@Component({
  selector: 'cm-upload-dialog',
  templateUrl: './upload-dialog.component.html',
  styleUrls: ['./upload-dialog.component.scss']
})
export class UploadDialogComponent implements OnInit {

  extractCheckboxChecked: boolean = true;
  public files: NgxFileDropEntry[] = [];
  @ViewChild('extractCheckbox') extractCheckbox: any;
  @Input() spanText: string = 'Upload Document';

  constructor (
    private router: Router,
    public dialogRef: MatDialogRef<UploadDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private contractService: ContractService,
    private toastr: ToastrService,
    private loaderService: LoaderService
  ) {}

  ngOnInit () {
  }

  public dropped (event: NgxFileDropEntry[]): void {
    this.files = event;
    for (const droppedFile of this.files) {
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          // Here you can access the real file
          console.log(droppedFile.relativePath, file);
        });
      } else {
        this.toastr.error('Only pdf, txt, docx, doc file format supported!');
        // It was a directory (empty directories are added, otherwise only files)
        // const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
      }
    }
  }

  public saveDocument (): void {
    // TODO: Sasa - some kind of valdiation we need
    this.loaderService.show();
    for (const droppedFile of this.files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          const formData = new FormData();
          formData.append('uploadFile', file, droppedFile.relativePath);
          formData.append('extractFile', this.extractCheckbox._checked);
          formData.append('fileType', file.type);
          this.contractService.documentUploadContractFile(formData).subscribe((response: any) => {
            if (response.status === '500') {
              this.toastr.error('Error', `Upload - something went wrong : ${response.msg}`);
            } else {
              this.toastr.success('Operation Complete', 'Contract successfully added');
              this.dialogRef.close();
              const base = SessionService.get('base-role');
              this.router.navigate([base + '/contract-list']).then(nav => {
                console.log(nav);
              }, err => {
                console.log(err);
              });
            }
            this.loaderService.hide();
          }, (error) => {
            console.log(error);
            this.toastr.error('Error', `Error: ${error.error}`);
            this.loaderService.hide();
          });
        });
      }
    }
  }

  public cancelUpload (): void {
    this.spanText = 'Upload Document';
    this.files = [];
  }

  public onClickExtractData (event): void {
    event.preventDefault();
    this.extractCheckbox._checked = !this.extractCheckbox._checked;
  }
}
