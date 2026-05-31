const platformTabs = document.querySelectorAll("#platformTabs button");
const researchForm = document.querySelector("#researchForm");
const researchTitle = document.querySelector("#researchTitle");
const platformLabel = document.querySelector("#platformLabel");
const statusLabel = document.querySelector("#status");
const metricGrid = document.querySelector("#metricGrid");
const barList = document.querySelector("#barList");
const insightList = document.querySelector("#insightList");
const ideaList = document.querySelector("#ideaList");
const competitorList = document.querySelector("#competitorList");
const addCompetitorButton = document.querySelector("#addCompetitorButton");
const copyReportButton = document.querySelector("#copyReportButton");
const downloadCsvButton = document.querySelector("#downloadCsvButton");

let activeSns = "YouTube";
let competitors = [
  { name: "AI副業チャンネルA", url: "https://youtube.com/@sample-a", memo: "実演先見せが強い" },
  { name: "AI活用ラボB", url: "https://youtube.com/@sample-b", memo: "保存版の導線が強い" },
];

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

const data = {
  YouTube: {
    metrics: [["伸びている尺", "18-32分"], ["強い導入", "実演先見せ"], ["視聴者の不安", "何から触ればいいか"]],
    bars: [["実演", 92], ["比較", 76], ["特典", 68], ["雑談", 44]],
    insights: [
      ["導入5分が勝負", "料金、対象者、今日できることを先に言うと離脱が減る。"],
      ["Before/Afterが強い", "入力から完成までの変化を見せると、ツールの価値が伝わりやすい。"],
      ["特典導線", "マニュアル配布は最後だけでなく中盤でも一度伏線を置く。"],
    ],
    ideas: [
      ["CodexでAI秘書を作る", "初心者でもコピペで始められる導線にする。"],
      ["月20ドルの元を取る使い方", "画像生成、資料化、リサーチの3本に絞る。"],
      ["設定ミスで損しない", "自動レビューとフルアクセスを比較する。"],
    ],
  },
  Instagram: {
    metrics: [["伸びている型", "保存版カルーセル"], ["強い1枚目", "結論+数字"], ["CTA", "無料特典"]],
    bars: [["保存版", 88], ["比較表", 74], ["チェックリスト", 69], ["日記", 35]],
    insights: [
      ["1枚目は強い断定", "「ChatGPT課金者の9割が損してる」系が刺さる。"],
      ["比較表が強い", "ChatGPTだけ/Codexありの作業差を見せる。"],
      ["保存理由を作る", "設定チェックリストは保存されやすい。"],
    ],
    ideas: [
      ["Codex初期設定チェック", "5枚で設定だけを解説。"],
      ["AIが作業する時代", "会話AIから作業AIへの変化を図解。"],
      ["危険な設定3選", "フルアクセス、APIキー、機密ファイルを扱う。"],
    ],
  },
  Threads: {
    metrics: [["伸びる投稿", "短文+強い比喩"], ["反応が出る型", "あるある問題提起"], ["投稿時間", "朝/夜"]],
    bars: [["体験談", 84], ["強い比喩", 79], ["問題提起", 73], ["長文解説", 41]],
    insights: [
      ["1投稿1メッセージ", "Codexの価値を詰め込みすぎない。"],
      ["体験談が強い", "「実際に作ったら30分でできた」が反応を取りやすい。"],
      ["ツリーで深掘り", "本文で興味を作り、返信欄で手順を補足。"],
    ],
    ideas: [
      ["ChatGPT課金者へ", "Codex使ってないのはかなり損。"],
      ["AI副業の差", "知識より作業をAIへ渡す設計力。"],
      ["撮影裏話", "Codexで動画準備を丸ごと作った話。"],
    ],
  },
  note: {
    metrics: [["読まれる型", "実践レポート"], ["強い見出し", "失敗談+改善"], ["販売導線", "テンプレ配布"]],
    bars: [["手順化", 86], ["失敗談", 75], ["テンプレ", 72], ["思想だけ", 38]],
    insights: [
      ["長文は手順化", "思想だけでなく、再現手順がある記事が強い。"],
      ["スクショが重要", "設定画面や成果物を見せると信用が上がる。"],
      ["テンプレ価値", "プロンプト集より、運用マニュアルの方が使われる。"],
    ],
    ideas: [
      ["Codex導入レポート", "初心者が詰まるポイントを先回り。"],
      ["AI秘書の作り方", "プロンプトとフォルダ構成をセットで配布。"],
      ["セキュリティ設定", "安全な始め方を記事化。"],
    ],
  },
};

