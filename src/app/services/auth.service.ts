import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, tap } from 'rxjs';

const API = 'https://strapi-server-0ymt.onrender.com/api';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  token = signal<string | null>(localStorage.getItem('jwt'));

  private currentUserSubject = new BehaviorSubject<any | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  isLoggedIn() {
    return !!this.token();
  }

  login(email: string, password: string) {
    return this.http
      .post<any>(`${API}/auth/local`, { identifier: email, password })
      .pipe(
        tap((res) => {
          localStorage.setItem('jwt', res.jwt);
          this.token.set(res.jwt);
          this.currentUserSubject.next(res.user);
        }),
      );
  }

  register(username: string, email: string, password: string) {
    return this.http
      .post<any>(`${API}/auth/local/register`, { username, email, password })
      .pipe(
        tap((res) => {
          localStorage.setItem('jwt', res.jwt);
          this.token.set(res.jwt);
          this.currentUserSubject.next(res.user);
        }),
      );
  }

  logout() {
    localStorage.removeItem('jwt');
    this.token.set(null);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getMe() {
    return this.http
      .get<any>(`${API}/users/me`)
      .pipe(tap((user) => this.currentUserSubject.next(user)));
  }
}
