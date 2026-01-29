function toTransparentView(data) {
  return {
    title: data.title || "物件名はページ内から特定できませんでした",
    rent: data.rent || "家賃は明記されていません",
    layout: data.layout || "間取りは明記されていません",
    area: data.area || "専有面積は明記されていません",
    station_distance: data.station_distance || "駅からの距離は明記されていません",
    points: data.points,
    noise: {
      fact: "騒音に関する具体的な記載は見つかりませんでした",
      note: "現地確認を推奨します",
      limit: "ページ情報の範囲内での判断です",
      source: "掲載ページ"
    }
  };
}
