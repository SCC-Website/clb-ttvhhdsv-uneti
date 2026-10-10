document.addEventListener('contextmenu', event => {
  if (event.target.closest('img')) {
    event.preventDefault();
  }
});

document.addEventListener('selectstart', event => {
  const target = event.target;
  if (target instanceof HTMLElement && !target.closest('input, textarea, select, [contenteditable="true"]')) {
    event.preventDefault();
  }
});

const BASE_URL = new URL('.', document.baseURI);

// ----- SVG ICONS (thay thế toàn bộ emoji) -----
// Icon dạng vector, dùng stroke="currentColor" nên tự đổi theo màu chữ xung quanh.
const SVG_ICON_PATHS = {
  // 🌐
  globe:
    '<circle cx="12" cy="12" r="10"/>' +
    '<path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>' +
    '<path d="M2 12h20"/>',
  // ✉️
  mail:
    '<rect width="20" height="16" x="2" y="4" rx="2"/>' +
    '<path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
  // 📞
  phone:
    '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
  // 📍
  mapPin:
    '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>' +
    '<circle cx="12" cy="10" r="3"/>',
  // 💌 (thư đã gửi)
  mailCheck:
    '<path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8"/>' +
    '<path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>' +
    '<path d="m16 19 2 2 4-4"/>',
  // 📩 (thư đến)
  mailDown:
    '<path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8"/>' +
    '<path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>' +
    '<path d="M19 16v6"/>' +
    '<path d="m16 19 3 3 3-3"/>'
};

function icon(name, size = 18) {
  const paths = SVG_ICON_PATHS[name];
  if (!paths) {
    return '';
  }

  return (
    `<svg class="svg-icon" xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" ` +
    'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false" ' +
    'style="display:inline-block;vertical-align:-0.2em;flex-shrink:0;">' +
    paths +
    '</svg>'
  );
}

const navigationItems = [
  { path: 'index.html', label: 'Trang chủ' },
  { path: 'VHHD.html', label: 'Văn hoá học đường sinh viên' },
  { path: 'News.html', label: 'Tin tức' },
  { path: 'Member.html', label: 'Thành viên' },
  { path: 'Contact.html', label: 'Liên hệ' },
  { path: 'SignUpToSCC.html', label: 'Đăng kí tham gia' }
];

function renderFavicon() {
  const favicon = document.getElementById('siteFavicon') || document.createElement('link');
  favicon.id = 'siteFavicon';
  favicon.rel = 'icon';
  favicon.type = 'image/png';
  favicon.sizes = '192x192';
  favicon.href = new URL('Image/SCC-Logo.png?v=2', BASE_URL).href;

  if (!favicon.parentNode) {
    document.head.appendChild(favicon);
  }
}

function renderNavigation() {
  const navigation = document.getElementById('mainNav') || document.querySelector('.main-nav');
  if (!navigation) {
    return;
  }

  navigation.innerHTML = '';
  const toggle = document.createElement('button');
  toggle.className = 'nav-toggle';
  toggle.type = 'button';
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-controls', 'siteMenu');
  toggle.setAttribute('aria-label', 'Mở menu điều hướng');
  toggle.innerHTML = '<span></span><span></span><span></span>';

  const menu = document.createElement('ul');
  menu.className = 'menu';
  menu.id = 'siteMenu';

  const currentPath = window.location.pathname.replace(/\/+$/, '') || '/index.html';

  navigationItems.forEach(({ path, label }) => {
    const item = document.createElement('li');
    const link = document.createElement('a');
    const linkUrl = new URL(path, BASE_URL);

    link.href = linkUrl.href;
    link.textContent = label;

    const targetPath = linkUrl.pathname.replace(/\/+$/, '');
    if (targetPath === currentPath || (currentPath.endsWith('/') && path === 'index.html') || currentPath.endsWith(path)) {
      link.setAttribute('aria-current', 'page');
    }

    item.appendChild(link);
    menu.appendChild(item);
  });

  navigation.append(toggle, menu);

  const closeMenu = () => {
    navigation.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Mở menu điều hướng');
  };

  toggle.addEventListener('click', () => {
    const isOpen = navigation.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Đóng menu điều hướng' : 'Mở menu điều hướng');
  });

  menu.addEventListener('click', event => {
    if (event.target instanceof HTMLAnchorElement) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeMenu();
    }
  });
}

