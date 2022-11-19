import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { User } from '@interfaces/user';
import { AlertService } from '@services/alert.service';
import { FileUploadService } from '@services/file-upload.service';
import { UserService } from '@services/user.service';

import { Scavenger } from '@wishtack/rx-scavenger';

/**
 * Account edit component.
 *
 * Display a form so user can edit his profile.
 *
 * User can edit pseudo, email, signature and avatar.
 * TODO: password change
 */
@Component({
  selector: 'app-account-edit',
  templateUrl: './account-edit.component.html',
  styleUrls: ['./account-edit.component.scss'],
})
export class AccountEditComponent implements OnInit, OnDestroy {
  /**
   * User form.
   */
  form: UntypedFormGroup;
  /**
   * User to edit.
   */
  user: User;
  /**
   * Contain avatar image as FormData that user uploaded.
   */
  selectedFile: FormData;
  /**
   * Contain avatar image's name that user uploaded.
   */
  selectedFileName: string;
  /**
   * Used to collect subscriptions and prevent memory leaks.
   */
  scavenger = new Scavenger(this);

  /**
   * creates an instance of AccountInfosComponent.
   */
  constructor(
    private userService: UserService,
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private fileUploadService: FileUploadService,
    private alertService: AlertService,
    private location: Location,
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
  ngOnDestroy() { }

  /**
   * Init method of the component.
   *
   * Subscribes to current user.
   */
  initialize(): void {
    this.userService.getCurrentUser().pipe(
      this.scavenger.collect(),
    ).subscribe((user) => {
      this.user = user;

      if (this.user) {
        // now there is user, we can build form and set default values
        this.buildForm();
      } else {
        // if no logged in user redirect to info page
        const id = this.route.snapshot.params.id;
        this.router.navigateByUrl('/account/' + id);
      }
    });
  }

  /**
   * Build the user form with FormBuilder.
   */
  buildForm(): void {
    this.form = this.formBuilder.group({
      email: [this.user.email, [Validators.email]],
      pseudo: [this.user.pseudo, [Validators.required, Validators.minLength(3), Validators.maxLength(21)]],
      signature: [this.user.signature, [Validators.minLength(3), Validators.maxLength(255)]],
    });
  }

  /**
   * Trigger when user upload image (new avatar).
   * - store file as FormData in selectedFile property
   * - store file name in selectedFileName property
   */
  onFileSelected(event: Event) {
    const formData = new FormData();
    formData.append('file', (event.target as HTMLInputElement).files[0], (event.target as HTMLInputElement).files[0].name);
    this.selectedFile = formData;
    this.selectedFileName = (event.target as HTMLInputElement).files[0].name;
  }

  /**
   * Edit submit.
   */
  async edit() {
    // upload avatar separately from user edit
    if (this.selectedFile) {
      try {
        const user = await this.fileUploadService.uploadAvatar(this.selectedFile, this.user);
        // update user to make avatar updated in all the app
        this.userService.setUser(user);
        // notify
        this.alertService.success('Votre avatar a été modifié avec succès');
        // unstore file and filename
        delete this.selectedFile;
        delete this.selectedFileName;
      } catch (e) {
        // notify
        this.alertService.warn('Il y a eu un problème lors du changement de votre avatar, veuillez réessayer');
        throw new Error(e);
      }
    }
    // check the form is valid
    if (this.form.valid) {
      // merge form values / initial values
      const user: User = { ...this.user, ...this.form.value };

      if (JSON.stringify(user) === JSON.stringify(this.user)) {
        // don't need to update user while it's the same as current
        return;
      }

      try {
        const editedUser = await this.userService.edit(user);
        // update user to make it updated in all the app
        this.userService.setUser(editedUser);
        // notify
        this.alertService.success('Votre profil a été modifié avec succés');
      } catch (e) {
        // notify
        this.alertService.warn('Il y a eu un problème lors de la sauvegarde de l\'utilisateur, veuillez réessayer');
        throw new Error(e);
      }
    }
  }

  /**
   * Redirect to previous location.
   */
  back(): void {
    this.location.back();
  }
}
