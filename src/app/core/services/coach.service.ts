import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CoachChatRequest, CoachChatResponse } from '../../shared/models/models';

const USE_MOCK = true;

const MOCK_REPLIES: string[] = [
  "Based on your meals today, you're at 1,480 kcal with 82g protein — great breakfast and lunch! For dinner I'd suggest grilled salmon with quinoa to hit your protein goal. That's roughly 520 kcal and 45g protein. 🎯",
  "Your biggest opportunity this week is fiber intake — you're averaging around 18g vs a 30g target. Try adding lentils, chia seeds, or an extra serving of leafy greens to your meals.",
  "Protein consistency is improving! You've averaged 118g this week vs 95g last week. Keep that momentum — aim for 40-50g per meal to hit your 150g daily target.",
  "For a high-protein snack under 200 kcal, try: Greek yogurt (170 kcal, 17g protein), cottage cheese with fruit (160 kcal, 20g protein), or a hard-boiled egg with hummus (180 kcal, 14g protein).",
  "Looking at your weekly pattern, Thursdays are your strongest day nutritionally. Try to replicate those meal choices on days when you're struggling — consistency beats perfection!"
];

let replyIndex = 0;

@Injectable({ providedIn: 'root' })
export class CoachService {

  constructor(private http: HttpClient) {}

  sendMessage(message: string): Observable<CoachChatResponse> {
    if (USE_MOCK) {
      const reply: CoachChatResponse = {
        role: 'assistant',
        message: MOCK_REPLIES[replyIndex % MOCK_REPLIES.length]
      };
      replyIndex++;
      return of(reply).pipe(delay(900));  // simulate network latency
    }
    const req: CoachChatRequest = { message };
    return this.http.post<CoachChatResponse>(`${environment.apiUrl}/coach/chat`, req);
  }

  getHistory(): Observable<CoachChatResponse[]> {
    if (USE_MOCK) return of([
      { role: 'assistant', message: "Hey! 👋 I'm your NutriCoach AI. I can see your meal history and help you hit your nutrition goals. What would you like to know?" }
    ]);
    return this.http.get<CoachChatResponse[]>(`${environment.apiUrl}/coach/history`);
  }
}