function renderFooter() {
  if (document.querySelector('footer#sharedFooter')) {
    return;
  }

  // Icon MXH lấy từ file ảnh thật trong thư mục Image/, resolve qua BASE_URL
  // (giống cách favicon đang làm) để chạy đúng dù trang nằm ở sub-path nào.
  const facebookIconUrl = new URL('Image/Facebook.png', BASE_URL).href;
  const tiktokIconUrl = new URL('Image/Tiktok.png', BASE_URL).href;

  const footer = document.createElement('footer');
  footer.id = 'sharedFooter';
  footer.innerHTML = `
    <div class="footer-container">
      <div class="footer-col">
        <h3>Về CLB SCC UNETI</h3>
        <div class="footer-info">
          <p><b>CLB Tuyên truyền Văn hóa học đường Sinh viên</b> trực thuộc Đoàn TNCS Hồ Chí Minh & Phòng CT&CTSV - Trường Đại học Kinh tế - Kỹ thuật Công Nghiệp.</p>
          <p>Slogan: <i>"Thân thiện - Chuyên nghiệp - Đồng hành và Chia sẻ"</i></p>
          <div class="footer-info-item">
            <span>${icon('globe')} Website Nhà trường:</span>
            <a href="https://uneti.edu.vn" target="_blank" rel="noopener noreferrer">https://uneti.edu.vn</a>
          </div>
        </div>
      </div>

      <div class="footer-col">
        <h3>Kênh Truyền Thông</h3>
        <ul class="footer-links">
          <li>
            <a href="https://www.facebook.com/VHHDSVUNETI" target="_blank" rel="noopener noreferrer">
              <img src="${facebookIconUrl}" alt="Facebook" class="footer-icon" width="18" height="18" loading="lazy"> Fanpage CLB SCC UNETI
            </a>
          </li>
          <li>
            <a href="https://www.facebook.com/DoanTN.HoiSV.Uneti" target="_blank" rel="noopener noreferrer">
              <img src="${facebookIconUrl}" alt="Facebook" class="footer-icon" width="18" height="18" loading="lazy"> Fanpage Đoàn Thanh Niên UNETI
            </a>
          </li>
          <li>
            <a href="https://www.facebook.com/PhongCTvaCTSV.Uneti" target="_blank" rel="noopener noreferrer">
              <img src="${facebookIconUrl}" alt="Facebook" class="footer-icon" width="18" height="18" loading="lazy"> Fanpage Phòng CT & CTSV UNETI
            </a>
          </li>
          <li>
            <a href="https://tiktok.com/@uneti.clb.scc" target="_blank" rel="noopener noreferrer">
              <img src="${tiktokIconUrl}" alt="TikTok" class="footer-icon" width="18" height="18" loading="lazy"> TikTok CLB SCC UNETI
            </a>
          </li>
        </ul>
      </div>

      <div class="footer-col">
        <h3>Thông Tin Liên Hệ</h3>
        <div class="footer-info">
          <div class="footer-info-item">
            <span>${icon('mail')} Email:</span>
            <button class="copy-value" type="button" data-copy="clb.tuyentruyenvhhd@gmail.com" aria-label="Sao chép email CLB">
              clb.tuyentruyenvhhd@gmail.com
            </button>
          </div>
          <div class="footer-info-item">
            <span>${icon('phone')} Hotline:</span>
            <button class="copy-value" type="button" data-copy="024 3233 6137" aria-label="Sao chép hotline CLB">
              024 3233 6137
            </button>
          </div>
          <div class="footer-info-item">
            <span>${icon('mapPin')} Địa chỉ:</span>
            <span>Trường ĐH Kinh tế - Kỹ thuật Công nghiệp (UNETI)</span>
          </div>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <p>© 2026 Trường Đại học Kinh tế - Kỹ thuật Công nghiệp | All rights reserved.</p>
      <p>© 2026 CLB Tuyên truyền Văn hóa học đường Sinh viên UNETI (SCC).</p>
      <div class="visit-counter-wrap">
        <span>Lượt truy cập:</span>
        <span id="visit-counter" aria-live="polite"></span>
      </div>
    </div>
  `;

  document.body.appendChild(footer);
  initVisitCounter();
}

