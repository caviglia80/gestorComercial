// loading.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  public isLoading = new BehaviorSubject<boolean>(false);

  constructor(private router: Router) { }

  setLoading(activate: boolean, targetRoute: string) {
    if (this.router.url !== targetRoute) {
      this.isLoading.next(activate);
    }
  }
}
