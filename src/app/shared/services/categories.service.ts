import { Injectable } from '@angular/core';

import { Category } from '@interfaces/category';
import { ApiService } from './api.service';

/**
 * Categories service of the app.
 */
@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  /**
   * Creates an instance of CategoriesService.
   */
  constructor(private apiService: ApiService) { }

  /**
   * Get categories tree.
   *
   * There must not be hundreds so pagination is not implemented.
   *
   * If a category has descendants, the descendants categories will be available only in the
   * ancestor category object.
   */
  getAll(): Promise<Category[]> {
    return this.apiService.get('/categories');
  }

  /**
   * Get all root categories.
   *
   * Root categories are categories that doesn't have ancestor.
   */
  getAllRoots(): Promise<Category[]> {
    return this.apiService.get('/categories/roots');
  }

  /**
   * Find a category from her id.
   */
  find(id: number): Promise<Category> {
    return this.apiService.get('/categories/' + id);
  }

  /**
   * Add a category.
   */
  add(category: Category): Promise<Boolean> {
    return this.apiService.post('/categories', category);
  }

  /**
   * Edit a category.
   */
  edit(category: Category): Promise<Boolean> {
    return this.apiService.put('/categories', category);
  }

  /**
   * Remove a category.
   */
  delete(id: number): Promise<Boolean> {
    return this.apiService.delete('/categories/' + id);
  }

  /**
   * Get all flat categories.
   *
   * Flat categories means all categories with ancestor/descendants relations.
   *
   * The difference with getAll() is that getAll returns categories tree.
   */
  getAllFlat(): Promise<Category[]> {
    return this.apiService.get('/categories/flat');
  }
}
