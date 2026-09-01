export function getClinicOpenStatus(): {
  isOpen: boolean;
  statusText: string;
  nextOpenText: string;
  currentTimeString: string;
} {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sun, 1 = Mon, ... 6 = Sat
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const currentMinutes = hours * 60 + minutes;

  // Timings:
  // Mon-Sat:
  // Morning: 10:00 AM (600m) to 1:30 PM (810m)
  // Evening: 5:00 PM (1020m) to 8:30 PM (1230m)
  // Sun: 10:30 AM (630m) to 1:30 PM (810m)

  const isWeekdayOrSat = dayOfWeek >= 1 && dayOfWeek <= 6;
  const isSunday = dayOfWeek === 0;

  let isOpen = false;
  let nextOpenText = '';

  if (isWeekdayOrSat) {
    if (currentMinutes >= 600 && currentMinutes < 810) {
      isOpen = true;
      nextOpenText = 'Morning Session • Closes at 1:30 PM';
    } else if (currentMinutes < 600) {
      isOpen = false;
      nextOpenText = 'Opens today at 10:00 AM';
    } else if (currentMinutes >= 810 && currentMinutes < 1020) {
      isOpen = false;
      nextOpenText = 'Evening Session opens at 5:00 PM';
    } else if (currentMinutes >= 1020 && currentMinutes < 1230) {
      isOpen = true;
      nextOpenText = 'Evening Session • Closes at 8:30 PM';
    } else {
      isOpen = false;
      nextOpenText = dayOfWeek === 6 ? 'Opens Sunday at 10:30 AM (Prior Appt)' : 'Opens tomorrow at 10:00 AM';
    }
  } else if (isSunday) {
    if (currentMinutes >= 630 && currentMinutes < 810) {
      isOpen = true;
      nextOpenText = 'Sunday Clinic • Closes at 1:30 PM';
    } else if (currentMinutes < 630) {
      isOpen = false;
      nextOpenText = 'Opens Sunday at 10:30 AM';
    } else {
      isOpen = false;
      nextOpenText = 'Opens Monday at 10:00 AM';
    }
  }

  const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return {
    isOpen,
    statusText: isOpen ? 'Clinic Open Now' : 'Currently Closed',
    nextOpenText,
    currentTimeString: timeString,
  };
}

export function getAvailableDates(daysAhead: number = 14): {
  dateString: string; // YYYY-MM-DD
  dayName: string; // e.g. "Mon"
  fullDayName: string;
  dayNumber: number; // e.g. 15
  monthName: string; // e.g. "Sep"
  isAvailable: boolean;
  displayFormatted: string;
}[] {
  const dates = [];
  const today = new Date();

  for (let i = 0; i < daysAhead; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);

    const dateString = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const fullDayName = d.toLocaleDateString('en-US', { weekday: 'long' });
    const dayNumber = d.getDate();
    const monthName = d.toLocaleDateString('en-US', { month: 'short' });
    const displayFormatted = d.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    dates.push({
      dateString,
      dayName,
      fullDayName,
      dayNumber,
      monthName,
      isAvailable: true, // All days open including Sunday morning
      displayFormatted,
    });
  }

  return dates;
}

export function getTimeSlotsForDate(dateString: string): {
  time: string;
  period: 'morning' | 'afternoon' | 'evening';
  isAvailable: boolean;
}[] {
  const dateObj = new Date(dateString + 'T00:00:00');
  const dayOfWeek = dateObj.getDay();

  if (dayOfWeek === 0) {
    // Sunday: Morning only 10:30 AM - 1:30 PM
    return [
      { time: '10:30 AM', period: 'morning' as const, isAvailable: true },
      { time: '11:00 AM', period: 'morning' as const, isAvailable: true },
      { time: '11:30 AM', period: 'morning' as const, isAvailable: true },
      { time: '12:00 PM', period: 'morning' as const, isAvailable: true },
      { time: '12:30 PM', period: 'morning' as const, isAvailable: true },
      { time: '01:00 PM', period: 'afternoon' as const, isAvailable: true },
    ];
  }

  // Weekdays & Saturday: Morning (10:00 AM - 1:30 PM) & Evening (5:00 PM - 8:30 PM)
  const morningSlots = [
    { time: '10:00 AM', period: 'morning' as const, isAvailable: true },
    { time: '10:30 AM', period: 'morning' as const, isAvailable: true },
    { time: '11:00 AM', period: 'morning' as const, isAvailable: true },
    { time: '11:30 AM', period: 'morning' as const, isAvailable: false },
    { time: '12:00 PM', period: 'morning' as const, isAvailable: true },
    { time: '12:30 PM', period: 'morning' as const, isAvailable: true },
    { time: '01:00 PM', period: 'afternoon' as const, isAvailable: true },
  ];

  const eveningSlots = [
    { time: '05:00 PM', period: 'evening' as const, isAvailable: true },
    { time: '05:30 PM', period: 'evening' as const, isAvailable: true },
    { time: '06:00 PM', period: 'evening' as const, isAvailable: true },
    { time: '06:30 PM', period: 'evening' as const, isAvailable: false },
    { time: '07:00 PM', period: 'evening' as const, isAvailable: true },
    { time: '07:30 PM', period: 'evening' as const, isAvailable: true },
    { time: '08:00 PM', period: 'evening' as const, isAvailable: true },
  ];

  return [...morningSlots, ...eveningSlots];
}
