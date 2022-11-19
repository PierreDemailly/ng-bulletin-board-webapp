import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { ActivatedRoute, Router } from '@angular/router';

import { MatPaginationChangeEvent } from '@interfaces/mat-pagination-change-event';
import { TopicsTablePaginationFilter } from '@interfaces/topics-table-pagination-filter';
import { User } from '@interfaces/user';
import { Topic } from '@shared/interfaces/topic';

/**
 * Topics table component.
 *
 * Displat topics in mat-table.
 */
@Component({
  selector: 'app-topics-table',
  templateUrl: './topics-table.component.html',
  styleUrls: ['./topics-table.component.scss'],
})
export class TopicsTableComponent {
  /**
   * Topic category's id
   */
  categoryId = Number(this.route.snapshot.params.id);
  /**
   * Mat-table data source.
   */
  dataSource: MatTableDataSource<Topic>;
  /**
   * Define if the component is waiting for topics.
   */
  loading = true;
  /**
   * The mat-table columns.
   */
  displayedColumns: string[] = [
    'title', 'user', 'views', 'replies',
  ];
  /**
   * Pagination filter.
   */
  paginationFilter: TopicsTablePaginationFilter = {
    categoryId: this.categoryId,
    limit: 20,
    page: 1,
  };
  /**
   * Topics to insert in mat-table.
   */
  _topics: Topic[];
  /**
   * Count of topics.
   */
  @Input() count: number;
  /**
   * Event sent when pagination changes.
   */
  @Output() paginationChange = new EventEmitter<TopicsTablePaginationFilter>();
  /**
   * Topics @Input with setter and getter.
   */
  @Input('topics')
  set topics(topics: Topic[]) {
    this._topics = topics;
    // when topics changes update dataSource.
    this.initializeDataSource();
  }
  get topics(): Topic[] {
    return this._topics;
  }

  /**
   * Creates an instance of TopicsTableComponent.
   */
  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  /**
   * Update mat-table data source.
   */
  initializeDataSource(): void {
    this.dataSource = new MatTableDataSource<Topic>(this.topics);
    this.loading = false;
  }

  /**
   * Handle mat-paginator values changes.
   */
  getPage(event: MatPaginationChangeEvent): void {
    this.paginationFilter.limit =  event.pageSize;
    this.paginationFilter.page = event.pageIndex + 1;
    this.paginationChange.emit(this.paginationFilter);
    this.loading = true;
  }

  /**
   * Redirect to user profile.
   */
  redirectUser(user: User): void {
    this.router.navigateByUrl(`/account/${user.id}`);
  }

  /**
   * Redirect to topic.
   */
  redirectTopic(topic: Topic): void {
    this.router.navigateByUrl(`/forums/c/${this.categoryId}/t/${topic.id}`);
  }
}
