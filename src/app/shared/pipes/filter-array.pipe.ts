import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash'
@Pipe({
  name: 'filterArray'
})
export class FilterArrayPipe implements PipeTransform {

  transform(items: any, type?: any): any {
    return items && _.filter(items, type );
  }

}
