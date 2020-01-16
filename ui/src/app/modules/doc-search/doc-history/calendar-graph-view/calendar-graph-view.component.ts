import { Component, OnInit, Input, HostListener, ChangeDetectorRef } from '@angular/core';
import * as _ from 'lodash';
import { trigger, state, style, transition, animate } from '@angular/animations';

/** Number of months to display */
const NUM_OF_MONTHS = 12;
/** Number of zears to display */
const NUM_OF_YEARS = 11;
/* Height of row in rems - important for treeview */
const ROW_HEIGHT = 4;
/* Height of cell in precents - important for treeview */
const CELL_WIDTH = 8;
/* Height of up button row in rems - important for treeview */
const UP_BUTTON_HEIGHT = 2;
/* Height of row content in rems - important for treeview */
const CONTENT_ROW_HEIGHT = 2;

/* Width of row content in rems - important for treeview */
const CONTENT_ROW_WIDTH = 6;

@Component({
  selector: 'cm-calendar-graph-view',
  animations: [
    trigger('slideInOut', [
      state('inFocus', style({
        opacity: '1'
      })),
      state('outOfFocus', style({
        opacity: '0.5'
      })),
      transition('inFocus => outOfFocus', animate('400ms ease-in-out')),
      transition('outOfFocus => inFocus', animate('400ms ease-in-out'))])
  ],
  templateUrl: './calendar-graph-view.component.html',
  styleUrls: ['./calendar-graph-view.component.scss']
})
export class CalendarGraphViewComponent implements OnInit {

  @Input()
  set _dataInput (dataInput: Array<Object>) {
    this.mat = [];
    this.years = [];
    for (let i = 0; i < NUM_OF_YEARS; i++) {
      this.mat[i] = [];
      for (let j = 0; j < NUM_OF_MONTHS; j++) {
        this.mat[i][j] = undefined;
      }
    }

    this.data1 = dataInput;
    if (dataInput.length > 0) {
      this.firstYear = new Date(_.min(dataInput, 'start_date').start_date).getFullYear();
    }

    if (isNaN(this.firstYear)) {
      this.firstYear = new Date().getFullYear();
    }

    this.data1.map(d => {
      let startDate = new Date(d.start_date);
      d.year = startDate.getFullYear();
      d.month = startDate.getMonth();

      d._id = d.document_id;

      if (!this.years.includes(d.year)) {
        this.years.push(d.year);
      }

      let numWithSameYearAndMonth = _.filter(this.data1, { year: d.year, month: d.month });
      if (numWithSameYearAndMonth.length > 1) {
        let currentNumWithSameYearAndMonth = this.years.filter(y => y === d.year);
        if (currentNumWithSameYearAndMonth.length < numWithSameYearAndMonth.length) {
          for (let k = currentNumWithSameYearAndMonth.length; k < numWithSameYearAndMonth.length; k++) {
            this.years.push(d.year);
          }
        }
      }

      let rows = this.yearsToDisplay(NUM_OF_YEARS);

      let documentWithSameYearAndMonth = _.filter(this.data1, { 'year': d.year, 'month': d.month });

      if (documentWithSameYearAndMonth.length > 1) {
        documentWithSameYearAndMonth.sort();
        documentWithSameYearAndMonth.map((c, index) => {
          let indexOfParent = _.findIndex(documentWithSameYearAndMonth, { _id: c.parent });

          if (indexOfParent && indexOfParent > index) {
            documentWithSameYearAndMonth[index] = documentWithSameYearAndMonth[indexOfParent];
            documentWithSameYearAndMonth[indexOfParent] = c;
          }
        });

        for (let i = 0; i < documentWithSameYearAndMonth.length; i++) {
          let indexOfDocument = _.findIndex(this.data1, { _id: documentWithSameYearAndMonth[i]._id });

          let distance = d.year - this.firstYear;
          this.data1[indexOfDocument].row = _.findIndex(rows, function (o) { return o.number === distance; }) + i;
        }
      } else {
        let distance = d.year - this.firstYear;
        d.row = _.findIndex(rows, function (o) { return o.number === distance; });
      }

      d.col = d.month;

      if (d.row >= 0 && d.row <= 10) {
        this.mat[d.row][d.col] = d.document_id;
      }

      if (isNaN(this.firstYear)) {
        this.firstYear = new Date().getFullYear();
      }
    });
  }

  @Input() data = [];
  @Input() documentId;
  @Input() filter = {};
  years = [];
  data1 = [];
  mat = [[]];

  pathSelected = false;
  firstYear;
  arrowType = 'down-arrow';
  activeNode;
  activeNodeParent;
  activeNodes = [];
  activeChildNodes = [];

  months = [
    { num: 0, name: 'Jan' },
    { num: 1, name: 'Feb' },
    { num: 2, name: 'Mar' },
    { num: 3, name: 'Apr' },
    { num: 4, name: 'May' },
    { num: 5, name: 'Jun' },
    { num: 6, name: 'Jul' },
    { num: 7, name: 'Aug' },
    { num: 8, name: 'Sep' },
    { num: 9, name: 'Oct' },
    { num: 10, name: 'Nov' },
    { num: 11, name: 'Dec' }
  ];

