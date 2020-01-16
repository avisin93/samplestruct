import { Component, OnInit, Inject, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators, Form, AbstractControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { DocumentService } from 'src/app/modules/contracts/document/document.service';

@Component({
  selector: 'app-update-comment-dialog',
  templateUrl: './update-comment-dialog.component.html',
  styleUrls: ['./update-comment-dialog.component.scss']
})
export class UpdateCommentDialogComponent implements OnInit {

  formGroup: FormGroup;
  onCreateComment = new EventEmitter<any>();
  titleText: String;
  showDeleteButton: Boolean;
  acknowledgmentMessageAction: String;

  constructor (
    public dialogRef: MatDialogRef<UpdateCommentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastr: ToastrService,
    private documentService: DocumentService
  ) { }

  ngOnInit () {
    this.formGroup = new FormGroup({
      text: new FormControl(this.data.row.comment, [Validators.required, Validators.maxLength(250)])
    });
    this.titleText = this.data.row.comment ? 'Edit Comment' : 'Add Comment';
    this.acknowledgmentMessageAction = this.data.row.comment ? 'updated' : 'added';
    this.showDeleteButton = this.data.row.comment;
  }

  saveDocumentComment () {
    if (!this.validate()) {
      return;
    }
    const documentId = (this.data.row._id) ? this.data.row._id : this.data.row.document_id;
    this.documentService.updateDocumentComment({ comment: this.text.value }, documentId)
    .subscribe((response: any) => {
      this.toastr.success('Operation Complete', `Successfully ${this.acknowledgmentMessageAction} comment.`);
      this.onCreateComment.emit();
    }, (error) => {
      this.toastr.error('Something went wrong');
      console.log('ERROR: ',error);
    });
    this.dialogRef.close();
  }

  deleteComment () {
    const documentId = (this.data.row._id) ? this.data.row._id : this.data.row.document_id;
    this.documentService.deleteDocumentComment(documentId)
    .subscribe((response: any) => {
      this.toastr.success('Operation Complete', 'Successfully deleted comment.');
      this.onCreateComment.emit();
    }, (error) => {
      this.toastr.error('Something went wrong');
      console.log('ERROR: ',error);
    });
    this.dialogRef.close();
  }

  validate (): boolean {
    let validate = true;
    Object.keys(this.formGroup.controls).forEach(key => {
      this.formGroup.get(key).markAsTouched();
      if (this.formGroup.get(key).invalid) {
        validate = false;
      }
    });
    return validate;
  }

  // GETTER
  get text (): AbstractControl {
    return this.formGroup.get('text');
  }

}
