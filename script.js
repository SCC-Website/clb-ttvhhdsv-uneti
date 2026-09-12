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
            <span>🌐 Website Nhà trường:</span>
            <a href="https://uneti.edu.vn" target="_blank" rel="noopener noreferrer">https://uneti.edu.vn</a>
          </div>
        </div>
      </div>

      <div class="footer-col">
        <h3>Kênh Truyền Thông</h3>
        <ul class="footer-links">
          <li>
            <a href="https://www.facebook.com/VHHDSVUNETI" target="_blank" rel="noopener noreferrer">
              <span>🔵</span> Fanpage CLB SCC UNETI
            </a>
          </li>
          <li>
            <a href="https://www.facebook.com/DoanTN.HoiSV.Uneti" target="_blank" rel="noopener noreferrer">
              <span>🔵</span> Fanpage Đoàn Thanh Niên UNETI
            </a>
          </li>
          <li>
            <a href="https://www.facebook.com/PhongCTvaCTSV.Uneti" target="_blank" rel="noopener noreferrer">
              <span>🔵</span> Phòng CT & CTSV UNETI
            </a>
          </li>
          <li>
            <a href="https://tiktok.com/@uneti.clb.scc" target="_blank" rel="noopener noreferrer">
              <span>🎵</span> TikTok: @uneti.clb.scc
            </a>
          </li>
        </ul>
      </div>

      <div class="footer-col">
        <h3>Thông Tin Liên Hệ</h3>
        <div class="footer-info">
          <div class="footer-info-item">
            <span>✉️ Email:</span>
            <button class="copy-value" type="button" data-copy="clb.tuyentruyenvhhd@gmail.com" aria-label="Sao chép email CLB">
              clb.tuyentruyenvhhd@gmail.com
            </button>
          </div>
          <div class="footer-info-item">
            <span>📞 Hotline:</span>
            <button class="copy-value" type="button" data-copy="024 3233 6137" aria-label="Sao chép hotline CLB">
              024 3233 6137
            </button>
          </div>
          <div class="footer-info-item">
            <span>📍 Địa chỉ:</span>
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

initCountdowns();

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