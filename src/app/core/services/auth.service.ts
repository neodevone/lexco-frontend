import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { User, AuthResponse, LoginPayload, RegisterPayload } from '../interfaces/user.interface';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api/auth';
  
  private _currentUser = signal<User | null>(null);
  
  currentUser = this._currentUser.asReadonly();
  isAuthenticated = computed(() => this._currentUser() !== null);
  isAdmin = computed(() => this._currentUser()?.role === 'admin');

  constructor(private http: HttpClient, private router: Router) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const user = localStorage.getItem('user');
    if (user) {
      this._currentUser.set(JSON.parse(user));
    }
  }

  register(payload: RegisterPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, payload).pipe(
      tap(res => this.handleAuthSuccess(res))
    );
  }

  login(payload: LoginPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, payload).pipe(
      tap(res => this.handleAuthSuccess(res))
    );
  }

  logout(): void {
    this.http.post(`${this.apiUrl}/logout`, {}).subscribe();
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    this._currentUser.set(null);
    this.router.navigate(['/auth/login']);
  }

  private handleAuthSuccess(res: AuthResponse): void {
    localStorage.setItem('auth_token', res.token);
    localStorage.setItem('user', JSON.stringify(res.user));
    this._currentUser.set(res.user);
  }
}