import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Category } from '@interfaces/category';
import { AlertService } from '@services/alert.service';
import { CategoriesService } from '@services/categories.service';

/**
 * New category component.
 *
 * Display a form to create a category.
 */
@Component({
  selector: 'app-new-category',
  templateUrl: './new-category.component.html',
  styleUrls: ['./new-category.component.scss'],
})
export class NewCategoryComponent implements OnInit {
  /**
   * Category form.
   */
  form: UntypedFormGroup;
  /**
   * All root categories that may become the category ancestor.
   */
  categories: Category[];

  /**
   * Creates an instance of CategoryNewComponent.
   */
  constructor(
    private categoriesService: CategoriesService,
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private alertService: AlertService,
  ) { }

  /**
   * @inheritdoc
   * See Angular lifecycle hooks: https://angular.io/guide/lifecycle-hooks.
   */
  ngOnInit() {
    this.buildForm();
    this.getCategories();
  }

  /**
   * Build the form with FormBuilder.
   */
  buildForm(): void {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      ancestor: [null],
    });
  }

  /**
   * Get all root categories.
   */
  async getCategories(): Promise<void> {
   this.categories = await this.categoriesService.getAllRoots();
  }

  /**
   * New category form submit.
   */
  async add(): Promise<void> {
    // check the form is valid
    if (this.form.valid) {
      const category: Category = this.form.value;

      if (category.parent) {
        // category.parent is already 'stringified' with toString pipe in template
        // but the linter don't know it so we pretend to stringify then parse (x2)
        category.parent = JSON.parse(JSON.parse(JSON.stringify(category.parent)));
      }

      try {
        await this.categoriesService.add(category);
        // notify
        this.alertService.success('Catégorie créée avec succés');
        // redirect to categories list
        this.router.navigateByUrl('/admin/categories');
      } catch (e) {
        // notify
        this.alertService.warn('Il y a eu un problème lors de la création de la catégorie, veuillez réessayer');
        throw new Error(e);
      }
    }
  }
}
