export const SUCCESS_STEPS = [1, 3, 7, 14, 30] as const;

export function nextIntervalDays(successStreak: number, wasCorrect: boolean): number {
  if (!wasCorrect) return 1;
  const index = Math.min(Math.max(successStreak, 0), SUCCESS_STEPS.length - 1);
  return SUCCESS_STEPS[index];
}
