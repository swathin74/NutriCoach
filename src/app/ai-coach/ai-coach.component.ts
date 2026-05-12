import { Component } from '@angular/core';

@Component({
  selector: 'app-ai-coach',
  standalone: true,
  imports: [],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h1 class="page-title">AI Coach</h1>
          <p class="page-subtitle">Your personal nutrition advisor</p>
        </div>
      </div>
      <div class="card">
        <p style="color:var(--nc-text-muted);font-size:14px;">
          🚧 &nbsp;<strong>AI Coach</strong> — coming up next!
        </p>
      </div>
    </div>
  `
})
export class AiCoachComponent {}
