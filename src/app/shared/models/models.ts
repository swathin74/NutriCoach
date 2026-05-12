// ─── Auth ────────────────────────────────────────
export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  age?: number;
  weightKg?: number;
  heightCm?: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  userId: number;
  fullName: string;
  email: string;
  goal: string;
  dailyCalorieTarget: number;
  proteinTargetG: number;
}

// ─── Meals ───────────────────────────────────────
export type MealType = 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK';

export interface MealLogRequest {
  foodName: string;
  mealType: MealType;
  calories?: number;
  proteinG?: number;
  carbsG?: number;
  fatG?: number;
  fiberG?: number;
  servingSize?: string;
  notes?: string;
  logDate?: string;
  logTime?: string;
}

export interface MealLogResponse {
  id: number;
  foodName: string;
  mealType: MealType;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  servingSize: string;
  notes: string;
  logDate: string;
  logTime: string;
}

// ─── Dashboard ───────────────────────────────────
export interface DailySummary {
  date: string;
  totalCalories: number;
  calorieTarget: number;
  totalProteinG: number;
  totalCarbsG: number;
  totalFatG: number;
  proteinTargetG: number;
  carbsTargetG: number;
  fatTargetG: number;
  caloriesRemaining: number;
  currentStreak: number;
  meals: MealLogResponse[];
}

export interface WeeklyStats {
  dailyCalories: DailyCalories[];
  dailyProtein: DailyProtein[];
  avgCalories: number;
  avgProtein: number;
  avgCarbs: number;
  avgFat: number;
  daysLogged: number;
}

export interface DailyCalories { date: string; dayLabel: string; calories: number; }
export interface DailyProtein  { date: string; dayLabel: string; protein: number;  }

// ─── AI Coach ────────────────────────────────────
export interface CoachChatRequest  { message: string; }
export interface CoachChatResponse { message: string; role: 'user' | 'assistant'; }

// ─── Profile ─────────────────────────────────────
export interface UpdateProfileRequest {
  fullName?: string;
  age?: number;
  weightKg?: number;
  heightCm?: number;
  goal?: string;
  dailyCalorieTarget?: number;
  proteinTargetG?: number;
  carbsTargetG?: number;
  fatTargetG?: number;
}
