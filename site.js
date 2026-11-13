// Shared behaviour for every page. Meeting dates live in meetings.js.

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.getElementById('nav-links');
  if (toggle && links) {
    const setOpen = (open) => {
      links.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    };
    toggle.addEventListener('click', () => setOpen(!links.classList.contains('is-open')));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
  }

  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach((a) => {
    if (a.getAttribute('href') === page) a.setAttribute('aria-current', 'page');
  });

  renderNextMeeting();
  renderSchedule();
  wireJoinForm();
});

function renderNextMeeting() {
  const el = document.getElementById('next-meeting');
  if (!el || typeof getNextMeeting !== 'function') return;
  const now = new Date();
  const next = getNextMeeting(now);
  if (!next) {
    el.textContent = 'Next season’s dates coming soon';
    return;
  }
  const isToday = next.date.toDateString() === now.toDateString();
  el.textContent = isToday
    ? 'Today, 4:30 PM'
    : next.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

function renderSchedule() {
  const el = document.getElementById('schedule-list');
  if (!el || typeof MEETING_SCHEDULE === 'undefined') return;
  const nextIdx = getNextMeetingIndex();
  let month = '';
  let list;

  MEETING_SCHEDULE.forEach((m, i) => {
    const name = m.date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    if (name !== month) {
      month = name;
      const h = document.createElement('h3');
      h.className = 'schedule-month';
      h.textContent = name;
      list = document.createElement('ol');
      list.className = 'schedule';
      el.append(h, list);
    }
    const isNext = i === nextIdx;
    const isPast = nextIdx === -1 || i < nextIdx;
    const li = document.createElement('li');
    if (isNext) li.className = 'next';
    else if (isPast) li.className = 'past';

    let tag = '';
    if (isNext) tag = '<span class="tag">Next up</span>';
    else if (isPast) tag = '<span class="tag">Done</span>';

    li.innerHTML = `
      <div class="date"><strong>${m.date.getDate()}</strong><span>${m.date.toLocaleDateString('en-US', { weekday: 'short' })}</span></div>
      <div class="info"><strong>${m.label}</strong></div>
      ${tag}`;
    list.appendChild(li);
  });
}

// Opens the visitor's mail app with their answers filled in.
function wireJoinForm() {
  const form = document.getElementById('join-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const body = [
      `Name: ${data.get('name')}`,
      `Grade: ${data.get('grade')}`,
      `Email: ${data.get('email')}`,
      `MUN experience: ${data.get('experience')}`,
      '',
      data.get('notes'),
    ].join('\n');
    const subject = `Joining Briar Woods MUN - ${data.get('name')}`;
    location.href = `mailto:bwhsmodelun@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    document.getElementById('form-success').classList.add('is-visible');
  });
}