function showCopyFeedback(button, message) {
  const originalLabel = button.getAttribute('aria-label');
  button.setAttribute('aria-label', message);
  button.classList.add('is-copied');
  window.setTimeout(() => {
    button.classList.remove('is-copied');
    if (originalLabel) {
      button.setAttribute('aria-label', originalLabel);
    }
  }, 1800);
}

async function copyValue(value, button) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(value);
  } else {
    const helper = document.createElement('textarea');
    helper.value = value;
    helper.setAttribute('readonly', '');
    helper.style.position = 'fixed';
    helper.style.opacity = '0';
    document.body.appendChild(helper);
    helper.select();
    const copied = document.execCommand('copy');
    helper.remove();
    if (!copied) {
      throw new Error('Không thể sao chép nội dung.');
    }
  }

  showCopyFeedback(button, 'Đã sao chép: ' + value);
}

function bindCopyButtons() {
  document.addEventListener('click', event => {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }

    const button = target.closest('.copy-value');
    if (!(button instanceof HTMLButtonElement)) {
      return;
    }

    const value = button.dataset.copy;
    if (!value) {
      return;
    }

    copyValue(value, button).catch(() => {
      showCopyFeedback(button, 'Sao chép không thành công');
    });
  });
}

renderFavicon();
renderNavigation();
renderFooter();
bindCopyButtons();

function initGalleryLightbox() {
  const gallery = document.getElementById('profileGallery');
  const lightbox = document.getElementById('galleryLightbox');
  if (!gallery || !lightbox) {
    return;
  }

  const items = Array.from(gallery.querySelectorAll('.gallery-item'));
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const closeBtn = document.getElementById('lightboxClose');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');

  let currentIndex = 0;
  let lastFocusedElement = null;

  function renderSlide(index) {
    const item = items[index];
    const img = item.querySelector('img');
    lightboxImage.src = img.src;
    lightboxImage.alt = img.alt || '';
    lightboxCaption.textContent = item.dataset.caption || img.alt || '';
    lightboxCounter.textContent = (index + 1) + ' / ' + items.length;
  }

  function openLightbox(index) {
    currentIndex = index;
    lastFocusedElement = document.activeElement;
    renderSlide(currentIndex);
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lightboxImage.src = '';
    if (lastFocusedElement instanceof HTMLElement) {
      lastFocusedElement.focus();
    }
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % items.length;
    renderSlide(currentIndex);
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    renderSlide(currentIndex);
  }

  items.forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(index));
  });

  closeBtn.addEventListener('click', closeLightbox);
  nextBtn.addEventListener('click', showNext);
  prevBtn.addEventListener('click', showPrev);

  lightbox.addEventListener('click', event => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', event => {
    if (!lightbox.classList.contains('is-open')) {
      return;
    }
    if (event.key === 'Escape') {
      closeLightbox();
    } else if (event.key === 'ArrowRight') {
      showNext();
    } else if (event.key === 'ArrowLeft') {
      showPrev();
    }
  });
}

initGalleryLightbox();

