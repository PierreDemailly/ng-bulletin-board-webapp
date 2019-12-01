import { Pipe, PipeTransform } from '@angular/core';

import { User } from '@interfaces/user';

/**
 * Pipe used to check if a user is blacklisted by the logged in user.
 */
@Pipe({
  name: 'checkBlacklist',
})
export class CheckblacklistPipe implements PipeTransform {
  transform(poster: User, reader: User): any {
    return (reader && reader.blacklistIds) ? reader.blacklistIds.includes(poster.id) : false;
  }
}
