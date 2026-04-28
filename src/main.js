import './style.css';

const app = document.querySelector('#app');

let editingId = null;
let adding = false;
let isPrivacyOpen = false;
let isAboutOpen = false;

// data
let timers = JSON.parse(localStorage.getItem('timers')) || [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

const categoryMap = {
  retainer: { icon: '🧑‍🌾', label: 'リテイナー' },
  field: { icon: '🌱', label: '畑' },
  fertilizer: { icon: '🧪', label: '畑肥料' },
  chocobo: { icon: '🐥', label: 'チョコボ厩舎' },
  custom: { icon: '⭐', label: 'カスタム' },
};

// --------------------
// save
// --------------------
function saveAll() {
  localStorage.setItem('timers', JSON.stringify(timers));
  localStorage.setItem('favorites', JSON.stringify(favorites));
}

// --------------------
// time
// --------------------
function getRemaining(timer) {
  return Math.max(0, Math.floor((timer.endTime - Date.now()) / 1000));
}

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  if (h > 0) {
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// --------------------
// add timer
// --------------------
function addPreset(name, minutes, category) {
  timers.push({
    id: Date.now(),
    category,
    name,
    duration: minutes * 60,
    endTime: Date.now() + minutes * 60 * 1000,
  });

  saveAll();
  render();
}

function addCustomTimer() {
  const category = document.querySelector('#add-category').value;
  const name = document.querySelector('#add-name').value.trim();
  const minutes = Number(document.querySelector('#add-minutes').value);

  if (!name || !minutes) return;

  timers.push({
    id: Date.now(),
    category,
    name,
    duration: minutes * 60,
    endTime: Date.now() + minutes * 60 * 1000,
  });

  adding = false;
  saveAll();
  render();
}

// --------------------
// actions
// --------------------
function restartTimer(id) {
  timers = timers.map(t =>
    t.id === id
      ? { ...t, endTime: Date.now() + t.duration * 1000 }
      : t
  );

  saveAll();
  render();
}

function deleteTimer(id) {
  timers = timers.filter(t => t.id !== id);
  saveAll();
  render();
}

// --------------------
// edit
// --------------------
function startEdit(id) {
  editingId = id;
  render();
}

function cancelEdit() {
  editingId = null;
  render();
}

function saveEdit(id) {
  const category = document.querySelector(`#category-${id}`).value;
  const name = document.querySelector(`#name-${id}`).value.trim();
  const minutes = Number(document.querySelector(`#minutes-${id}`).value);

  if (!name || !minutes) return;

  timers = timers.map(t =>
    t.id === id
      ? {
          ...t,
          category,
          name,
          duration: minutes * 60,
          endTime: Date.now() + minutes * 60 * 1000,
        }
      : t
  );

  editingId = null;
  saveAll();
  render();
}

// --------------------
// favorites
// --------------------
function toggleFavorite(timer) {
  const exists = favorites.find(f => f.name === timer.name);

  if (exists) {
    favorites = favorites.filter(f => f.name !== timer.name);
  } else {
    favorites.push({
      name: timer.name,
      category: timer.category,
      duration: timer.duration,
    });
  }

  saveAll();
  render();
}

function removeFavorite(name) {
  favorites = favorites.filter(f => f.name !== name);
  saveAll();
  render();
}

// --------------------
// UI state
// --------------------
function openAddForm() {
  adding = true;
  render();
}

function cancelAdd() {
  adding = false;
  render();
}

// --------------------
// render
// --------------------
function render() {
  const windowScrollY = window.scrollY;

  const policyContentEl = document.querySelector(".policy-card");
  const policyScrollTop = policyContentEl ? policyContentEl.scrollTop : 0;
  const aboutContentEl = document.querySelector(".about-card");
  const aboutScrollTop = aboutContentEl ? aboutContentEl.scrollTop : 0;

  app.innerHTML = `
    <div class="container">
      <h1>FF14 Life Helper</h1>

      ${
        favorites.length > 0
          ? `
        <div class="favorites">
          <h3>⭐ よく使う</h3>
          ${favorites
            .map(f => `
              <div class="fav-item">
                <button class="preset-fav"
                  data-name="${f.name}"
                  data-min="${f.duration / 60}"
                  data-category="${f.category}">
                  ${f.name}
                </button>

                <button class="fav-remove" data-name="${f.name}">
                  ×
                </button>
              </div>
            `)
            .join('')}
        </div>
      `
          : ''
      }

      <div class="top-buttons">
        <button id="addBtn">＋ カスタム追加</button>

        ${
          adding
            ? `
          <div class="edit-box">
            <select id="add-category">
              <option value="custom">⭐ カスタム</option>
              <option value="retainer">🧑‍🌾 リテイナー</option>
              <option value="field">🌱 畑</option>
              <option value="fertilizer">🧪 畑肥料</option>
              <option value="chocobo">🐥 チョコボ厩舎</option>
            </select>

            <input id="add-name" placeholder="名前" />
            <input id="add-minutes" type="number" value="60" />

            <div class="buttons">
              <button id="saveAdd">追加</button>
              <button id="cancelAdd" class="danger">キャンセル</button>
            </div>
          </div>
        `
            : ''
        }

        <button class="preset" data-name="リテイナー" data-min="40" data-category="retainer">🧑‍🌾 リテイナー40分</button>
        <button class="preset" data-name="リテイナー" data-min="60" data-category="retainer">🧑‍🌾 リテイナー60分</button>
        <button class="preset" data-name="畑" data-min="1440" data-category="field">🌱 畑(1日)</button>
        <button class="preset" data-name="畑肥料" data-min="60" data-category="fertilizer">🧪 畑肥料(60分)</button>
        <button class="preset" data-name="チョコボ厩舎" data-min="60" data-category="chocobo">🐥 チョコボ厩舎(1時間)</button>
      </div>

      <div id="timerList">
        ${[...timers]
          .sort((a, b) => {
            const ar = getRemaining(a);
            const br = getRemaining(b);

            const af = ar <= 0;
            const bf = br <= 0;

            if (af && !bf) return -1;
            if (!af && bf) return 1;

            return ar - br;
          })
          .map(timer => {
            const remaining = getRemaining(timer);
            const finished = remaining <= 0;
            const cat = categoryMap[timer.category] || categoryMap.custom;
            const isEditing = editingId === timer.id;

            return `
              <div class="card ${finished ? 'finished' : ''}">
                <h2>${cat.icon} ${timer.name}</h2>

                <p>${finished ? '帰還しました！' : `残り ${formatTime(remaining)}`}</p>

                <div class="buttons">
                  <button data-id="${timer.id}" class="restart">再開</button>
                  <button data-id="${timer.id}" class="edit">編集</button>
                  <button data-id="${timer.id}" class="danger delete">削除</button>
                  <button data-id="${timer.id}" class="fav">⭐</button>
                </div>

                ${
                  isEditing
                    ? `
                  <div class="edit-box">
                    <select id="category-${timer.id}">
                      <option value="retainer" ${timer.category === 'retainer' ? 'selected' : ''}>🧑‍🌾</option>
                      <option value="field" ${timer.category === 'field' ? 'selected' : ''}>🌱</option>
                      <option value="fertilizer" ${timer.category === 'fertilizer' ? 'selected' : ''}>🧪</option>
                      <option value="chocobo" ${timer.category === 'chocobo' ? 'selected' : ''}>🐥</option>
                      <option value="custom" ${timer.category === 'custom' ? 'selected' : ''}>⭐</option>
                    </select>

                    <input id="name-${timer.id}" value="${timer.name}" />
                    <input id="minutes-${timer.id}" type="number" value="${Math.floor(timer.duration / 60)}" />

                    <div class="buttons">
                      <button data-id="${timer.id}" class="save">保存</button>
                      <button data-id="${timer.id}" class="cancel">キャンセル</button>
                    </div>
                  </div>
                `
                    : ''
                }
              </div>
            `;
          })
          .join('')}
      </div>
      <div class="ad-section">
        <div class="ad-label">スポンサーリンク</div>
        <div class="ad-box">
          AdSense広告エリア（準備中）
        </div>
      </div>

      <section class="update-log">
        <h3 class="section-title">Update Log</h3>

        <div class="log-list">
          <div class="log-item">
            <span class="log-date">2026/04/28</span>
            <span class="log-text">Privacy Policy追加</span>
          </div>

          <div class="log-item">
            <span class="log-date">2026/04/28</span>
            <span class="log-text">Aboutページ追加</span>
          </div>

          <div class="log-item">
            <span class="log-date">2026/04/27</span>
            <span class="log-text">タイマー機能改善 / UI改善</span>
          </div>
        </div>
      </section>

      <footer class="site-footer">
        <button id="aboutBtn" class="footer-link">
          About
        </button>
        <span class="footer-divider">｜</span>
        <button id="privacyBtn" class="footer-link">
          Privacy Policy
        </button>
      </footer>

      <div id="privacyModal" class="modal ${isPrivacyOpen ? "" : "hidden"}">
        <div class="modal-card policy-card">
          <button id="closePrivacy" class="modal-close">×</button>

          <h2>Privacy Policy</h2>

          <div class="policy-content">
            <p><strong>制定日：</strong>2026年4月28日</p>

            <p>
              本プライバシーポリシーは、「FF14 Life Helper」（以下「当サービス」といいます）が提供する
              Webサイト・アプリ・関連サービスにおける、ユーザー情報および利用情報の取り扱いについて定めるものです。
            </p>

            <h3>第1条（収集する情報）</h3>
            <p>
              お問い合わせ時にユーザーが任意で入力する情報（メールアドレス・問い合わせ内容等）、
              Cookie、アクセス情報、利用状況データを収集する場合があります。
            </p>

            <h3>第2条（利用目的）</h3>
            <p>
              サービス提供、改善、サポート対応、不正利用防止、広告配信、アクセス解析のために利用します。
            </p>

            <h3>第3条（広告について）</h3>
            <p>
              当サービスは第三者配信広告（Google AdSense等）を利用する場合があります。
              Cookieを利用して興味に応じた広告を表示する場合があります。
            </p>

            <h3>第4条（アクセス解析）</h3>
            <p>Google Analytics等を利用する場合があります。</p>

            <h3>第5条（ローカル保存）</h3>
            <p>
              ユーザーが追加したタイマー設定やお気に入り情報を、
              ブラウザのローカルストレージへ保存する場合があります。
            </p>

            <h3>第6条（著作権）</h3>
            <p>
              「ファイナルファンタジーXIV」 © SQUARE ENIX<br>
              当サービスは非公式ファン制作ツールであり、
              株式会社スクウェア・エニックスとは一切関係ありません。
            </p>

            <h3>第7条（お問い合わせ）</h3>
            <p>ff14lifehelper@gmail.com</p>
          </div>
        </div>
      </div>

      <div id="aboutModal" class="modal ${isAboutOpen ? "" : "hidden"}">
        <div class="modal-card about-card">
          <button id="closeAbout" class="modal-close">×</button>

          <h2>About FF14 Life Helper</h2>

          <div class="policy-content">
            <p>
              FF14 Life Helper は、ファイナルファンタジーXIV向けの
              非公式ライフサポートツールです。
            </p>

            <p>
              リテイナー帰還、畑管理、チョコボ厩舎など、
              日常的な管理を少し便利にする目的で制作しています。
            </p>

            <p>
              今後の追加予定：
            </p>

            <ul>
              <li>通知音機能</li>
              <li>タイマー並び替え</li>
              <li>プリセット追加</li>
              <li>UI改善</li>
            </ul>

            <p>
              Contact：ff14lifehelper@gmail.com
            </p>

            <p>
              非公式ファン制作ツール / © SQUARE ENIX
            </p>
          </div>
        </div>
      </div>
    </div>
  `;

  // events
  document.querySelector('#addBtn').onclick = openAddForm;

  document.querySelectorAll('.preset').forEach(btn => {
    btn.onclick = () =>
      addPreset(btn.dataset.name, Number(btn.dataset.min), btn.dataset.category);
  });

  document.querySelectorAll('.preset-fav').forEach(btn => {
    btn.onclick = () =>
      addPreset(btn.dataset.name, Number(btn.dataset.min), btn.dataset.category);
  });

  if (adding) {
    document.querySelector('#saveAdd').onclick = addCustomTimer;
    document.querySelector('#cancelAdd').onclick = cancelAdd;
  }

  document.querySelectorAll('.restart').forEach(btn => {
    btn.onclick = () => restartTimer(Number(btn.dataset.id));
  });

  document.querySelectorAll('.edit').forEach(btn => {
    btn.onclick = () => startEdit(Number(btn.dataset.id));
  });

  document.querySelectorAll('.delete').forEach(btn => {
    btn.onclick = () => deleteTimer(Number(btn.dataset.id));
  });

  document.querySelectorAll('.fav').forEach(btn => {
    btn.onclick = () => {
      const timer = timers.find(t => t.id === Number(btn.dataset.id));
      toggleFavorite(timer);
    };
  });

  document.querySelectorAll('.fav-remove').forEach(btn => {
    btn.onclick = () => removeFavorite(btn.dataset.name);
  });

  document.querySelectorAll('.save').forEach(btn => {
    btn.onclick = () => saveEdit(Number(btn.dataset.id));
  });

  document.querySelectorAll('.cancel').forEach(btn => {
    btn.onclick = cancelEdit;
  });

  document.getElementById("privacyBtn")?.addEventListener("click", () => {
    isPrivacyOpen = true;
    render();
  });

  document.getElementById("closePrivacy")?.addEventListener("click", () => {
    isPrivacyOpen = false;
    render();
  });

  const privacyModal = document.getElementById("privacyModal");
  const policyCard = document.querySelector(".policy-card");
  const newAboutCard = document.querySelector(".about-card");
  if (newAboutCard) {
    newAboutCard.scrollTop = aboutScrollTop;
  } 

  privacyModal?.addEventListener("click", () => {
    isPrivacyOpen = false;
    render();
  });

  policyCard?.addEventListener("click", (e) => {
    e.stopPropagation();
  });

    window.scrollTo(0, windowScrollY);

  const newPolicyCard = document.querySelector(".policy-card");
    if (newPolicyCard) {
      newPolicyCard.scrollTop = policyScrollTop;
  }

  document.getElementById("aboutBtn")?.addEventListener("click", () => {
    isAboutOpen = true;
    render();
  });

  document.getElementById("closeAbout")?.addEventListener("click", () => {
    isAboutOpen = false;
    render();
  });

  const aboutModal = document.getElementById("aboutModal");
  const aboutCard = document.querySelector(".about-card");

  aboutModal?.addEventListener("click", () => {
    isAboutOpen = false;
    render();
  });

  aboutCard?.addEventListener("click", (e) => {
    e.stopPropagation();
  });
}

// auto render
setInterval(() => {
  if (editingId || adding) return;
  render();
}, 1000);

render();