function initCountdowns() {
  const singleContainers = document.querySelectorAll('[data-countdown-deadline]');
  const stageContainers = document.querySelectorAll('[data-countdown-stages]');
  if (!singleContainers.length && !stageContainers.length) {
    return;
  }

  function pad(value) {
    return String(value).padStart(2, '0');
  }

  function getUnitEls(container) {
    return {
      daysEl: container.querySelector('[data-countdown-unit="days"]'),
      hoursEl: container.querySelector('[data-countdown-unit="hours"]'),
      minutesEl: container.querySelector('[data-countdown-unit="minutes"]'),
      secondsEl: container.querySelector('[data-countdown-unit="seconds"]')
    };
  }

  function writeUnits(units, days, hours, minutes, seconds) {
    units.daysEl.textContent = pad(days);
    units.hoursEl.textContent = pad(hours);
    units.minutesEl.textContent = pad(minutes);
    units.secondsEl.textContent = pad(seconds);
  }

  function writeClosed(units) {
    units.daysEl.textContent = '00';
    units.hoursEl.textContent = '00';
    units.minutesEl.textContent = '00';
    units.secondsEl.textContent = '00';
  }

  function splitDiff(diff) {
    const totalSeconds = Math.floor(diff / 1000);
    return {
      days: Math.floor(totalSeconds / 86400),
      hours: Math.floor((totalSeconds % 86400) / 3600),
      minutes: Math.floor((totalSeconds % 3600) / 60),
      seconds: totalSeconds % 60
    };
  }

  // Single fixed-deadline countdowns
  singleContainers.forEach(container => {
    const deadline = new Date(container.dataset.countdownDeadline);
    if (Number.isNaN(deadline.getTime())) {
      return;
    }

    const titleEl = container.querySelector('.countdown-title');
    const units = getUnitEls(container);
    const closedText = container.dataset.countdownClosedText || 'Đã đóng đơn đăng ký';

    if (!units.daysEl || !units.hoursEl || !units.minutesEl || !units.secondsEl) {
      return;
    }

    let timerId;

    function update() {
      const now = new Date();
      const diff = deadline.getTime() - now.getTime();

      if (diff <= 0) {
        container.classList.add('is-closed');
        if (titleEl) {
          titleEl.textContent = closedText;
        }
        writeClosed(units);
        window.clearInterval(timerId);
        return;
      }

      const { days, hours, minutes, seconds } = splitDiff(diff);
      writeUnits(units, days, hours, minutes, seconds);
    }

    update();
    timerId = window.setInterval(update, 1000);
  });

  // Multi-stage countdowns: automatically advance to the next upcoming
  // deadline in the list as each stage passes.
  stageContainers.forEach(container => {
    let stages;
    try {
      stages = JSON.parse(container.dataset.countdownStages);
    } catch (error) {
      return;
    }

    if (!Array.isArray(stages) || !stages.length) {
      return;
    }

    const parsedStages = stages
      .map(stage => ({ label: stage.label, deadline: new Date(stage.deadline) }))
      .filter(stage => !Number.isNaN(stage.deadline.getTime()))
      .sort((a, b) => a.deadline.getTime() - b.deadline.getTime());

    if (!parsedStages.length) {
      return;
    }

    const titleEl = container.querySelector('.countdown-title');
    const stageLabelEl = container.querySelector('[data-countdown-stage-label]');
    const units = getUnitEls(container);
    const closedText = container.dataset.countdownClosedText || 'Đã hoàn tất các mốc';

    if (!units.daysEl || !units.hoursEl || !units.minutesEl || !units.secondsEl) {
      return;
    }

    let timerId;

    function update() {
      const now = new Date();
      const currentStage = parsedStages.find(stage => stage.deadline.getTime() > now.getTime());

      if (!currentStage) {
        container.classList.add('is-closed');
        if (titleEl) {
          titleEl.textContent = closedText;
        }
        if (stageLabelEl) {
          stageLabelEl.textContent = '';
        }
        writeClosed(units);
        window.clearInterval(timerId);
        return;
      }

      if (stageLabelEl) {
        stageLabelEl.textContent = 'Đến: ' + currentStage.label;
      }

      const diff = currentStage.deadline.getTime() - now.getTime();
      const { days, hours, minutes, seconds } = splitDiff(diff);
      writeUnits(units, days, hours, minutes, seconds);
    }

    update();
    timerId = window.setInterval(update, 1000);
  });
}

