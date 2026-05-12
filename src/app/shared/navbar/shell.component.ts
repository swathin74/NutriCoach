import { Component, computed } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

interface NavItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <div class="shell">

      <!-- ── Sidebar ───────────────────────────── -->
      <aside class="sidebar">

        <div class="sidebar-logo">
          <span class="logo-wordmark">NutriCoach</span>
          <span class="logo-tagline">Your nutrition intelligence</span>
        </div>

        <nav class="sidebar-nav">
          <a
            *ngFor="let item of navItems"
            [routerLink]="item.route"
            routerLinkActive="active"
            class="nav-item"
          >
            <span class="nav-icon">{{ item.icon }}</span>
            <span>{{ item.label }}</span>
          </a>
        </nav>

        <div class="sidebar-user">
          <div class="user-avatar">
            {{ userInitials() }}
          </div>
          <div class="user-info">
            <span class="user-name">{{ user()?.fullName }}</span>
            <span class="user-email">{{ user()?.email }}</span>
          </div>
          <button class="logout-btn" (click)="logout()" title="Sign out">⇥</button>
        </div>

      </aside>

      <!-- ── Main content ───────────────────────── -->
      <main class="shell-main">
        <router-outlet />
      </main>

    </div>
  `,
  styles: [`
    .shell {
      display: flex;
      height: 100vh;
      overflow: hidden;
    }

    /* ── Sidebar ───────────────────────── */
    .sidebar {
      width: var(--sidebar-width);
      background: var(--nc-surface);
      border-right: 1px solid var(--nc-border);
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
    }

    .sidebar-logo {
      padding: 20px 18px 16px;
      border-bottom: 1px solid var(--nc-border);
    }
    .logo-wordmark {
      display: block;
      font-family: var(--font-display);
      font-size: 19px;
      font-weight: 500;
      color: var(--nc-green-dark);
      letter-spacing: -0.3px;
    }
    .logo-tagline {
      font-size: 11px;
      color: var(--nc-text-muted);
      margin-top: 2px;
      display: block;
    }

    /* ── Nav ──────────────────────────── */
    .sidebar-nav {
      padding: 12px 10px;
      flex: 1;
      overflow-y: auto;
    }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 9px 12px;
      border-radius: var(--radius-md);
      cursor: pointer;
      font-size: 14px;
      color: var(--nc-text-muted);
      text-decoration: none;
      transition: background 0.12s, color 0.12s;
      margin-bottom: 2px;

      &:hover { background: #f3f4f6; color: var(--nc-text); }
      &.active {
        background: var(--nc-green-light);
        color: var(--nc-green-dark);
        font-weight: 500;
      }
    }
    .nav-icon { font-size: 16px; width: 20px; text-align: center; }

    /* ── User footer ──────────────────── */
    .sidebar-user {
      padding: 12px 14px;
      border-top: 1px solid var(--nc-border);
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .user-avatar {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: var(--nc-green-light);
      color: var(--nc-green-dark);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      font-weight: 600;
      flex-shrink: 0;
    }
    .user-info {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
    }
    .user-name {
      font-size: 13px;
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .user-email {
      font-size: 11px;
      color: var(--nc-text-muted);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .logout-btn {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 18px;
      color: var(--nc-text-muted);
      padding: 4px;
      border-radius: var(--radius-sm);
      transition: color 0.12s, background 0.12s;
      &:hover { color: var(--nc-coral); background: var(--nc-coral-light); }
    }

    /* ── Main ─────────────────────────── */
    .shell-main {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
    }
  `]
})
export class ShellComponent {

  user        = this.auth.currentUser;
  userInitials = computed(() => {
    const name = this.user()?.fullName ?? '';
    return name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
  });

  navItems: NavItem[] = [
    { label: 'Dashboard', route: '/dashboard', icon: '◈'  },
    { label: 'Meal Log',  route: '/meal-log',  icon: '⬡'  },
    { label: 'AI Coach',  route: '/ai-coach',  icon: '✦'  },
    { label: 'Progress',  route: '/progress',  icon: '↗'  },
    { label: 'Settings',  route: '/settings',  icon: '⚙'  }
  ];

  constructor(private auth: AuthService) {}

  logout(): void { this.auth.logout(); }
}
