(() => {
  'use strict';

  const profileId = document.body.dataset.profileId;
  const badge = document.getElementById('profileHits');
  if (!profileId || !badge) return;

  const image = document.createElement('img');
  const profileUrl = new URL(window.location.pathname, window.location.origin).href;
  const params = new URLSearchParams({
    url: profileUrl,
    title: 'lượt xem',
    title_bg: '#8a3022',
    count_bg: '#e85b35',
    edge_flat: 'false'
  });
  image.src = `https://hits.seeyoufarm.com/api/count/incr/badge.svg?${params}`;
  image.alt = `Lượt xem profile ${profileId}`;
  image.width = 110;
  image.height = 20;
  image.loading = 'eager';
  image.addEventListener('load', () => { badge.hidden = false; }, { once: true });
  image.addEventListener('error', () => {
    badge.hidden = false;
    badge.classList.add('profile-hit-badge--offline');
    const label = badge.querySelector('span');
    if (label) label.textContent = 'Không tải được bộ đếm';
  }, { once: true });
  const count = badge.querySelector('[data-hits-count]');
  if (count) count.replaceWith(image);
})();
