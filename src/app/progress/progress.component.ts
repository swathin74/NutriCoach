import {
  Component, OnInit, AfterViewInit,
  ElementRef, ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { ProgressService } from '../core/services/progress.service';
import { WeeklyStats } from '../shared/models/models';

Chart.register(...registerables);

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">

      <!-- Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">Progress</h1>
          <p class="page-subtitle">Your 7-day nutrition trends</p>
        </div>
        <div class="week-badge">Week of May 5 – 11</div>
      </div>

      <div *ngIf="stats">

        <!-- Stat summary cards -->
        <div class="metric-grid" style="margin-bottom:20px">
          <div class="metric-card">
            <div class="metric-label">📅 Days logged</div>
            <div class="metric-value">{{ stats.daysLogged }}<span>/ 7</span></div>
            <div class="metric-change positive">Full week! 🎉</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">🔥 Avg calories</div>
            <div class="metric-value">{{ stats.avgCalories | number:'1.0-0' }}<span>kcal</span></div>
            <div class="metric-change"
              [class.positive]="stats.avgCalories <= 2100"
              [class.negative]="stats.avgCalories > 2100">
              {{ stats.avgCalories <= 2100 ? 'Under target ✓' : 'Over target' }}
            </div>
          </div>
          <div class="metric-card">
            <div class="metric-label">💪 Avg protein</div>
            <div class="metric-value">{{ stats.avgProtein | number:'1.0-0' }}<span>g</span></div>
            <div class="metric-change"
              [class.positive]="stats.avgProtein >= 120"
              [class.negative]="stats.avgProtein < 120">
              {{ stats.avgProtein >= 150 ? 'Goal hit ✓' : (150 - stats.avgProtein | number:'1.0-0') + 'g below goal' }}
            </div>
          </div>
          <div class="metric-card">
            <div class="metric-label">🌾 Avg carbs</div>
            <div class="metric-value">{{ stats.avgCarbs | number:'1.0-0' }}<span>g</span></div>
            <div class="metric-change positive">Within range</div>
          </div>
        </div>

        <!-- Calorie bar chart -->
        <div class="card" style="margin-bottom:16px">
          <div class="card-title">
            Weekly calorie intake
            <span class="card-subtitle">Goal: 2,100 kcal/day</span>
          </div>
          <div class="chart-wrap">
            <canvas #calChart></canvas>
          </div>
        </div>

        <!-- Protein + Macro split -->
        <div class="chart-grid">

          <div class="card">
            <div class="card-title">
              Protein trend
              <span class="card-subtitle">Target: 150g</span>
            </div>
            <div class="chart-wrap">
              <canvas #protChart></canvas>
            </div>
          </div>

          <div class="card">
            <div class="card-title">
              Avg macro split
              <span class="card-subtitle">This week</span>
            </div>
            <div class="donut-wrap">
              <div class="donut-canvas">
                <canvas #macroChart></canvas>
              </div>
              <div class="donut-legend">
                <div class="legend-row" *ngFor="let m of macroLegend">
                  <span class="dot" [style.background]="m.color"></span>
                  <span class="leg-name">{{ m.label }}</span>
                  <strong>{{ m.value }}g</strong>
                  <span class="leg-pct">{{ m.pct }}%</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- Insight cards -->
        <div class="insights-row">
          <div class="insight-card insight-green">
            <div class="insight-icon">✅</div>
            <div>
              <div class="insight-title">Calorie control</div>
              <div class="insight-body">You stayed under your 2,100 kcal target on 5 out of 7 days this week.</div>
            </div>
          </div>
          <div class="insight-card insight-amber">
            <div class="insight-icon">⚠️</div>
            <div>
              <div class="insight-title">Protein gap</div>
              <div class="insight-body">Average protein is 111g vs your 150g goal. Add a protein-rich snack each day.</div>
            </div>
          </div>
          <div class="insight-card insight-purple">
            <div class="insight-icon">💡</div>
            <div>
              <div class="insight-title">Best day</div>
              <div class="insight-body">Thursday was your strongest day — 2,180 kcal and 142g protein. Replicate those meals!</div>
            </div>
          </div>
        </div>

      </div>

      <!-- Loading -->
      <div class="spinner-wrap" *ngIf="!stats">
        <div class="spinner"></div>
      </div>

    </div>
  `,
  styles: [`
    .week-badge {
      font-size: 13px; font-weight: 500;
      background: var(--nc-purple-light); color: var(--nc-purple);
      padding: 6px 14px; border-radius: 20px;
    }

    .chart-wrap { position: relative; height: 220px; }

    /* Donut */
    .donut-wrap { display: flex; align-items: center; gap: 20px; }
    .donut-canvas { position: relative; width: 160px; height: 160px; flex-shrink: 0; }
    .donut-legend { flex: 1; }
    .legend-row {
      display: flex; align-items: center; gap: 8px;
      font-size: 13px; margin-bottom: 10px;
    }
    .dot { width: 10px; height: 10px; border-radius: 3px; flex-shrink: 0; }
    .leg-name { flex: 1; color: var(--nc-text-muted); }
    .leg-pct { font-size: 12px; color: var(--nc-text-muted); }

    /* Insights */
    .insights-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px; margin-top: 16px;
    }
    .insight-card {
      display: flex; gap: 12px; align-items: flex-start;
      padding: 14px 16px; border-radius: var(--radius-lg);
    }
    .insight-green  { background: var(--nc-green-light);  }
    .insight-amber  { background: var(--nc-amber-light);  }
    .insight-purple { background: var(--nc-purple-light); }
    .insight-icon { font-size: 20px; flex-shrink: 0; margin-top: 2px; }
    .insight-title {
      font-size: 13px; font-weight: 600; margin-bottom: 4px;
    }
    .insight-body { font-size: 13px; line-height: 1.5; color: #374151; }
  `]
})
export class ProgressComponent implements OnInit, AfterViewInit {

  @ViewChild('calChart')   calChartRef!:   ElementRef<HTMLCanvasElement>;
  @ViewChild('protChart')  protChartRef!:  ElementRef<HTMLCanvasElement>;
  @ViewChild('macroChart') macroChartRef!: ElementRef<HTMLCanvasElement>;

  stats: WeeklyStats | null = null;

  macroLegend = [
    { label: 'Carbs',   value: 210, pct: 43, color: '#BA7517' },
    { label: 'Protein', value: 111, pct: 31, color: '#1D9E75' },
    { label: 'Fat',     value:  58, pct: 26, color: '#534AB7' }
  ];

  constructor(private progressService: ProgressService) {}

  ngOnInit(): void {
    this.progressService.getWeeklyStats().subscribe(data => {
      this.stats = data;
      setTimeout(() => this.drawCharts(), 100);
    });
  }

  ngAfterViewInit(): void {}

  private drawCharts(): void {
    if (!this.stats) return;
    this.drawCalorieChart();
    this.drawProteinChart();
    this.drawMacroChart();
  }

  private drawCalorieChart(): void {
    const labels  = this.stats!.dailyCalories.map(d => d.dayLabel);
    const values  = this.stats!.dailyCalories.map(d => d.calories);
    const goal    = Array(7).fill(2100);

    new Chart(this.calChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Calories',
            data: values,
            backgroundColor: values.map(v => v > 2100 ? '#D85A30' : '#1D9E75'),
            borderRadius: 6,
            borderSkipped: false
          },
          {
            label: 'Goal',
            data: goal,
            type: 'line',
            borderColor: '#BA7517',
            borderDash: [5, 4],
            borderWidth: 2,
            pointRadius: 0,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { mode: 'index', intersect: false }
        },
        scales: {
          y: {
            beginAtZero: false,
            min: 1200,
            grid: { color: '#f3f4f6' },
            ticks: { color: '#9ca3af' }
          },
          x: { grid: { display: false }, ticks: { color: '#9ca3af' } }
        }
      }
    });
  }

  private drawProteinChart(): void {
    const labels = this.stats!.dailyProtein.map(d => d.dayLabel);
    const values = this.stats!.dailyProtein.map(d => d.protein);
    const goal   = Array(7).fill(150);

    new Chart(this.protChartRef.nativeElement, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Protein (g)',
            data: values,
            borderColor: '#534AB7',
            backgroundColor: 'rgba(83,74,183,0.08)',
            fill: true,
            tension: 0.4,
            borderWidth: 2.5,
            pointRadius: 4,
            pointBackgroundColor: '#534AB7'
          },
          {
            label: 'Goal',
            data: goal,
            borderColor: '#1D9E75',
            borderDash: [5, 4],
            borderWidth: 2,
            pointRadius: 0,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            min: 60,
            grid: { color: '#f3f4f6' },
            ticks: { color: '#9ca3af' }
          },
          x: { grid: { display: false }, ticks: { color: '#9ca3af' } }
        }
      }
    });
  }

  private drawMacroChart(): void {
    new Chart(this.macroChartRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Carbs', 'Protein', 'Fat'],
        datasets: [{
          data: [210, 111, 58],
          backgroundColor: ['#BA7517', '#1D9E75', '#534AB7'],
          borderWidth: 0,
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '68%',
        plugins: { legend: { display: false } }
      }
    });
  }
}