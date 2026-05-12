import { Component } from '@angular/core';

@Component({
  selector: 'app-meal-log',
  standalone: true,
  imports: [],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h1 class="page-title">Meal Log</h1>
          <p class="page-subtitle">Log and review your meals</p>
        </div>
      </div>
      <div class="card">
        <p style="color:var(--nc-text-muted);font-size:14px;">
          🚧 &nbsp;<strong>Meal Log</strong> — coming up next!
        </p>
      </div>
    </div>
  `
})
export class MealLogComponent {}
