
import { AgeResult } from '../types';

export const calculatePreciseAge = (birthDate: Date): AgeResult => {
  const today = new Date();
  
  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();

  // Adjustment for months and years
  if (days < 0) {
    months--;
    const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += lastMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  const weeks = Math.floor(days / 7);
  const remainingDays = days % 7;

  // Totals
  const diffTime = Math.abs(today.getTime() - birthDate.getTime());
  const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const totalHours = Math.floor(diffTime / (1000 * 60 * 60));
  const totalMinutes = Math.floor(diffTime / (1000 * 60));

  return {
    years,
    months,
    weeks,
    days: remainingDays,
    totalDays,
    totalHours,
    totalMinutes,
    zodiacSign: getZodiacSign(birthDate)
  };
};

export const getZodiacSign = (date: Date): string => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Bảo Bình";
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return "Song Ngư";
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Bạch Dương";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Kim Ngưu";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Song Tử";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cự Giải";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Sư Tử";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Xử Nữ";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Thiên Bình";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Thiên Yết";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Nhân Mã";
  return "Ma Kết";
};
