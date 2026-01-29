// ------------------------------
// 1. URL パラメータを取得
// ------------------------------
const params = new URLSearchParams(window.location.search);
const targetUrl = params.get("url");

if (!targetUrl) {
  alert("URL が取得できませんでした。index.html からやり直してください。");
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
// 3. UI に反映（最小版）
// ------------------------------
function render(data) {
  if (!data) return;

  // 家賃
  document.getElementById("rent").textContent =
    "家賃：" + (data.rent || "不明");

  // 駅距離
  document.getElementById("station").textContent =
    "駅距離：" + (data.station_distance || "不明");
}

// ------------------------------
// 4. エラー表示
// ------------------------------
function showError(message) {
  const el = document.getElementById("error-area");
  if (el) {
    el.textContent = message;
    el.style.display = "block";
  } else {
    alert(message);
  }
}

// ------------------------------
// 5. メイン処理
// ------------------------------
async function main() {
  const data = await fetchData();
  render(data);
}

main();
