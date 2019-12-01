import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Setting } from '@interfaces/setting';
import { AlertService } from '@services/alert.service';
import { SettingsService } from '@services/settings.service';

import { Scavenger } from '@wishtack/rx-scavenger';
import { ReCaptcha2Component } from 'ngx-captcha';

/**
 * App parameters component.
 *
 * Display a form to edit settings.
 */
@Component({
  selector: 'app-parameters',
  templateUrl: './app-parameters.component.html',
  styleUrls: ['./app-parameters.component.scss'],
})
export class AppParametersComponent implements OnInit, OnDestroy {
  /**
   * Parameters form.
   */
  form: FormGroup;
  /**
   * Settings of the app.
   */
  settings: Setting[];
  /**
   * Used to collect subscriptions and prevent memory leaks.
   */
  scavenger = new Scavenger(this);
  /**
   * ReCaptcha reference.
   */
  @ViewChild('captchaElem') captchaElem: ReCaptcha2Component;

  /**
   * Creates an instance of AppParametersComponent.
   */
  constructor(
    private formBuilder: FormBuilder,
    private settingsService: SettingsService,
    private alertService: AlertService,
  ) { }

  /**
   * @inheritdoc
   * See Angular lifecycle hooks: https://angular.io/guide/lifecycle-hooks.
   */
  ngOnInit() {
    this.initialize();
  }

  /**
   * @inheritdoc
   * See Angular lifecycle hooks: https://angular.io/guide/lifecycle-hooks.
   *
   * This component implements ngOnDestroy for scavenger.
   */
  ngOnDestroy() {}

  /**
   * Init method of the component.
   *
   * Subscribes to app settings.
   */
  initialize(): void {
    this.settingsService.getSettings().pipe(
      this.scavenger.collect(),
    ).subscribe((settings) => {
      this.settings = settings;
      // build form with settings default values
      this.buildForm();
    });
  }

  /**
   * Build the parameters form with FormBuilder.
   */
  buildForm(): void {
    const sitename = this.settings.filter((setting) => setting.name === 'sitename')[0].value;
    this.form = this.formBuilder.group({
      sitename: [sitename, [Validators.minLength(3), Validators.maxLength(30)]],
      recaptcha: ['', [Validators.required]],
    });
  }

  /**
   * Parameters form submit.
   */
  async editParameters(): Promise<void> {
    // check form is valid
    if (this.form.valid) {
      const setting: Setting = this.settings[0];
      setting.value = this.form.value.sitename;

      try {
        const settings = await this.settingsService.edit(setting);
        // update settings to make them updated in all the app
        this.settingsService.setSettings(settings);
        // notify
        this.alertService.success('Paramètres modifiés avec succés');
      } catch (error) {
        // notify
        this.alertService.warn('Impossible de modifier les paramètres, veuillez réessayer');
        throw new Error(error);
      }

      // reset captcha in case user edit again parameters
      this.captchaElem.resetCaptcha();
    }
  }
}
