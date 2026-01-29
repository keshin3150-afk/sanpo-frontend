const params = new URLSearchParams(window.location.search);
const targetUrl = params.get("url");

const api = "https://sanpo-api.udsmail.workers.dev/?url=" + encodeURIComponent(targetUrl);

fetch(api)
  .then(res => res.json())
  .then(data => {
    document.getElementById("name").textContent =
      data.name || "（物件名が取得できませんでした）";

    document.getElementById("rent").textContent =
      data.rent || "（取得不可）";

    document.getElementById("station").textContent =
      data.station_distance || "（取得不可）";

    document.getElementById("initial").textContent =
      data.initial_cost || "（未実装）";

    document.getElementById("notes").textContent =
      data.notes.length ? data.notes.join("\n") : "（なし）";

    document.getElementById("points").textContent =
      data.transparent_points.length ? data.transparent_points.join("\n") : "（なし）";
  });
