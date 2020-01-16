import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export interface DialogData {
  message: string;
  heading: string;
  yes: string;
  no: string;
  fontSize: string;
}

@Component({
  selector: 'app-pop-up',
  templateUrl: './pop-up.component.html',
  styleUrls: ['./pop-up.component.scss']
})
export class PopUpComponent {

  constructor (
    public dialogRef: MatDialogRef<PopUpComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }

  onNoClick (): void {
    this.dialogRef.close();

  }

  setFontSize (): any {
    return { 'font-size': this.data.fontSize ? this.data.fontSize : '20px' };
  }
}
