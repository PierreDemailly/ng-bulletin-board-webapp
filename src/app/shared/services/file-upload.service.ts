import { Injectable } from '@angular/core';

import { User } from '@interfaces/user';
import { ApiService } from './api.service';

/**
 * File upload service of the app
 */
@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  /**
   * Creates an instance of FileUploadService.
   */
  constructor(private apiService: ApiService) { }

  /**
   * Upload avatar.
   */
  uploadAvatar(avatar: FormData, user: User): Promise<any> {
    return this.apiService.post(`/users/upload/avatar?userId=${user.id}`, avatar, null);
  }
}
