import { Injectable } from '@angular/core';

import { Reply } from '@interfaces/reply';
import { ApiService } from './api.service';

/**
 * Replies service of the app.
 */
@Injectable({
  providedIn: 'root',
})
export class RepliesService {
  /**
   * Creates an instance of RepliesService.
   */
  constructor(private apiService: ApiService) { }

  /**
   * Add a reply.
   */
  add(reply: Reply): Promise<Reply> {
    return this.apiService.post('/replies', reply);
  }

  /**
   * Get all replies in a page.
   */
  getAll(topicId: number, page = 1): Promise<{replies: Reply[], count: number}> {
    return this.apiService.get(`/replies/${topicId}?page=${page}`);
  }

  /**
   * Edit a reply.
   */
  edit(reply: Reply): Promise<void> {
    return this.apiService.put('/replies', reply);
  }
}
