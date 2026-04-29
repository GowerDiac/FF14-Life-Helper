import './style.css';

document.querySelector('#app').innerHTML = `
  <div class="home">
    <h1>FF14 Life Helper</h1>
    <p class="subtitle">
      FF14の生活系コンテンツをもっと便利に
    </p>

    <div class="tool-grid">
      <a href="/src/pages/timer/index.html" class="tool-card">
        <div class="icon">⏰</div>
        <h2>ライフタイマー</h2>
        <p>
          リテイナー / 畑 / チョコボ厩舎
        </p>
      </a>

      <div class="tool-card soon">
        <div class="icon">📦</div>
        <h2>未定</h2>
        <p>準備中</p>
      </div>

      <div class="tool-card soon">
        <div class="icon">🌱</div>
        <h2>未定</h2>
        <p>準備中</p>
      </div>
    </div>
    <footer class="site-footer">
      <button id="aboutBtn" class="footer-link">
        About
      </button>
      <span class="footer-divider">｜</span>
      <button id="privacyBtn" class="footer-link">
        Privacy Policy
      </button>
    </footer>

    <div id="privacyModal" class="modal hidden">
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

    <div id="aboutModal" class="modal hidden">
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

const aboutBtn = document.getElementById("aboutBtn");
const privacyBtn = document.getElementById("privacyBtn");

const aboutModal = document.getElementById("aboutModal");
const privacyModal = document.getElementById("privacyModal");

const closeAbout = document.getElementById("closeAbout");
const closePrivacy = document.getElementById("closePrivacy");

const aboutCard = document.querySelector(".about-card");
const privacyCard = document.querySelector(".policy-card");

// 開く
aboutBtn?.addEventListener("click", () => {
  aboutModal.classList.remove("hidden");
});

privacyBtn?.addEventListener("click", () => {
  privacyModal.classList.remove("hidden");
});

// ×で閉じる
closeAbout?.addEventListener("click", () => {
  aboutModal.classList.add("hidden");
});

closePrivacy?.addEventListener("click", () => {
  privacyModal.classList.add("hidden");
});

// 背景クリックで閉じる
aboutModal?.addEventListener("click", () => {
  aboutModal.classList.add("hidden");
});

privacyModal?.addEventListener("click", () => {
  privacyModal.classList.add("hidden");
});

// 中身クリックでは閉じない
aboutCard?.addEventListener("click", (e) => {
  e.stopPropagation();
});

privacyCard?.addEventListener("click", (e) => {
  e.stopPropagation();
});