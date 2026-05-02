import './style.css';

const app = document.querySelector('#app');

let editingId = null;
let adding = false;
let soundEnabled =
  JSON.parse(localStorage.getItem("soundEnabled") ?? "true");
let soundVolume =
  Number(localStorage.getItem("soundVolume") ?? "70");

let notifiedTimers = {};

let audioCtx = null;

function initAudio() {
  const AudioContext =
    window.AudioContext || window.webkitAudioContext;

  if (!AudioContext) return;

  if (!audioCtx) {
    audioCtx = new AudioContext();
  }

  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
}

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

function formatEndTime(endTime) {
  const date = new Date(endTime);

  const h = String(date.getHours()).padStart(2, "0");
  const m = String(date.getMinutes()).padStart(2, "0");

  return `${h}:${m}`;
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

function playNotificationSound() {
  if (!soundEnabled) return;
  if (!audioCtx) return;

  const now = audioCtx.currentTime;
  const master = audioCtx.createGain();

  master.gain.value = soundVolume / 100;
  master.connect(audioCtx.destination);

  // キラッと鳴る高音を重ねる
  const notes = [1046.5, 1318.5, 1568, 2093]; // C6 E6 G6 C7

  notes.forEach((freq, i) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = "sine";
    osc.frequency.value = freq;

    const start = now + i * 0.12;

    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.linearRampToValueAtTime(0.18, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      start + 2.8
    );

    osc.connect(gain);
    gain.connect(master);

    osc.start(start);
    osc.stop(start + 2.8);
  });

  // きらめき成分
  for (let i = 0; i < 8; i++) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = "triangle";
    osc.frequency.value =
      2500 + Math.random() * 2500;

    const start = now + 0.1 + i * 0.08;

    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.linearRampToValueAtTime(
      0.03,
      start + 0.01
    );
    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      start + 1.2
    );

    osc.connect(gain);
    gain.connect(master);

    osc.start(start);
    osc.stop(start + 1.2);
  }
}

function updateCountdowns() {
  let shouldRerender = false;

  document.querySelectorAll(".remain-time").forEach(el => {
    const id = Number(el.dataset.id);
    const timer = timers.find(t => t.id === id);

    if (!timer) return;

    const remaining = getRemaining(timer);
    const finished = remaining <= 0;

    // 残り時間表示だけ毎秒更新
    el.textContent = finished
      ? "帰還しました！"
      : `残り ${formatTime(remaining)}`;

    const card = el.closest(".card");

    const endEl = card?.querySelector(".end-time");
    if (endEl && !finished) {
      endEl.textContent =
        `🕒 ${formatEndTime(timer.endTime)} に終了`;
    }

    // 見た目更新
    if (finished) {
      card?.classList.add("finished");

      // 初回終了時だけ通知＆再描画
      if (!notifiedTimers[id]) {
        playNotificationSound();
        notifiedTimers[id] = true;
        shouldRerender = true;
      }
    } else {
      card?.classList.remove("finished");
      notifiedTimers[id] = false;
    }
  });

  // 終了した瞬間だけ全体再描画
  if (shouldRerender) {
    render();
  }
}

// --------------------
// render
// --------------------
function render() {
  app.innerHTML = `
    <div class="container">
      <a href="/" class="back-btn">← ホームへ戻る</a>
      <h1>FF14 Life Helper</h1>

      <div class="sound-setting">
        <label class="sound-toggle">
          <input
            type="checkbox"
            id="soundToggle"
            ${soundEnabled ? "checked" : ""}
          />
          <span>🔔 音通知 ON</span>
        </label>

        <div class="sound-volume-wrap">
          <span>🔊 ${soundVolume}%</span>

          <input
            id="volumeSlider"
            type="range"
            min="0"
            max="100"
            value="${soundVolume}"
          />

          <button id="soundTestBtn" class="sound-test-btn">
            ♪ テスト再生
          </button>
        </div>
      </div>

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

                ${
                  finished
                    ? `
                      <p
                        class="remain-time"
                        data-id="${timer.id}"
                      >
                        帰還しました！
                      </p>
                    `
                    : `
                      <p
                        class="remain-time"
                        data-id="${timer.id}"
                      >
                        残り ${formatTime(remaining)}
                      </p>

                      <p class="end-time">
                        🕒 ${formatEndTime(timer.endTime)} に終了
                      </p>
                    `
                }

                <div class="buttons">
                  ${
                    finished
                      ? `<button data-id="${timer.id}" class="restart">↻ もう一度</button>`
                      : ""
                  }

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
      
      <div class="ad-box">
        <ins
          class="adsbygoogle"
          style="display:block"
          data-ad-client="ca-pub-6816707587409913"
          data-ad-slot="4617669955"
          data-ad-format="auto"
          data-full-width-responsive="true">
        </ins>
      </div>

      <section class="howto-section">
        <h3 class="section-title">How to Use</h3>

        <div class="howto-grid">
          <div class="howto-card">
            <div class="howto-number">①</div>
            <h4>クイック追加</h4>
            <p>よく使うタイマーをワンタップですぐ開始できます。</p>
          </div>

          <div class="howto-card">
            <div class="howto-number">②</div>
            <h4>カスタム追加</h4>
            <p>自由な名前と時間で、自分専用タイマーを作れます。</p>
          </div>

          <div class="howto-card">
            <div class="howto-number">③</div>
            <h4>お気に入り登録</h4>
            <p>よく使うタイマー設定を保存してすぐ呼び出せます。</p>
          </div>

          <div class="howto-card">
            <div class="howto-number">④</div>
            <h4>残り時間通知</h4>
            <p>終了時に光って知らせるので見逃しにくいです。</p>
          </div>
        </div>
      </section>
      <footer class="site-footer">
        <p>
          FINAL FANTASY XIV © SQUARE ENIX
        </p>
        <p>
          当サイトは非公式のファン制作ツールであり、
          株式会社スクウェア・エニックスとは関係ありません。
        </p>
        <p>
          Contact：ff14lifehelper@gmail.com
        </p>
      </footer>
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

  document.getElementById("soundToggle")?.addEventListener("change", (e) => {
    soundEnabled = e.target.checked;
    localStorage.setItem(
      "soundEnabled",
      JSON.stringify(soundEnabled)
    );
  });

  const volumeSlider = document.getElementById("volumeSlider");

  volumeSlider?.addEventListener("input", (e) => {
    soundVolume = Number(e.target.value);
    localStorage.setItem("soundVolume", soundVolume);

    const label = document.querySelector(".sound-volume-wrap span");
    if (label) {
      label.textContent = `🔊 ${soundVolume}%`;
    }
  });

  document.getElementById("soundTestBtn")?.addEventListener("click", () => {
    initAudio();
    playNotificationSound();
  });

  document.addEventListener(
    "click",
    () => {
      initAudio();
    },
    { once: true }
  );  

  document
    .querySelectorAll("input, select, textarea, button")
    .forEach(el => {
      el.addEventListener("focus", pauseAutoRender);
      el.addEventListener("blur", resumeAutoRender);

      el.addEventListener("pointerdown", pauseAutoRender);
      el.addEventListener("change", resumeAutoRender);
    });

  // AdSense描画
  setTimeout(() => {
    try {
      (adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.log(e);
    }
  }, 300);
}

// auto render
setInterval(updateCountdowns, 1000);

render();