import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Category } from '@interfaces/category';
import { CategoriesService } from '@services/categories.service';

/**
 * Category header component.
 *
 * Display current category and list of root categories.
 *
 * Display filters: TOP / LAST
 */
@Component({
  selector: 'app-category-header',
  templateUrl: './category-header.component.html',
  styleUrls: ['./category-header.component.scss'],
})
export class CategoryHeaderComponent {
  /**
   * The category that will show the header.
   */
  category: Category;
  /**
   * Root categories.
   */
  categories: Category[];
  /**
   * Whether list of root categories are hidden.
   */
  hideCategories = true;
  /**
   * Whether filter is "top" or "latest"
   */
  activeFilter: 'latest' | 'top' = 'latest';
  /**
   * Whether current user is allowed to reply.
   */
  @Input() allowedToReply = false;
  /**
   * Get the category via @Input.
   */
  @Input('activeCategory')
  set activeCategory(category: Category) {
    if (category) {
      this.category = category;
      this.initialize();
    }
  }
  /**
   * Category change event.
   */
  @Output() change = new EventEmitter<Category>();
  /**
   * Filter change event.
   */
  @Output() filterChange = new EventEmitter<'latest' | 'top'>();
  /**
   * Create topic event.
   */
  @Output() createTopic = new EventEmitter<void>();

  /**
   * Creates an instance of CategoryHeaderComponent.
   */
  constructor(private categoriesService: CategoriesService) { }

  /**
   * Init method of the component.
   *
   * Get root categories.
   */
  async initialize(): Promise<void> {
    try {
      this.categories = await this.categoriesService.getAllRoots();
      if (this.categories.length > 0) {
        this.filterCategories();
      }
    } catch (e) {
      throw new Error(e);
    }
  }

  /**
   * Remove current category from root categories.
   */
  filterCategories(): void {
    this.categories = this.categories.filter((category) => {
      return category.id !== this.category.id;
    });
  }

  /**
   * Toggle categories.
   */
  toggleCategories(): void {
    this.hideCategories = !this.hideCategories;
  }

  /**
   * Hide categories.
   */
  closeCategories(): void {
    this.hideCategories = true;
  }

  /**
   * Emit change event.
   */
  redirectCategory(category: Category): void {
    this.change.emit(category);
  }

  /**
   * Emit filterChange event.
   */
  setFilter(filter: 'latest' | 'top'): void {
    this.activeFilter = filter;
    this.filterChange.emit(filter);
  }

  /**
   * Emit createTopic event.
   */
  emitCreateTopic(): void {
    this.createTopic.emit();
  }
}