// Mốc thời gian đóng đơn đăng ký tuyển thành viên Gen 5
const REGISTRATION_DEADLINE = new Date('2026-09-16T23:59:59+07:00');

function initRegistrationStatus() {
  function applyStatus() {
    const now = new Date();
    const isClosed = now.getTime() >= REGISTRATION_DEADLINE.getTime();

    if (isClosed) {
      document.body.classList.add('registration-closed');

      // Ẩn tất cả các nút mở form đăng ký
      document.querySelectorAll('[data-register-btn], .floating-register-btn, a[href*="forms.gle"]').forEach(btn => {
        btn.style.display = 'none';
      });

      // Hiện badge thông báo kết quả đã được gửi (nếu có)
      const closedBadge = document.getElementById('regClosedNotice');
      if (closedBadge) {
        closedBadge.style.display = 'inline-flex';
        closedBadge.style.alignItems = 'center';
        closedBadge.style.gap = '6px';
        // Dùng innerHTML vì có chứa icon SVG; nội dung là chuỗi cố định nên an toàn.
        const closedBadgeHtml = icon('mailCheck') + '<span>Kết quả phỏng vấn đã được gửi qua email</span>';
        if (closedBadge.innerHTML !== closedBadgeHtml) {
          closedBadge.innerHTML = closedBadgeHtml;
        }
      }

      // Cập nhật card CTA cuối trang SignUpToSCC
      const signupCtaCard = document.querySelector('.avatar-cta-card--signup');
      if (signupCtaCard) {
        const titleEl = signupCtaCard.querySelector('h3');
        const descEl = signupCtaCard.querySelector('p');
        if (titleEl) {
          const titleHtml = icon('mailDown', 22) + ' Chưa nhận được email kết quả?';
          if (titleEl.innerHTML !== titleHtml) {
            titleEl.innerHTML = titleHtml;
          }
        }
        if (descEl) {
          descEl.textContent = 'Nếu đã kiểm tra cả mục Spam và Quảng cáo nhưng vẫn chưa thấy thư, hãy nhắn tin cho Fanpage CLB để được hỗ trợ.';
        }
      }

      // Cập nhật nút đăng ký trong overlay Gen 5 trên trang chủ
      const overlayRegisterBtn = document.querySelector('.gen5-overlay-actions a[data-register-btn], .gen5-overlay-actions a[href*="forms.gle"]');
      if (overlayRegisterBtn) {
        overlayRegisterBtn.remove();
      }
    } else {
      document.body.classList.remove('registration-closed');
      const closedBadge = document.getElementById('regClosedNotice');
      if (closedBadge) {
        closedBadge.style.display = 'none';
      }
    }
  }

  applyStatus();
  window.setInterval(applyStatus, 1000);
}

initCountdowns();
initRegistrationStatus();

function toggleHonor() {
  const box = document.getElementById("honorContent");
  box.style.display = box.style.display === "none" ? "block" : "none";
  if (box) {
    box.style.display = box.style.display === "none" ? "block" : "none";
  }
}

// ----- 4. Visit Counter (hits.sh - free, no signup) -----
function initVisitCounter() {
  const counterEl = document.getElementById("visit-counter");
  if (!counterEl) return;

  // Khi đang code/chỉnh giao diện ở local thì không gọi hits.sh,
  // tránh badge bị vỡ do key không hợp lệ trên localhost
  if (
    !window.location.hostname ||
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  ) {
    counterEl.innerHTML =
      '<span style="opacity:0.6;font-size:13px;">[Bộ đếm lượt truy cập]</span>';
    return;
  }

  const siteKey = window.location.hostname;
  const label = encodeURIComponent("Lượt truy cập");
  const badgeUrl =
    `https://hits.sh/${siteKey}.svg` +
    `?style=flat-square&label=${label}&color=ff0000`;

  const img = document.createElement("img");
  img.src = badgeUrl;
  img.alt = "Lượt truy cập website";
  img.loading = "lazy";
  img.style.height = "24px";

  img.onerror = () => {
    counterEl.innerHTML =
      '<span style="opacity:0.6;font-size:13px;">' +
      "Không tải được bộ đếm lượt truy cập" +
      "</span>";
  };

  counterEl.appendChild(img);
}

