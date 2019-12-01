import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Category } from '@interfaces/category';
import { NewTopicForm } from '@interfaces/new-topic-form';
import { Topic } from '@interfaces/topic';
import { TopicsFilter } from '@interfaces/topics-filter';
import { AlertService } from '@services/alert.service';
import { AuthService } from '@services/auth.service';
import { CategoriesService } from '@services/categories.service';
import { TopicsService } from '@services/topics.service';
import { UserService } from '@services/user.service';

/**
 * Category component.
 *
 * Display topics of the categories in mat-table.
 */
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {
  /**
   * Category's id.
   */
  categoryId: number;
  /**
   * Category.
   */
  category: Category;
  /**
   * Category's topics.
   */
  topics: Topic[];
  /**
   * Define if current user is logged in.
   */
  isAuth = false;
  /**
   * Topics filter.
   */
  topicsFilter: TopicsFilter = {
    filter: 'latest',
    page: 1,
    limit: 20,
  };
  /**
   * Topics count in the category, for mat-paginator only.
   */
  count: number;
  /**
   * New topic form reference.
   */
  @ViewChild('formTopic', { read: ElementRef }) formTopic: ElementRef;

  /**
   * Creates an instance of CategoryComponent.
   */
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoriesService: CategoriesService,
    private topicsService: TopicsService,
    private authService: AuthService,
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
   * Get category.
   */
  async initialize(): Promise<void> {
    this.categoryId = Number(this.route.snapshot.params.id);

    try {
      this.category = await this.categoriesService.find(this.categoryId);
    } catch (e) {
      // redirect user to home
      this.router.navigateByUrl('/');
      // notify
      this.alertService.warn('Erreur lors de la récupération de la catégorie');
      throw new Error(e);
    }

    this.getTopics();

    this.isAuth = this.authService.isLoggedIn();
  }

  /**
   * Get topics.
   */
  async getTopics(filter: 'latest' | 'top' = 'latest', page: number = 1, limit: number = 20): Promise<void> {
    this.topicsFilter.filter = filter;
    this.topicsFilter.page = page;
    this.topicsFilter.limit = limit;

    try {
      const req = await this.topicsService.getAll(
        this.categoryId,
        this.topicsFilter.filter,
        this.topicsFilter.page,
        this.topicsFilter.limit,
      );
      this.topics = req.topics;
      this.count = req.count;
    } catch (error) {
      // notify
      this.alertService.warn('Erreur lors de la récupération des sujets');
      throw new Error(error);
    }
  }

  /**
   * Add topic submit.
   */
  async addTopic(values: NewTopicForm): Promise<void> {
    const topic: Topic = {
      title: values.title,
      content: values.content,
      user: this.userService.getCurrentUserValue(),
      category: this.category,
      survey: values.survey,
    };

    try {
      const req = await this.topicsService.add(topic);
      // redirect user to his topic page
      this.router.navigateByUrl('/forums/c/' + this.categoryId + '/t/' + req.id);
    } catch (e) {
      // notify
      this.alertService.warn('Erreur lors de la création de votre sujet, veuillez réessayer');
      throw new Error(e);
    }
  }

  /**
   * Change category id param in url and re-init component.
   */
  async changeCategory(category: Category): Promise<void> {
    await this.router.navigateByUrl(this.router.url.replace(
      this.categoryId.toString(), category.id.toString(),
    ));
    this.initialize();
  }

  /**
   * Scroll to form.
   */
  handleCreateTopic(): void {
    this.formTopic.nativeElement.scrollIntoView();
  }
}
