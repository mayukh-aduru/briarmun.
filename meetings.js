/* =========================================================================
   BRIAR WOODS MODEL UNITED NATIONS — meeting schedule
   Single source of truth, shared by index.html (the "Next Meeting" card)
   and join.html (the full schedule list).

   To add, move, or cancel a meeting, just edit MEETING_DATES below —
   nothing else needs to change. Meetings are listed in order and the
   month/day use normal calendar numbers (month: 1 = January).
   ========================================================================= */

const MEETING_DATES = [
  { year: 2026, month: 9,  day: 9,  label: 'Interest meeting' },
  { year: 2026, month: 9,  day: 23 },
  { year: 2026, month: 10, day: 14 },
  { year: 2026, month: 10, day: 28 },
  { year: 2026, month: 11, day: 11 },
  { year: 2026, month: 12, day: 2 },
  { year: 2026, month: 12, day: 16 },
  { year: 2027, month: 1,  day: 6 },
  { year: 2027, month: 1,  day: 20 },
  { year: 2027, month: 2,  day: 3 },
  { year: 2027, month: 2,  day: 17 },
  { year: 2027, month: 3,  day: 3 },
  { year: 2027, month: 3,  day: 17 },
  { year: 2027, month: 3,  day: 31 },
  { year: 2027, month: 4,  day: 14 },
  { year: 2027, month: 4,  day: 28 },
  { year: 2027, month: 5,  day: 12 }
];

const MEETING_START = { hour: 16, minute: 30 };
const MEETING_END = { hour: 17, minute: 30 };

const MEETING_SCHEDULE = MEETING_DATES.map(m => ({
  date: new Date(m.year, m.month - 1, m.day),
  label: m.label || 'General meeting'
}));

function meetingEndsAt(meeting) {
  const d = meeting.date;
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), MEETING_END.hour, MEETING_END.minute);
}

// a meeting counts as "upcoming" until it ends; the first one that
// hasn't ended yet is the next meeting, everything before it is past
function getNextMeetingIndex(now) {
  now = now || new Date();
  return MEETING_SCHEDULE.findIndex(m => meetingEndsAt(m) > now);
}

function getNextMeeting(now) {
  const i = getNextMeetingIndex(now);
  return i === -1 ? null : MEETING_SCHEDULE[i];
}
