import { Component } from '@angular/core';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h1 class="page-title">Settings</h1>
          <p class="page-subtitle">Manage your profile and nutrition goals</p>
        </div>
      </div>
      <div class="card">
        <p style="color:var(--nc-text-muted);font-size:14px;">
          🚧 &nbsp;<strong>Settings</strong> — coming up next!
        </p>
      </div>
    </div>
  `
})
export class SettingsComponent {}