// ----- 5. Nâng cấp trải nghiệm cuộn: nav, hiện dần nội dung, nút lên đầu trang -----
function initScrollEnhancements() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 5a. Thanh điều hướng đổi bóng khi cuộn
  const nav = document.getElementById('mainNav') || document.querySelector('.main-nav');
  const backToTop = document.createElement('button');
  backToTop.type = 'button';
  backToTop.className = 'back-to-top';
  backToTop.setAttribute('aria-label', 'Lên đầu trang');
  backToTop.innerHTML =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
    'stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="m18 15-6-6-6 6"/></svg>';
  document.body.appendChild(backToTop);

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });

  let ticking = false;
  function onScroll() {
    if (ticking) {
      return;
    }
    ticking = true;
    window.requestAnimationFrame(() => {
      const y = window.scrollY;
      if (nav) {
        nav.classList.toggle('is-scrolled', y > 24);
      }
      backToTop.classList.toggle('is-shown', y > 600);
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // 5b. Hiện dần nội dung khi cuộn tới (bỏ qua nếu giảm chuyển động / trình duyệt cũ)
  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    return;
  }

  const selector = [
    '.section-header', '.overview-card', '.activites-card', '.role-card', '.member-card',
    '.board-card', '.event-card', '.principle-card', '.activity-card', '.contact-tile',
    '.faq-item', '.achievement-card', '.timeline-item', '.info-grid', '.profile-bio-card',
    '.slogan-banner', '.advisor-card', '.culture-panel', '.culture-quote',
    '.avatar-cta-card', '.main-poster-wrapper', '.gallery-item'
  ].join(',');

  const targets = Array.from(document.querySelectorAll(selector))
    .filter(el => !el.closest('.gen5-overlay, .lightbox'));
  if (!targets.length) {
    return;
  }

  document.documentElement.classList.add('js-reveal');

  // Xếp so le theo thứ tự trong cùng một hàng cha (tối đa 4 bước) để chuyển động nhịp nhàng
  const siblingCount = new WeakMap();
  targets.forEach(el => {
    const parent = el.parentElement;
    const index = siblingCount.get(parent) || 0;
    siblingCount.set(parent, index + 1);
    el.classList.add('reveal');
    el.style.setProperty('--reveal-delay', Math.min(index, 3) * 70 + 'ms');
  });

  // Sau khi hiện xong thì gỡ class để hiệu ứng hover của thẻ hoạt động bình thường
  function release(el) {
    el.classList.remove('reveal', 'is-visible');
    el.style.removeProperty('--reveal-delay');
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        return;
      }
      const el = entry.target;
      obs.unobserve(el);
      el.classList.add('is-visible');
      let done = false;
      const finish = () => {
        if (!done) {
          done = true;
          release(el);
        }
      };
      el.addEventListener('transitionend', event => {
        if (event.target === el && event.propertyName === 'opacity') {
          finish();
        }
      });
      window.setTimeout(finish, 1400);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

  targets.forEach(el => observer.observe(el));
}

function initRecognitionTableDetails() {
  const toggle = document.querySelector('.recognition-detail-toggle');
  const tableWrapper = document.getElementById('recognition-table-wrapper');
  if (!toggle || !tableWrapper) {
    return;
  }

  toggle.addEventListener('click', () => {
    const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isExpanded));
    toggle.textContent = isExpanded ? 'Xem chi tiết' : 'Ẩn chi tiết';
    tableWrapper.hidden = isExpanded;
  });
}

initRecognitionTableDetails();
initScrollEnhancements();