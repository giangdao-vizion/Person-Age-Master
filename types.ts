
export interface AgeResult {
  years: number;
  months: number;
  weeks: number;
  days: number;
  totalDays: number;
  totalHours: number;
  totalMinutes: number;
  zodiacSign: string;
}

export interface FunFacts {
  historicalEvents: string[];
  personalityTraits: string;
  famousBirthdays: string[];
  zodiacWisdom: string;
}

export enum CalculationStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
