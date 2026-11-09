(() => {
  'use strict';

  const profileId = document.body.dataset.profileId;
  const badge = document.getElementById('profileHits');
  const count = badge?.querySelector('[data-hits-count]');
  if (!profileId || !badge || !count) return;

  const profileUrl = new URL(window.location.pathname, window.location.origin).href;
  const endpoint = new URL('https://hitscounter.dev/api/hit');
  endpoint.search = new URLSearchParams({
    url: profileUrl,
    output: 'json',
    tz: 'Asia/Ho_Chi_Minh'
  }).toString();

  fetch(endpoint, { mode: 'cors', cache: 'no-store' })
    .then(response => {
      if (!response.ok) throw new Error(`Hits API returned ${response.status}`);
      return response.json();
    })
    .then(data => {
      const total = Number(data.total_hits);
      if (!Number.isFinite(total) || total < 0) throw new Error('Invalid hits count');
      count.textContent = new Intl.NumberFormat('vi-VN').format(total);
      badge.classList.remove('profile-hit-badge--offline');
      badge.hidden = false;
    })
    .catch(() => {
      count.textContent = '—';
      badge.classList.add('profile-hit-badge--offline');
      badge.hidden = false;
    });
})();
