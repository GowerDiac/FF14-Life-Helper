import './style.css';

const app = document.querySelector('#app');

let editingId = null;
let adding = false;

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
}

// auto render
setInterval(() => {
  if (editingId || adding) return;
  render();
}, 1000);

render();