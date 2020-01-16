import { Component, OnInit, Input, ViewChild, TemplateRef } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { FormControl } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'cm-preview-add-contract-meta-model-view-tab-subtab-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class PreviewContractMetaModelViewTabSubtabTableComponent implements OnInit {

  customizeMenuFilter: FormControl = new FormControl();
  customizeMenuSelect: FormControl = new FormControl();
  /** list of columns filtered by search keyword */
  public filteredColumnsMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();
  @ViewChild('multiSelect') multiSelect;

  @ViewChild(DatatableComponent) datatable: DatatableComponent;
  @ViewChild('sortableHeaderTemplate') sortableHeaderTemplate: TemplateRef<any>;
  @ViewChild('actionColumnTemplate') actionColumnTemplate: TemplateRef<any>;

  columnsTable = [];
  rowsTable = [];
  tempRowsTable = [];
  customizeColumns = [];

  pageTable = {
    limit: 10,
    count: 0,
    offset: 0
  };

  public readonly pageLimitOptions = [
    { value: 10 },
    { value: 20 },
    { value: 30 },
    { value: 40 },
    { value: 50 }
  ];

  myMessages = {
    emptyMessage: '<img src="../../../../assets/images/no_data_found.png">',
    totalMessage: 'Displaying item '
  };

  @Input() subtab: any;
  @Input() oneSubtab: Boolean;
  arrayComponents: any[];

  showPanels: any = {
    tablePanel: true,
    addPanel: false
  };

  constructor (
    private toastr: ToastrService
  ) {}

  ngOnInit () {
    this.initDataTable();
  }

  initDataTable (): void {
    this.arrayComponents = this.subtab ? this.subtab['components'].filter(el => {
      return (el.hasOwnProperty('is_deleted') && !el.is_deleted);
    }) : [];
    this.arrayComponents.forEach((element, index) => {
      this.columnsTable.push(
        {
          name: element.name,
          prop: element.database_column_name,
          sortable: true,
          headerTemplate: this.sortableHeaderTemplate,
          cellTemplate: '',
          resizeable: false,
          minWidth: 100,
          isVisibleColumn: index < 5
        }
      );
    });

    this.columnsTable.push(
      {
        name: 'ACTION',
        prop: 'action',
        sortable: false,
        cellTemplate: this.actionColumnTemplate,
        resizeable: false,
        minWidth: 90,
        isVisibleColumn: true
      }
    );

    this.customizeColumns = this.columnsTable;
    this.columnsTable = this.columnsTable.filter(column => {
      return column.isVisibleColumn;
    });

    this.customizeMenuSelect.setValue(this.columnsTable);
    this.filteredColumnsMulti.next(this.customizeColumns.slice());
    // listen for search field value changes
    this.customizeMenuFilter.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterColumns();
      });
  }

  protected filterColumns () {
    if (!this.customizeColumns) {
      return;
    }
    // get the search keyword
    let search = this.customizeMenuFilter.value;
    if (!search) {
      this.filteredColumnsMulti.next(this.customizeColumns.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the columns
    this.filteredColumnsMulti.next(
      this.customizeColumns.filter(col => col.name.toLowerCase().indexOf(search) > -1)
    );
  }

  ngAfterViewInit () {
    this.setInitialValue();
  }

  ngOnDestroy () {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  /**
   * Sets the initial value after the filteredColumns are loaded initially
   */
  protected setInitialValue () {
    this.filteredColumnsMulti
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        // setting the compareWith property to a comparison function
        // triggers initializing the selection according to the initial value of
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredColumns are loaded initially
        // and after the mat-option elements are available
        this.multiSelect.compareWith = (a, b) => a && b && a.name === b.name;
      });
  }

  toggleColumns (col) {
    const isChecked = this.isCheckedToggleColumn(col);
    if (isChecked) {
      this.columnsTable = this.columnsTable.filter(c => {
        return c.name !== col.name;
      });
    } else {
      const newColumns = [...this.columnsTable, col];
      this.columnsTable = [];
      this.customizeColumns.forEach(f => {
        newColumns.forEach(s => {
          if (s.name === f.name) {
            this.columnsTable.push(f);
          }
        });
      });
    }
  }

  isCheckedToggleColumn (col) {
    return this.columnsTable.find(c => {
      return c.prop === col.prop;
    });
  }

  onInputPageChange (value) {
    if (value === '') {
      this.pageTable.offset = 0;
    } else if (isNaN(value)) {
      this.toastr.error(
        'Error',
        'You can only enter numeric'
      );
    } else {
      const numberPages = Math.ceil(this.datatable.rowCount / this.datatable.limit);
      if (numberPages >= value && value > 0) {
        this.pageTable.offset = value - 1;
      } else {
        this.toastr.error(
          'Error',
          'Page that you enter does not exist!'
        );
      }
    }
  }
}
