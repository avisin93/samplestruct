import { CORE_DATE_FORMAT, DateFormat } from '../../config';
import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe extends DatePipe implements PipeTransform {
  transform(value: any, args?: any): any {
    const dateFormatObj = DateFormat.getDateFormat();
    const format = args ? args : dateFormatObj.CORE_DATE_FORMAT;
    return super.transform(value, format, '', dateFormatObj.LOCALE_ID);
  }
}
