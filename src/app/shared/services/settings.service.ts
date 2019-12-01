import { Injectable } from '@angular/core';

import { Setting } from '@interfaces/setting';
import { ApiService } from './api.service';

import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

/**
 * Settings service of the app.
 */
@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  /**
   * Subject of current settings.
   *
   * Store settings in a subject so they are available in the whole app.
   */
  settings = new BehaviorSubject<Setting[]>(null);

  /**
   * Creates an instance of SettingsService.
   */
  constructor(private apiService: ApiService) { }

  /**
   * Get all settings.
   */
  getAll(): Promise<Setting[]> {
    return this.apiService.get('/settings');
  }

  /**
   * Edit a setting.
   */
  edit(setting: Setting): Promise<Setting[]> {
    return this.apiService.put('/settings', setting);
  }

  /**
   * Set current settings.
   */
  setSettings(settings: Setting[]): void {
    this.settings.next(settings);
  }

  /**
   * Get current settings.
   */
  getSettings(): Observable<Setting[]> {
    return this.settings.asObservable().pipe(
      filter((settings) => settings !== null),
    );
  }
}
