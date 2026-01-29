// ① 汎用抽出エンジン（Universal Extractor）
function extractGeneric(html) {
  const text = html.replace(/\s+/g, " ");

  const rent = (text.match(/(\d+\.?\d*)\s*万[円]?/) || [])[1] || null;
  const area = (text.match(/(\d+\.?\d*)\s*㎡/) || [])[1] || null;
  const layout = (text.match(/([1-4LDKＳＫＬＤＫ]+)\s*(タイプ)?/) || [])[1] || null;
  const station = (text.match(/徒歩\s*(\d+)\s*分/) || [])[0] || null;

  const points = [];
  ["南向き", "角部屋", "2階以上", "オートロック", "エレベーター"].forEach(k => {
    if (text.includes(k)) points.push(k);
  });

  return {
    rent,
    area,
    layout,
    station_distance: station,
    points
  };
}

// ② 透明化レイヤー（sanpo OS のコア）
function toTransparentView(data) {
  return {
    title: data.title || "物件名はページ内から特定できませんでした",
    rent: data.rent || "家賃は明記されていません",
    layout: data.layout || "間取りは明記されていません",
    area: data.area || "専有面積は明記されていません",
    station_distance: data.station_distance || "駅からの距離は明記されていません",
    points: data.points.length > 0
      ? data.points
      : ["特筆すべき特徴は抽出できませんでした"],
    noise: {
      fact: "騒音に関する具体的な記載は見つかりませんでした",
      note: "現地確認を推奨します",
      limit: "ページ情報の範囲内での判断です",
      source: "掲載ページ"
    }
  };
}

// ③ Workers → 抽出 → 透明化 → UI 表示
async function loadResult() {
  const url = new URLSearchParams(location.search).get("url");

  const res = await fetch(
    `https://sanpo-api.udsmail.workers.dev/extract?url=${encodeURIComponent(url)}`
  );
  const data = await res.json();

  console.log("Workersから受け取ったデータ:", data);

  const extracted = extractGeneric(data.html);
  const transparent = toTransparentView(extracted);

  renderTransparentView(transparent);
}
