import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { WeeklyStats } from '../../shared/models/models';

const USE_MOCK = true;

const MOCK_WEEKLY: WeeklyStats = {
  dailyCalories: [
    { date: '', dayLabel: 'Mon', calories: 1840 },
    { date: '', dayLabel: 'Tue', calories: 2050 },
    { date: '', dayLabel: 'Wed', calories: 1920 },
    { date: '', dayLabel: 'Thu', calories: 2180 },
    { date: '', dayLabel: 'Fri', calories: 1760 },
    { date: '', dayLabel: 'Sat', calories: 2310 },
    { date: '', dayLabel: 'Sun', calories: 1480 }
  ],
  dailyProtein: [
    { date: '', dayLabel: 'Mon', protein: 95  },
    { date: '', dayLabel: 'Tue', protein: 132 },
    { date: '', dayLabel: 'Wed', protein: 108 },
    { date: '', dayLabel: 'Thu', protein: 142 },
    { date: '', dayLabel: 'Fri', protein: 98  },
    { date: '', dayLabel: 'Sat', protein: 125 },
    { date: '', dayLabel: 'Sun', protein: 82  }
  ],
  avgCalories: 1934,
  avgProtein:  111,
  avgCarbs:    210,
  avgFat:       58,
  daysLogged:    7
};

@Injectable({ providedIn: 'root' })
export class ProgressService {

  constructor(private http: HttpClient) {}

  getWeeklyStats(): Observable<WeeklyStats> {
    if (USE_MOCK) return of(MOCK_WEEKLY);
    return this.http.get<WeeklyStats>(`${environment.apiUrl}/dashboard/weekly`);
  }
}