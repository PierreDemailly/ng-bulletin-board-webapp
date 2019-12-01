import { Component, OnInit } from '@angular/core';

import { Category } from '@interfaces/category';
import { AlertService } from '@services/alert.service';
import { CategoriesService } from '@services/categories.service';

/**
 * Categories component.
 *
 * Display each root categories with descendants.
 */
@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {
  /**
   * All root categories of the app.
   */
  categories: Category[];

  /**
   * Creates an instance of CategoriesComponent.
   */
  constructor(
    private categoriesService: CategoriesService,
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
   * Get categories.
   */
  async initialize() {
    try {
      this.categories = await this.categoriesService.getAll();
    } catch (error) {
      // notify
      this.alertService.warn('Erreur lors de la récupération des catégories');
      this.categories = [];
      throw new Error(error);
    }
  }
}
