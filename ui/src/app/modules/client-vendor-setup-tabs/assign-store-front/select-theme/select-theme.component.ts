import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HttpService } from '../../../shared/providers/http.service';
import { UrlDetails } from '../../../../models/url/url-details.model';
import { StorageService } from '../../../shared/providers/storage.service';

@Component({
  selector: 'app-select-theme',
  templateUrl: './select-theme.component.html',
  styleUrls: ['./select-theme.component.scss']
})

export class SelectThemeComponent implements OnInit {

  @Input('form') form: FormGroup;

  @Input('mode') mode: string = '';

  @Input('selectedTheme') selectedTheme: string = '';

  @Output('stepChange') stepChange = new EventEmitter<any>();

  refresh: boolean = false;

  responsive: any = {
    0: { items: 1 },
    600: { items: 2 },
    1000: { items: 3 },
    1200: { items: 4 }
  };

  navText: Array<any> = [
    "<i class='fa fa-chevron-circle-left'></i>",
    "<i class='fa fa-chevron-circle-right'></i>"
  ];

  themes: Array<any> = [];

  themeRequired: boolean = false;

  constructor (private httpService: HttpService) {

  }

  ngOnInit () {
    console.log(this.form);
    this.getAllThemes();
  }

  getAllThemes () {
    this.httpService.getAll(UrlDetails.$getAllThemesUrl).subscribe(response => {
      console.log(response);
      if (response.responseCode === 200) {
        this.themes = response.responseData;
        this.refresh = true;
      }
    }, () => {

    });
  }

  selectTheme (theme: any) {
    this.form.controls['storeFrontTheme'].setValue(theme);
    this.selectedTheme = theme.themeId;
  }

  saveContinue ({ value, valid }: {value: any, valid: boolean}) {
    if (this.selectedTheme === '') {
      this.themeRequired = true;
    } else {
      this.themeRequired = false;
      let data = {
        client: {
           // "id" : "2",
          'id' : StorageService.get(StorageService.organizationId),
          'organizationName' : 'Bank of America'
        },
        theme: value.storeFrontTheme,
        createdby : {
          'userId' : StorageService.get(StorageService.userId),
          'userName' : StorageService.get(StorageService.userName)
        }
      };
      this.httpService.save(UrlDetails.$saveSelectedThemeUrl, data).subscribe(response => {
        console.log(response);
        if (response.responseCode === 200) {
          this.stepChange.emit(2);
        }
      }, () => {

      });
    }
  }

}
