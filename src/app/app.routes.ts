import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Public
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./auth/register/register.component').then(m => m.RegisterComponent)
  },

  // Protected — all inside the shell layout
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./shared/navbar/shell.component').then(m => m.ShellComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'meal-log',
        loadComponent: () =>
          import('./meal-log/meal-log.component').then(m => m.MealLogComponent)
      },
      {
        path: 'ai-coach',
        loadComponent: () =>
          import('./ai-coach/ai-coach.component').then(m => m.AiCoachComponent)
      },
      {
        path: 'progress',
        loadComponent: () =>
          import('./progress/progress.component').then(m => m.ProgressComponent)
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./settings/settings.component').then(m => m.SettingsComponent)
      }
    ]
  },

  // Fallback
  { path: '**', redirectTo: 'dashboard' }
];
