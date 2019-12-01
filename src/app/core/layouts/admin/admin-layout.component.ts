import { Component, OnInit } from '@angular/core';

import { SidenavService } from '@services/sidenav.service';

/**
 * Admin layout.
 *
 * Set admin sidenav and content in material styles.
 */
@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
})
export class AdminLayoutComponent implements OnInit {
  /**
   * Creates an instance of AdminLayoutComponent.
   */
  constructor(private sidenavService: SidenavService) { }

  /**
   * @inheritdoc
   * See Angular lifecycle hooks: https://angular.io/guide/lifecycle-hooks.
   */
  ngOnInit() {
    const sidenav = this.sidenavService.sidenav;
    // if the main sidenav is open, close it when coming into admin
    if (sidenav.opened) {
      this.sidenavService.toggle();
    }
  }
}
