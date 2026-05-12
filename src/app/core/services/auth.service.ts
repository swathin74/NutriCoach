import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, LoginRequest, RegisterRequest } from '../../shared/models/models';

// ── Toggle this to false when your backend is ready ──
const USE_MOCK = true;

const MOCK_USER: AuthResponse = {
  token: 'mock-jwt-token',
  type: 'Bearer',
  userId: 1,
  fullName: 'Alex Johnson',
  email: 'alex@example.com',
  goal: 'WEIGHT_LOSS',
  dailyCalorieTarget: 2100,
  proteinTargetG: 150
};

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly TOKEN_KEY = 'nc_token';
  private readonly USER_KEY  = 'nc_user';

  currentUser = signal<AuthResponse | null>(this.loadUser());

  constructor(private http: HttpClient, private router: Router) {}

  login(payload: LoginRequest): Observable<AuthResponse> {
    if (USE_MOCK) {
      this.persist(MOCK_USER);
      return of(MOCK_USER);
    }
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/login`, payload)
      .pipe(tap(res => this.persist(res)));
  }

  register(payload: RegisterRequest): Observable<AuthResponse> {
    if (USE_MOCK) {
      const mockUser = { ...MOCK_USER, fullName: payload.fullName, email: payload.email };
      this.persist(mockUser);
      return of(mockUser);
    }
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/register`, payload)
      .pipe(tap(res => this.persist(res)));
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  private persist(res: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, res.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(res));
    this.currentUser.set(res);
  }

  private loadUser(): AuthResponse | null {
    const raw = localStorage.getItem(this.USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }
}