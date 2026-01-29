// ------------------------------
// 1. URL パラメータを取得
// ------------------------------
const params = new URLSearchParams(window.location.search);
const targetUrl = params.get("url");

if (!targetUrl) {
  showError("URL が取得できませんでした。index.html からやり直してください。");
  throw new Error("URL parameter missing");
}

// ------------------------------
// 2. Workers API にリクエスト
// ------------------------------
async function fetchData() {
  const endpoint = "https://sanpo-proxy.your-domain.workers.dev/extract";

  try {
    const res = await fetch(endpoint + "?url=" + encodeURIComponent(targetUrl));

    if (!res.ok) {
      throw new Error("API error: " + res.status);
    }

    const data = await res.json();
    return data;

  } catch (err) {
    console.error(err);
    showError("透明化に失敗しました。URL を確認してください。");
    return null;
  }
}

// ------------------------------
// 3. UI に反映
// ------------------------------
function render(data) {
  if (!data) return;

  // タイトル
  document.getElementById("title").textContent =
    data.title || "タイトル不明";

  // 基本情報
  document.getElementById("rent").textContent =
    "家賃：" + (data.rent || "不明");

  document.getElementById("layout").textContent =
    "間取り：" + (data.layout || "不明");

  document.getElementById("age").textContent =
    "築年数：" + (data.age || "不明");

  document.getElementById("area").textContent =
    "専有面積：" + (data.area || "不明");

  // 駅距離
  document.getElementById("station").textContent =
    data.station_distance || "不明";

  // 人口
  document.getElementById("population").textContent =
    data.population || "不明";

  // 要点（配列）
  const pointsEl = document.getElementById("points");
  pointsEl.innerHTML = "";
  if (Array.isArray(data.points)) {
    data.points.forEach(p => {
      const li = document.createElement("li");
      li.textContent = p;
      pointsEl.appendChild(li);
    });
  } else {
    pointsEl.innerHTML = "<li>不明</li>";
  }

  // 深掘り（有料）
  setDeep("noise", data.noise);
  setDeep("structure", data.structure);
}

// ------------------------------
// 4. 深掘りカードの共通処理
// ------------------------------
function setDeep(prefix, obj) {
  if (!obj) return;

  document.getElementById(`${prefix}-fact`).textContent =
    obj.fact || "不明";

  document.getElementById(`${prefix}-note`).textContent =
    obj.note || "不明";

  document.getElementById(`${prefix}-limit`).textContent =
    obj.limit || "不明";

  document.getElementById(`${prefix}-source`).textContent =
    obj.source || "不明";
}

// ------------------------------
// 5. エラー表示
// ------------------------------
function showError(message) {
  const el = document.getElementById("error-area");
  el.textContent = message;
  el.style.display = "block";
}

// ------------------------------
// 6. メイン処理
// ------------------------------
async function main() {
  const data = await fetchData();
  render(data);
}

main();
