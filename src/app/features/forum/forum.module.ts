import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderModule } from '@core/partials/header/header.module';

import { CategoryHeaderComponent } from '@shared/components/category-header/category-header.component';
import { CategoryLinkComponent } from '@shared/components/category-link/category-link.component';
import { CreatedSurveyComponent } from '@shared/components/created-survey/created-survey.component';
import { NewReplyFormComponent } from '@shared/components/new-reply-form/new-reply-form.component';
import { NewTopicFormComponent } from '@shared/components/new-topic-form/new-topic-form.component';
import { PostComponent } from '@shared/components/post/post.component';
import { SurveyComponent } from '@shared/components/survey/survey.component';
import { TopicHeaderComponent } from '@shared/components/topic-header/topic-header.component';
import { TopicsTableComponent } from '@shared/components/topics-table/topics-table.component';
import { MappingPipe } from '@shared/pipes/mapping.pipe';
import { RoundPipe } from '@shared/pipes/round.pipe';
import { SharedModule } from '@shared/shared.module';
import { CategoriesComponent } from './categories/categories.component';
import { CategoryComponent } from './category/category.component';
import { ForumRoutingModule } from './forum-routing.module';
import { TopicComponent } from './topic/topic.component';

import { ClickOutsideModule } from 'ng-click-outside';
import { EditorModule } from 'primeng/editor';

@NgModule({
  declarations: [
    TopicComponent,
    CategoryLinkComponent,
    CategoryComponent,
    CategoryHeaderComponent,
    CategoriesComponent,
    TopicsTableComponent,
    NewTopicFormComponent,
    NewReplyFormComponent,
    SurveyComponent,
    PostComponent,
    TopicHeaderComponent,
    CreatedSurveyComponent,
    MappingPipe,
    RoundPipe,
  ],
  imports: [
    CommonModule,
    ForumRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HeaderModule,
    SharedModule,
    EditorModule,
    ClickOutsideModule,
  ],
})
export class ForumModule { }
