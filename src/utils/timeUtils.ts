export function formatTimeLabel(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

export function parseHoursString(hoursString: string): { start: string; end: string } {
  const timeRegex = /(\d{1,2})(am|pm)?\s*-\s*(\d{1,2})(am|pm)?/i;
  const match = hoursString.match(timeRegex);

  if (!match) {
    throw new Error('Invalid hours format. Use "9am - 5pm" format');
  }

  let startHour = parseInt(match[1]);
  const startPeriod = match[2]?.toLowerCase();
  let endHour = parseInt(match[3]);
  const endPeriod = match[4]?.toLowerCase();

  // Convert to 24-hour format
  if (startPeriod === 'pm' && startHour !== 12) startHour += 12;
  if (startPeriod === 'am' && startHour === 12) startHour = 0;

  if (endPeriod === 'pm' && endHour !== 12) endHour += 12;
  if (endPeriod === 'am' && endHour === 12) endHour = 0;

  const start = `${startHour.toString().padStart(2, '0')}:00`;
  const end = `${endHour.toString().padStart(2, '0')}:00`;

  return { start, end };
}

export function generatePreviewSlots(
  start: string,
  end: string,
  durationMinutes: number
): string[] {
  const slots: string[] = [];
  const [startHour, startMin] = start.split(':').map(Number);
  const [endHour, endMin] = end.split(':').map(Number);

  let currentMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;

  while (currentMinutes < endMinutes) {
    const hours = Math.floor(currentMinutes / 60);
    const minutes = currentMinutes % 60;
    slots.push(
      `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
    );
    currentMinutes += durationMinutes;
  }

  return slots;
}

export function isTimeSlotAvailable(
  slotTime: string,
  availableSlots: string[]
): boolean {
  return availableSlots.includes(slotTime);
}

export function getTimeSlotEnd(
  startTime: string,
  durationMinutes: number
): string {
  const [hours, minutes] = startTime.split(':').map(Number);
  let totalMinutes = hours * 60 + minutes + durationMinutes;

  const endHours = Math.floor(totalMinutes / 60);
  const endMinutes = totalMinutes % 60;

  return `${endHours.toString().padStart(2, '0')}:${endMinutes
    .toString()
    .padStart(2, '0')}`;
}
