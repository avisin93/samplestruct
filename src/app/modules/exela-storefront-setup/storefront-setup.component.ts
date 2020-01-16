import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from '../shared/providers/http.service';
import { UrlDetails } from '../../models/url/url-details.model';
import { SweetAlertController } from '../shared/controllers/sweet-alert.controller';
import { LoaderService } from '../shared/components/loader/loader.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-storefront-setup',
  templateUrl: './storefront-setup.component.html',
  styleUrls: ['./storefront-setup.component.scss']
})

export class StoreFrontSetupComponent implements OnInit {

  breadcrumbs: Array<any> = [
    {
      text: 'Home',
      base: true,
      link: '/home',
      active: false
    },
    {
      text: 'Site Design Setup',
      base: false,
      link: '',
      active: true
    }
  ];

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
  selectedTheme: string = '';
  constructor (private _router: Router,
    private route: ActivatedRoute,
    private httpService: HttpService,
    private loaderService: LoaderService,
    private _toastCtr: ToastrService) {

  }

  ngOnInit () {
    this.getAllThemes();
  }
  getAllThemes () {
    this.loaderService.show();
    this.httpService.getAll(UrlDetails.$getAllThemesUrl + '?' + Date.now()).subscribe((data: any) => {
      this.themes.push(...data);
      this.refresh = true;
      this.loaderService.hide();
    }, (error) => {
      this.loaderService.hide();
      console.log(error);
    });
  }
  editTheme (theme) {
    this._router.navigate(['edit/' + theme['id']], { relativeTo: this.route });
  }

  deleteTheme (theme: any) {
    let deleteThemeAlert = new SweetAlertController();
    deleteThemeAlert.deleteConfirm({},() => {
      theme.active = false;
      this.httpService.update(UrlDetails.$updateThemeUrl + theme.id, theme)
            .subscribe(Response => {
              this._toastCtr.success('Theme Deleted');
              this.getAllThemes();
              this.themes = [];
            },
            () => {
              this._toastCtr.error('Something went Wrong');
            });
    });
  }

}
