import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'fillZero'
})
export class FillZeroPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        if (value) {
            let zeroCount = args - value.toString().length;
            if (zeroCount > 0) {
                while (zeroCount > 0) {
                    value = '0' + value;
                    zeroCount--;
                }
            }
        }
        return value;
    }

}
