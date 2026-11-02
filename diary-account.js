(() => {
  'use strict';

  const byId = id => document.getElementById(id);
  const PAGE_SIZE = 8;
  const LOGIN_ID_STORAGE_KEY = 'scc-diary-login-id-session-v1';
  let account = null;
  let pendingLoginId = null;
  let loginIdVisible = false;
  let readyPromise;
  let historyOffset = 0;
  let historyTotal = 0;
  let historyLoading = false;

  function apiRequestUrl(path) {
    const configuredBase = String(window.SCC_API_BASE_URL || '').trim();
    if (!configuredBase) return path;

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
    return new URL(path, `${base.origin}/`).toString();
  }

  function errorText(error) {
    if (error?.status === 503) {
      return 'API chưa sẵn sàng. Kiểm tra kết nối MongoDB Atlas và trạng thái /api/health.';
    }
    if (error instanceof TypeError) {
      return 'Không kết nối được API. Kiểm tra URL trong diary-api-config.js, CORS_ORIGINS và trạng thái máy chủ.';
    }
    return error?.message || 'Có lỗi xảy ra. Vui lòng thử lại.';
  }

  async function request(url, options = {}) {
    const requestUrl = apiRequestUrl(url);
    let response;
    try {
      response = await fetch(requestUrl, {
        credentials: 'include',
        ...options,
        headers: { ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...(options.headers || {}) }
      });
    } catch (error) {
      throw new TypeError('Backend unavailable');
    }
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(data.error || 'Yêu cầu chưa được xử lý.');
      error.status = response.status;
      throw error;
    }
    return data;
  }

  function setStatus(message = '', kind = '') {
    const status = byId('profile-status');
    if (!status) return;
    status.textContent = message;
    status.className = `profile-status${kind ? ` ${kind}` : ''}`;
    status.hidden = !message;
  }

  function toast(message) {
    const node = byId('toast');
    if (!node) return;
    node.textContent = message;
    node.classList.add('show');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => node.classList.remove('show'), 2600);
  }

  function setAccount(value) {
    account = value ? { name: value.name, studentId: value.studentId || '', createdAt: value.createdAt } : null;
    const profileButton = byId('profile-btn');
    const profileLabel = profileButton?.querySelector('span');
    if (profileButton) {
      profileButton.dataset.loggedIn = String(Boolean(account));
      profileButton.setAttribute('aria-label', account ? 'Mở hồ sơ tài khoản' : 'Đăng nhập hoặc tạo tài khoản');
      if (profileLabel) profileLabel.textContent = account ? 'Hồ sơ' : 'Đăng nhập';
    }
    const nameInput = byId('player-name');
    if (nameInput) {
      nameInput.readOnly = Boolean(account);
      nameInput.value = account?.name || '';
      nameInput.placeholder = account ? 'Tên tài khoản của bạn' : 'Nhập tên để tạo tài khoản…';
    }
    const note = byId('home-account-note');
    if (note) note.textContent = account
      ? 'Lượt chơi sẽ được lưu vào hồ sơ và bảng xếp hạng toàn hệ thống.'
      : 'Nhập tên để tạo tài khoản mới, hoặc đăng nhập bằng ID SCC / mã sinh viên qua nút Hồ sơ.';
    if (!byId('profile-modal')?.hidden) renderProfileView();
  }

  function currentAccount() {
    return account ? { name: account.name, studentId: account.studentId || '', createdAt: account.createdAt } : null;
  }

  function isAuthenticated() {
    return Boolean(account);
  }

  function readStoredLoginId() {
    try {
      const value = window.sessionStorage.getItem(LOGIN_ID_STORAGE_KEY);
      return value && /^SCC-[A-Za-z0-9_-]{43}$/u.test(value) ? value : null;
    } catch {
      return null;
    }
  }

  function storeLoginId(value) {
    try {
      window.sessionStorage.setItem(LOGIN_ID_STORAGE_KEY, value);
    } catch {
      // Keep the ID in memory for this page even if browser storage is unavailable.
    }
  }

  function clearStoredLoginId() {
    try {
      window.sessionStorage.removeItem(LOGIN_ID_STORAGE_KEY);
    } catch {
      // Nothing else is needed when tab storage is unavailable.
    }
  }

  function renderIdCard() {
    const card = byId('profile-id-card');
    const value = byId('profile-id');
    const toggle = byId('toggle-id-btn');
    const copy = byId('copy-id-btn');
    const note = byId('profile-security-note');
    const available = Boolean(account && pendingLoginId);
    if (card) card.hidden = !available;
    if (value) value.textContent = available ? (loginIdVisible ? pendingLoginId : '••••••••••••••••••••••••') : '';
    if (toggle) {
      toggle.textContent = loginIdVisible ? 'Ẩn ID' : 'Hiện ID';
      toggle.setAttribute('aria-pressed', String(Boolean(available && loginIdVisible)));
    }
    if (copy) copy.disabled = !available;
    if (note) note.textContent = available
      ? 'ID được giữ tạm trong tab này, không lưu dạng bản rõ trên server. Script cùng nguồn có thể đọc ID; đăng xuất sẽ xoá bản tạm, hãy giữ riêng tư.'
      : 'Tab này chưa có ID. Nếu bạn còn giữ ID, đăng nhập lại trong tab này để bật hiện/ẩn; server chỉ lưu hash.';
  }

  async function createAccount(name) {
    await readyPromise;
    const data = await request('/api/auth/register', { method: 'POST', body: JSON.stringify({ name }) });
    setAccount(data.account);
    pendingLoginId = typeof data.loginId === 'string' ? data.loginId : null;
    if (!pendingLoginId) throw new Error('Tài khoản đã tạo nhưng máy chủ không trả ID mới. Hãy khởi động lại backend rồi thử lại.');
    loginIdVisible = false;
    storeLoginId(pendingLoginId);
    if (!byId('profile-modal')?.hidden) renderProfileView();
    refreshLeaderboard();
    return currentAccount();
  }

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  }

  function dateLabel(value) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? '' : date.toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' });
  }

  function renderLeaderboard(target, entries, offset) {
    const list = byId(target);
    if (!list) return;
    if (!entries.length && !offset) {
      list.innerHTML = '<div class="empty-leader">Chưa có lượt chơi nào được ghi nhận.</div>';
      return;
    }
    list.innerHTML = entries.map((entry, index) => `<div class="leader-row"><span class="leader-rank">${String(offset + index + 1).padStart(2, '0')}</span><span class="leader-name">${escapeHTML(entry.name)}<span class="leader-level">${escapeHTML(entry.rank)} · ${escapeHTML(dateLabel(entry.createdAt))}</span></span><strong class="leader-score">${Number(entry.score) || 0}</strong></div>`).join('');
  }

  function renderLeaderboardError(message) {
    const safe = escapeHTML(message);
    for (const target of ['leaderboard-list', 'result-leaderboard-list']) {
      const list = byId(target);
      if (list) list.innerHTML = `<div class="empty-leader">${safe}</div>`;
    }
  }

  async function refreshLeaderboard() {
    try {
      const result = await request('/api/leaderboard?limit=10&offset=0');
      renderLeaderboard('leaderboard-list', result.entries || [], 0);
      renderLeaderboard('result-leaderboard-list', result.entries || [], 0);
      return result;
    } catch (error) {
      renderLeaderboardError(errorText(error));
      return null;
    }
  }

  async function recordPlay(play) {
    await request('/api/plays', { method: 'POST', body: JSON.stringify(play) });
    await refreshLeaderboard();
    return true;
  }

  function openProfile() {
    const modal = byId('profile-modal');
    if (!modal) return;
    loginIdVisible = false;
    modal.hidden = false;
    setStatus('');
    renderProfileView();
    if (account) loadHistory(true);
    const focusTarget = account ? byId('profile-name') : byId('login-id');
    setTimeout(() => focusTarget?.focus(), 0);
  }

  function closeProfile() {
    const modal = byId('profile-modal');
    if (modal) modal.hidden = true;
    loginIdVisible = false;
    renderIdCard();
    setStatus('');
  }

  function renderProfileView() {
    const loggedIn = Boolean(account);
    const loginView = byId('login-view');
    const profileView = byId('profile-view');
    if (loginView) loginView.hidden = loggedIn;
    if (profileView) profileView.hidden = !loggedIn;
    if (loggedIn) {
      renderIdCard();
      byId('profile-name').value = account.name;
      byId('profile-student-id').value = account.studentId || '';
      byId('profile-history').innerHTML = '<p class="profile-history-empty">Đang tải lịch sử…</p>';
      byId('history-more').hidden = true;
    } else {
      byId('login-id').value = '';
      byId('register-name').value = '';
    }
  }

  async function loadHistory(reset = false) {
    if (!account || historyLoading) return;
    const list = byId('profile-history');
    if (!list) return;
    historyLoading = true;
    if (reset) {
      historyOffset = 0;
      historyTotal = 0;
      list.innerHTML = '<p class="profile-history-empty">Đang tải lịch sử…</p>';
    }
    try {
      const result = await request(`/api/me/history?limit=${PAGE_SIZE}&offset=${historyOffset}`);
      historyTotal = result.total || 0;
      if (reset) list.innerHTML = '';
      if (!result.entries?.length && historyOffset === 0) {
        list.innerHTML = '<p class="profile-history-empty">Bạn chưa có lượt chơi nào trong nhật ký.</p>';
      } else {
        const rows = result.entries.map(entry => `<article class="profile-history-entry"><div><strong>${Number(entry.score) || 0} điểm · ${escapeHTML(entry.rank)}</strong><small>${escapeHTML(dateLabel(entry.createdAt))} · Hoàn thành ${Number(entry.completedDays) || 0}/7 ngày</small></div><span>✦</span></article>`).join('');
        list.insertAdjacentHTML('beforeend', rows);
      }
      historyOffset += result.entries?.length || 0;
      byId('history-count').textContent = `${historyTotal} lượt`;
      byId('history-more').hidden = historyOffset >= historyTotal;
    } catch (error) {
      if (reset) list.innerHTML = `<p class="profile-history-empty">${escapeHTML(errorText(error))}</p>`;
      setStatus(errorText(error), 'error');
    } finally {
      historyLoading = false;
    }
  }

  async function initialize() {
    byId('profile-btn')?.addEventListener('click', openProfile);
    byId('profile-close')?.addEventListener('click', closeProfile);
    for (const id of ['profile-student-id', 'result-student-id']) {
      byId(id)?.addEventListener('input', event => {
        event.currentTarget.value = event.currentTarget.value.replace(/\D/g, '').slice(0, 11);
      });
    }
    byId('profile-modal')?.addEventListener('click', event => { if (event.target === byId('profile-modal')) closeProfile(); });
    document.addEventListener('keydown', event => { if (event.key === 'Escape' && !byId('profile-modal')?.hidden) closeProfile(); });

    byId('login-form')?.addEventListener('submit', async event => {
      event.preventDefault();
      const button = event.currentTarget.querySelector('button[type="submit"]');
      button.disabled = true;
      setStatus('Đang đăng nhập…');
      try {
        const id = byId('login-id').value.trim();
        const data = await request('/api/auth/login', { method: 'POST', body: JSON.stringify({ id }) });
        pendingLoginId = /^SCC-[A-Za-z0-9_-]{43}$/u.test(id) ? id : null;
        loginIdVisible = false;
        if (pendingLoginId) storeLoginId(pendingLoginId);
        setAccount(data.account);
        setStatus('Đăng nhập thành công.', 'success');
        loadHistory(true);
        setTimeout(() => setStatus(''), 1400);
      } catch (error) {
        setStatus(errorText(error), 'error');
      } finally {
        button.disabled = false;
      }
    });

    byId('register-form')?.addEventListener('submit', async event => {
      event.preventDefault();
      const button = event.currentTarget.querySelector('button[type="submit"]');
      button.disabled = true;
      setStatus('Đang tạo tài khoản…');
      try {
        await createAccount(byId('register-name').value);
        setStatus('Đã tạo tài khoản. ID được giữ tạm trong tab; bạn có thể ẩn/hiện hoặc sao chép trong Hồ sơ.', 'success');
        loadHistory(true);
      } catch (error) {
        setStatus(errorText(error), 'error');
      } finally {
        button.disabled = false;
      }
    });

    byId('profile-name-form')?.addEventListener('submit', async event => {
      event.preventDefault();
      const button = event.currentTarget.querySelector('button[type="submit"]');
      button.disabled = true;
      setStatus('Đang cập nhật tên…');
      try {
        const data = await request('/api/me/name', { method: 'PATCH', body: JSON.stringify({ name: byId('profile-name').value }) });
        setAccount(data.account);
        loadHistory(true);
        setStatus('Đã cập nhật tên tài khoản.', 'success');
        refreshLeaderboard();
      } catch (error) {
        setStatus(errorText(error), 'error');
      } finally {
        button.disabled = false;
      }
    });

    byId('profile-student-id-form')?.addEventListener('submit', async event => {
      event.preventDefault();
      const button = event.currentTarget.querySelector('button[type="submit"]');
      button.disabled = true;
      setStatus('Đang cập nhật mã sinh viên…');
      try {
        const data = await request('/api/me/student-id', { method: 'PATCH', body: JSON.stringify({ studentId: byId('profile-student-id').value }) });
        setAccount(data.account);
        if (byId('result-student-id')) byId('result-student-id').value = account.studentId || '';
        setStatus(account.studentId ? 'Đã lưu mã sinh viên.' : 'Đã xoá mã sinh viên.', 'success');
        setTimeout(() => setStatus(''), 1400);
      } catch (error) {
        setStatus(errorText(error), 'error');
      } finally {
        button.disabled = false;
      }
    });

    byId('copy-id-btn')?.addEventListener('click', async () => {
      if (!pendingLoginId) return;
      try {
        await navigator.clipboard.writeText(pendingLoginId);
        toast('Đã sao chép ID. Hãy giữ riêng tư.');
      } catch {
        const field = document.createElement('textarea');
        field.value = pendingLoginId;
        field.setAttribute('readonly', '');
        field.style.position = 'fixed';
        field.style.opacity = '0';
        document.body.appendChild(field);
        field.select();
        const copied = document.execCommand('copy');
        field.remove();
        toast(copied ? 'Đã sao chép ID. Hãy giữ riêng tư.' : 'Không thể sao chép tự động. Hãy chọn ID và sao chép thủ công.');
      }
    });

    byId('toggle-id-btn')?.addEventListener('click', () => {
      if (!account || !pendingLoginId) return;
      loginIdVisible = !loginIdVisible;
      renderIdCard();
    });

    byId('history-more')?.addEventListener('click', () => loadHistory(false));
    byId('logout-btn')?.addEventListener('click', async () => {
      const gameActive = byId('game-screen')?.classList.contains('active');
      if (gameActive && !window.confirm('Đăng xuất khi đang chơi? Lượt hiện tại sẽ không được lưu.')) return;
      const button = byId('logout-btn');
      button.disabled = true;
      try {
        await request('/api/auth/logout', { method: 'POST', body: '{}' });
        pendingLoginId = null;
        loginIdVisible = false;
        clearStoredLoginId();
        setAccount(null);
        byId('profile-history').innerHTML = '';
        setStatus('Đã đăng xuất.', 'success');
        toast('Đã đăng xuất khỏi tài khoản.');
        setTimeout(closeProfile, 700);
      } catch (error) {
        setStatus(errorText(error), 'error');
      } finally {
        button.disabled = false;
      }
    });

    try {
      const data = await request('/api/auth/me');
      pendingLoginId = readStoredLoginId();
      loginIdVisible = false;
      setAccount(data.account);
    } catch (error) {
      if (error?.status === 401) clearStoredLoginId();
      pendingLoginId = null;
      setAccount(null);
    }
    await refreshLeaderboard();
  }

  readyPromise = initialize();
  window.SCCAccount = {
    ready: () => readyPromise,
    createAccount,
    getAccount: currentAccount,
    isAuthenticated,
    refreshLeaderboard,
    updateStudentId: async (studentId) => {
      const data = await request('/api/me/student-id', { method: 'PATCH', body: JSON.stringify({ studentId }) });
      setAccount(data.account);
      return currentAccount();
    },
    recordPlay,
    openProfile
  };
})();
