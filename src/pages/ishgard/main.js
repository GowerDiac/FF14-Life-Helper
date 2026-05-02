import "./style.css";

const app = document.querySelector("#app");

const recipes = [
  {
    name: "アイスボックス",
    job: "木工師",
    materials: [
      ["幻風枝", 5],
      ["特注氷筍", 10],
      ["特注原木", 10],
      ["特注研草", 10],
    ],
  },
  {
    name: "寝台",
    job: "木工師",
    materials: [
      ["最高級ホワイトシーダー原木", 10],
      ["最高級小麦", 10],
      ["最高級綿花", 10],
      ["ドワーフ綿布", 1],
    ],
  },
  {
    name: "ウェザーチョコボ",
    job: "鍛冶師",
    materials: [
      ["幻風枝", 5],
      ["特注鉱石", 10],
      ["特注虹結晶", 10],
      ["特注珪砂", 10],
    ],
  },
  {
    name: "焜炉",
    job: "鍛冶師",
    materials: [
      ["最高級金鉱", 10],
      ["最高級霊青岩", 10],
      ["最高級ホワイトシーダー原木", 10],
      ["ハイミスリルナゲット", 1],
    ],
  },
  {
    name: "カンパニーチェスト",
    job: "甲冑師",
    materials: [
      ["幻火石", 5],
      ["特注原木", 10],
      ["特注虹結晶", 10],
      ["特注マユ", 10],
    ],
  },
  {
    name: "街灯",
    job: "甲冑師",
    materials: [
      ["最高級金鉱", 10],
      ["最高級霊青岩", 10],
      ["最高級鉱砂", 10],
      ["ハイミスリルナゲット", 1],
    ],
  },
  {
    name: "アストロスコープ",
    job: "彫金師",
    materials: [
      ["幻火石", 5],
      ["特注鉱石", 10],
      ["特注珪砂", 10],
      ["特注研草", 10],
    ],
  },
  {
    name: "篝火大",
    job: "彫金師",
    materials: [
      ["最高級霊青岩", 10],
      ["最高級鉱砂", 10],
      ["最高級古代樹脂", 10],
      ["ハイミスリルインゴット", 1],
    ],
  },
  {
    name: "ツールベルト",
    job: "革細工師",
    materials: [
      ["幻土草", 5],
      ["特注カイマン", 10],
      ["特注珪砂", 10],
      ["特注氷筍", 10],
    ],
  },
  {
    name: "作業着",
    job: "革細工師",
    materials: [
      ["最高級陸亀", 10],
      ["最高級ホワイトシーダー原木", 10],
      ["最高級綿花", 10],
      ["ドワーフ綿布", 1],
    ],
  },
  {
    name: "ベスト",
    job: "裁縫師",
    materials: [
      ["幻雷鉱砂", 5],
      ["特注マユ", 10],
      ["特注天然水", 10],
      ["特注研草", 10],
    ],
  },
  {
    name: "オーニング",
    job: "裁縫師",
    materials: [
      ["最高級綿花", 10],
      ["最高級古代樹脂", 10],
      ["最高級天然水", 10],
      ["リグナムバイタ材", 1],
    ],
  },
  {
    name: "幻薬",
    job: "錬金術師",
    materials: [
      ["幻雷鉱砂", 5],
      ["特注カイマン", 10],
      ["特注マユ", 10],
      ["特注ラズベリー", 10],
    ],
  },
  {
    name: "グロースフォーミュラ",
    job: "錬金術師",
    materials: [
      ["最高級陸亀", 10],
      ["最高級岩塩", 10],
      ["最高級天然水", 10],
      ["カブスの肉", 4],
    ],
  },
  {
    name: "ソルベ",
    job: "調理師",
    materials: [
      ["幻土草", 5],
      ["特注氷筍", 10],
      ["特注天然水", 10],
      ["特注ラズベリー", 10],
    ],
  },
  {
    name: "シチュー",
    job: "調理師",
    materials: [
      ["最高級小麦", 10],
      ["最高級天然水", 10],
      ["最高級岩塩", 10],
      ["オヴィムの肉", 4],
    ],
  },
];