function render() {
  const current = data[activeSns];
  platformLabel.textContent = activeSns;
  researchTitle.textContent = `${activeSns}分析`;
  metricGrid.innerHTML = current.metrics
    .map(([label, value]) => `<div class="metric"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`)
    .join("");
  barList.innerHTML = current.bars
    .map(
      ([label, value]) => `
        <div class="bar-row">
          <div class="bar-label"><span>${escapeHtml(label)}</span><span>${escapeHtml(value)}%</span></div>
          <div class="bar-track"><div class="bar-fill" style="width:${value}%"></div></div>
        </div>
      `,
    )
    .join("");
  insightList.innerHTML = current.insights
    .map(([title, body]) => `<article class="insight"><strong>${escapeHtml(title)}</strong><span>${escapeHtml(body)}</span></article>`)
    .join("");
  ideaList.innerHTML = current.ideas
    .map(([title, body]) => `<article class="idea"><strong>${escapeHtml(title)}</strong><span>${escapeHtml(body)}</span></article>`)
    .join("");
  renderCompetitors();
  saveState();
}

function renderCompetitors() {
  competitorList.innerHTML = competitors
    .map(
      (competitor, index) => `
        <div class="competitor-row">
          <input data-index="${index}" data-field="name" value="${escapeHtml(competitor.name)}" aria-label="アカウント名" />
          <input data-index="${index}" data-field="url" value="${escapeHtml(competitor.url)}" aria-label="URL" />
          <input data-index="${index}" data-field="memo" value="${escapeHtml(competitor.memo)}" aria-label="メモ" />
          <button type="button" data-remove="${index}">削除</button>
        </div>
      `,
    )
    .join("");
}

function saveState() {
  localStorage.setItem("codex-sns-research-demo-v2", JSON.stringify({ activeSns, competitors }));
}

function loadState() {
  const saved = localStorage.getItem("codex-sns-research-demo-v2");
  if (!saved) return;
  try {
    const parsed = JSON.parse(saved);
    if (parsed.activeSns && data[parsed.activeSns]) activeSns = parsed.activeSns;
    if (Array.isArray(parsed.competitors)) competitors = parsed.competitors;
  } catch {
    localStorage.removeItem("codex-sns-research-demo-v2");
  }
}

function reportText() {
  const current = data[activeSns];
  return [
    `# ${activeSns} 競合SNSリサーチ`,
    "",
    "## 競合アカウント",
    ...competitors.map((item) => `- ${item.name}: ${item.url} / ${item.memo}`),
    "",
    "## 伸びている切り口",
    ...current.insights.map(([title, body]) => `- ${title}: ${body}`),
    "",
    "## 次に試す投稿案",
    ...current.ideas.map(([title, body]) => `- ${title}: ${body}`),
  ].join("\n");
}

platformTabs.forEach((button) => {
  button.addEventListener("click", () => {
    activeSns = button.dataset.sns;
    platformTabs.forEach((tab) => tab.classList.toggle("is-active", tab === button));
    render();
  });
});

competitorList.addEventListener("input", (event) => {
  const index = Number(event.target.dataset.index);
  const field = event.target.dataset.field;
  if (!Number.isNaN(index) && field) {
    competitors[index][field] = event.target.value;
    saveState();
  }
});

competitorList.addEventListener("click", (event) => {
  const index = Number(event.target.dataset.remove);
  if (!Number.isNaN(index)) {
    competitors.splice(index, 1);
    renderCompetitors();
    saveState();
  }
});

addCompetitorButton.addEventListener("click", () => {
  competitors.push({ name: `${activeSns}競合`, url: "https://", memo: "伸びている投稿をメモ" });
  renderCompetitors();
  saveState();
});

copyReportButton.addEventListener("click", () => {
  navigator.clipboard?.writeText(reportText());
  statusLabel.textContent = "COPIED";
});

downloadCsvButton.addEventListener("click", () => {
  const rows = [["platform", "name", "url", "memo"], ...competitors.map((item) => [activeSns, item.name, item.url, item.memo])];
  const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${activeSns}-research.csv`;
  a.click();
  URL.revokeObjectURL(url);
  statusLabel.textContent = "EXPORTED";
});

researchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  statusLabel.textContent = "ANALYZED";
  render();
});

loadState();
platformTabs.forEach((tab) => tab.classList.toggle("is-active", tab.dataset.sns === activeSns));
render();
