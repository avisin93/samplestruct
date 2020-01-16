import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatDialogRef } from '@angular/material';
import { FileUploadController } from '../../../controllers/file-uploader.controller';
import { HttpService } from '../../../providers/http.service';

@Component({
  selector: 'app-dynamic-content',
  templateUrl: './dynamic-content.component.html',
  styleUrls: ['./dynamic-content.component.scss']
})
export class DynamicContentComponent implements OnInit {
  selectedContent;
  dynamicContent;
  tableExampleTemplate = '<table border="1" class="template-table">'
      + '<thead>'
      + '<tr>'
      + '<th style="text-align:Center;color:gray">Document Type</th>'
      + '<th style="text-align:Center;color:gray">Sender Name</th>'
      + '<th style="text-align:Center;color:gray">Date</th>'
      + '</tr>'
      + '</thead>'
      + '<tbody>'
      + '<tr>'
      + '<td>At TU-Verse</td>'
      + '<td>LEGAL SUBPOPENA</td>'
      + '<td>04/06/2018 01:17 PM</td>'
      + ' </tr>'
      + '</tbody>';

  constructor (
    private http: HttpClient,public _fb: FormBuilder,
    public _dialogRef: MatDialogRef<DynamicContentComponent>,
    public fileUploadCtrl: FileUploadController,
    private httpService: HttpService
  ) {}

  ngOnInit () {
      // this.dynamicContent=[{key:'From',value:"$senderName$",example:'Mahadeo Kale'},{key:'To',value:"$userFullName$",example:'Suresh Adling'},{key:'Table',value:"$table",example:this.tableExampleTemplate}];
  }
  closePopup () {
    this._dialogRef.close();
  }
  onContentSelect (content) {
    this.selectedContent = content;
    this._dialogRef.close('save');
  }
}
