import { Injectable, PLATFORM_ID, inject, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { User, LoginResponse, RefreshTokenResponse, TokenInfo } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = environment.apiUrl;
  private readonly INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes in milliseconds
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private tokenExpirationTimer: ReturnType<typeof setTimeout> | null = null;
  private sessionWarningTimer: ReturnType<typeof setTimeout> | null = null;
  private inactivityTimer: ReturnType<typeof setTimeout> | null = null;
  private sessionWarningSubject = new BehaviorSubject<boolean>(false);
  private inactivityWarningSubject = new BehaviorSubject<boolean>(false);
  private isBrowser: boolean;
  private activityEvents = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click'];

  private http = inject(HttpClient);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private ngZone = inject(NgZone);

  currentUser$ = this.currentUserSubject.asObservable();
  sessionWarning$ = this.sessionWarningSubject.asObservable();
  inactivityWarning$ = this.inactivityWarningSubject.asObservable();

  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      this.loadStoredUser();
      this.setupActivityListeners();
    }
  }

  private loadStoredUser(): void {
    const token = this.getToken();
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as User;
        this.currentUserSubject.next(user);
        this.setupTokenExpiration();
      } catch {
        this.clearStorage();
      }
    }
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/auth/login`, { email, password })
      .pipe(
        tap(response => {
          this.storeToken(response.access_token);
          this.storeUser(response.user);
          this.currentUserSubject.next(response.user);
          this.setupTokenExpiration();
        }),
        catchError(error => {
          return throwError(() => error);
        })
      );
  }

  logout(): void {
    this.clearStorage();
    this.currentUserSubject.next(null);
    this.clearTimers();
    this.router.navigate(['/login']);
  }

  refreshToken(): Observable<RefreshTokenResponse> {
    return this.http.post<RefreshTokenResponse>(`${this.API_URL}/auth/refresh`, {})
      .pipe(
        tap(response => {
          this.storeToken(response.access_token);
          this.storeUser(response.user);
          this.currentUserSubject.next(response.user);
          this.sessionWarningSubject.next(false);
          this.setupTokenExpiration();
        }),
        catchError(error => {
          this.logout();
          return throwError(() => error);
        })
      );
  }

  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/auth/profile`);
  }

  getTokenInfo(): Observable<TokenInfo> {
    return this.http.get<TokenInfo>(`${this.API_URL}/auth/token-info`);
  }

  getToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem('access_token');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.currentUserSubject.value;
  }

  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === 'admin';
  }

  isVendedor(): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === 'vendedor';
  }

  hasRole(role: 'admin' | 'vendedor'): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === role;
  }

  private storeToken(token: string): void {
    if (this.isBrowser) {
      localStorage.setItem('access_token', token);
    }
  }

  private storeUser(user: User): void {
    if (this.isBrowser) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }

  private clearStorage(): void {
    if (this.isBrowser) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
    }
  }

  private clearTimers(): void {
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
    if (this.sessionWarningTimer) {
      clearTimeout(this.sessionWarningTimer);
      this.sessionWarningTimer = null;
    }
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
      this.inactivityTimer = null;
    }
    this.sessionWarningSubject.next(false);
    this.inactivityWarningSubject.next(false);
  }

  private setupTokenExpiration(): void {
    this.clearTimers();
    
    const token = this.getToken();
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000;
      const currentTime = Date.now();
      const timeUntilExpiration = expirationTime - currentTime;

      if (timeUntilExpiration <= 0) {
        this.logout();
        return;
      }

      const warningTime = Math.max(timeUntilExpiration - (5 * 60 * 1000), 0);
      
      if (warningTime > 0) {
        this.sessionWarningTimer = setTimeout(() => {
          this.sessionWarningSubject.next(true);
        }, warningTime);
      } else {
        this.sessionWarningSubject.next(true);
      }

      this.tokenExpirationTimer = setTimeout(() => {
        this.logout();
      }, timeUntilExpiration);
    } catch {
      this.logout();
    }
  }

  dismissSessionWarning(): void {
    this.sessionWarningSubject.next(false);
  }

  dismissInactivityWarning(): void {
    this.inactivityWarningSubject.next(false);
  }

  resetActivityTimer(): void {
    if (this.sessionWarningSubject.value) {
      return;
    }
    this.setupTokenExpiration();
  }

  private setupActivityListeners(): void {
    const handleActivity = () => {
      if (this.isAuthenticated()) {
        this.resetInactivityTimer();
      }
    };

    this.ngZone.runOutsideAngular(() => {
      this.activityEvents.forEach(event => {
        document.addEventListener(event, handleActivity, { passive: true });
      });
    });
  }

  private resetInactivityTimer(): void {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
    }

    this.inactivityWarningSubject.next(false);

    this.inactivityTimer = setTimeout(() => {
      this.ngZone.run(() => {
        if (this.isAuthenticated()) {
          this.inactivityWarningSubject.next(true);
          this.startInactivityLogoutCountdown();
        }
      });
    }, this.INACTIVITY_TIMEOUT);
  }

  private startInactivityLogoutCountdown(): void {
    setTimeout(() => {
      this.ngZone.run(() => {
        if (this.inactivityWarningSubject.value && this.isAuthenticated()) {
          this.logout();
        }
      });
    }, 60 * 1000);
  }

  startInactivityTracking(): void {
    if (this.isBrowser && this.isAuthenticated()) {
      this.resetInactivityTimer();
    }
  }

  stopInactivityTracking(): void {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
      this.inactivityTimer = null;
    }
    this.inactivityWarningSubject.next(false);
  }

  extendSessionFromInactivity(): void {
    this.inactivityWarningSubject.next(false);
    this.resetInactivityTimer();
  }
}
