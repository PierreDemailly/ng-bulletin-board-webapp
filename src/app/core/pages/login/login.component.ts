import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { User } from '@interfaces/user';
import { AlertService } from '@services/alert.service';
import { AuthService } from '@services/auth.service';
import { UserService } from '@services/user.service';

/**
 * Login component.
 *
 * Display a form so user can login with email+password.
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  /**
   * Login form.
   */
  form: FormGroup;
  /**
   * Url the user come from.
   */
  returnUrl: string;

  /**
   * Creates an instance of LoginComponent.
   */
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute,
    private location: Location,
    private userService: UserService,
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
   * Logout the user anytime he come on the login page.
   *
   * Get return url from query params if exist.
   *
   * call buildForm() to create login form.
   */
  initialize(): void {
    this.authService.logout();

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    this.buildForm();
  }

  /**
   * Build the login form with FormBuilder.
   */
  buildForm(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      recaptcha: ['', [Validators.required]],
    });
  }

  /**
   * Login submit.
   */
  async login(): Promise<void> {
    // check the form is valid
    if (this.form.valid) {
      const user: User = this.form.value;

      try {
        const req = await this.authService.login(user);
        // store the token in localStorage
        localStorage.setItem('jwtToken', req.token);
        // store the user in subject
        this.userService.setUser(req.user);

        // notify
        this.alertService.success(`Content de vous revoir, ${req.user.pseudo}`);

        /** redirect to the previous url or /home */
        this.router.navigateByUrl(this.returnUrl);
      } catch (e) {
        // notify
        this.alertService.warn('Email ou mot de passe incorrect');
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
