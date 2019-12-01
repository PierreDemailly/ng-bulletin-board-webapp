import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Category } from '@interfaces/category';
import { AlertService } from '@services/alert.service';
import { CategoriesService } from '@services/categories.service';

/**
 * Edit category component.
 *
 * Display a form to edit category's name, description or ancestor.
 * Either possibility to delete the category.
 */
@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.scss'],
})
export class EditCategoryComponent implements OnInit {
  /**
   * Category's id.
   */
  categoryId = Number(this.route.snapshot.params.id);
  /**
   * Category form.
   */
  form: FormGroup;
  /**
   * Category to edit.
   */
  category: Category;
  /**
   * All root categories that may become the category ancestor.
   */
  categories: Category[];
  /**
   * Whether the category is ancestor of at least one category.
   */
  isAncestor: boolean;

  /**
   * Creates an instance of EditCategoriesComponent.
   */
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
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
   * Get the category and root categories?
   * Define whether the category is ancestor.
   */
  async initialize(): Promise<void> {
    try {
      this.category = await this.categoriesService.find(this.categoryId);
      this.isAncestor = this.category.children.length > 0;
      this.buildForm();
      this.getRootCategories();
    } catch (e) {
      // if failed to get the category, back to categories list
      this.router.navigateByUrl('/admin/categories');
      // notify
      this.alertService.warn('Erreur du serveur lors de la récupération de la catégorie');
      throw new Error(e);
    }
  }

  /**
   * Build the form with FormBuilder.
   */
  buildForm(): void {
    this.form = this.formBuilder.group({
      name: [this.category.name, [Validators.required]],
      description: [this.category.description, [Validators.required]],
      parent: [JSON.stringify(this.category.parent) || null],
    });
  }

  /**
   * Get all root categories.
   */
  async getRootCategories(): Promise<void> {
    try {
      this.categories = await this.categoriesService.getAllRoots();
    } catch (error) {
      // set isAncestor true to disable ancestor select if it fail
      this.isAncestor = true;
      throw new Error(error);
    }
  }

  /**
   * Edit form submit.
   */
  async edit(): Promise<void> {
    // check the form is valid
    if (this.form.valid) {
      const category: Category = this.form.value;

      if (category.parent) {
        // category.parent is already 'stringified' with toString pipe in template
        // but the linter don't know it so we pretend to stringify then parse (x2)
        category.parent = JSON.parse(JSON.parse(JSON.stringify(category.parent)));
      } else {
        // to be sure there is no error in backend
        category.parent = null;
      }

      category.id = this.category.id;

      try {
        await this.categoriesService.edit(category);
        // back to list when category has been edited
        this.router.navigateByUrl('admin/categories');
        // notify
        this.alertService.success('Catégorie modifiée avec succés');
      } catch (e) {
        // notify
        this.alertService.warn('Il y a eu un problème lors de le sauvegarde de la catégorie, veuillez réessayer');
        throw new Error(e);
      }
    }
  }

  /**
   * Delete the category.
   */
  async delete() {
    // user must confirm before removal
    if (confirm(`Êtes vous sûr de supprimer la catégorie ${this.category.name}`)) {
      try {
        await this.categoriesService.delete(this.categoryId);
        // back to list
        this.router.navigateByUrl('admin/categories');
        // notify
        this.alertService.success('Catégorie supprimée avec succés');
      } catch (e) {
        this.alertService.warn('Il y a eu un problème lors de la suppression de la catégorie, veuillez réessayer');
        throw new Error(e);
      }
    }
  }
}
