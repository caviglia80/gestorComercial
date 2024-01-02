import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RequestCancelService {
  private pendingRequests = new Map<string, Subject<void>>();

  cancelRequest(url: string): void {
    const request = this.pendingRequests.get(url);
    if (request) {
      request.next();
      this.pendingRequests.delete(url);
    }
  }


  onNewRequest(url: string): Subject<void> {
    this.cancelRequest(url);
    const cancelToken = new Subject<void>();
    this.pendingRequests.set(url, cancelToken);
    return cancelToken;
  }
}
