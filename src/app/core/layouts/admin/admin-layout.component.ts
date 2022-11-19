import { Component, OnInit } from '@angular/core';

import { SidenavService } from '@services/sidenav.service';
import { AlertService } from '@shared/services/alert.service';
import { SettingsService } from '@shared/services/settings.service';

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
  constructor(private sidenavService: SidenavService, private settingsService: SettingsService, private alertService: AlertService) { }

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
    
    this.getSettings();
  }

  /**
   * Get settings and store them in subject so they can be used in the admin modules.
   */
  async getSettings() {
    try {
      const settings = await this.settingsService.getAll();
      console.log(settings);
      this.settingsService.setSettings(settings);
    } catch (e) {
      // notify
      this.alertService.warn('Impossible de récupérer les paramètres de l\'application, veuillez recharger la page.');
      throw new Error(e);
    }
  }
}
