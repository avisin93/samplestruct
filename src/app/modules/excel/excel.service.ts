import { Injectable } from '@angular/core';
import * as Excel from 'exceljs/dist/exceljs.min.js';
import * as fs from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor () { }

  generateExcel (header: any[],data: any[],worksheetName: string) {
    let workbook = new Excel.Workbook();
    let worksheet = workbook.addWorksheet(worksheetName);

    let headerRow = worksheet.addRow(header);

    // Cell Style : Fill and Border
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFFF' }
      };
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    });
    worksheet.addRows(data);

   // DOWNLOAD FILE
    workbook.xlsx.writeBuffer().then((dataToWrite: ArrayBuffer) => {
      let blob = new Blob([dataToWrite], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      if (data.length > 1) {
        fs.saveAs(blob, 'Contracts.xlsx');
      } else {
        fs.saveAs(blob, 'Contract.xlsx');
      }
    });
  }
}
