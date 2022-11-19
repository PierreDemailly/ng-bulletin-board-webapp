import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { User } from '@interfaces/user';
import { AlertService } from '@services/alert.service';
import { UserService } from '@services/user.service';

/**
 * Edit user component.
 *
 * Display a form to edit a user.
 */
@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
})
export class EditUserComponent implements OnInit {
  /**
   * User's id.
   */
  userId = Number(this.route.snapshot.paramMap.get('id'));
  /**
   * User form.
   */
  form: UntypedFormGroup;
  /**
   * User to edit.
   */
  user: User;

  /**
   * Creates an instance of EditUserComponent.
   */
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private formBuilder: UntypedFormBuilder,
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
   * Init method of the component.
   *
   * Get the user then build form.
   */
  async initialize(): Promise<void> {
    try {
      this.user = await this.userService.find(this.userId);
      this.buildForm();
    } catch (e) {
      // if failed to get the user, back to users list
      this.router.navigateByUrl('/admin/users');
      // notify
      this.alertService.warn('Erreur lors de la récupération de l\'utilisateur');
      throw new Error(e);
    }
  }

  /**
   * Build the form with FormBuilder.
   */
  buildForm(): void {
    this.form = this.formBuilder.group({
      pseudo: [this.user.pseudo],
      email: [this.user.email],
      signature: [{
        value: this.user.signature || 'l\'utilisateur n\'a pas de signature',
        disabled: true,
      }],
      rank: [this.user.rank],
    });
  }

  /**
   * Edit form submit.
   */
  async edit(): Promise<void> {
    // check the form is valid
    if (this.form.valid) {
      // merge form values / initial values
      const user: User = { ...this.user, ...this.form.value };

      try {
        await this.userService.edit(user);
        // notify
        this.alertService.success('L\'utilisateur a bien été sauvegardé');
        // reload user
        this.initialize();
      } catch (e) {
        // notify
        this.alertService.warn('Il y a eu un problème lors de la sauvegarde de l\'utilisateur, veuillez réessayer');
        throw new Error(e);
      }
    }
  }

  /**
   * Reset user signature as empty.
   */
  async resetSignature(): Promise<void> {
    const user: User = this.user;
    user.signature = null;

    try {
      await this.userService.edit(user);
      // notify
      this.alertService.success('La signature de l\'utilisateur a bien été réinitialisée');
      // reload user
      this.initialize();
    } catch (e) {
      // notify
      this.alertService.warn('Il y a eu un problème lors de la réinitialisation de la signature de l\'utilisateur, veuillez réessayer');
      throw new Error(e);
    }
  }

  /**
   * Reset user avatar as default.
   */
  async resetAvatar(): Promise<void> {
    const user: User = this.user;
    user.avatar = 'default.png';

    try {
      await this.userService.edit(user);
      // notify
      this.alertService.success('L\'avatar de l\'utilisateur a bien été réinitialisée');
      // reload user
      this.initialize();
    } catch (e) {
      // notify
      this.alertService.warn('Il y a eu un problème lors de la réinitialisation de l\'avatar de l\'utilisateur, veuillez réessayer');
      throw new Error(e);
    }
  }
}
