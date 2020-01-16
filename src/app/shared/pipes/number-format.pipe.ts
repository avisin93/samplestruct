import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Pipe({
  name: 'numberFormat'
})
export class NumberFormatPipe extends DecimalPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    const number = value ? value : 0;
    const format = args ? args : ((number === 0) ? '1.0' : '1.2-2');
    return super.transform(number, format, 'en');
  }

}
