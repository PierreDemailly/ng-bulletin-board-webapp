import { Component,
         ElementRef,
         OnDestroy,
         OnInit,
         QueryList,
         ViewChild,
         ViewChildren,
        } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';

import { Answer } from '@interfaces/answer';
import { FormatedSurveyResult } from '@interfaces/formated-survey-result';
import { MatPaginationChangeEvent } from '@interfaces/mat-pagination-change-event';
import { Reply } from '@interfaces/reply';
import { Topic } from '@interfaces/topic';
import { User } from '@interfaces/user';
import { AlertService } from '@services/alert.service';
import { AuthService } from '@services/auth.service';
import { RepliesService } from '@services/replies.service';
import { TopicsService } from '@services/topics.service';
import { UserService } from '@services/user.service';

import { Scavenger } from '@wishtack/rx-scavenger';
import { InvisibleReCaptchaComponent } from 'ngx-captcha';

/**
 * Topic component.
 *
 * Display topic, replies and a form to reply.
 */
@Component({
  selector: 'app-topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.scss'],
})
export class TopicComponent implements OnInit, OnDestroy {
  /**
   * Define if current user is logged in.
   */
  isAuth: Boolean = false;
  /**
   * Topic's replies.
   */
  replies: Reply[];
  /**
   * Replies count + 1 (add the topic).
   */
  count: number;
  /**
   * Paginator page.
   */
  page = 1;
  /**
   * Topic.
   */
  topic: Topic;
  /**
   * Topic's id.
   */
  topicId: number;
  /**
   * Current user.
   */
  user: User;
  /**
   * User can quote the topic or a reply to discuss about.
   */
  quote: Reply | Topic;
  /**
   * Survey result.
   */
  surveyResult: FormatedSurveyResult;
  /**
   * User last action is stored there because it is executed
   * after reCaptcha success.
   */
  lastAction: { method: string, args: any };
  /**
   * Used to collect subscriptions and prevent memory leaks.
   */
  scavenger = new Scavenger(this);
  /**
   * TODO: debug
   */
  recaptcha: any;
  /**
   * Reply form reference.
   */
  @ViewChild('FormReply', { read: ElementRef }) formReply: ElementRef;
  /**
   * ReCaptcha reference.
   */
  @ViewChild('captchaElem') captchaElem: InvisibleReCaptchaComponent;
  /**
   * Both paginators (top & bottom) references.
   */
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();

  /**
   * Creates an instance of TopicComponent.
   */
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private topicsService: TopicsService,
    private repliesService: RepliesService,
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
   * @inheritdoc
   * See Angular lifecycle hooks: https://angular.io/guide/lifecycle-hooks.
   *
   * This component implements ngOnDestroy for scavenger.
   */
  ngOnDestroy() { }

  /**
   * Init method of the app.
   *
   * Get topic's id.
   *
   * Subscribes to route query params.
   *
   * Get topic, replies, whether user is auth and current user.
   *
   */
  async initialize(): Promise<void> {
    this.topicId = this.route.snapshot.params.id;

    this.route.queryParams.subscribe((param) => {
      this.page = param.page ? param.page : 1;
    });

    try {
      this.topic = await this.topicsService.find(this.topicId);
    } catch (error) {
      // notify
      this.alertService.warn('Erreur lors de la récupération du sujet');
      this.router.navigateByUrl('/forums');
      throw new Error(error);
    }

    // separate method due to need to update only replies later.
    this.getReplies();

    this.isAuth = this.authService.isLoggedIn();

    this.userService.getCurrentUser().pipe(
      this.scavenger.collect(),
    ).subscribe((user) => {
      this.user = user;
    });
  }

  /**
   * Get topic replies.
   */
  async getReplies(): Promise<void> {
    try {
      const req = await this.repliesService.getAll(this.topicId, this.page);
      this.replies = req.replies;
      // add +1 to count the topic
      this.count = req.count + 1;
    } catch (error) {
      // notify
      this.alertService.warn('Erreur lors de la récupération des posts');
      throw new Error(error);
    }
  }

