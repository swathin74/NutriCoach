import { Component } from '@angular/core';

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h1 class="page-title">Progress</h1>
          <p class="page-subtitle">Track your nutrition trends over time</p>
        </div>
      </div>
      <div class="card">
        <p style="color:var(--nc-text-muted);font-size:14px;">
          🚧 &nbsp;<strong>Progress</strong> — coming up next!
        </p>
      </div>
    </div>
  `
})
export class ProgressComponent {}
