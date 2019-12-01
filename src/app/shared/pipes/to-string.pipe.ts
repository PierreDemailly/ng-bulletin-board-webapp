import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe used to JSON.stringify() an object.
 */
@Pipe({
  name: 'toString',
})
export class ToStringPipe implements PipeTransform {

  transform(object: any): any {
    return JSON.stringify(object);
  }

}
