import "./style.css";

const app = document.querySelector("#app");

const formUrl =
  "https://forms.gle/x7bVPFRmz3VUGPGf9";

const dcs = [
  "Elemental",
  "Gaia",
  "Mana",
  "Meteor"
];

let selectedDC = "Elemental";
let selectedWorld = "Aegis";

let openedImage = null;

const posters = {
  Elemental: {
    Aegis: [],
    Atomos: [],
    Carbuncle: [],
    Garuda: [],
    Gungnir: [],
    Kujata: [],
    Tonberry: [],
    Typhon: [],
  },

  Gaia: {
    Alexander: [],
    Bahamut: [],
    Durandal: [],
    Fenrir: [],
    Ifrit: [],
    Ridill: [],
    Tiamat: [],
    Ultima: [],
  },

  Mana: {
    Anima: [],
    Asura: [],
    Chocobo: [],
    Hades: [
      "/posters/SummerFairy.png",
    ],
    Ixion: [],
    Masamune: [],
    Pandaemonium: [],
    Titan: [],
  },

  Meteor: {
    Belias: [],
    Mandragora:[],
    Ramuh: [],
    Shinryu: [],
    Unicorn: [],
    Valefor: [],
    Yojimbo: [],
    Zeromus: [],
  },
};

function render() {
  const worlds =
    Object.keys(posters[selectedDC]);

  const currentPosters =
    posters[selectedDC][selectedWorld] || [];

  app.innerHTML = `
    <div class="container">

      <a href="/" class="back-btn">
        ← ホームへ戻る
      </a>

      <h1>FF14 募集掲示板</h1>

      <p class="desc">
        DCごとの募集ポスターを掲載しています。
      </p>

      <a
        href="${formUrl}"
        target="_blank"
        class="post-btn"
      >
        ＋ ポスターを申請する
      </a>

      <div class="dc-tabs">
        ${dcs.map(dc => `
          <button
            class="dc-btn ${
              selectedDC === dc
                ? "active"
                : ""
            }"
            data-dc="${dc}"
          >
            ${dc}
          </button>
        `).join("")}
      </div>

      <div class="world-tabs">
        ${worlds.map(world => `
          <button
            class="world-btn ${
              selectedWorld === world
                ? "active"
                : ""
            }"
            data-world="${world}"
          >
            ${world}
          </button>
        `).join("")}
      </div>

      <section class="poster-grid">

        ${
          currentPosters.length
            ? currentPosters.map(src => `
                <img
                  src="${src}"
                  class="poster-image"
                  data-image="${src}"
                />
              `).join("")
            : `
              <p class="empty">
                まだポスターはありません
              </p>
            `
        }

      </section>

    </div>

    ${
      openedImage
        ? `
          <div
            class="image-modal"
            id="imageModal"
          >
            <img
              src="${openedImage}"
              class="modal-image"
            />
          </div>
        `
        : ""
    }
  `;

  // DC切り替え
  document
    .querySelectorAll(".dc-btn")
    .forEach(btn => {
      btn.onclick = () => {
        selectedDC = btn.dataset.dc;

        selectedWorld =
          Object.keys(
            posters[selectedDC]
          )[0];

        render();
      };
    });

  // ワールド切り替え
  document
    .querySelectorAll(".world-btn")
    .forEach(btn => {
      btn.onclick = () => {
        selectedWorld =
          btn.dataset.world;

        render();
      };
    });

  // 画像拡大
  document
    .querySelectorAll(".poster-image")
    .forEach(img => {
      img.onclick = () => {
        openedImage =
          img.dataset.image;

        render();
      };
    });

  // モーダル閉じる
  document
    .querySelector("#imageModal")
    ?.addEventListener("click", () => {
      openedImage = null;
      render();
    });
}

render();