(() => {
  'use strict';

  const tips = [
    {
      title: 'Xếp hàng văn minh khi chờ thang máy',
      description: 'Đứng gọn về một phía, nhường người bên trong ra trước và chờ lượt tiếp theo thay vì chen lấn.',
      image: 'Image/VHHDMinhKhai.jpg',
      alt: 'Hoạt động tuyên truyền văn hóa học đường tại Cơ sở Minh Khai'
    },
    {
      title: 'Giữ lớp học sạch sau mỗi buổi học',
      description: 'Thu gom rác của mình, sắp xếp lại bàn ghế và trả không gian học tập gọn gàng cho lớp tiếp theo.',
      image: 'Image/VHHDLinhNam.jpg',
      alt: 'Hoạt động tuyên truyền văn hóa học đường tại Cơ sở Lĩnh Nam'
    },
    {
      title: 'Đeo thẻ sinh viên đúng quy định',
      description: 'Đeo thẻ ở vị trí dễ nhìn khi đến trường để thể hiện tác phong nghiêm túc và hỗ trợ nhận diện.',
      image: 'Image/VHHDNinhBinh.jpg',
      alt: 'Hoạt động tuyên truyền văn hóa học đường tại Cơ sở Ninh Bình'
    },
    {
      title: 'Giữ âm lượng vừa đủ ở hành lang',
      description: 'Nói chuyện vừa nghe, hạn chế làm ồn gần lớp đang học và khu vực cần yên tĩnh.',
      image: 'Image/VHHDMinhKhai.jpg',
      alt: 'Hoạt động tuyên truyền văn hóa học đường tại Cơ sở Minh Khai'
    }
  ];

  function isoWeek(date) {
    const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const day = utcDate.getUTCDay() || 7;
    utcDate.setUTCDate(utcDate.getUTCDate() + 4 - day);
    const year = utcDate.getUTCFullYear();
    const yearStart = new Date(Date.UTC(year, 0, 1));
    const week = Math.ceil((((utcDate - yearStart) / 86400000) + 1) / 7);
    return { week, year };
  }

  function renderWeeklyTip() {
    const heading = document.getElementById('weekly-tip-heading');
    const description = document.getElementById('weekly-tip-description');
    const image = document.getElementById('weekly-tip-image');
    const label = document.getElementById('weekly-tip-label');
    if (!heading || !description || !image || !label) return;

    const { week, year } = isoWeek(new Date());
    const tip = tips[(week - 1) % tips.length];
    heading.textContent = tip.title;
    description.textContent = tip.description;
    image.src = tip.image;
    image.alt = tip.alt;
    label.textContent = `Tip tuần ${week} · ${year}`;
  }

  function setupChecklist() {
    const checklist = document.getElementById('cultureChecklist');
    const result = document.getElementById('cultureChecklistResult');
    if (!checklist || !result) return;

    const items = Array.from(checklist.querySelectorAll('input[type="checkbox"]'));
    const updateResult = () => {
      const checked = items.filter(item => item.checked).length;
      items.forEach(item => item.closest('.culture-checklist-item')?.classList.toggle('is-checked', item.checked));
      if (checked === items.length) {
        result.textContent = `Tuyệt vời! Bạn đã thực hiện đủ ${checked}/${items.length} tiêu chí. Hãy tiếp tục lan tỏa nếp sống văn minh UNETI.`;
      } else if (checked === 0) {
        result.textContent = `Bạn đã chọn ${checked}/${items.length} tiêu chí. Bắt đầu từ một việc nhỏ nhé!`;
      } else {
        result.textContent = `Bạn đã chọn ${checked}/${items.length} tiêu chí. Mỗi ngày thêm một hành động đẹp!`;
      }
    };

    items.forEach(item => item.addEventListener('change', updateResult));
  }

  function feedbackApiUrl() {
    const configuredBase = String(window.SCC_API_BASE_URL || '').trim();
    if (!configuredBase) return '/api/culture-feedback';

    let base;
    try {
      base = new URL(configuredBase);
    } catch {
      throw new Error('Địa chỉ API trong diary-api-config.js không hợp lệ.');
    }
    if (!['https:', 'http:'].includes(base.protocol) || base.username || base.password || base.pathname !== '/' || base.search || base.hash) {
      throw new Error('Hãy nhập địa chỉ gốc HTTP(S) của API vào diary-api-config.js.');
    }
    if (window.location.protocol === 'https:' && base.protocol !== 'https:') {
      throw new Error('Trang HTTPS chỉ có thể kết nối API qua HTTPS.');
    }
    return new URL('/api/culture-feedback', base.origin).toString();
  }

  function setupFeedbackForm() {
    const form = document.getElementById('cultureFeedbackForm');
    const status = document.getElementById('cultureFeedbackStatus');
    const submit = form?.querySelector('button[type="submit"]');
    if (!form || !status || !submit) return;

    const showStatus = (message, kind) => {
      status.textContent = message;
      status.dataset.kind = kind;
      status.hidden = false;
    };

    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (!form.reportValidity()) return;

      submit.disabled = true;
      showStatus('Đang gửi góp ý…', '');
      try {
        const response = await fetch(feedbackApiUrl(), {
          method: 'POST',
          mode: 'cors',
          credentials: 'omit',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            category: form.elements.category.value,
            campus: form.elements.campus.value,
            message: form.elements.message.value
          })
        });
        const data = await response.json().catch(() => null);
        if (!response.ok) {
          throw new Error(data?.error || `Máy chủ chưa nhận được góp ý (HTTP ${response.status}).`);
        }

        form.reset();
        showStatus('Cảm ơn bạn! Góp ý đã được gửi ẩn danh tới Ban Thông tin - Kết nối.', 'success');
      } catch (error) {
        const message = error instanceof TypeError
          ? 'Không kết nối được máy chủ. Vui lòng thử lại sau.'
          : error.message || 'Không thể gửi góp ý. Vui lòng thử lại sau.';
        showStatus(message, 'error');
      } finally {
        submit.disabled = false;
      }
    });
  }

  renderWeeklyTip();
  setupChecklist();
  setupFeedbackForm();
})();
