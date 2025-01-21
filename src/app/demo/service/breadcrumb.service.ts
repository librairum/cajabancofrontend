import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {
    private breadcrumbsSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
    public currentBreadcrumbs$: Observable<any[]> = this.breadcrumbsSubject.asObservable();
  constructor() { }
  setBreadcrumbs(paths: any[]): void {
    this.breadcrumbsSubject.next(paths);
  }

  clearBreadcrumbs(): void {
    this.breadcrumbsSubject.next([]);
  }
}
