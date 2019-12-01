import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { Category } from '@interfaces/category';

/**
 * Category link component.
 *
 * Display a category with descendants.
 */
@Component({
  selector: 'app-category-link',
  templateUrl: './category-link.component.html',
  styleUrls: ['./category-link.component.scss'],
})
export class CategoryLinkComponent {
  /**
   * Category to display.
   */
  @Input() category: Category;

  /**
   * Creates an instance of CategoryLinkComponent.
   */
  constructor(private router: Router) { }

  /**
   * Redirect to category page.
   */
  redirectToCategory(category: Category): void {
    this.router.navigateByUrl(`/forums/c/${category.id}`);
  }
}
