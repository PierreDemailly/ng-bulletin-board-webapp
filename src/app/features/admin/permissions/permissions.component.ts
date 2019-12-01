import { Component, OnInit } from '@angular/core';

import { PermissionService } from '@services/permission.service';

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss']
})
export class PermissionsComponent implements OnInit {

  constructor(private permissionService: PermissionService) { }

  ngOnInit() {
    this.initialize();
  }

  async initialize(): Promise<void> {
    try {
      const q = await this.permissionService.getAll();
      console.log(q);
    } catch (error) {
      throw new Error(error);
    }
  }

}
