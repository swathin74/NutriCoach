import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DailySummary, WeeklyStats } from '../../shared/models/models';

const USE_MOCK = true;

const MOCK_SUMMARY: DailySummary = {
  date: new Date().toISOString().split('T')[0],
  totalCalories: 1480,
  calorieTarget: 2100,
  totalProteinG: 82,
  totalCarbsG: 165,
  totalFatG: 48,
  proteinTargetG: 150,
  carbsTargetG: 240,
  fatTargetG: 70,
  caloriesRemaining: 620,
  currentStreak: 14,
  meals: [
    { id: 1, foodName: 'Oat porridge with berries', mealType: 'BREAKFAST', calories: 420, proteinG: 12, carbsG: 68, fatG: 8, fiberG: 6, servingSize: '1 bowl', notes: '', logDate: new Date().toISOString().split('T')[0], logTime: '07:30' },
    { id: 2, foodName: 'Grilled chicken caesar salad', mealType: 'LUNCH', calories: 540, proteinG: 52, carbsG: 28, fatG: 22, fiberG: 4, servingSize: 'Large', notes: '', logDate: new Date().toISOString().split('T')[0], logTime: '12:45' },
    { id: 3, foodName: 'Apple + almonds', mealType: 'SNACK', calories: 220, proteinG: 5, carbsG: 32, fatG: 11, fiberG: 4, servingSize: '1 serving', notes: '', logDate: new Date().toISOString().split('T')[0], logTime: '15:15' },
    { id: 4, foodName: 'Salmon pasta', mealType: 'DINNER', calories: 300, proteinG: 13, carbsG: 37, fatG: 7, fiberG: 3, servingSize: '1 plate', notes: '', logDate: new Date().toISOString().split('T')[0], logTime: '19:00' }
  ]
};

@Injectable({ providedIn: 'root' })
export class DashboardService {

  constructor(private http: HttpClient) {}

  getDailySummary(): Observable<DailySummary> {
    if (USE_MOCK) return of(MOCK_SUMMARY);
    return this.http.get<DailySummary>(`${environment.apiUrl}/dashboard/today`);
  }

  getWeeklyStats(): Observable<WeeklyStats> {
    if (USE_MOCK) return of({
      dailyCalories: [
        { date: '', dayLabel: 'Mon', calories: 1840 },
        { date: '', dayLabel: 'Tue', calories: 2050 },
        { date: '', dayLabel: 'Wed', calories: 1920 },
        { date: '', dayLabel: 'Thu', calories: 2180 },
        { date: '', dayLabel: 'Fri', calories: 1760 },
        { date: '', dayLabel: 'Sat', calories: 2310 },
        { date: '', dayLabel: 'Sun', calories: 1480 }
      ],
      dailyProtein: [],
      avgCalories: 1934,
      avgProtein: 118,
      avgCarbs: 210,
      avgFat: 58,
      daysLogged: 7
    });
    return this.http.get<WeeklyStats>(`${environment.apiUrl}/dashboard/weekly`);
  }
}