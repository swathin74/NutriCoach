import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="page-container">

      <!-- Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">Settings</h1>
          <p class="page-subtitle">Manage your profile and nutrition goals</p>
        </div>
      </div>

      <!-- Success toast -->
      <div class="alert alert-success" *ngIf="saved" style="margin-bottom:20px">
        ✓ Changes saved successfully!
      </div>

      <div class="settings-grid">

        <!-- Profile card -->
        <div class="card">
          <div class="card-title">Profile</div>
          <form [formGroup]="profileForm" (ngSubmit)="saveProfile()">

            <div class="avatar-row">
              <div class="big-avatar">{{ initials }}</div>
              <div>
                <div style="font-size:15px;font-weight:500">{{ profileForm.get('fullName')?.value }}</div>
                <div style="font-size:13px;color:var(--nc-text-muted)">{{ profileForm.get('email')?.value }}</div>
              </div>
            </div>

            <div class="form-group">
              <label>Full name</label>
              <input type="text" formControlName="fullName" placeholder="Your full name" />
            </div>

            <div class="form-group">
              <label>Email address</label>
              <input type="email" formControlName="email" placeholder="you@example.com" />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Age</label>
                <input type="number" formControlName="age" placeholder="29" min="10" max="120" />
              </div>
              <div class="form-group">
                <label>Weight (kg)</label>
                <input type="number" formControlName="weightKg" placeholder="70" min="30" max="300" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Height (cm)</label>
                <input type="number" formControlName="heightCm" placeholder="175" min="100" max="250" />
              </div>
              <div class="form-group">
                <label>Gender</label>
                <select formControlName="gender">
                  <option value="">Prefer not to say</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <button type="submit" class="btn btn-primary">Save profile</button>

          </form>
        </div>

        <!-- Nutrition goals card -->
        <div class="card">
          <div class="card-title">Nutrition goals</div>
          <form [formGroup]="goalsForm" (ngSubmit)="saveGoals()">

            <div class="form-group">
              <label>Primary goal</label>
              <select formControlName="goal">
                <option value="WEIGHT_LOSS">🎯 Weight loss</option>
                <option value="MUSCLE_GAIN">💪 Muscle gain</option>
                <option value="MAINTAIN_WEIGHT">⚖️ Maintain weight</option>
              </select>
            </div>

            <div class="goal-preview" [class]="goalClass">
              {{ goalDescription }}
            </div>

            <div class="form-group">
              <label>Daily calorie target (kcal)</label>
              <input type="number" formControlName="dailyCalorieTarget" placeholder="2100" min="1000" max="5000" />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Protein (g)</label>
                <input type="number" formControlName="proteinTargetG" placeholder="150" min="0" />
              </div>
              <div class="form-group">
                <label>Carbs (g)</label>
                <input type="number" formControlName="carbsTargetG" placeholder="240" min="0" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Fats (g)</label>
                <input type="number" formControlName="fatTargetG" placeholder="70" min="0" />
              </div>
              <div class="form-group">
                <label>Fiber (g)</label>
                <input type="number" formControlName="fiberTargetG" placeholder="30" min="0" />
              </div>
            </div>

            <!-- Macro split preview -->
            <div class="macro-preview">
              <div class="macro-preview-label">
                <span>Macro split preview</span>
                <span>{{ totalMacroCalories }} kcal from macros</span>
              </div>
              <div class="bar-track" style="height:10px;border-radius:6px;overflow:hidden;display:flex;gap:0">
                <div [style.width.%]="proteinPct" style="background:var(--nc-green);transition:width 0.3s"></div>
                <div [style.width.%]="carbsPct"   style="background:var(--nc-amber);transition:width 0.3s"></div>
                <div [style.width.%]="fatPct"     style="background:var(--nc-purple);transition:width 0.3s"></div>
              </div>
              <div class="macro-legend">
                <span><i style="background:var(--nc-green)"></i>Protein {{ proteinPct }}%</span>
                <span><i style="background:var(--nc-amber)"></i>Carbs {{ carbsPct }}%</span>
                <span><i style="background:var(--nc-purple)"></i>Fat {{ fatPct }}%</span>
              </div>
            </div>

            <button type="submit" class="btn btn-primary">Save goals</button>

          </form>
        </div>

      </div>

      <!-- Danger zone -->
      <div class="card danger-card">
        <div class="card-title" style="color:var(--nc-coral)">Danger zone</div>
        <div class="danger-row">
          <div>
            <div style="font-size:14px;font-weight:500">Sign out of all devices</div>
            <div style="font-size:13px;color:var(--nc-text-muted);margin-top:2px">This will invalidate your session token</div>
          </div>
          <button class="btn btn-danger" (click)="logout()">Sign out</button>
        </div>
        <hr class="divider">
        <div class="danger-row">
          <div>
            <div style="font-size:14px;font-weight:500">Delete account</div>
            <div style="font-size:13px;color:var(--nc-text-muted);margin-top:2px">Permanently delete your data — cannot be undone</div>
          </div>
          <button class="btn btn-danger" (click)="confirmDelete()">Delete account</button>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .settings-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 20px;
    }

    /* Avatar */
    .avatar-row {
      display: flex; align-items: center; gap: 14px;
      margin-bottom: 20px;
      padding: 14px;
      background: var(--nc-bg);
      border-radius: var(--radius-md);
    }
    .big-avatar {
      width: 52px; height: 52px; border-radius: 50%;
      background: var(--nc-green-light); color: var(--nc-green-dark);
      display: flex; align-items: center; justify-content: center;
      font-size: 18px; font-weight: 600; flex-shrink: 0;
    }

    /* Goal preview */
    .goal-preview {
      font-size: 13px; line-height: 1.5;
      padding: 10px 14px; border-radius: var(--radius-md);
      margin-bottom: 16px;
    }
    .goal-loss    { background: var(--nc-green-light);  color: var(--nc-green-dark); }
    .goal-gain    { background: var(--nc-purple-light); color: var(--nc-purple);     }
    .goal-maintain{ background: var(--nc-amber-light);  color: var(--nc-amber);      }

    /* Macro split preview */
    .macro-preview { margin-bottom: 18px; }
    .macro-preview-label {
      display: flex; justify-content: space-between;
      font-size: 13px; margin-bottom: 6px;
      color: var(--nc-text-muted);
    }
    .macro-legend {
      display: flex; gap: 14px; margin-top: 7px;
      font-size: 12px; color: var(--nc-text-muted);
      span { display: flex; align-items: center; gap: 5px; }
      i { display: inline-block; width: 8px; height: 8px; border-radius: 2px; }
    }

    /* Danger zone */
    .danger-card { border-color: #fecaca; }
    .danger-row {
      display: flex; align-items: center;
      justify-content: space-between; gap: 16px;
    }
  `]
})
export class SettingsComponent implements OnInit {

  profileForm!: FormGroup;
  goalsForm!:   FormGroup;
  saved = false;

  constructor(private fb: FormBuilder, private auth: AuthService) {}

  ngOnInit(): void {
    const user = this.auth.currentUser();

    this.profileForm = this.fb.group({
      fullName: [user?.fullName ?? '',  Validators.required],
      email:    [user?.email    ?? '',  [Validators.required, Validators.email]],
      age:      [null],
      weightKg: [null],
      heightCm: [null],
      gender:   ['']
    });

    this.goalsForm = this.fb.group({
      goal:               [user?.goal ?? 'WEIGHT_LOSS'],
      dailyCalorieTarget: [user?.dailyCalorieTarget ?? 2100],
      proteinTargetG:     [user?.proteinTargetG     ?? 150],
      carbsTargetG:       [240],
      fatTargetG:         [70],
      fiberTargetG:       [30]
    });
  }

  get initials(): string {
    return (this.profileForm.get('fullName')?.value ?? '')
      .split(' ').map((w: string) => w[0]).join('').substring(0, 2).toUpperCase();
  }

  get goalClass(): string {
    const g = this.goalsForm.get('goal')?.value;
    return g === 'WEIGHT_LOSS' ? 'goal-preview goal-loss'
         : g === 'MUSCLE_GAIN' ? 'goal-preview goal-gain'
         : 'goal-preview goal-maintain';
  }

  get goalDescription(): string {
    const g = this.goalsForm.get('goal')?.value;
    return g === 'WEIGHT_LOSS'    ? '🎯 Calorie deficit mode — focus on hitting protein to preserve muscle while losing fat.'
         : g === 'MUSCLE_GAIN'    ? '💪 Calorie surplus mode — prioritise protein and carbs to fuel muscle growth.'
         : '⚖️ Maintenance mode — balanced macros to sustain your current weight and performance.';
  }

  get totalMacroCalories(): number {
    const p = +(this.goalsForm.get('proteinTargetG')?.value ?? 0);
    const c = +(this.goalsForm.get('carbsTargetG')?.value   ?? 0);
    const f = +(this.goalsForm.get('fatTargetG')?.value     ?? 0);
    return p * 4 + c * 4 + f * 9;
  }

  get proteinPct(): number { return this.macroPercent('proteinTargetG', 4); }
  get carbsPct():   number { return this.macroPercent('carbsTargetG',   4); }
  get fatPct():     number { return this.macroPercent('fatTargetG',     9); }

  private macroPercent(field: string, cal: number): number {
    const total = this.totalMacroCalories;
    if (!total) return 0;
    return Math.round((+(this.goalsForm.get(field)?.value ?? 0) * cal / total) * 100);
  }

  saveProfile(): void {
    if (this.profileForm.invalid) { this.profileForm.markAllAsTouched(); return; }
    // TODO: call API when backend is ready
    this.flash();
  }

  saveGoals(): void {
    // TODO: call API when backend is ready
    this.flash();
  }

  logout(): void { this.auth.logout(); }

  confirmDelete(): void {
    if (confirm('Are you sure? This cannot be undone.')) {
      this.auth.logout();
    }
  }

  private flash(): void {
    this.saved = true;
    setTimeout(() => this.saved = false, 3000);
  }
}