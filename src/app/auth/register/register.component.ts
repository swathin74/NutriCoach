import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  template: `
    <div class="login-page">
      <div class="login-card">

        <div class="login-header">
          <h1 class="login-logo">NutriCoach</h1>
          <p class="login-tagline">Create your free account</p>
        </div>

        <form [formGroup]="form" (ngSubmit)="submit()">

          <div class="form-group">
            <label for="fullName">Full name</label>
            <input id="fullName" type="text" formControlName="fullName"
              placeholder="Alex Johnson" autocomplete="name" />
            <span class="form-error"
              *ngIf="form.get('fullName')?.touched && form.get('fullName')?.invalid">
              Full name required
            </span>
          </div>

          <div class="form-group">
            <label for="email">Email address</label>
            <input id="email" type="email" formControlName="email"
              placeholder="you@example.com" autocomplete="email" />
            <span class="form-error"
              *ngIf="form.get('email')?.touched && form.get('email')?.invalid">
              Enter a valid email
            </span>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input id="password" type="password" formControlName="password"
              placeholder="Min. 6 characters" autocomplete="new-password" />
            <span class="form-error"
              *ngIf="form.get('password')?.touched && form.get('password')?.invalid">
              Password must be at least 6 characters
            </span>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="age">Age</label>
              <input id="age" type="number" formControlName="age" placeholder="29" />
            </div>
            <div class="form-group">
              <label for="weightKg">Weight (kg)</label>
              <input id="weightKg" type="number" formControlName="weightKg" placeholder="70" />
            </div>
          </div>

          <div class="alert alert-danger" *ngIf="error">{{ error }}</div>

          <button type="submit" class="btn btn-primary btn-full" [disabled]="loading">
            {{ loading ? 'Creating account…' : 'Create account' }}
          </button>

        </form>

        <hr class="divider">

        <p class="login-footer">
          Already have an account? <a routerLink="/login">Sign in</a>
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
      max-width: 420px;
    }
    .login-header { text-align: center; margin-bottom: 24px; }
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
export class RegisterComponent {

  form: FormGroup;
  loading = false;
  error   = '';

  constructor(
    private fb:   FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      fullName:  ['', Validators.required],
      email:     ['', [Validators.required, Validators.email]],
      password:  ['', [Validators.required, Validators.minLength(6)]],
      age:       [null],
      weightKg:  [null]
    });
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    this.loading = true;
    this.error   = '';

    this.auth.register(this.form.value).subscribe({
      next:  ()  => this.router.navigate(['/dashboard']),
      error: err => {
        this.error   = err.error?.error ?? 'Registration failed. Please try again.';
        this.loading = false;
      }
    });
  }
}
