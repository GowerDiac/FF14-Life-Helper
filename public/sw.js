self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", () => {
  console.log("SW activated");
});

self.addEventListener("fetch", () => {
  // 基本キャッシュなし（軽量運用）
});