  /**
   * Handle mat-paginator changes.
   */
  getPage(event: MatPaginationChangeEvent): void {
    this.page = event.pageIndex + 1;
    // make bottom & top paginator synchronizing
    this.paginator.toArray()[0].pageIndex = event.pageIndex;
    this.paginator.toArray()[1].pageIndex = event.pageIndex;

    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: { page: this.page },
        queryParamsHandling: 'merge',
    });

    // get the new page replies
    this.getReplies();
  }

  /**
   * Execute reCaptcha and store the needed action.
   */
  checkCaptcha(method: string, args: any): void {
    this.captchaElem.execute();
    this.lastAction = { method, args };
  }

  /**
   * Handle reCaptcha success.
   *
   * Run needed action.
   */
  handleSuccess(): void {
    this[this.lastAction.method](this.lastAction.args);
    this.captchaElem.resetCaptcha();
  }

  /**
   * Add reply submit.
   */
  async addReply(content: string): Promise<void> {
    const reply: Reply = {
      content: content,
      user: this.user,
      topic: this.topic,
    };

    try {
      await this.repliesService.add(reply);
      this.getReplies();
      // notify
      this.alertService.success('Post créé avec succés');
    } catch (e) {
      // notify
      this.alertService.warn('Erreur lors de la sauvegarde du post, veuillez réessayer');
      throw new Error(e);
    }
  }

  /**
   * Handle when user quote.
   */
  handleQuote(post: Topic | Reply): void {
    this.quote = post;
  }

  /**
   * Handle when user wanna reply.
   */
  handleReply(): void {
    this.formReply.nativeElement.scrollIntoView();
  }

  /**
   * Handle when user wanna refresh.
   */
  handleRefresh(): void {
    this.initialize();
  }

  /**
   * Handle when user wanna back to topics list.
   */
  handleReturnToTopics(): void {
    this.router.navigateByUrl(`forums/c/${this.topic.category.id}`);
  }

  /**
   * Handle when user wanna blacklist a user.
   */
  async handleBlacklistUser(user: User): Promise<void> {
    try {
      await this.userService.blacklist(this.user, user);
      this.userService.loadUser();
    } catch (error) {
      // notify
      this.alertService.warn('Erreur lors du bloquage de l\'utilisateur, veuillez réessayer');
      throw new Error(error);
    }
  }

  /**
   * Handle when user wanna unblacklist a user.
   */
  async handleUnblacklistUser(user: User): Promise<void> {
    try {
      await this.userService.unblacklist(this.user, user);
      this.userService.loadUser();
    } catch (error) {
      // notify
      this.alertService.warn('Erreur lors du débloquage de l\'utilisateur, veuillez réessayer');
      throw new Error(error);
    }
  }

  /**
   * Handle when user wanna vote survey.
   */
  async handleAnswer(answer: Answer): Promise<void> {
    try {
      await this.topicsService.voteSurvey(this.topic.survey, answer, this.user);
      this.initialize();
    } catch (e) {
      // notify
      this.alertService.warn('Erreur lors du vote au sondage, veuillez réessayer');
      throw new Error(e);
    }
  }

  /**
   * Handle when user wanna edit topic.
   */
  async handleEditTopic(topic: Topic): Promise<void> {
    try {
      await this.topicsService.edit(topic);
      // update
      this.initialize();
    } catch (e) {
      // notify
      this.alertService.warn('Erreur lors de la modification du sujet, veuillez réessayer');
      throw new Error(e);
    }
  }

  /**
   * Handle when user wanna edit reply.
   */
  async handleEditReply(reply: Reply): Promise<void> {
    try {
      await this.repliesService.edit(reply);
      // udpate
      this.getReplies();
    } catch (e) {
      // notify
      this.alertService.warn('Erreur lors de la modification du post, veuillez réessayer');
      throw new Error(e);
    }
  }
}
