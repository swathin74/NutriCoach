import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  template: `
    <div class="login-page">

      <div class="login-card">

        <div class="login-header">
          <h1 class="login-logo">NutriCoach</h1>
          <p class="login-tagline">Your personal nutrition intelligence</p>
        </div>

        <form [formGroup]="form" (ngSubmit)="submit()">

          <div class="form-group">
            <label for="email">Email address</label>
            <input
              id="email"
              type="email"
              formControlName="email"
              placeholder="you@example.com"
              autocomplete="email"
            />
            <span class="form-error"
              *ngIf="form.get('email')?.touched && form.get('email')?.invalid">
              Enter a valid email
            </span>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              id="password"
              type="password"
              formControlName="password"
              placeholder="••••••••"
              autocomplete="current-password"
            />
            <span class="form-error"
              *ngIf="form.get('password')?.touched && form.get('password')?.invalid">
              Password required
            </span>
          </div>

          <div class="alert alert-danger" *ngIf="error">{{ error }}</div>

          <button
            type="submit"
            class="btn btn-primary btn-full"
            [disabled]="loading"
          >
            {{ loading ? 'Signing in…' : 'Sign in' }}
          </button>

        </form>

        <hr class="divider">

        <p class="login-footer">
          Don't have an account?
          <a routerLink="/register">Create one free</a>
        </p>

      </div>
    </div>
  `,
  styles: [`
    .login-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--nc-bg);
      padding: 20px;
    }
    .login-card {
      background: var(--nc-surface);
      border: 1px solid var(--nc-border);
      border-radius: var(--radius-lg);
      padding: 36px 32px;
      width: 100%;
      max-width: 400px;
    }
    .login-header { text-align: center; margin-bottom: 28px; }
    .login-logo {
      font-family: var(--font-display);
      font-size: 26px;
      font-weight: 500;
      color: var(--nc-green-dark);
    }
    .login-tagline { font-size: 13px; color: var(--nc-text-muted); margin-top: 4px; }
    .login-footer {
      text-align: center;
      font-size: 13px;
      color: var(--nc-text-muted);
      a { color: var(--nc-green); text-decoration: none; font-weight: 500; }
    }
    button[disabled] { opacity: 0.6; cursor: not-allowed; }
  `]
})
export class LoginComponent {

  form: FormGroup;
  loading = false;
  error   = '';

  constructor(
    private fb:   FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    this.loading = true;
    this.error   = '';

    this.auth.login(this.form.value).subscribe({
      next:  ()  => this.router.navigate(['/dashboard']),
      error: err => {
        this.error   = err.error?.error ?? 'Login failed. Please try again.';
        this.loading = false;
      }
    });
  }
}
