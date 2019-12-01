import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe used to use component method inside template.
 */
@Pipe({
  name: 'map',
})
export class MappingPipe implements PipeTransform {
  transform(value: [], mappingFunction: Function) {
    return mappingFunction(value);
  }
}
