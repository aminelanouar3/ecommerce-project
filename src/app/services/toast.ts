import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toastSubject = new BehaviorSubject<string | null>(null);
  toast$ = this.toastSubject.asObservable();
  show(message: string) {
    this.toastSubject.next(message);
  }
}
