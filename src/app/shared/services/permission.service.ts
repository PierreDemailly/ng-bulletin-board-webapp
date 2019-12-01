import { Injectable } from '@angular/core';

import { Permission } from '@interfaces/permission';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {

  constructor(private apiService: ApiService) { }

  getAll(): Promise<Permission[]> {
    return this.apiService.get('/permissions');
  }
}
