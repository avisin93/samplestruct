import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'absolute'
})
export class AbsoluteValuePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return value ? Math.abs(value) : null;
  }

}
