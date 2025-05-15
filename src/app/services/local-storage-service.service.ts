import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageServiceService {
  private storageSubject = new Subject<{ key: string; value: any }>();
  storageChanges$ = this.storageSubject.asObservable();

  setItem(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
    this.storageSubject.next({ key, value });
  }

  getItem<T>(key: string): T | null {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  removeItem(key: string) {
    localStorage.removeItem(key);
    this.storageSubject.next({ key, value: null });
  }
}