  constructor (private cdRef: ChangeDetectorRef) {
  }

  ngOnInit () {
  }

  ngAfterViewChecked () {
    this.cdRef.detectChanges();
  }

  calculatePosition (month, id) {
    let numOfRow = _.findIndex(this.mat, obj => obj.includes(id));
    let indexOfDocument = _.findIndex(this.data1, { _id: id });
    this.data1[indexOfDocument].row = numOfRow;

    return {
      'top.rem': UP_BUTTON_HEIGHT + (numOfRow * ROW_HEIGHT) + ((ROW_HEIGHT - CONTENT_ROW_HEIGHT) / 2),
      'left.%': (month + 1) * CELL_WIDTH,
      'transform': 'translateX(-50%)'
    };
  }

  calculateClass (i, doc, isFirst, isLast) {
    let arrow = '';
    let parent = _.find(this.data1, { '_id': doc.parent });
    if (parent && parent.row > doc.row && doc.col > parent.col) {
      if (isLast) {
        if (i['border-right'] !== undefined) {
          arrow = 'up-r';
        } else {
          arrow = 'up-l';
        }
      }
    } else {
      if (isFirst) {
        if (((i['left.%'] < (doc.col + 1) * 8) && i['border-right'] !== undefined)) {
          arrow = 'top-r';
        } else if (
          ((i['left.%'] > (doc.col + 1) * 8) && i['border-left'] !== undefined) ||
          ((i['left.%'] === (doc.col + 1) * 8) && i['border-left'] !== undefined)) {
          arrow = 'top-l';
        } else if (i['left.%'] < (doc.col + 1) * 8) {
          if (i['border-bottom'] && i['border-top']) {
            arrow = 'right-bt';
          } else if (i['border-bottom']) {
            arrow = 'right-b';
          } else if (i['border-top']) {
            arrow = 'right-t';
          }
        } else if (i['left.%'] > (doc.col + 1) * 8 ||
          (i['left.%'] === (doc.col + 1) * 8 && i['border-bottom'] || i['border-top'])) {
          if (i['border-bottom']) {
            arrow = 'left-b';
          } else if (i['border-top']) {
            arrow = 'left-t';
          }
        }
      }
    }
    return arrow;
  }

