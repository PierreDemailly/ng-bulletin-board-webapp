import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe used to round a number.
 */
@Pipe({
  name: 'round',
})
export class RoundPipe implements PipeTransform {
  transform(value: number): number {
    return Math.round(value);
  }
}
