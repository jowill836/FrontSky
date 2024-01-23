import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SelectionService {
  private categorySource = new BehaviorSubject<string>('hottest');
  currentCategory = this.categorySource.asObservable();

  changeCategory(category: string) {
    this.categorySource.next(category);
  }
}
