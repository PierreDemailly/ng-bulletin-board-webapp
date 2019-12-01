import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { User } from '@interfaces/user';
import { AlertService } from '@services/alert.service';
import { AuthService } from '@services/auth.service';
import { UserService } from '@services/user.service';

/**
 * Register component.
 *
 * Display a form so user can register.
 */
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  /**
   * Register form.
   */
  form: FormGroup;
  /**
   * Url the user come from.
   */
  returnUrl: string;

  /**
   * Creates an instance of RegisterComponent.
   */
  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private authService: AuthService,
    private alertService: AlertService,
  ) { }

  /**
   * @inheritdoc
   * See Angular lifecycle hooks: https://angular.io/guide/lifecycle-hooks.
   */
  ngOnInit() {
    // logout user anytime he come on the register page
    this.authService.logout();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.buildForm();
  }

  /**
   * Build the register form with FormBuilder.
   */
  buildForm(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      pseudo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(21)]],
      recaptcha: ['', [Validators.required]],
    });
  }

  /**
   * Register submit.
   */
  async register(): Promise<void> {
    // check the form is valid
    if (this.form.valid) {
      const user: User = this.form.value;

      try {
        await this.userService.add(user);
        // redirect to login page
        this.router.navigateByUrl('/login');
        // notify
        this.alertService.success('Inscription réussie, veuillez vous connecter');
      } catch (e) {
        // notify
        this.alertService.warn('Impossible de créer votre compte, veuillez réessayer');
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
