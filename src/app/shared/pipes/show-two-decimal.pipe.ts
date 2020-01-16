import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'twoDecimal'
})
export class ShowTwoDecimalPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value) {
      value = parseFloat((Math.round(parseFloat(value) * 100) / 100).toFixed(2));
      // value = (Math.ceil(parseFloat(value) * 100) / 100).toFixed(2);
    }
    return value;
  }

}
