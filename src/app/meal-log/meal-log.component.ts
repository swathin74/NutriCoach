import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MealService } from '../core/services/meal.service';
import { MealLogResponse, MealLogRequest, MealType } from '../shared/models/models';

const MEAL_META: Record<string, { icon: string; bg: string; tag: string }> = {
  BREAKFAST: { icon: '🌾', bg: '#FAEEDA', tag: 'tag-amber'  },
  LUNCH:     { icon: '🥗', bg: '#E1F5EE', tag: 'tag-green'  },
  DINNER:    { icon: '🍝', bg: '#EEEDFE', tag: 'tag-purple' },
  SNACK:     { icon: '🍎', bg: '#FAECE7', tag: 'tag-coral'  }
};

@Component({
  selector: 'app-meal-log',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="page-container">

      <!-- Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">Meal Log</h1>
          <p class="page-subtitle">{{ today | date:'EEEE, MMMM d' }} · {{ totalCalories }} kcal logged</p>
        </div>
        <button class="btn btn-primary" (click)="toggleForm()">
          {{ showForm ? '✕ Cancel' : '+ Log a meal' }}
        </button>
      </div>

      <!-- Add meal form -->
      <div class="card form-card" *ngIf="showForm">
        <div class="card-title">New meal entry</div>
        <form [formGroup]="mealForm" (ngSubmit)="submitMeal()">

          <div class="form-row">
            <div class="form-group" style="grid-column: span 2">
              <label>Food name</label>
              <input type="text" formControlName="foodName" placeholder="e.g. Grilled salmon with vegetables" />
              <span class="form-error" *ngIf="mealForm.get('foodName')?.touched && mealForm.get('foodName')?.invalid">Food name is required</span>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Meal type</label>
              <select formControlName="mealType">
                <option value="BREAKFAST">🌾 Breakfast</option>
                <option value="LUNCH">🥗 Lunch</option>
                <option value="DINNER">🍝 Dinner</option>
                <option value="SNACK">🍎 Snack</option>
              </select>
            </div>
            <div class="form-group">
              <label>Serving size</label>
              <input type="text" formControlName="servingSize" placeholder="e.g. 1 plate, 200g" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Calories (kcal)</label>
              <input type="number" formControlName="calories" placeholder="0" min="0" />
            </div>
            <div class="form-group">
              <label>Protein (g)</label>
              <input type="number" formControlName="proteinG" placeholder="0" min="0" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Carbs (g)</label>
              <input type="number" formControlName="carbsG" placeholder="0" min="0" />
            </div>
            <div class="form-group">
              <label>Fats (g)</label>
              <input type="number" formControlName="fatG" placeholder="0" min="0" />
            </div>
          </div>

          <!-- Live preview -->
          <div class="preview-strip" *ngIf="mealForm.get('foodName')?.value">
            <span class="preview-name">{{ mealForm.get('foodName')?.value }}</span>
            <span class="tag tag-green">{{ mealForm.get('calories')?.value || 0 }} kcal</span>
            <span class="tag tag-amber">P: {{ mealForm.get('proteinG')?.value || 0 }}g</span>
            <span class="tag tag-purple">C: {{ mealForm.get('carbsG')?.value || 0 }}g</span>
            <span class="tag tag-coral">F: {{ mealForm.get('fatG')?.value || 0 }}g</span>
          </div>

          <div style="display:flex; gap:10px; margin-top:4px;">
            <button type="submit" class="btn btn-primary" [disabled]="mealForm.invalid">
              ✓ Save meal
            </button>
            <button type="button" class="btn" (click)="toggleForm()">Cancel</button>
          </div>

        </form>
      </div>

      <!-- Success toast -->
      <div class="alert alert-success" *ngIf="saved" style="margin-bottom:16px;">
        ✓ Meal logged successfully!
      </div>

      <!-- Daily summary strip -->
      <div class="summary-strip">
        <div class="summary-chip" *ngFor="let m of mealTypeSummary">
          <span class="meal-icon-sm" [style.background]="m.bg">{{ m.icon }}</span>
          <span class="summary-label">{{ m.label }}</span>
          <strong>{{ m.calories }} kcal</strong>
        </div>
      </div>

      <!-- Meal entries -->
      <div class="meal-entries">
        <div class="meal-entry" *ngFor="let meal of meals">
          <div class="entry-icon" [style.background]="meta(meal.mealType).bg">
            {{ meta(meal.mealType).icon }}
          </div>

          <div class="entry-body">
            <div class="entry-name">{{ meal.foodName }}</div>
            <div class="entry-meta">
              <span class="tag" [class]="meta(meal.mealType).tag">{{ meal.mealType | titlecase }}</span>
              <span class="entry-time">{{ meal.logTime }}</span>
              <span *ngIf="meal.servingSize" class="entry-time">· {{ meal.servingSize }}</span>
            </div>
          </div>

          <div class="entry-macros">
            <div class="macro-pill">
              <span class="mp-label">Cal</span>
              <span class="mp-val" style="color:var(--nc-green-dark)">{{ meal.calories }}</span>
            </div>
            <div class="macro-pill">
              <span class="mp-label">P</span>
              <span class="mp-val">{{ meal.proteinG }}g</span>
            </div>
            <div class="macro-pill">
              <span class="mp-label">C</span>
              <span class="mp-val">{{ meal.carbsG }}g</span>
            </div>
            <div class="macro-pill">
              <span class="mp-label">F</span>
              <span class="mp-val">{{ meal.fatG }}g</span>
            </div>
          </div>

          <button class="delete-btn" (click)="deleteMeal(meal.id)" title="Remove">✕</button>
        </div>

        <!-- Empty -->
        <div class="empty-state" *ngIf="meals.length === 0">
          <div class="empty-icon">🍽</div>
          <p>No meals logged yet today</p>
          <button class="btn btn-primary" style="margin-top:12px" (click)="toggleForm()">Log your first meal</button>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .form-card { margin-bottom: 20px; }

    /* Summary strip */
    .summary-strip {
      display: flex; gap: 10px; margin-bottom: 16px; flex-wrap: wrap;
    }
    .summary-chip {
      display: flex; align-items: center; gap: 8px;
      background: white; border: 1px solid var(--nc-border);
      border-radius: 10px; padding: 8px 14px; font-size: 13px;
    }
    .meal-icon-sm {
      width: 28px; height: 28px; border-radius: 7px;
      display: flex; align-items: center; justify-content: center; font-size: 14px;
    }
    .summary-label { color: var(--nc-text-muted); }

    /* Entries */
    .meal-entry {
      display: flex; align-items: center; gap: 14px;
      background: white; border: 1px solid var(--nc-border);
      border-radius: 12px; padding: 12px 14px; margin-bottom: 10px;
      transition: box-shadow 0.15s;
      &:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
    }
    .entry-icon {
      width: 42px; height: 42px; border-radius: 11px;
      display: flex; align-items: center; justify-content: center;
      font-size: 20px; flex-shrink: 0;
    }
    .entry-body { flex: 1; min-width: 0; }
    .entry-name { font-size: 14px; font-weight: 500; margin-bottom: 5px; }
    .entry-meta { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
    .entry-time { font-size: 12px; color: var(--nc-text-muted); }

    /* Macros */
    .entry-macros { display: flex; gap: 10px; flex-shrink: 0; }
    .macro-pill { text-align: center; }
    .mp-label { display: block; font-size: 10px; color: var(--nc-text-muted); }
    .mp-val   { display: block; font-size: 14px; font-weight: 500; }

    /* Delete */
    .delete-btn {
      background: none; border: none; cursor: pointer;
      font-size: 14px; color: #d1d5db; padding: 4px 6px;
      border-radius: 6px; transition: color 0.15s, background 0.15s;
      &:hover { color: var(--nc-coral); background: var(--nc-coral-light); }
    }

    /* Preview strip */
    .preview-strip {
      display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
      padding: 10px 14px; background: var(--nc-bg);
      border-radius: 10px; margin-bottom: 14px;
    }
    .preview-name { font-size: 13px; font-weight: 500; flex: 1; }
  `]
})
export class MealLogComponent implements OnInit {

  meals: MealLogResponse[] = [];
  mealForm: FormGroup;
  showForm = false;
  saved    = false;
  today    = new Date();

  mealTypeSummary: { label: string; icon: string; bg: string; calories: number }[] = [];

  constructor(private mealService: MealService, private fb: FormBuilder) {
    this.mealForm = this.fb.group({
      foodName:    ['', Validators.required],
      mealType:    ['BREAKFAST'],
      servingSize: [''],
      calories:    [null],
      proteinG:    [null],
      carbsG:      [null],
      fatG:        [null],
      fiberG:      [null]
    });
  }

  ngOnInit(): void {
    this.mealService.getMeals().subscribe(meals => {
      this.meals = meals;
      this.buildSummary();
    });
  }

  get totalCalories(): number {
    return this.meals.reduce((sum, m) => sum + (m.calories ?? 0), 0);
  }

  meta(type: string) {
    return MEAL_META[type] ?? { icon: '🍽', bg: '#f3f4f6', tag: '' };
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) this.mealForm.reset({ mealType: 'BREAKFAST' });
  }

  submitMeal(): void {
    if (this.mealForm.invalid) { this.mealForm.markAllAsTouched(); return; }

    const req: MealLogRequest = {
      ...this.mealForm.value,
      mealType: this.mealForm.value.mealType as MealType
    };

    this.mealService.addMeal(req).subscribe(() => {
      this.showForm = false;
      this.saved    = true;
      this.mealForm.reset({ mealType: 'BREAKFAST' });
      setTimeout(() => this.saved = false, 3000);
    });
  }

  deleteMeal(id: number): void {
    this.mealService.deleteMeal(id).subscribe();
  }

  private buildSummary(): void {
    const types = ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK'];
    this.mealTypeSummary = types.map(type => ({
      label:    type.charAt(0) + type.slice(1).toLowerCase(),
      icon:     MEAL_META[type].icon,
      bg:       MEAL_META[type].bg,
      calories: this.meals.filter(m => m.mealType === type).reduce((s, m) => s + (m.calories ?? 0), 0)
    }));
  }
}