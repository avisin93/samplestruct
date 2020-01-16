import { Component, OnInit, OnChanges,AfterViewChecked, OnDestroy, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import * as pagination from './pagination';

declare var $;

@Component({
  selector: 'ng-pagination',
  templateUrl: './ng-pagination.component.html',
  styleUrls: ['./ng-pagination.component.scss']
})
export class NgPaginationComponent implements OnInit, OnChanges,AfterViewChecked, OnDestroy {

  pagination: any = pagination;

  @ViewChild('paginationel') paginationEl: ElementRef;

  @Input() isAjax: boolean = false;

  @Input() totalRows: number = 1;

  @Input() perPage: number = 10;

  @Output('paginateRecords') paginateEvent = new EventEmitter();

  constructor () {

  }
  ngAfterViewChecked () {
    let prevEle = this.paginationEl.nativeElement.querySelector('.prev');
    let nextEle = this.paginationEl.nativeElement.querySelector('.next');
    // this.translateService.use(StorageService.get(StorageService.langPref));
    // prevEle.innerHTML = this.translateService.instant(prevEle.innerHTML);
    // nextEle.innerHTML = this.translateService.instant(nextEle.innerHTML);
  }
  ngOnInit () {
    $(this.paginationEl.nativeElement).pagination({
      items: this.totalRows,
      itemsOnPage: this.perPage,
      cssStyle: 'compact-theme',
      ellipsePageSet: false,
      selectOnClick: false,
      onPageClick: (pageNumber, event) => {
        $(this.paginationEl.nativeElement).pagination('drawPage', pageNumber);
        this.paginateEvent.emit(pageNumber);
        return false;
      }
    });
  }

  ngOnChanges (changes: any) {
    if (changes && typeof changes.perPage !== 'undefined' && changes.perPage.isFirstChange() === false) {
      $(this.paginationEl.nativeElement).pagination('updateItemsOnPage', changes.perPage.currentValue);
    }
    if (changes && typeof changes.totalRows !== 'undefined' && changes.totalRows.isFirstChange() === false) {
      $(this.paginationEl.nativeElement).pagination('updateItems', this.totalRows);
    }
  }

  setPage (pageNumber: number = 1) {
    $(this.paginationEl.nativeElement).pagination('drawPage', pageNumber);

  }

  ngOnDestroy () {
    $(this.paginationEl.nativeElement).pagination('destroy');
  }

}