  countNumOfDivs (doc) {
    // Parent of current document
    let parent = _.find(this.data1, { '_id': doc.parent });

    if (parent && parent.row > doc.row && doc.col > parent.col) {
      let pom = doc;
      doc = parent;
      parent = pom;
    }
    // Array of styles for divs that create path from current document to the parent document
    let stylesOfPathDivs = [];

    // Current row and current column of path
    let currentRow = doc.row;
    let currentColumn = doc.col;

    if (parent) {
      // Check if parent is on right side of document
      let isParentOnRightSide = parent.col > doc.col;
      // Number of parent's children
      let children = _.countBy(this.data1, { 'parent': parent._id });
      // Number of parent's children which is in same row as parent
      let childrenInSameRow = _.countBy(this.data1, { 'parent': parent._id, 'row': parent.row });
      // Check if there is parent's children which is in different row of parent's row
      let childrenInDiffRow = childrenInSameRow ? children.true > childrenInSameRow.true : true;
      // Check if parent has children in same and different rows
      let childrenInSameAndDiffRow = childrenInSameRow && childrenInDiffRow;

      // Row and column of parent document
      let parentRow = parent.row;
      let parentColumn = parent.col;

      // Current document and his parent are in same row
      if (parentRow === currentRow) {
        let styles = {};

        // Get parent's children in same row but in greater column (same year/later month)
        let arrayOfDocInSameRow = _.filter(this.data1, { 'row': parent.row });
        _.remove(arrayOfDocInSameRow, o => { return o.col <= parent.col; });

        // Get the closest child of parent document which is in same row as parent
        let docWithMinMonth = _.minBy(arrayOfDocInSameRow, 'col');

        if (docWithMinMonth && doc.col === docWithMinMonth.col) { // Current document is in same row as parent and it's closer to parent then all other children in same row
          // Div is moved down from top border of tbody, so his top is in the middle of parent
          styles['top.rem'] = (parentRow + 1) * ROW_HEIGHT;
          // Height of div is like height of row - div should have some height but value is not important
          styles['height.rem'] = ROW_HEIGHT / 2;
          // Only top border of div is displayed
          styles['border-top'] = '1px solid #cccccc';
          // Div is moved right, so his beginning in the middle of parent
          styles['left.%'] = (parent.col + 1) * CELL_WIDTH;
          // Width of div is like distance between current document and his parent
          styles['width.%'] = (currentColumn - parentColumn) * CELL_WIDTH;

          stylesOfPathDivs.push(styles);

          this.arrowType = 'right-arrow';
        } else { // Current document is in same row as parent but it isn't closer to parent then all other children in same row
          // Div is moved down from top border of tbody, so his top is little above parent
          styles['top.rem'] = (parentRow + 1) * ROW_HEIGHT - (CONTENT_ROW_HEIGHT / 2 + (ROW_HEIGHT - CONTENT_ROW_HEIGHT) / 4);
          // Height of div is 3/4 of row's height
          styles['height.rem'] = CONTENT_ROW_HEIGHT / 2 + (ROW_HEIGHT - CONTENT_ROW_HEIGHT) / 4;
          // Left, top and right border of div are displayed
          styles['border-top'] = '1px solid #cccccc';
          styles['border-left'] = '1px solid #cccccc';
          styles['border-right'] = '1px solid #cccccc';
          // Div is moved right, so his beginning is in the middle of parent
          styles['left.%'] = (parentColumn + 1) * CELL_WIDTH;
          // Width of div is like distance between current document and his parent
          styles['width.%'] = (currentColumn - parentColumn) * CELL_WIDTH;

          stylesOfPathDivs.push(styles);
          this.arrowType = 'down-arrow';
        }

        return stylesOfPathDivs;
      }

      // Current document and his parent are in same column
      if (parentColumn === currentColumn) {
        let styles = {};

        // Get parent's children in same column but in greater rows (later year/same month)
        let arrayOfDocInSameColumn = _.filter(this.data1, { 'col': parent.col });
        _.remove(arrayOfDocInSameColumn, o => { return o.row <= parent.row; });

        // Get the closest child of parent document which is in same column as parent
        let docWithMinYear = _.minBy(arrayOfDocInSameColumn, 'row');

        // ako je trenutni dokument najblizi roditelju
        if (docWithMinYear && doc.row === docWithMinYear.row) { // Current document is in same column as parent and it's closer to parent then all other children in same column
          // Div is moved down from top border of tbody, so his top is in the middle of parent
          styles['top.rem'] = (parentRow + 1) * ROW_HEIGHT;
          // Height of div is like distance between current document and his parent
          styles['height.rem'] = (currentRow - parentRow) * ROW_HEIGHT;
          // Only left border of div is displayed
          styles['border-left'] = '1px solid #cccccc';
          // Div is moved right, so his beginning is in the middle of parent
          styles['left.%'] = (parent.month + 1) * CELL_WIDTH;
          // Width of div - div should have some width but value is not important
          styles['width.%'] = CELL_WIDTH / 2;

          stylesOfPathDivs.push(styles);
          this.arrowType = 'down-arrow';
        } else { // Current document is in same column as parent and it isn't closer to parent then all other children in same column
          // Div is moved down from top border of tbody, so his top is in the middle of parent
          styles['top.rem'] = (parentRow + 1) * ROW_HEIGHT;
          // Height of div is like distance between current document and his parent
          styles['height.rem'] = (currentRow - parentRow) * ROW_HEIGHT;
          // Top, bottom and left border of div are displayed
          styles['border-top'] = '1px solid #cccccc';
          styles['border-left'] = '1px solid #cccccc';
          styles['border-bottom'] = '1px solid #cccccc';
          // Div is moved right, so his beginning is before parent
          styles['left.%'] = (parentColumn + 1) * CELL_WIDTH - (CELL_WIDTH / 2);
          // Width of div, so his ending is in the middle of parent
          styles['width.%'] = CELL_WIDTH / 2;

          stylesOfPathDivs.push(styles);
          this.arrowType = 'right-arrow';
        }

        return stylesOfPathDivs;
      }

      /**
       * Current document is not in same row or in same column as his parent document!
       */

      /**
       * Number of documents which is in same row as current document.
       * We know that parent document is not in same row as current document.
       * If parent is on right side of current document,
       * we will take all documents which have greater column then column of curent document and lower (or equals) than column of parent document.
       * If parent is on left side of current document,
       * we will take all documents which have lower column then column of curent document and grater (or equals) than column of parent document.
       */
      let docsInSameRow = _.countBy(this.data1, o => {
        return o.row === doc.row &&
        ((!isParentOnRightSide && o.col < doc.col && o.col >= parent.col) ||
        (isParentOnRightSide && o.col > doc.col && o.col <= parent.col));
      });

      // Number of documents in same column as parent document and in row which is greater than row of parent document and lower (or equals) than row of current document.
      let docsInSameColumnAsParent = _.countBy(this.data1, o => {
        return o.col === parent.col && o.row <= doc.row && o.row > parent.row;
      });

      // Number of documents in same column as current document and in row which is greater than row of parent document and lower than row of current document.
      let docsInSameColumn = _.countBy(this.data1, o => {
        return o.col === doc.col && o.row < doc.row && o.row > parent.row;
      });

      if (!docsInSameRow.true && !docsInSameColumnAsParent.true) { // There is no documents in same row as current document and in same column as parent document
        let styles = {};

        // Div is moved down from top border of tbody, so his top is in the middle of parent
        styles['top.rem'] = (parent.row + 1) * ROW_HEIGHT;
        // Height of div is like distance between row of current document and row of his parent
        styles['height.rem'] = (doc.row - parent.row) * ROW_HEIGHT;

        if (isParentOnRightSide) {
          // Div is moved right, so his beginning is in the middle of current document
          styles['left.%'] = (doc.col + 1) * CELL_WIDTH;
          // Width of div is like distance between column of current document and column of his parent
          styles['width.%'] = (parent.col - doc.col) * CELL_WIDTH;
          // Bottom and right border of div are displayed
          styles['border-bottom'] = '1px solid #cccccc';
          styles['border-right'] = '1px solid #cccccc';
          this.arrowType = 'left-arrow';
        } else {
          // Div is moved right, so his beginning is in the middle of parent document
          styles['left.%'] = (parent.col + 1) * CELL_WIDTH;
          // Width of div is like distance between column of current document and column of his parent
          styles['width.%'] = (doc.col - parent.col) * CELL_WIDTH;
          // Bottom and left border of div are displayed
          styles['border-bottom'] = '1px solid #cccccc';
          styles['border-left'] = '1px solid #cccccc';
          this.arrowType = 'right-arrow';
        }

        stylesOfPathDivs.push(styles);

        return stylesOfPathDivs;
      }

      /**
       * if there is no documents in same column as current document,
       * path will go from current document to the parent's row
       * and it will go through whole row until it comes to the parent column.
       * For this implementation we use two divs.
       */

      if (!docsInSameColumn.true) {
        let styleFirstDiv = {};

        // Div is moved down from top border of tbody, so his top is beneath parent
        styleFirstDiv['top.rem'] = (parent.row + 1) * ROW_HEIGHT + (CONTENT_ROW_HEIGHT / 2 + (ROW_HEIGHT - CONTENT_ROW_HEIGHT) / 4);
        // Height of div is like distance between row of current document and row of his parent minus distance between top of current and middle of parent document
        styleFirstDiv['height.rem'] = (doc.row - parent.row) * ROW_HEIGHT - (CONTENT_ROW_HEIGHT / 2 + (ROW_HEIGHT - CONTENT_ROW_HEIGHT) / 4);

        if (isParentOnRightSide) {
          // Div is moved right, so his beginning is in the middle of current document
          styleFirstDiv['left.%'] = (doc.col + 1) * CELL_WIDTH;
          // Width of div is like distance between column of current document and column of his parent
          styleFirstDiv['width.%'] = (parent.col - doc.col) * CELL_WIDTH;
          // Top and left border of div are displayed
          styleFirstDiv['border-top'] = '1px solid #cccccc';
          styleFirstDiv['border-left'] = '1px solid #cccccc';
          this.arrowType = 'down-arrow';
        } else {
          // Div is moved right, so his beginning is in the middle of parent document
          styleFirstDiv['left.%'] = (parent.col + 1) * CELL_WIDTH;
          // Width of div is like distance between column of current document and column of his parent
          styleFirstDiv['width.%'] = (doc.col - parent.col) * CELL_WIDTH;
          // Top and right border of div are displayed
          styleFirstDiv['border-top'] = '1px solid #cccccc';
          styleFirstDiv['border-right'] = '1px solid #cccccc';
          this.arrowType = 'down-arrow';
        }

        stylesOfPathDivs.push(styleFirstDiv);

        // Style for div which is in parent's cell
        let styleSecondDiv = {};

        // Div is moved down from top border of tbody, so his top is in the middle of parent
        styleSecondDiv['top.rem'] = (parent.row + 1) * ROW_HEIGHT;
        // Height of div is like distance between top of current document and middle of parent document
        styleSecondDiv['height.rem'] = CONTENT_ROW_HEIGHT / 2 + (ROW_HEIGHT - CONTENT_ROW_HEIGHT) / 4;
        // Div is moved right, so his beginning is in the middle of parent document
        styleSecondDiv['left.%'] = (parent.col + 1) * CELL_WIDTH;
        // Only left border of div is displayed
        styleSecondDiv['border-left'] = '1px solid #cccccc';
        // Width of div is half of parent's width
        styleSecondDiv['width.rem'] = CONTENT_ROW_WIDTH / 2;

        stylesOfPathDivs.push(styleSecondDiv);
        return stylesOfPathDivs;
      }

      // Start from cell that is to the left of the current document
      let i = doc.row;
      let j = doc.col - 1;

      for (; j >= parent.col; j--) { // This loop will execute only if parent is on left side
        let height;

        // Current cell is empty and column of current cell is same as parent's column, but row of current cell is different of parent's row.
        if (j === parentColumn && i !== parentRow && !this.mat[i][j]) {
          height = 0;

          // Go up to the parent's row
          while (i !== parentRow) {
            height += ROW_HEIGHT;
            i--;
          }

          let styles = {};
          // Div is moved down from top border of tbody, so his top is in the middle of parent
          styles['top.rem'] = (parentRow + 1) * ROW_HEIGHT;
          styles['height.rem'] = height;

          // Number of documents that are in same column as parent and in row which is grater than parent's row and lower (or equals) than row of last cell in previous div
          let topArrow = _.countBy(this.data1, o => {
            return o.row > parent.row && o.row <= currentRow && o.col === parent.col;
          });

          /**
           * Check if there is documents which are in rows between parent's row and row of last cell in previous div (it can be in same row as last cell in previous div) and
           * in same column as last cell in previous div or parent document
           */
          let betweenRow = topArrow.true && _.countBy(this.data1, o => {
            return o.row >= parent.row && o.row <= currentRow && o.col === currentColumn;
          }).true;

          /**
           * If there is no documents which are in rows between parent's row and row of last cell in previous div (it can be in same row as last cell in previous div)
           * and in same column as last cell in previous div, but there is documents which are in rows between parent's row and
           * row of last cell in previous div (it can be in same row as last cell in previous div) and in same column as parent document
           */
          if (!betweenRow && topArrow.true) {
            // Top and right borders of div are displayed
            styles['border-top'] = '1px solid #cccccc';
            styles['border-right'] = '1px solid #cccccc';
            if (stylesOfPathDivs.length === 0) { // Div has arrow only if it's first div (div of path that is closest to current document)
              this.arrowType = 'down-arrow';
            }
          } else {
            // Bottom and left borders of div are displayed
            styles['border-bottom'] = '1px solid #cccccc';
            styles['border-left'] = '1px solid #cccccc';
            if (stylesOfPathDivs.length === 0) { // Div has arrow only if it's first div (div of path that is closest to current document)
              this.arrowType = 'down-arrow';
            }
          }

          let styles1 = {};
          if (betweenRow) {
            // Div is moved right, so his beginning is on the end of parent cell
            styles['left.%'] = (parent.col + 1) * CELL_WIDTH + 4;
            // Width of div is like horizontal distance between END (-4) of current cell and middle of last cell in previous div
            styles['width.%'] = (currentColumn - j) * 8 - 4;
            // Height and top are changed, so top of div is in below parent document
            styles['height.rem'] -= 1.5;
            styles['top.rem'] += 1.5;

            // Div is moved down from top border of tbody, so his top is in the middle of parent
            styles1['top.rem'] = (parentRow + 1) * 4;
            // Div is moved right, so his beginning is in the middle of parent document
            styles1['left.%'] = (parent.col + 1) * 8;
            // Height should move bottom border below parent, so this div is connected to previous div
            styles1['height.rem'] = 1.5;
            // Width of div is half of column's width, so the end of div is on the beginning of previous div
            styles1['width.%'] = 4;
            // Left and bottom of div are displayed
            styles1['border-left'] = '1px solid #cccccc';
            styles1['border-bottom'] = '1px solid #cccccc';
          } else { // TODO: Vido
            // Div is moved right, so his beginning is in the middle of parent document
            styles['left.%'] = (parent.col + 1) * CELL_WIDTH;
            // Width of div is like horizontal distance between current docuemnt and last cell in previous div
            styles['width.%'] = (currentColumn - j) * CELL_WIDTH;
          }

          stylesOfPathDivs.push(styles);

          if (betweenRow) {
            stylesOfPathDivs.push(styles1);
          }
          break;
        }

        // Number of documents that are in same column as current cell and in row which is grater than parent's row and lower (or equals) than row of current cell
        let docsInSameColumn = _.countBy(this.data1, o => {
          return o.col === j && o.row <= i && o.row > parent.row;
        });

        if (i >= 0 && i <= 10 && docsInSameColumn.true) {
          let numOfDocsInSameColumn = docsInSameColumn.true;

          let styles = {};

          // Height is same as height of row
          height = ROW_HEIGHT;
          i--;

          // Go up while there is ducment in same column or while we get to parent's row
          while (i !== -1 && i !== parentRow && numOfDocsInSameColumn !== 0) {
            if (this.mat[i][j]) {
              numOfDocsInSameColumn--;
            }
            height += ROW_HEIGHT;
            i--;
          }

          // Div is moved down from top border of tbody, so his top is in the middle of current row
          styles['top.rem'] = (i + 1) * ROW_HEIGHT;
          styles['height.rem'] = height;
          // Only bottom boreder is displayed
          styles['border-bottom'] = '1px solid #cccccc';

          if ((i + 1) === parentRow) { // current cell is in same row as parent

            if (childrenInSameAndDiffRow) { // parent has children in same and different rows than his row
              // Div is moved down, so his top is below of parent document
              styles['top.rem'] += CONTENT_ROW_HEIGHT / 2 + (ROW_HEIGHT - CONTENT_ROW_HEIGHT) / 4;
              // Fixing previous div - reducing height and moving down previous div
              stylesOfPathDivs[stylesOfPathDivs.length - 1]['height.rem'] -= CONTENT_ROW_HEIGHT / 2 + (ROW_HEIGHT - CONTENT_ROW_HEIGHT) / 4;
              stylesOfPathDivs[stylesOfPathDivs.length - 1]['top.rem'] += CONTENT_ROW_HEIGHT / 2 + (ROW_HEIGHT - CONTENT_ROW_HEIGHT) / 4;
            }
            // Div is moved right, so his beginning is in the middle of parent document
            styles['left.%'] = (parent.col + 1) * CELL_WIDTH;

            // Width of div is like horizontal distance between last cell in previous div and current cell increased by half of column's width
            styles['width.%'] = (currentColumn - j) * CELL_WIDTH + CELL_WIDTH / 2;

          } else {
            // Div is moved right, so his beginning is on the end of current cell
            styles['left.%'] = (j + 1) * CELL_WIDTH + CELL_WIDTH / 2; // CELL_WIDTH / 2 === Width of "years" column
            // Width of div is like horizontal distance between last cell in previous div and current cell
            if (stylesOfPathDivs.length > 0) {
              styles['width.%'] = (currentColumn - j) * CELL_WIDTH;
            } else { // TODO: Vido
              styles['width.%'] = (currentColumn - j) * CELL_WIDTH - CELL_WIDTH / 2;
            }
            // Only left border of div is displayed
            styles['border-left'] = '1px solid #cccccc';
          }

          // New values for previous div
          currentRow = i;
          currentColumn = j;

          stylesOfPathDivs.push(styles);
        }

        if (parentRow === i && parentColumn === j) { // Path came to the parent cell
          let styles = {};

          // Div is moved down, so his top is in the middle of parent document
          styles['top.rem'] = (parentRow + 1) * ROW_HEIGHT;
          // Height should connect this div with previous one
          styles['height.rem'] = CONTENT_ROW_HEIGHT / 2 + (ROW_HEIGHT - CONTENT_ROW_HEIGHT) / 4;
          // Bottom and left borders are displayed
          styles['border-bottom'] = '1px solid #cccccc';
          styles['border-left'] = '1px solid #cccccc';

          // Fixing previous div - reducing height and moving down previous div
          stylesOfPathDivs[stylesOfPathDivs.length - 1]['height.rem'] -= CONTENT_ROW_HEIGHT / 2 + (ROW_HEIGHT - CONTENT_ROW_HEIGHT) / 4;
          stylesOfPathDivs[stylesOfPathDivs.length - 1]['top.rem'] += CONTENT_ROW_HEIGHT / 2 + (ROW_HEIGHT - CONTENT_ROW_HEIGHT) / 4;

          // Div is moved right, so his beginning is in the middle of parent document
          styles['left.%'] = (parentColumn + 1) * CELL_WIDTH;

          // Width of div is like horizontal distance between last cell in previous div and current/parent cell
          styles['width.%'] = (currentColumn - parentColumn) * CELL_WIDTH + CELL_WIDTH / 2;

          stylesOfPathDivs.push(styles);

          return stylesOfPathDivs;
        }
      }

      // Start from cell that is to the right of the current document
      i = doc.row;
      j = doc.col + 1;

      // Set values for previous div
      currentRow = doc.row;
      currentColumn = doc.col;

      for (; j <= parent.col && isParentOnRightSide; j++) {  // This loop will execute only if parent is on right side
        let height;

        // ako smo dosli do meseca u kom je roditelj
        // Current cell is empty and column of current cell is same as parent's column, but row of current cell is different of parent's row.
        if (j === parentColumn && i !== parentRow && !this.mat[i][j]) {
          height = 0;

          // Go up to the parent's row
          while (i !== parentRow) {
            height += ROW_HEIGHT;
            i--;
          }
          let styles = {};

          // Div is moved down from top border of tbody, so his top is in the middle of parent
          styles['top.rem'] = (parentRow + 1) * ROW_HEIGHT;
          styles['height.rem'] = height;

          // Number of documents that are in same column as parent and in row which is grater than parent's row and lower (or equals) than row of last cell in previous div
          let topArrow = _.countBy(this.data1, o => {
            return o.row > parent.row && o.row <= currentRow && o.col === parent.col;
          });

          /**
           * Check if there is documents which are in rows between parent's row and row of last cell in previous div (it can be in same row as last cell in previous div) and
           * in same column as last cell in previous div or parent document
           */
          let betweenRow = topArrow.true && _.countBy(this.data1, o => {
              return o.row >= parent.row && o.row <= currentRow && o.col === currentColumn;
            }).true;

          /**
           * If there is no documents which are in rows between parent's row and row of last cell in previous div (it can be in same row as last cell in previous div)
           * and in same column as last cell in previous div, but there is documents which are in rows between parent's row and
           * row of last cell in previous div (it can be in same row as last cell in previous div) and in same column as parent document
           */
          if (!betweenRow && topArrow.true) {
            // Top and left borders of div are displayed
            styles['border-top'] = '1px solid #cccccc';
            styles['border-left'] = '1px solid #cccccc';
            if (stylesOfPathDivs.length === 0) { // Div has arrow only if it's first div (div of path that is closest to current document)
              this.arrowType = 'left-arrow';
            }
          } else {
            // Bottom and right borders of div are displayed
            styles['border-bottom'] = '1px solid #cccccc';
            styles['border-right'] = '1px solid #cccccc';
            if (stylesOfPathDivs.length === 0) { // Div has arrow only if it's first div (div of path that is closest to current document)
              this.arrowType = 'left-arrow';
            }
          }

          let styles1 = {};
          if (betweenRow) {
            // Div is moved right, so his beginning is in the middle of last cell in previous div
            styles['left.%'] = (currentColumn + 1) * CELL_WIDTH;
            // Width of div is like horizontal distance between END (-4) of current cell and middle of last cell in previous div
            styles['width.%'] = (j - currentColumn) * CELL_WIDTH - CELL_WIDTH / 2;
            // Height and top are changed, so top of div is in below parent document
            styles['height.rem'] -= CONTENT_ROW_HEIGHT / 2 + (ROW_HEIGHT - CONTENT_ROW_HEIGHT) / 4;
            styles['top.rem'] += CONTENT_ROW_HEIGHT / 2 + (ROW_HEIGHT - CONTENT_ROW_HEIGHT) / 4;

            // Div is moved down from top border of tbody, so his top is in the middle of parent
            styles1['top.rem'] = (parentRow + 1) * ROW_HEIGHT;
            // Div is moved right, so his beginning is on the beginning of parent cell
            styles1['left.%'] = (parent.col + 1) * CELL_WIDTH - CELL_WIDTH / 2;
            // Height should move bottom border below parent, so this div is connected to previous div
            styles1['height.rem'] = CONTENT_ROW_HEIGHT / 2 + (ROW_HEIGHT - CONTENT_ROW_HEIGHT) / 4;
            // Width of div is half of column's width, so the end of div is in the middle of parent document
            styles1['width.%.rem'] = 4;
            // Right and bottom of div are displayed
            styles1['border-right'] = '1px solid #cccccc';
            styles1['border-bottom'] = '1px solid #cccccc';
          } else {
            // Div is moved right, so his beginning is on the beginning of last cell in previous div
            styles['left.%'] = (currentColumn + 1) * CELL_WIDTH - CELL_WIDTH / 2;
            // Width of div is like horizontal distance between current cell and end of last cell in previous div
            styles['width.%'] = (j - currentColumn) * CELL_WIDTH + CELL_WIDTH / 2;
          }

          stylesOfPathDivs.push(styles);

          if (betweenRow) {
            stylesOfPathDivs.push(styles1);
          }
          break;
        }

        // Number of documents that are in same column as current cell and in row which is grater than parent's row and lower (or equals) than row of current cell
        let docsInSameColumn = _.countBy(this.data1, o => {
          return o.col === j && o.row <= i && o.row > parent.row;
        });

        if (i >= 0 && i <= 10 && docsInSameColumn.true) {
          let numOfDocsInSameColumn = docsInSameColumn.true;

          let styles = {};

          // Height is same as height of row
          height = ROW_HEIGHT;
          i--;

          // Go up while there is ducment in same column or while we get to parent's row
          while (i !== -1 && i !== parentRow && numOfDocsInSameColumn !== 0) {
            if (this.mat[i][j]) {
              numOfDocsInSameColumn--;
            }
            height += ROW_HEIGHT;
            i--;
          }

          // Div is moved down from top border of tbody, so his top is in the middle of current row
          styles['top.rem'] = (i + 1) * ROW_HEIGHT;
          styles['height.rem'] = height;
          // Only bottom boreder is displayed
          styles['border-bottom'] = '1px solid #cccccc';

          if ((i + 1) === parentRow) { // current cell is in same row as parent
            // ako se nalazimo u redu u kom je roditelj

            if (childrenInSameAndDiffRow) { // parent has children in same and different rows than his row
              // Div is moved down, so his top is below of parent document
              styles['top.rem'] += 1.5;
              // Fixing previous div - reducing height and moving down previous div
              stylesOfPathDivs[stylesOfPathDivs.length - 1]['height.rem'] -= 1.5;
              stylesOfPathDivs[stylesOfPathDivs.length - 1]['top.rem'] += 1.5;
            }
            // Div is moved right, so his beginning is in the middle of parent document
            styles['left.%'] = (parent.col + 1) * 8;
            // Width of div is like horizontal distance between last cell in previous div and current cell increased by half of column's width
            styles['width.%'] = (currentColumn - j) * 8 + 4;

          } else {
            // Div is moved right, so his beginning is on the end of current cell
            styles['left.%'] = (currentColumn + 1) * CELL_WIDTH;
            // Width of div is like horizontal distance between last cell in previous div and current cell
            if (stylesOfPathDivs.length > 0) {
              styles['left.%'] = currentColumn * CELL_WIDTH;
              styles['width.%'] = (j - currentColumn) * CELL_WIDTH;
              styles['left.%'] += CELL_WIDTH / 2;
            } else { // TODO: VIDO
              styles['width.%'] = (j - currentColumn) * CELL_WIDTH - CELL_WIDTH / 2;
            }
            // Only right border of div is displayed
            styles['border-right'] = '1px solid #cccccc';
          }

          // New values for previous div
          currentRow = i;
          currentColumn = j;

          stylesOfPathDivs.push(styles);
        }

        if (parentRow === i && parentColumn === j) { // Path came to the parent cell
          let styles = {};

          // Div is moved down, so his top is in the middle of parent document
          styles['top.rem'] = (parentRow + 1) * ROW_HEIGHT;
          // Height should connect this div with previous one
          styles['height.rem'] = CONTENT_ROW_HEIGHT / 2 + (ROW_HEIGHT - CONTENT_ROW_HEIGHT) / 4;
          // Bottom and right borders are displayed
          styles['border-bottom'] = '1px solid #cccccc';
          styles['border-right'] = '1px solid #cccccc';

          // Fixing previous div - reducing height and moving down previous div
          stylesOfPathDivs[stylesOfPathDivs.length - 1]['height.rem'] -= CONTENT_ROW_HEIGHT / 2 + (ROW_HEIGHT - CONTENT_ROW_HEIGHT) / 4;
          stylesOfPathDivs[stylesOfPathDivs.length - 1]['top.rem'] += CONTENT_ROW_HEIGHT / 2 + (ROW_HEIGHT - CONTENT_ROW_HEIGHT) / 4;

          // Div is moved right, so his beginning is in the beginning of parent document cell
          styles['left.%'] = currentColumn * CELL_WIDTH + CELL_WIDTH / 2;

          // Width of div is like horizontal distance between last cell in previous div and current/parent cell
          styles['width.%'] = (parentColumn - currentColumn) * CELL_WIDTH + CELL_WIDTH / 2;

          stylesOfPathDivs.push(styles);

          break;
        }
      }
    } else {
      stylesOfPathDivs = [];
    }

    return stylesOfPathDivs;
  }

