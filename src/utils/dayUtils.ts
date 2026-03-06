const DAYS_OF_WEEK = [
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
  'Sun',
];

export function parseDaysString(daysString: string): string[] {
  // Handle ranges like "Mon-Fri"
  const rangeMatch = daysString.match(/(\w{3})-(\w{3})/);
  if (rangeMatch) {
    const startDay = rangeMatch[1];
    const endDay = rangeMatch[2];

    const startIndex = DAYS_OF_WEEK.indexOf(startDay);
    const endIndex = DAYS_OF_WEEK.indexOf(endDay);

    if (startIndex === -1 || endIndex === -1) {
      throw new Error('Invalid day format');
    }

    const days: string[] = [];
    if (startIndex <= endIndex) {
      for (let i = startIndex; i <= endIndex; i++) {
        days.push(DAYS_OF_WEEK[i]);
      }
    } else {
      // Handle wrapping (e.g., "Fri-Mon")
      for (let i = startIndex; i < DAYS_OF_WEEK.length; i++) {
        days.push(DAYS_OF_WEEK[i]);
      }
      for (let i = 0; i <= endIndex; i++) {
        days.push(DAYS_OF_WEEK[i]);
      }
    }
    return days;
  }

  // Handle comma-separated days
  return daysString.split(',').map((day) => day.trim());
}

export function formatDaysString(days: string[]): string {
  if (days.length === 0) return '';

  // Check if days are consecutive
  const indices = days.map((day) => DAYS_OF_WEEK.indexOf(day));
  const sorted = [...indices].sort((a, b) => a - b);

  let isConsecutive = true;
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] !== sorted[i - 1] + 1) {
      isConsecutive = false;
      break;
    }
  }

  if (isConsecutive && sorted.length > 2) {
    return `${days[indices.indexOf(sorted[0])]}-${days[indices.indexOf(sorted[sorted.length - 1])]}`;
  }

  return days.join(', ');
}

export function getDayIndex(day: string): number {
  return DAYS_OF_WEEK.indexOf(day);
}

export function isValidDay(day: string): boolean {
  return DAYS_OF_WEEK.includes(day);
}

export function getNextAvailableDay(
  availableDays: string[],
  startFromDate?: Date
): Date | null {
  if (availableDays.length === 0) return null;

  const start = startFromDate || new Date();
  const availableIndices = availableDays.map((day) => getDayIndex(day));

  for (let i = 0; i < 7; i++) {
    const date = new Date(start);
    date.setDate(date.getDate() + i);
    const dayIndex = date.getDay();
    const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1; // Convert JS day (0=Sun) to our format (0=Mon)

    if (availableIndices.includes(adjustedIndex)) {
      return date;
    }
  }

  return null;
}
