import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'comment'
})
export class CommentPipe implements PipeTransform {

  transform (value: any, args?: any): any {
    if (value) {
      return value.length > 18 ? value.slice(0, 15).concat('...') : value;
    }
  }

}
