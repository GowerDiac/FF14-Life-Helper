import "./style.css";

const app = document.querySelector("#app");

const shopInfo = {
  name: "GowerDiac Shop",
  world: "Gungnir",
  dc: "Elemental",
  contact: "@GowerDiac",
  description:
    "戦闘飯・薬・ハウジング家具などを販売しています。",
};

const items = [
  {
    category: "戦闘飯",
    name: "キャラメルポップコーン HQ",
    price: "2,500G",
    stock: "在庫あり",
    desc: "レイド向け最新HQ飯",
  },

  {
    category: "薬品",
    name: "剛力の宝薬G4 HQ",
    price: "4,250G",
    stock: "在庫あり",
    desc: "まとめ買い歓迎",
  },

  {
    category: "家具",
    name: "プリズンパーティション",
    price: "10,000G",
    stock: "残り5個",
    desc: "Gungnirでハウスシェアできる方限定",
  },

  {
    category: "家具",
    name: "プリズンパーティションドア",
    price: "10,000G",
    stock: "残り4個",
    desc: "Gungnirでハウスシェアできる方限定",
  },

  {
    category: "家具",
    name: "ラティスウィンドウ・キャビネット",
    price: "200,000G",
    stock: "残り2個",
    desc: "潜水艦産の素材使用家具",
  },
];

function render() {
  app.innerHTML = `
    <div class="shop-page">

      <a href="/" class="back-btn">
        ← ホームへ戻る
      </a>

      <header class="shop-header">

        <div class="shop-title-wrap">
          <h1>
            🛒 ${shopInfo.name}
          </h1>

          <p class="shop-world">
            ${shopInfo.dc} ｜ ${shopInfo.world}
          </p>
        </div>

        <div class="shop-contact">
          <p>
            📮 ${shopInfo.contact}
          </p>
        </div>

      </header>

      <section class="shop-description">
        ${shopInfo.description}
      </section>

      <section class="market-board">

        <div class="market-header">
          <span>商品名</span>
          <span>価格</span>
          <span>在庫</span>
        </div>

        ${
          items.map(item => `
            <article class="market-row">

              <div class="item-main">

                <div class="item-category">
                  ${item.category}
                </div>

                <h2>
                  ${item.name}
                </h2>

                <p class="item-desc">
                  ${item.desc}
                </p>

              </div>

              <div class="item-price">
                ${item.price}
              </div>

              <div class="item-stock">
                ${item.stock}
              </div>

            </article>
          `).join("")
        }

      </section>

      <footer class="shop-footer">

        <p>
          FINAL FANTASY XIV © SQUARE ENIX
        </p>

        <p>
          当サイトは非公式ファン制作ツールです
        </p>

      </footer>

    </div>
  `;
}

render();