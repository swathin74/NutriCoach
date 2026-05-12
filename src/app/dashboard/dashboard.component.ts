import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h1 class="page-title">Dashboard</h1>
          <p class="page-subtitle">Your daily nutrition at a glance</p>
        </div>
      </div>
      <div class="card">
        <p style="color:var(--nc-text-muted);font-size:14px;">
          🚧 &nbsp;<strong>Dashboard</strong> — coming up next!
        </p>
      </div>
    </div>
  `
})
export class DashboardComponent {}
