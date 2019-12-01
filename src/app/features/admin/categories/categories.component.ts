import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Category } from '@interfaces/category';
import { AlertService } from '@services/alert.service';
import { CategoriesService } from '@services/categories.service';

/**
 * Admin categories component.
 *
 * Display categories in a mat-table
 * with the possibility of edit/delete.
 */
@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {
  /**
   * Define if the component is waiting for categories (via http).
   */
  loading: boolean;
  /**
   * Categories of the app.
   */
  categories: Category[];
  /**
   * The mat-table columns.
   */
  displayedColumns = ['name', 'description', 'actions'];

  /**
   * Creates an instance of CategoriesComponent.
   */
  constructor(
    private categoriesService: CategoriesService,
    private router: Router,
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
   * Get the categories of the app.
   */
  async initialize(): Promise<void> {
    this.loading = true;

    try {
      this.categories = await this.categoriesService.getAllFlat();
    } catch (e) {
      // notify
      this.alertService.warn('Impossible de récupérer les catégories de l\'application');
      this.categories = [];
      throw new Error(e);
    }

    this.loading = false;
  }

  /**
   * Redirect to edit page.
   */
  edit(category: Category): void {
    this.router.navigateByUrl(`admin/categories/edit/${category.id}`);
  }

  /**
   * Delete a category.
   */
  async delete(category: Category): Promise<void> {
    // delete the category only if it has no ancestor neither descendant
    if (category.parent || category.children.length > 0) {
      alert('Vous ne pouvez pas supprimer une catégorie parent ou enfant');
    } else {
      // user must confirm before removal
      if (confirm(`Êtes vous sûr de supprimer la catégorie ${category.name}`)) {
        try {
          await this.categoriesService.delete(category.id);
          // update categories
          this.initialize();
        } catch (e) {
          throw new Error(e);
        }
      }
    }
  }
}