const materials = [
  { name: "幻雷鉱砂", group: "green" },
  { name: "幻火石", group: "green" },
  { name: "幻土草", group: "green" },
  { name: "幻風枝", group: "green" },

  { name: "特注虹結晶", group: "blue" },
  { name: "特注珪砂", group: "blue" },
  { name: "特注氷筍", group: "blue" },
  { name: "特注天然水", group: "blue" },
  { name: "特注鉱石", group: "blue" },

  { name: "特注研草", group: "yellow" },
  { name: "特注マユ", group: "yellow" },
  { name: "特注カイマン", group: "yellow" },
  { name: "特注ラズベリー", group: "yellow" },
  { name: "特注原木", group: "yellow" },

  { name: "最高級霊青岩", group: "purple" },
  { name: "最高級鉱砂", group: "purple" },
  { name: "最高級天然水", group: "purple" },
  { name: "最高級岩塩", group: "purple" },
  { name: "最高級金鉱", group: "purple" },

  { name: "最高級陸亀", group: "red" },
  { name: "最高級綿花", group: "red" },
  { name: "最高級小麦", group: "red" },
  { name: "最高級古代樹脂", group: "red" },
  { name: "最高級ホワイトシーダー原木", group: "red" },

  { name: "ドワーフ綿布", group: "gray" },
  { name: "ハイミスリルナゲット", group: "gray" },
  { name: "ハイミスリルインゴット", group: "gray" },
  { name: "リグナムバイタ材", group: "gray" },
  { name: "カブスの肉", group: "gray" },
  { name: "オヴィムの肉", group: "gray" },
];

let stocks =
  JSON.parse(localStorage.getItem("ishgardStocks")) ||
  Object.fromEntries(materials.map(m => [m.name, 0]));
  
function getCraftable(recipe) {
  return Math.min(
    ...recipe.materials.map(([name, need]) =>
      Math.floor((stocks[name] || 0) / need)
    )
  );
}

function updateResult() {
  const result = recipes
    .map(r => ({
      ...r,
      count: getCraftable(r),
    }))
    .filter(r => r.count > 0)
    .sort((a, b) => b.count - a.count);

  const resultArea = document.querySelector("#resultArea");

  resultArea.innerHTML =
    result.length
      ? `
        <table class="result-table">
          <thead>
            <tr>
              <th>レシピ名</th>
              <th>職業</th>
              <th>作成可能</th>
            </tr>
          </thead>
          <tbody>
            ${result.map(r => `
              <tr>
                <td>${r.name}</td>
                <td>${r.job}</td>
                <td>${r.count}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      `
      : `<p class="empty">作成可能なレシピはありません</p>`;
}

function render() {
  app.innerHTML = `
    <div class="container">
      <a href="/" class="back-btn">← ホームへ戻る</a>
      <h1>蒼天街クラフト管理</h1>

      <div class="ishgard-grid">

        <section class="card">
          <div class="card-title">素材在庫</div>

          <div class="material-list">
            ${materials.map(m => `
              <div class="material-row ${m.group}">
                <span>${m.name}</span>
                <input
                  type="number"
                  min="0"
                  data-name="${m.name}"
                  value="${stocks[m.name] ?? 0}"
                />
              </div>
            `).join("")}
          </div>

          <button id="resetBtn" class="danger">
            在庫リセット
          </button>
        </section>

        <section class="card">
          <div class="card-title">作成可能一覧</div>
          <div id="resultArea"></div>
        </section>

      </div>
      <div class="ad-box"></div>
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

  document.querySelectorAll("input").forEach(input => {
    input.addEventListener("input", e => {
      stocks[e.target.dataset.name] = Number(e.target.value);

      localStorage.setItem(
        "ishgardStocks",
        JSON.stringify(stocks)
      );

      updateResult();
    });
  });

  document.getElementById("resetBtn").onclick = () => {
    stocks = Object.fromEntries(materials.map(m => [m.name, 0]))
    localStorage.setItem(
      "ishgardStocks",
      JSON.stringify(stocks)
    );
    render();
  };

  updateResult();
  
}

render();