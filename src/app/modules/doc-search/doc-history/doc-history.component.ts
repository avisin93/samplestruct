import { Component, OnInit, ViewChild, TemplateRef, Input } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS, MatDatepicker } from '@angular/material';
import * as _ from 'lodash';
import * as moment from 'moment';
import { DocSearchService } from '../doc-search.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { distinctUntilChanged } from 'rxjs/internal/operators/distinctUntilChanged';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL'
  },
  display: {
    dateInput: 'MM/DD/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM Do YYYY'
  }
};

@Component({
  selector: 'cm-doc-history',
  templateUrl: './doc-history.component.html',
  styleUrls: ['./doc-history.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class DocHistoryComponent implements OnInit {

  @ViewChild(DatatableComponent) datatable: DatatableComponent;
  @ViewChild('sortableHeaderTemplate') sortableHeaderTemplate: TemplateRef<any>;
  @ViewChild('dateColumn') dateColumn: TemplateRef<any>;
  @ViewChild('checkboxHeaderTemplate') checkboxHeaderTemplate: TemplateRef<any>;
  @ViewChild('checkboxColumnTemplate') checkboxColumnTemplate: TemplateRef<any>;
  @ViewChild('actionRowTemplate') actionRowTemplate: TemplateRef<any>;
  arrayStatus: any[];
  customFilter: boolean = false;
  searchTextGlobal = new FormControl();
  statusFilter;
  filter = {};
  allData = [];
  data = [];
  rootDocumentId;
  currentDocumentId;
  minEndDate;
  maxStartDate;
  businessPartner;
  @ViewChild('startDatePicker') startDatePicker: MatDatepicker<any>;
  @ViewChild('endDatePicker') endDatePicker: MatDatepicker<any>;

  currentView = 'primary';

  breadcrumbs: Array<any> = [
    {
      text: 'Doc Search',
      base: true,
      link: '/doc-search',
      active: false
    },
    {
      text: 'Doc History',
      base: true,
      active: true
    }
  ];

  constructor (
    private route: ActivatedRoute,
    private docSearchService: DocSearchService,
    private toastr: ToastrService
  ) {
    this.route.queryParams.subscribe(params => {
      this.rootDocumentId = params['rootId'];
      this.currentDocumentId = params['id'];
    });
  }

  ngOnInit () {
    let params = new HttpParams().set('documentId', `${this.rootDocumentId}`);
    this.docSearchService.getChildrenFromRootDocument(params).subscribe((res: any) => {
      this.allData = res;
      this.data = res;
      this.businessPartner = _.find(res, ['document_id', this.rootDocumentId]).business_partner;
    });

    this.docSearchService.getAllStatus().subscribe((res: any) => {
      this.arrayStatus = res;
      this.arrayStatus.push({
        code: 'CUSTOM',
        name: 'Custom Filter'
      });
    }, error => {
      console.log(error);
      this.toastr.error(
        'Error',
        'Something went wrong(Cannot fetch list of statuses)'
      );
    });

    this.searchTextGlobal.valueChanges
    .pipe(debounceTime(1000), distinctUntilChanged())
    .subscribe((value) => {
      this.globalCustomFilterSearch(value);
    });
  }

  startDateChange (event) {
    if (event.value) {
      this.filter['startDate'] = Date.UTC(event.value._i.year, event.value._i.month, event.value._i.date);
      if (this.customFilter) {
        this.globalCustomFilterSearch(this.searchTextGlobal.value);
      } else {
        this.filterChanged();
      }
      this.minEndDate = moment(event.value).add(1, 'd');
    }
  }

  endDateChange (event) {
    if (event.value) {
      this.filter['endDate'] = Date.UTC(event.value._i.year, event.value._i.month, event.value._i.date);
      if (this.customFilter) {
        this.globalCustomFilterSearch(this.searchTextGlobal.value);
      } else {
        this.filterChanged();
      }
      this.maxStartDate = moment(event.value).subtract(1, 'd');
    }
  }

  selectedStatus (value) {
    this.statusFilter = value;
    if (value === 'CUSTOM') {
      this.customFilter = true;
      delete this.filter['status'];
    } else {
      this.filter['status'] = value;
      this.filterChanged();
    }
  }

  globalCustomFilterSearch (value) {
    if (this.customFilter) {
      this.data = this.allData;
      const searchValue = value.toLowerCase();
      this.data = _.filter(this.data,
        (o) => {
          return (
          (o.start_date && new Date(o.start_date).getFullYear().toString().includes(searchValue))
          ||
          (o.type_of_doc && o.type_of_doc.toLowerCase().includes(searchValue))
          ||
          (o.comment && o.comment.toLowerCase().includes(searchValue))
          ||
          (o.status && o.status.toLowerCase().includes(searchValue))
          );
        }
      );
      if (this.filter['startDate']) {
        this.data = _.filter(this.data, (o) => { return new Date(o.start_date) >= new Date(this.filter['startDate']); });
      }

      if (this.filter['endDate']) {
        this.data = _.filter(this.data, (o) => { return new Date(o.start_date) <= new Date(this.filter['endDate']); });
      }
    }
  }

  filterChanged () {
    this.data = this.allData;
    if (this.filter['startDate']) {
      this.data = _.filter(this.data, (o) => { return o.start_date && new Date(o.start_date) >= new Date(this.filter['startDate']); });
    }

    if (this.filter['endDate']) {
      this.data = _.filter(this.data, (o) => { return o.start_date && new Date(o.start_date) <= new Date(this.filter['endDate']); });
    }

    if (this.filter['status']) {
      this.data = _.filter(this.data, (o) => { return o.status && o.status.replace(/ /g, '').toUpperCase() === this.filter['status']; });
    }
  }

  changeView (newView) {
    this.currentView = newView;
  }

  resetTimePeriod () {
    delete this.filter['startDate'];
    delete this.filter['endDate'];
    delete this.filter['status'];
    this.minEndDate = null;
    this.maxStartDate = null;
    this.customFilter = false;
    this.statusFilter = '';
    this.searchTextGlobal.setValue('');
    this.filterChanged();
    this.startDatePicker.select(null);
    this.endDatePicker.select(null);
  }

  commentCreated () {
    this.ngOnInit();
  }
}