  changeYear (step) {
    this.firstYear += step;

    this.mat = [];
    for (let i = 0; i < NUM_OF_YEARS; i++) {
      this.mat[i] = [];
      for (let j = 0; j < NUM_OF_MONTHS; j++) {
        this.mat[i][j] = undefined;
      }
    }

    let rows = this.yearsToDisplay(NUM_OF_YEARS);

    this.data1.map(d => {

      let documentWithSameYearAndMonth = _.filter(this.data1, { 'year': d.year, 'month': d.month });

      if (documentWithSameYearAndMonth.length > 1) {
        documentWithSameYearAndMonth.sort();
        documentWithSameYearAndMonth.map((c, index) => {
          let indexOfParent = _.findIndex(documentWithSameYearAndMonth, { _id: c.parent });

          if (indexOfParent && indexOfParent > index) {
            documentWithSameYearAndMonth[index] = documentWithSameYearAndMonth[indexOfParent];
            documentWithSameYearAndMonth[indexOfParent] = c;
          }
        });

        for (let i = 0; i < documentWithSameYearAndMonth.length; i++) {
          let indexOfDocument = _.findIndex(this.data1, { _id: documentWithSameYearAndMonth[i]._id });

          let distance = d.year - this.firstYear + i;
          this.data1[indexOfDocument].row = distance;
        }
      } else {
        let indexOfDocument = _.findIndex(this.data1, { _id: d._id });

        let distance = d.year - this.firstYear;
        this.data1[indexOfDocument].row = _.findIndex(rows, function (o) { return o.number === distance; });
      }
    });

    this.data1.map(d => {
      if (d.row >= 0 && d.row <= (NUM_OF_YEARS - 1)) {
        this.mat[d.row][d.col] = d._id;
      }
    });
  }

