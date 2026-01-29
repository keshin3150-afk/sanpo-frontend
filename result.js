document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const targetUrl = params.get("url");

  if (!targetUrl) {
    alert("URL が指定されていません。index.html に戻ってください。");
    return;
  }

  // ★ ここが今回の最重要ポイント（Workers の接続先）
  const endpoint = "https://sanpo-api.udsmail.workers.dev/extract";

  try {
    const res = await fetch(`${endpoint}?url=${encodeURIComponent(targetUrl)}`);
    const data = await res.json();

    // ------------------------------
    // 基本情報
    // ------------------------------
    document.getElementById("title").textContent =
      data.title || "不明";

    document.getElementById("rent").textContent =
      "家賃：" + (data.rent || "不明");

    document.getElementById("layout").textContent =
      "間取り：" + (data.layout || "不明");

    document.getElementById("age").textContent =
      "築年数：" + (data.age || "不明");

    document.getElementById("area").textContent =
      "専有面積：" + (data.area || "不明");

    // ------------------------------
    // 駅距離
    // ------------------------------
    document.getElementById("station_distance").textContent =
      data.station_distance || "不明";

    // ------------------------------
    // 人口
    // ------------------------------
    document.getElementById("population").textContent =
      data.population || "不明";

    // ------------------------------
    // 要点（配列）
    // ------------------------------
    const pointsList = document.getElementById("points");
    pointsList.innerHTML = "";

    if (Array.isArray(data.points)) {
      data.points.forEach((p) => {
        const li = document.createElement("li");
        li.textContent = p;
        pointsList.appendChild(li);
      });
    } else {
      const li = document.createElement("li");
      li.textContent = "不明";
      pointsList.appendChild(li);
    }

    // ------------------------------
    // 深掘り：騒音
    // ------------------------------
    document.getElementById("noise_fact").textContent =
      data.noise?.fact || "不明";

    document.getElementById("noise_note").textContent =
      data.noise?.note || "不明";

    document.getElementById("noise_limit").textContent =
      data.noise?.limit || "不明";

    document.getElementById("noise_source").textContent =
      data.noise?.source || "不明";

    // ------------------------------
    // 深掘り：建物構造
    // ------------------------------
    document.getElementById("structure_fact").textContent =
      data.structure?.fact || "不明";

    document.getElementById("structure_note").textContent =
      data.structure?.note || "不明";

    document.getElementById("structure_limit").textContent =
      data.structure?.limit || "不明";

    document.getElementById("structure_source").textContent =
      data.structure?.source || "不明";

  } catch (err) {
    console.error(err);
    alert("データの取得に失敗しました。Workers 側を確認してください。");
  }
});
