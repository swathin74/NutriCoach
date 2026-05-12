import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { DashboardService } from '../core/services/dashboard.service';
import { DailySummary } from '../shared/models/models';

Chart.register(...registerables);

const MEAL_META: Record<string, { icon: string; bg: string }> = {
  BREAKFAST: { icon: '🌾', bg: '#FAEEDA' },
  LUNCH:     { icon: '🥗', bg: '#E1F5EE' },
  DINNER:    { icon: '🍝', bg: '#EEEDFE' },
  SNACK:     { icon: '🍎', bg: '#FAECE7' }
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-container">

      <!-- Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">Today's Overview</h1>
          <p class="page-subtitle">{{ today | date:'EEEE, MMMM d' }} · {{ summary?.currentStreak }} day streak 🔥</p>
        </div>
        <a routerLink="/meal-log" class="btn btn-primary">+ Log a meal</a>
      </div>

      <div *ngIf="summary">

        <!-- Metric cards -->
        <div class="metric-grid">
          <div class="metric-card">
            <div class="metric-label">🔥 Calories</div>
            <div class="metric-value">{{ summary.totalCalories }}<span>/ {{ summary.calorieTarget }}</span></div>
            <div class="metric-change positive">{{ summary.caloriesRemaining }} kcal remaining</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">💪 Protein</div>
            <div class="metric-value">{{ summary.totalProteinG | number:'1.0-0' }}<span>g / {{ summary.proteinTargetG }}g</span></div>
            <div class="metric-change" [class.positive]="summary.totalProteinG >= summary.proteinTargetG" [class.negative]="summary.totalProteinG < summary.proteinTargetG">
              {{ summary.proteinTargetG - summary.totalProteinG > 0 ? (summary.proteinTargetG - summary.totalProteinG) + 'g to goal' : 'Goal reached ✓' }}
            </div>
          </div>
          <div class="metric-card">
            <div class="metric-label">🌾 Carbs</div>
            <div class="metric-value">{{ summary.totalCarbsG | number:'1.0-0' }}<span>g / {{ summary.carbsTargetG }}g</span></div>
            <div class="metric-change positive">On track</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">🫒 Fats</div>
            <div class="metric-value">{{ summary.totalFatG | number:'1.0-0' }}<span>g / {{ summary.fatTargetG }}g</span></div>
            <div class="metric-change positive">{{ summary.fatTargetG - summary.totalFatG }}g remaining</div>
          </div>
        </div>

        <!-- Charts row -->
        <div class="chart-grid">

          <!-- Calorie ring -->
          <div class="card">
            <div class="card-title">Calorie progress <span class="card-subtitle">Today</span></div>
            <div class="ring-wrap">
              <div class="ring-canvas-wrap">
                <canvas #calorieRing width="110" height="110"></canvas>
                <div class="ring-center">
                  <span class="ring-pct">{{ caloriePercent }}%</span>
                  <span class="ring-label-sm">used</span>
                </div>
              </div>
              <div class="ring-legend">
                <div class="legend-row"><span class="dot" style="background:var(--nc-green)"></span><span class="leg-name">Consumed</span><strong>{{ summary.totalCalories }}</strong></div>
                <div class="legend-row"><span class="dot" style="background:#e5e7eb"></span><span class="leg-name">Remaining</span><strong>{{ summary.caloriesRemaining }}</strong></div>
              </div>
            </div>
          </div>

          <!-- Macro bars -->
          <div class="card">
            <div class="card-title">Macros breakdown</div>
            <div class="macro-bar" *ngFor="let m of macros">
              <div class="macro-bar-header">
                <span>{{ m.label }}</span>
                <span>{{ m.value }}{{ m.unit }} / {{ m.target }}{{ m.unit }}</span>
              </div>
              <div class="bar-track">
                <div class="bar-fill" [style.width.%]="m.pct" [style.background]="m.color"></div>
              </div>
            </div>
          </div>

        </div>

        <!-- Meals + Streak row -->
        <div class="chart-grid">

          <!-- Today's meals -->
          <div class="card">
            <div class="card-title">
              Today's meals
              <a routerLink="/meal-log" class="btn btn-ghost btn-sm">View all</a>
            </div>
            <div class="meal-list">
              <div class="meal-row" *ngFor="let meal of summary.meals">
                <div class="meal-icon" [style.background]="mealMeta(meal.mealType).bg">
                  {{ mealMeta(meal.mealType).icon }}
                </div>
                <div class="meal-info">
                  <div class="meal-name">{{ meal.foodName }}</div>
                  <div class="meal-time">{{ meal.mealType | titlecase }} · {{ meal.logTime }}</div>
                </div>
                <div class="meal-kcal">{{ meal.calories }} kcal</div>
              </div>
              <div class="empty-state" *ngIf="summary.meals.length === 0">
                <p>No meals logged yet today</p>
              </div>
            </div>
          </div>

          <!-- Streak -->
          <div class="card">
            <div class="card-title">{{ summary.currentStreak }}-day streak 🔥</div>
            <p style="font-size:13px;color:var(--nc-text-muted);margin-bottom:12px;">
              Logging every day builds the habit
            </p>
            <div class="streak-grid">
              <div
                *ngFor="let day of streakDays"
                class="streak-cell"
                [class.logged]="day.logged"
                [title]="day.label"
              >{{ day.num }}</div>
            </div>
            <div class="streak-legend">
              <span><span class="dot" style="background:var(--nc-green)"></span>Logged</span>
              <span><span class="dot" style="background:#e5e7eb;border:1px solid #d1d5db"></span>Missed</span>
            </div>
            <div class="alert alert-success" style="margin-top:14px;">
              <strong>Keep it up! 🎯</strong><br>
              You've hit your protein goal {{ proteinDays }} out of the last {{ summary.currentStreak }} days.
            </div>
          </div>

        </div>

      </div>

      <!-- Loading -->
      <div class="spinner-wrap" *ngIf="!summary">
        <div class="spinner"></div>
      </div>

    </div>
  `,
  styles: [`
    /* Ring */
    .ring-wrap { display: flex; align-items: center; gap: 24px; }
    .ring-canvas-wrap { position: relative; width: 110px; height: 110px; flex-shrink: 0; }
    .ring-center {
      position: absolute; top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      text-align: center; line-height: 1.2;
    }
    .ring-pct { font-size: 20px; font-weight: 600; display: block; }
    .ring-label-sm { font-size: 11px; color: var(--nc-text-muted); }
    .ring-legend { flex: 1; }
    .legend-row {
      display: flex; align-items: center; gap: 8px;
      font-size: 13px; margin-bottom: 10px;
    }
    .dot { width: 10px; height: 10px; border-radius: 3px; flex-shrink: 0; }
    .leg-name { flex: 1; color: var(--nc-text-muted); }

    /* Macro bars */
    .macro-bar { margin-bottom: 12px; }
    .macro-bar-header {
      display: flex; justify-content: space-between;
      font-size: 13px; margin-bottom: 5px;
      span:last-child { font-weight: 500; }
    }

    /* Meals */
    .meal-list { }
    .meal-row {
      display: flex; align-items: center; gap: 12px;
      padding: 9px 0; border-bottom: 1px solid var(--nc-border);
      &:last-child { border-bottom: none; }
    }
    .meal-icon {
      width: 38px; height: 38px; border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      font-size: 18px; flex-shrink: 0;
    }
    .meal-info { flex: 1; }
    .meal-name { font-size: 14px; font-weight: 500; }
    .meal-time { font-size: 12px; color: var(--nc-text-muted); margin-top: 2px; }
    .meal-kcal { font-size: 14px; font-weight: 500; color: var(--nc-green-dark); }

    /* Streak */
    .streak-grid {
      display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 10px;
    }
    .streak-cell {
      width: 28px; height: 28px; border-radius: 6px;
      background: #f3f4f6; font-size: 10px; color: #9ca3af;
      display: flex; align-items: center; justify-content: center;
      &.logged { background: var(--nc-green); color: white; font-weight: 500; }
    }
    .streak-legend {
      display: flex; gap: 14px; font-size: 12px; color: var(--nc-text-muted);
      align-items: center;
      span { display: flex; align-items: center; gap: 5px; }
      .dot { width: 8px; height: 8px; border-radius: 50%; }
    }
  `]
})
export class DashboardComponent implements OnInit, AfterViewInit {

  @ViewChild('calorieRing') calorieRingRef!: ElementRef<HTMLCanvasElement>;

  summary: DailySummary | null = null;
  today = new Date();
  caloriePercent = 0;
  proteinDays = 9;

  macros: { label: string; value: number; target: number; unit: string; pct: number; color: string }[] = [];

  streakDays: { num: number; label: string; logged: boolean }[] = [];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getDailySummary().subscribe(data => {
      this.summary = data;
      this.caloriePercent = Math.round((data.totalCalories / data.calorieTarget) * 100);
      this.macros = [
        { label: 'Protein',       value: data.totalProteinG, target: data.proteinTargetG, unit: 'g', pct: Math.min(100, (data.totalProteinG / data.proteinTargetG) * 100), color: 'var(--nc-green)'  },
        { label: 'Carbohydrates', value: data.totalCarbsG,   target: data.carbsTargetG,   unit: 'g', pct: Math.min(100, (data.totalCarbsG   / data.carbsTargetG)   * 100), color: 'var(--nc-amber)'  },
        { label: 'Fats',          value: data.totalFatG,     target: data.fatTargetG,     unit: 'g', pct: Math.min(100, (data.totalFatG     / data.fatTargetG)     * 100), color: 'var(--nc-purple)' },
      ];
      this.buildStreak(data.currentStreak);
    });
  }

  ngAfterViewInit(): void {
    // Chart drawn after summary loads — handled via setTimeout to let DOM settle
    setTimeout(() => this.drawRing(), 200);
  }

  mealMeta(type: string) {
    return MEAL_META[type] ?? { icon: '🍽', bg: '#f3f4f6' };
  }

  private buildStreak(streak: number): void {
    const today = new Date();
    this.streakDays = Array.from({ length: 14 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (13 - i));
      return {
        num: d.getDate(),
        label: d.toDateString(),
        logged: i >= (14 - streak)
      };
    });
  }

  private drawRing(): void {
    if (!this.calorieRingRef || !this.summary) return;
    const consumed  = this.summary.totalCalories;
    const remaining = this.summary.caloriesRemaining;
    new Chart(this.calorieRingRef.nativeElement, {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [consumed, remaining],
          backgroundColor: ['#1D9E75', '#e5e7eb'],
          borderWidth: 0,
          hoverOffset: 4
        }]
      },
      options: {
        cutout: '72%',
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        animation: { duration: 600 }
      }
    });
  }
}