  yearsToDisplay (i: number) {
    let array = new Array(i);
    let j = 0;

    for (; j < this.years.sort()[0] - this.firstYear ; j++) {
      array[j] = j;
    }

    this.years.sort().map((year) => {
      while (year - this.firstYear - array[j - 1] > 1) {
        array[j] = array[j - 1] + 1;
        j++;
      }
      array[j] = (year - this.firstYear);
      j++;
    });

    for (; j < i; j++) {
      if (j === 0) {
        array[j] = 0;
      } else {
        array[j] = array[j - 1] + 1;
      }
    }

    let begin = 0;
    if (array[0] < 0) {
      begin = -array[0];
    }
    array = array.slice(begin,begin + 11);

    for (j = array.length; j < i; j++) {
      array[j] = array[j - 1] + 1;
    }

    if (isNaN(array[0])) {
      array = Array.from(Array(11).keys());
    }

    let rowsInTable = [];

    rowsInTable.push({
      'number': array[0],
      'numOfRows': 1,
      'display': true
    });

    for (let k = 1; k < array.length; k++) {
      if (rowsInTable[k - 1]['number'] === array[k]) {
        rowsInTable[k - 1]['display'] = false;
        rowsInTable.push({
          'number': array[k],
          'numOfRows': rowsInTable[k - 1]['numOfRows'] + 1,
          'display': true
        });
      } else {
        rowsInTable.push({
          'number': array[k],
          'numOfRows': 1,
          'display': true
        });
      }
    }

    return rowsInTable;
  }

  public mouseup () {
    this.pathSelected = false;
    this.activeNode = undefined;
    this.activeNodeParent = undefined;
    this.activeNodes = [];
  }

  public mousedown (id, parentId) {
    const found = [];
    const findChild = docId => {
      const childs = this.data1.filter(doc => doc.parent === docId).map(doc => doc.document_id);
      found.push(...childs);
      for (let child of childs) {
        findChild(child);
      }
    };
    findChild(id);
    this.activeChildNodes = found;
    this.pathSelected = true;
    this.activeNodes = [];
    this.activeNode = undefined;
    this.activeNodeParent = undefined;
    this.activeNodes.push(id);
    let documentToAdd = _.find(this.data1, { _id: parentId });
    while (documentToAdd) {
      this.activeNodes.push(documentToAdd.document_id);
      documentToAdd = _.find(this.data1, { _id: documentToAdd.parent });
    }
    return false;
  }
}
