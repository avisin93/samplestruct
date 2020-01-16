import {
  Component,
  OnInit,
  Input,
  TemplateRef,
  ViewChild,
  HostListener
} from '@angular/core';
import { RecentActivitiesService } from './recent-activities.service';
import { HashMap } from '@nebtex/hashmaps';
import { HttpParams } from '@angular/common/http';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

interface RecentActivityData {
  user: string;
  activity: string;
  date: string;
}

class DateOnlyPipe extends DatePipe {
  public transform (value): any {
    return super.transform(value, 'dd/MM/y');
  }
}

@Component({
  selector: 'cm-recent-activities',
  templateUrl: './recent-activities.component.html',
  styleUrls: ['./recent-activities.component.scss']
})
export class RecentActivitiesComponent implements OnInit {
  @ViewChild(DatatableComponent) datatable: DatatableComponent;
  @ViewChild('sortableHeaderTemplateInput') sortableHeaderTemplateInput: TemplateRef<any>;
  @ViewChild('textColumnTemplate') textColumnTemplate: TemplateRef<any>;
  @ViewChild('dateFormatTemplate') dateFormatTemplate: TemplateRef<any>;
  @ViewChild('firstColumnTemplate') firstColumnTemplate: TemplateRef<any>;
  @Input() displayedColumnsRecentAct;
  @Input() dataSourceRecentAct;

  isLoading = true;
  slideIn: boolean = false;

  arrayCategories = [];
  arraySubCategories = [];
  arrayStatus = [];

  currentScreenSize;
  columnsTable = [];
  columnsTableForMobile = [];
  customizeColumns = [];

  selectedRowsTable = [];
  tempRowsTable = [];
  rowsTable = [];

  transform (value: string): string {
    return value.replace('_', ' ');
  }

  recentActivityData: RecentActivityData;
  myMessages = {
    emptyMessage: '<img src="../../../../assets/images/no_data_found.png">',
    totalMessage: 'Displaying item '
  };

  pageTable = {
    limit: 5,
    count: 0,
    offset: 0,
    orderBy: '',
    sortDirection: '',
    hashMapPropNameFilterSearch: new HashMap()
  };

  // public readonly pageLimitOptions = [
  //   { value: 5 },
  //   { value: 10 },
  //   { value: 15 },
  //   { value: 20 },
  //   { value: 25 }
  // ];

  constructor (
    private recentActivitiesService: RecentActivitiesService,
    private toastr: ToastrService
  ) {}

  ngOnInit () {
    this.currentScreenSize = window.innerWidth;
    this.initDataTable();
    if (this.currentScreenSize < 800) {
      this.calculateSize();
    }
    this.pageCallback({ offset: 0 });
  }

  initDataTable () {
    this.columnsTable = [
      {
        name: 'USER',
        prop: 'user',
        customizeName: 'user',
        sortable: true,
        headerTemplate: this.sortableHeaderTemplateInput,
        cellTemplate: this.textColumnTemplate,
        resizeable: false,
        minWidth: 80
      },
      {
        name: 'ACTIVITY',
        prop: 'activity',
        customizeName: 'activity',
        sortable: true,
        headerTemplate: this.sortableHeaderTemplateInput,
        cellTemplate: this.textColumnTemplate,
        resizeable: false,
        minWidth: 300
      },
      {
        name: 'DATE',
        prop: 'date_modified',
        customizeName: 'date',
        pipe: new DateOnlyPipe('en-US'),
        sortable: true,
        headerTemplate: this.sortableHeaderTemplateInput,
        cellTemplate: this.dateFormatTemplate,
        resizeable: false,
        minWidth: 80
      }
    ];
    this.customizeColumns = this.columnsTable;
  }
  pageCallback (pageInfo: {
    count?: number;
    pageSize?: number;
    limit?: number;
    offset?: number;
  }) {
    this.pageTable.offset = pageInfo.offset;
    this.reloadTable();
  }

  sortCallback (sortInfo: {
    sorts: {
      dir: string;
      prop: string;
    }[];
    column: {};
    prevValue: string;
    newValue: string;
  }) {
    this.pageTable.sortDirection = sortInfo.sorts[0].dir;
    this.pageTable.orderBy = sortInfo.sorts[0].prop;
    this.reloadTable();
  }

  reloadTable () {
    this.isLoading = true;

    // Table properites
    let params = new HttpParams()
      .set('orderBy', `${this.pageTable.orderBy}`)
      .set('sortDirection', `${this.pageTable.sortDirection}`)
      .set('pageNumber', `${this.pageTable.offset + 1}`)
      .set('pageSize', `${this.pageTable.limit}`);

    // Filter part
    this.pageTable.hashMapPropNameFilterSearch.forEach((value, key) => {
      params = params.append(`${key}`, `${value}`);
    });

    this.recentActivitiesService.getRecentActivities().subscribe(
      (data: any) => {
        this.pageTable.count = data;
        this.isLoading = false;
        this.selectedRowsTable = [];
        this.rowsTable = data;
        this.rowsTable.forEach(row => {
          if (row.change_type === 'CREATE') {
            if (row.contract_id && row.contract_id.business_partner) {
              row.activity = 'Added new contract for ' + row.contract_id.business_partner.name;
            } else {
              row.activity =
                'Added new contract for undefined Business Partner';
            }
          } else if (row.change_type === 'EDIT') {
            // TODO: Sasa
            let lower = row.changed_tab ? this.transform(row.changed_tab.toLowerCase()) : '';
            if (row.contract_id && row.contract_id.business_partner) {
              row.activity =
                lower.charAt(0).toUpperCase() +
                lower.slice(1) +
                ' update for ' +
                row.contract_id.business_partner.name;
            } else {
              row.activity =
                lower.charAt(0).toUpperCase() +
                lower.slice(1) +
                ' update for ' +
                'undefined Business Partner';
            }
          } else if (row.change_type === 'DELETE') {
            if (row.contract_id && row.contract_id.business_partner) {
              row.activity = 'Deleted contract for ' + row.contract_id.business_partner.name;
            } else {
              row.activity = 'Deleted contract for undefined Business Partner';
            }
          } else {
            row.activity = 'No recent changes to display';
          }
        });
      },
      err => {
        console.log(err);
      }
    );
  }

  @HostListener('window:resize', ['$event']) onResize (event) {
    if (this.currentScreenSize !== window.innerWidth) {
      this.currentScreenSize = window.innerWidth;
      this.calculateSize();
    }
  }

  calculateSize () {
    if (this.currentScreenSize < 800) {
      this.columnsTableForMobile = this.columnsTable;
      this.columnsTable = this.columnsTable.filter(column => {
        if (column.name === this.columnsTable[0].name) {
          column.cellTemplate = this.firstColumnTemplate;
          column.sortable = false;
          return column;
        }
      });
    } else {
      this.columnsTable = this.columnsTableForMobile;
    }
  }

  showMore () {
    if (this.datatable.rowCount >= this.pageTable.limit) {
      this.pageTable.limit += 5;
      this.reloadTable();
    } else {
      this.toastr.info('Info', 'No more data to show!');
    }
  }
}
