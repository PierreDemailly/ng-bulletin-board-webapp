import { Component, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';

import { MatPaginationChangeEvent } from '@interfaces/mat-pagination-change-event';
import { User } from '@interfaces/user';
import { AlertService } from '@services/alert.service';
import { UserService } from '@services/user.service';
import { DialogUserDetailsComponent } from '@shared/components/dialog-user-details/dialog-user-details.component';
import { Subject } from 'rxjs/internal/Subject';

/**
 * Admin users component.
 *
 * Display each users in a mat-table
 * with the possibility of showing detail/edit/delete
 */
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit, OnDestroy {
  /**
   * Search user form.
   */
  form: UntypedFormGroup;
  /**
   * The mat-table columns.
   */
  displayedColumns: string[] = ['pseudo', 'email', 'rank', 'actions'];
  /**
   * Define if the component is waiting for users (via http).
   */
  loading: boolean;
  /**
   * Users displayed in mat-table.
   */
  users: User[];
  /**
   * Pagination filter.
   */
  paginationFilter = {
    page: 1,
    limit: 20,
  };
  /**
   * Count of users. Only used for mat-paginator.
   */
  count: number;
  /**
   * Used to collect subscriptions and prevent memory leaks.
   */
  scavenger = new Subject();
  /**
   * Both (top & bottom) mat-paginators references.
   */
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();

  /**
   * Creates an instance of UsersComponent.
   */
  constructor(
    private formBuilder: UntypedFormBuilder,
    private userService: UserService,
    private dialog: MatDialog,
    private router: Router,
    private alertService: AlertService,
  ) {
    this.buildForm();
  }

  /**
   * @inheritdoc
   */
  ngOnInit() {
    this.search();
  }

  /**
   * @inheritdoc
   * See Angular lifecycle hooks: https://angular.io/guide/lifecycle-hooks.
   *
   * This component implements ngOnDestroy for scavenger.
   */
  ngOnDestroy() {}

  /**
   * Build search form with FormBuilder.
   */
  buildForm(): void {
    this.form = this.formBuilder.group({
      search: [''],
    });
  }

  /**
   * Get filtered users depending mat-paginator page/limit.
   */
  async getUsers(): Promise<void> {
    this.loading = true;

    try {
      const req = await this.userService.getAll(
        this.paginationFilter.page,
        this.paginationFilter.limit,
      );
      this.users = req.users;
      this.count = req.count;
    } catch (e) {
      // set empty array or the template will crash
      this.users = [];
      // notify
      this.alertService.warn('Erreur lors de la récupération des utilisateurs');
      throw new Error(e);
    }

    this.loading = false;
  }

  /**
   * Search filtered users depending search string and mat-paginator page/limit.
   */
  async search(): Promise<void> {
    const searchString = this.form.value.search;

    if (searchString) {
      this.loading = true;

      try {
        const req = await this.userService.search(
          searchString,
          this.paginationFilter.page,
          this.paginationFilter.limit,
        );
        this.users = req.users;
        this.count = req.count;
      } catch (error) {
        // set empty array or the template will crash
        this.users = [];
        // notify
        this.alertService.warn('Erreur lors de la récupération des utilisateurs');
        throw new Error(error);
      }

      this.loading = false;
    } else {
      // if empty search string just get users
      this.getUsers();
    }
  }

  /**
   * Open mat-dialog that display user details.
   */
  showDetails(user: User): void {
    const dialogRef = this.dialog.open(DialogUserDetailsComponent);
    // get instance of the user details component
    const instance = dialogRef.componentInstance;
    // set user @Input()
    instance.user = user;
    // subscribe to edit @Output()
    instance.edit.pipe(
    ).subscribe(() => {
      this.router.navigateByUrl(`/admin/users/edit/${user.id}`);
      dialogRef.close();
    });
  }

  /**
   * Update paginationFilter when mat-paginator values change.
   */
  getPage(event: MatPaginationChangeEvent) {
    // make bottom & top paginator synchronizing
    this.paginator.toArray()[0].pageIndex = event.pageIndex;
    this.paginator.toArray()[1].pageIndex = event.pageIndex;

    this.paginationFilter.page = event.pageIndex + 1;
    this.paginationFilter.limit = event.pageSize;
    // search again with new filters
    this.search();
  }

  /**
   * Delete a user.
   */
  async delete(user: User): Promise<void> {
    // user must confirm before removal
    if (confirm(`Êtes vous sûr de supprimer l'utilisateur ${user.pseudo} ?`)) {
      try {
        await this.userService.delete(user);
        // search again so removed user disaspear from mat-table
        this.search();
        // notify
        this.alertService.success('Utilisateur supprimé avec succés');
      } catch (e) {
        // notify
        this.alertService.warn('Il y a eu un problème lors de la suppression de l\'utilisateur, veuillez réessayer');
        throw new Error(e);
      }
    }
  }
}
