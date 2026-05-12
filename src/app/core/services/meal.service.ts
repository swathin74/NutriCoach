import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MealLogRequest, MealLogResponse } from '../../shared/models/models';

const USE_MOCK = true;

let mockIdCounter = 5;
const mockMeals: MealLogResponse[] = [
  { id: 1, foodName: 'Oat porridge with berries', mealType: 'BREAKFAST', calories: 420, proteinG: 12, carbsG: 68, fatG: 8, fiberG: 6, servingSize: '1 bowl', notes: '', logDate: today(), logTime: '07:30' },
  { id: 2, foodName: 'Grilled chicken caesar salad', mealType: 'LUNCH', calories: 540, proteinG: 52, carbsG: 28, fatG: 22, fiberG: 4, servingSize: 'Large', notes: '', logDate: today(), logTime: '12:45' },
  { id: 3, foodName: 'Apple + almonds', mealType: 'SNACK', calories: 220, proteinG: 5, carbsG: 32, fatG: 11, fiberG: 4, servingSize: '1 serving', notes: '', logDate: today(), logTime: '15:15' },
  { id: 4, foodName: 'Salmon pasta', mealType: 'DINNER', calories: 300, proteinG: 13, carbsG: 37, fatG: 7, fiberG: 3, servingSize: '1 plate', notes: '', logDate: today(), logTime: '19:00' }
];

function today(): string {
  return new Date().toISOString().split('T')[0];
}

@Injectable({ providedIn: 'root' })
export class MealService {

  private mealsSubject = new BehaviorSubject<MealLogResponse[]>([...mockMeals]);
  meals$ = this.mealsSubject.asObservable();

  constructor(private http: HttpClient) {}

  getMeals(date?: string): Observable<MealLogResponse[]> {
    if (USE_MOCK) return this.meals$;
    const params = date ? `?date=${date}` : '';
    return this.http.get<MealLogResponse[]>(`${environment.apiUrl}/meals${params}`);
  }

  addMeal(req: MealLogRequest): Observable<MealLogResponse> {
    if (USE_MOCK) {
      const newMeal: MealLogResponse = {
        id: mockIdCounter++,
        foodName:   req.foodName,
        mealType:   req.mealType,
        calories:   req.calories   ?? 0,
        proteinG:   req.proteinG   ?? 0,
        carbsG:     req.carbsG     ?? 0,
        fatG:       req.fatG       ?? 0,
        fiberG:     req.fiberG     ?? 0,
        servingSize: req.servingSize ?? '',
        notes:      req.notes      ?? '',
        logDate:    req.logDate    ?? today(),
        logTime:    req.logTime    ?? new Date().toTimeString().slice(0, 5)
      };
      this.mealsSubject.next([...this.mealsSubject.value, newMeal]);
      return of(newMeal);
    }
    return this.http.post<MealLogResponse>(`${environment.apiUrl}/meals`, req);
  }

  deleteMeal(id: number): Observable<void> {
    if (USE_MOCK) {
      this.mealsSubject.next(this.mealsSubject.value.filter(m => m.id !== id));
      return of(void 0);
    }
    return this.http.delete<void>(`${environment.apiUrl}/meals/${id}`);
  }
}