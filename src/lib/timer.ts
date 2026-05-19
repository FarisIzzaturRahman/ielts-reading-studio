export function createDeadline(timeLimitMinutes: number, now = Date.now()) {
  return new Date(now + timeLimitMinutes * 60 * 1000).toISOString();
}

export function secondsUntil(deadlineAt: string, fallbackSeconds: number) {
  const deadline = new Date(deadlineAt).getTime();
  if (Number.isNaN(deadline)) {
    return fallbackSeconds;
  }

  return Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
}

export function clampRemaining(seconds: number, maxSeconds: number) {
  return Math.max(0, Math.min(maxSeconds, Math.floor(seconds)));
}
