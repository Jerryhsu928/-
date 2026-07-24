/**
 * 國中九年級形音義練習系統 - 核心控制邏輯 (script.js)
 */

// ==========================================================================
// 全域狀態管理
// ==========================================================================
const state = {
  // 用戶學習數據
  notebook: {
    starred: [], // 收藏的字卡: { id, round, question, answer, note, type }
    wrong: []    // 測驗錯題: { id, round, question, options, answer, explanation }
  },
  progress: {
    round1: [], // 已複習的索引列表
    round2: [],
    round3: [],
    round4: [],
    round5: [],
    round6: []
  },
  scores: {
    quiz1: 0,
    quiz2: 0,
    quiz3: 0,
    quiz4: 0,
    quiz5: 0,
    quiz6: 0,
    gameHigh: 0,
    gameClearedGroups: [],
    gameGroupBest: {},
    gameGroupBestTime: {},
    gameGroupFinishOrder: [],
    gameGroupStats: {},
    activeGroupBattle: 1,
    groupBattles: {}
  },
  
  // 當前進行中的狀態
  currentRound: 1,
  currentCardIndex: 0,
  isCardFlipped: false,
  
  // 測驗進行中狀態
  quiz: {
    questions: [], // 個人測驗題目
    currentIndex: 0,
    score: 0,
    selectedOption: null,
    timer: null,
    autoNextTimer: null,
    timeLeft: 5,
    correctCount: 0,
    wrongCount: 0,
    answeredCorrect: new Set(),
    retryQuestion: false,
    failedByMistakes: false,
    wrongAnswersCollected: [], // 本次測驗錯題
    playerName: '',
    startedAt: 0,
    leaderboardSubmitted: false
  }
};

const QUIZ_AUTO_ADVANCE_SECONDS = 5;
const PERSONAL_QUIZ_WRONG_CHANCES = Infinity;
const PERSONAL_QUIZ_CLEAR_WRONG_LIMIT = Infinity;
const PERSONAL_QUIZ_QUESTION_COUNT = 25;
const ROUND_COUNT = REVIEW_DATA.length;
const OPEN_ROUNDS_COUNT = ROUND_COUNT;

function getRoundTotal(roundNum) {
  return RAW_SHEET_DATA.filter(item => item.round === roundNum).length;
}

function ensureRoundState() {
  for (let roundNum = 1; roundNum <= ROUND_COUNT; roundNum++) {
    const progressKey = `round${roundNum}`;
    const scoreKey = `quiz${roundNum}`;
    state.progress[progressKey] = state.progress[progressKey] || [];
    state.scores[scoreKey] = state.scores[scoreKey] || 0;
    state.scores.roundLeaderboards = state.scores.roundLeaderboards || {};
    state.scores.roundLeaderboards[roundNum] = state.scores.roundLeaderboards[roundNum] || [];
  }
}

function getQuestionTypeLabel(type, short = false) {
  if (type === "shape") return short ? "字形題" : "字形選擇題";
  if (type === "meaning") return short ? "字義題" : "字義選擇題";
  return short ? "字音題" : "字音選擇題";
}

function getCardTypeLabel(type) {
  if (type === "shape") return "字形篇";
  if (type === "meaning") return "字義篇";
  return "字音篇";
}

function getNotebookTypeLabel(type) {
  if (type === "shape") return "形";
  if (type === "meaning") return "義";
  return "音";
}

// ==========================================================================
// 初始化與本地儲存
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  // 從 LocalStorage 載入數據
  loadFromLocalStorage();
  applyPreviewMode();
  
  // 初始化主題
  initTheme();
  
  // 更新主頁進度顯示與統計數據
  updateDashboardStats();
  
  // 綁定通用事件
  document.getElementById("theme-toggle").addEventListener("click", toggleTheme);
  
  // 顯示儀表板或預覽指定頁面
  app.showPage(isPreviewMode() ? "game" : "dashboard");
});

function isPreviewMode() {
  return new URLSearchParams(window.location.search).get("preview") === "challenge";
}

function applyPreviewMode() {
  if (!isPreviewMode()) return;

  ensureRoundState();
  for (let roundNum = 1; roundNum <= ROUND_COUNT; roundNum++) {
    const total = getRoundTotal(roundNum);
    const previewCount = roundNum === 1 ? total : Math.max(0, Math.floor(total * 0.45));
    state.progress[`round${roundNum}`] = Array.from({ length: previewCount }, (_, i) => i);
    state.scores[`quiz${roundNum}`] = roundNum === 1 ? 100 : 0;
  }
  state.scores.gameHigh = 7500;
  state.scores.gameClearedGroups = [2, 5, 1];
  state.scores.gameGroupBest = {
    1: 7500,
    2: 7600,
    3: 4100,
    4: 0,
    5: 7520,
    6: 0
  };
  state.scores.gameGroupBestTime = {
    2: 356,
    5: 384,
    1: 421
  };
  state.scores.gameGroupFinishOrder = [2, 5, 1];
  state.scores.gameGroupStats = {
    1: { correct: 58, totalTime: 421, attempts: 1 },
    2: { correct: 75, totalTime: 760, attempts: 2 },
    5: { correct: 75, totalTime: 720, attempts: 2 }
  };
  state.scores.activeGroupBattle = 1;
  state.scores.groupBattles = {
    1: normalizeGroupBattleRecord({
      gameHigh: state.scores.gameHigh,
      gameClearedGroups: state.scores.gameClearedGroups,
      gameGroupBest: state.scores.gameGroupBest,
      gameGroupBestTime: state.scores.gameGroupBestTime,
      gameGroupFinishOrder: state.scores.gameGroupFinishOrder,
      gameGroupStats: state.scores.gameGroupStats
    }),
    2: normalizeGroupBattleRecord({
      gameGroupStats: {
        3: { correct: 64, totalTime: 598, attempts: 2 },
        4: { correct: 52, totalTime: 410, attempts: 1 }
      }
    })
  };
}

function loadFromLocalStorage() {
  const savedNotebook = localStorage.getItem("yy_notebook");
  if (savedNotebook) {
    try {
      state.notebook = JSON.parse(savedNotebook);
    } catch (e) {
      console.error("解析筆記本數據失敗，重設數據", e);
    }
  }
  
  const savedProgress = localStorage.getItem("yy_progress");
  if (savedProgress) {
    try {
      state.progress = { ...state.progress, ...JSON.parse(savedProgress) };
      ensureRoundState();
    } catch (e) {
      console.error("解析進度數據失敗", e);
    }
  }
  
  const savedScores = localStorage.getItem("yy_scores");
  if (savedScores) {
    try {
      state.scores = { ...state.scores, ...JSON.parse(savedScores) };
      state.scores.gameClearedGroups = state.scores.gameClearedGroups || [];
      state.scores.gameGroupBest = state.scores.gameGroupBest || {};
      state.scores.gameGroupBestTime = state.scores.gameGroupBestTime || {};
      state.scores.gameGroupFinishOrder = state.scores.gameGroupFinishOrder || [];
      state.scores.gameGroupStats = state.scores.gameGroupStats || {};
      state.scores.activeGroupBattle = Number(state.scores.activeGroupBattle) || 1;
      state.scores.groupBattles = state.scores.groupBattles || {};
      ensureGroupBattleState();
      ensureRoundState();
    } catch (e) {
      console.error("解析分數數據失敗", e);
    }
  }
  
  updateNotebookBadge();
}

function saveToLocalStorage() {
  localStorage.setItem("yy_notebook", JSON.stringify(state.notebook));
  localStorage.setItem("yy_progress", JSON.stringify(state.progress));
  localStorage.setItem("yy_scores", JSON.stringify(state.scores));
  updateNotebookBadge();
}

function updateNotebookBadge() {
  const total = state.notebook.starred.length + state.notebook.wrong.length;
  document.getElementById("notebook-count").textContent = total;
}

// ==========================================================================
// 主題切換 (Light/Dark Theme)
// ==========================================================================
function initTheme() {
  const isLight = localStorage.getItem("yy_theme") === "light";
  if (isLight) {
    document.body.classList.remove("dark-theme");
    document.body.classList.add("light-theme");
    document.getElementById("theme-toggle").innerHTML = '<i class="fa-solid fa-moon"></i>';
  } else {
    document.body.classList.remove("light-theme");
    document.body.classList.add("dark-theme");
    document.getElementById("theme-toggle").innerHTML = '<i class="fa-solid fa-sun"></i>';
  }
}

function toggleTheme() {
  const body = document.body;
  if (body.classList.contains("dark-theme")) {
    body.classList.remove("dark-theme");
    body.classList.add("light-theme");
    localStorage.setItem("yy_theme", "light");
    document.getElementById("theme-toggle").innerHTML = '<i class="fa-solid fa-moon"></i>';
  } else {
    body.classList.remove("light-theme");
    body.classList.add("dark-theme");
    localStorage.setItem("yy_theme", "dark");
    document.getElementById("theme-toggle").innerHTML = '<i class="fa-solid fa-sun"></i>';
  }
}

// ==========================================================================
// 儀表板數據統計
// ==========================================================================
function updateDashboardStats() {
  ensureRoundState();

  let totalCards = 0;
  let totalReviewed = 0;
  const scores = [];

  for (let roundNum = 1; roundNum <= ROUND_COUNT; roundNum++) {
    const total = getRoundTotal(roundNum);
    const progressKey = `round${roundNum}`;
    const scoreKey = `quiz${roundNum}`;
    const reviewed = state.progress[progressKey].length;
    const pct = total > 0 ? Math.round((reviewed / total) * 100) : 0;
    const isLocked = false; // 全部解鎖

    totalCards += total;
    totalReviewed += reviewed;
    scores.push(state.scores[scoreKey] || 0);

    const fill = document.getElementById(`progress-r${roundNum}`);
    const text = document.getElementById(`progress-text-r${roundNum}`);
    if (fill) fill.style.width = `${pct}%`;
    if (text) {
      text.textContent = `已複習 ${reviewed}/${total}`;
    }
    setRoundLockState(roundNum, false);
  }

  const totalPct = totalCards > 0 ? Math.round((totalReviewed / totalCards) * 100) : 0;
  document.getElementById("stat-reviewed-pct").textContent = `${totalPct}%`;

  const bestScore = Math.max(...scores, 0);
  document.getElementById("stat-best-score").textContent = bestScore > 0 ? `${bestScore}分` : "無";

  ensureGroupBattleState();
  const groupStats = GROUP_BATTLE_SETS.flatMap(set => Object.values(state.scores.groupBattles?.[set.id]?.gameGroupStats || {}));
  const statsHigh = groupStats.reduce((max, stats) => Math.max(max, stats.correct || 0), 0);
  const legacyHigh = state.scores.gameHigh <= RAW_SHEET_DATA.length ? state.scores.gameHigh : 0;
  const gameHigh = Math.max(statsHigh, legacyHigh);
  document.getElementById("stat-game-score").textContent = gameHigh > 0 ? `${gameHigh}題` : "無";
  renderRoundLeaderboards();
}

function isPersonalRoundUnlocked(roundNum) {
  return true; // 全部解鎖
}

function getRoundLeaderboard(roundNum) {
  state.scores.roundLeaderboards = state.scores.roundLeaderboards || {};
  state.scores.roundLeaderboards[roundNum] = state.scores.roundLeaderboards[roundNum] || [];
  return state.scores.roundLeaderboards[roundNum];
}

function normalizePlayerName(name) {
  const cleaned = String(name || "").trim().replace(/\s+/g, " ");
  return cleaned || "挑戰者";
}

function getSavedPlayerName() {
  return normalizePlayerName(localStorage.getItem("yy_player_name") || "");
}

function formatQuizDuration(seconds) {
  const total = Math.max(0, Math.round(seconds || 0));
  const minutes = Math.floor(total / 60);
  const rest = total % 60;
  return minutes > 0 ? `${minutes}分${String(rest).padStart(2, "0")}秒` : `${rest}秒`;
}

function recordRoundLeaderboardAttempt({ completed, name, score }) {
  const roundNum = state.currentRound;
  const elapsedSeconds = state.quiz.startedAt ? Math.max(1, Math.round((Date.now() - state.quiz.startedAt) / 1000)) : 0;
  const manualScore = Number.isFinite(Number(score)) ? Math.max(0, Math.min(100, Math.round(Number(score)))) : state.quiz.score;
  const total = state.quiz.questions.length;
  const entry = {
    name: normalizePlayerName(name || state.quiz.playerName),
    score: manualScore,
    correct: Math.round((manualScore / 100) * total),
    total,
    wrong: state.quiz.wrongCount,
    time: elapsedSeconds,
    completed: Boolean(completed),
    cleared: true,
    at: new Date().toISOString()
  };

  const leaderboard = getRoundLeaderboard(roundNum);
  leaderboard.push(entry);
  leaderboard.sort((a, b) => {
    if ((b.score || 0) !== (a.score || 0)) return (b.score || 0) - (a.score || 0);
    if (Boolean(b.cleared) !== Boolean(a.cleared)) return Boolean(b.cleared) - Boolean(a.cleared);
    if ((a.wrong || 0) !== (b.wrong || 0)) return (a.wrong || 0) - (b.wrong || 0);
    if ((a.time || 0) !== (b.time || 0)) return (a.time || 0) - (b.time || 0);
    return String(a.at || "").localeCompare(String(b.at || ""));
  });
  state.scores.roundLeaderboards[roundNum] = leaderboard.slice(0, 10);
  saveToLocalStorage();
  updateDashboardStats();
}

function renderRoundLeaderboards() {
  for (let roundNum = 1; roundNum <= ROUND_COUNT; roundNum++) {
    const list = document.getElementById(`round-leaderboard-r${roundNum}`);
    if (!list) continue;
    const rows = getRoundLeaderboard(roundNum).slice(0, 5);
    if (rows.length === 0) {
      list.innerHTML = `<li class="empty-rank">尚無挑戰紀錄</li>`;
      continue;
    }
    list.innerHTML = rows.map((entry, index) => `
      <li>
        <span class="rank-place">${index + 1}</span>
        <span class="rank-name">${entry.name}</span>
        <span class="rank-score">${entry.score}分</span>
        <span class="rank-meta">${entry.correct}/${entry.total} · 錯${entry.wrong} · ${formatQuizDuration(entry.time)}</span>
      </li>
    `).join("");
  }
}

function setRoundLockState(roundNum, isLocked) {
  const card = document.getElementById(`card-round-${roundNum}`);
  const reviewBtn = document.getElementById(`btn-review-r${roundNum}`);
  const quizBtn = document.getElementById(`btn-quiz-r${roundNum}`);
  if (!card || !reviewBtn || !quizBtn) return;

  card.classList.remove("locked");
  reviewBtn.disabled = false;
  quizBtn.disabled = false;
  reviewBtn.title = "";
  quizBtn.title = "";
}

// ==========================================================================
// SPA 路由與頁面切換控制
// ==========================================================================
const app = {
  showPage(pageId) {
    // 隱藏所有頁面
    document.querySelectorAll(".page").forEach(page => {
      page.classList.remove("active");
    });
    
    // 停止測驗與遊戲計時器防止溢出
    if (state.quiz.timer) {
      clearInterval(state.quiz.timer);
      state.quiz.timer = null;
    }
    if (state.quiz.autoNextTimer) {
      clearTimeout(state.quiz.autoNextTimer);
      state.quiz.autoNextTimer = null;
    }
    game.stop();
    
    // 顯示指定頁面
    const targetPage = document.getElementById(`page-${pageId}`);
    if (targetPage) {
      targetPage.classList.add("active");
      window.scrollTo(0, 0);
    }
    
    // 載入特定頁面的渲染數據
    if (pageId === "dashboard") {
      updateDashboardStats();
    } else if (pageId === "notebook") {
      this.renderNotebook();
    } else if (pageId === "game") {
      game.showMenu();
    }
  },
  
  exportSaveFile() {
    saveToLocalStorage();
    const saveData = {
      app: "日日讀形音義練習",
      version: 1,
      savedAt: new Date().toISOString(),
      notebook: state.notebook,
      progress: state.progress,
      scores: state.scores,
      theme: localStorage.getItem("yy_theme") || "dark"
    };
    const blob = new Blob([JSON.stringify(saveData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const stamp = new Date().toISOString().slice(0, 10).replaceAll("-", "");
    link.href = url;
    link.download = `日日讀形音義存檔-${stamp}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  },

  triggerImportSave() {
    const input = document.getElementById("save-file-input");
    if (!input) return;
    input.value = "";
    input.click();
  },

  importSaveFile(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const saveData = JSON.parse(reader.result);
        if (!saveData || saveData.app !== "日日讀形音義練習") {
          alert("這不是本遊戲的存檔檔案。");
          return;
        }
        if (!confirm("讀取存檔會覆蓋目前這台瀏覽器中的進度，確定要讀取嗎？")) {
          return;
        }

        state.notebook = saveData.notebook || { starred: [], wrong: [] };
        state.progress = { ...state.progress, ...(saveData.progress || {}) };
        state.scores = { ...state.scores, ...(saveData.scores || {}) };
        ensureRoundState();
        ensureGroupBattleState();
        saveToLocalStorage();

        if (saveData.theme) {
          localStorage.setItem("yy_theme", saveData.theme);
          initTheme();
        }
        updateDashboardStats();
        updateNotebookBadge();
        if (document.getElementById("page-notebook")?.classList.contains("active")) {
          this.renderNotebook();
        }
        if (document.getElementById("page-game")?.classList.contains("active")) {
          game.showMenu();
        }
        alert("讀檔完成！");
      } catch (error) {
        console.error("讀取存檔失敗", error);
        alert("讀檔失敗，請確認檔案沒有損壞。");
      }
    };
    reader.readAsText(file, "utf-8");
  },
  // ==========================================================================
  // 字卡複習邏輯 (Review Mode)
  // ==========================================================================
  isRoundUnlocked(roundNum) {
    return true; // 全部解鎖
  },

  showLockedRoundMessage(roundNum) {
    return;
  },

  startReview(roundNum) {
    state.currentRound = roundNum;
    state.currentCardIndex = 0;
    state.isCardFlipped = false;
    
    // 載入當前 Round 標題資訊
    const roundData = REVIEW_DATA.find(r => r.round === roundNum);
    document.getElementById("review-round-title").textContent = roundData.title;
    document.getElementById("review-round-subtitle").textContent = `第 ${roundNum} 回複習`;
    
    // 獲取這回的所有複習卡 (依據 data.js 中 type = shape/pronunciation 過濾)
    const cards = RAW_SHEET_DATA.filter(item => item.round === roundNum);
    this.currentCards = cards;
    
    // 重設翻卡樣式
    const flashcard = document.getElementById("flashcard");
    flashcard.classList.remove("flipped");
    
    this.renderCurrentCard();
    this.showPage("review");
    
    // 標記當前卡片為已讀進度
    this.markCardAsRead(0);
  },
  
  renderCurrentCard() {
    const card = this.currentCards[state.currentCardIndex];
    if (!card) return;
    
    // 區分字音與字形卡片標籤
    const badge = document.getElementById("card-type-badge");
    badge.textContent = getCardTypeLabel(card.type);
    badge.style.borderColor = card.type === "shape" ? "var(--accent-primary)" : "var(--accent-secondary)";
    badge.style.color = card.type === "shape" ? "var(--accent-primary)" : "var(--accent-secondary)";
    
    // 正面
    document.getElementById("card-front-word").textContent = card.question;
    
    // 背面
    document.getElementById("card-back-answer").textContent = card.answer;
    document.getElementById("card-back-detail").textContent = card.note;
    
    // 更新收藏狀態星星圖標
    const isStarred = state.notebook.starred.some(s => s.question === card.question && s.round === state.currentRound);
    const starBtn = document.getElementById("card-star-btn");
    if (isStarred) {
      starBtn.classList.add("active");
      starBtn.innerHTML = '<i class="fa-solid fa-star"></i>';
    } else {
      starBtn.classList.remove("active");
      starBtn.innerHTML = '<i class="fa-regular fa-star"></i>';
    }
    
    // 更新頁碼索引與進度條
    const total = this.currentCards.length;
    document.getElementById("card-index-text").textContent = `${state.currentCardIndex + 1} / ${total}`;
    
    const pct = Math.round(((state.currentCardIndex + 1) / total) * 100);
    document.getElementById("review-progress-fill").style.width = `${pct}%`;
    
    // 控制前後按鈕
    document.getElementById("btn-prev-card").disabled = state.currentCardIndex === 0;
    document.getElementById("btn-next-card").disabled = state.currentCardIndex === total - 1;
    
    // 每次切換卡片重設翻牌狀態 (回到正面)
    const flashcard = document.getElementById("flashcard");
    flashcard.classList.remove("flipped");
    state.isCardFlipped = false;
  },
  
  flipCard() {
    const flashcard = document.getElementById("flashcard");
    state.isCardFlipped = !state.isCardFlipped;
    if (state.isCardFlipped) {
      flashcard.classList.add("flipped");
    } else {
      flashcard.classList.remove("flipped");
    }
  },
  
  prevCard() {
    if (state.currentCardIndex > 0) {
      state.currentCardIndex--;
      this.renderCurrentCard();
      this.markCardAsRead(state.currentCardIndex);
    }
  },
  
  nextCard() {
    if (state.currentCardIndex < this.currentCards.length - 1) {
      state.currentCardIndex++;
      this.renderCurrentCard();
      this.markCardAsRead(state.currentCardIndex);
    }
  },
  
  // 記錄複習卡片進度
  markCardAsRead(index) {
    const key = `round${state.currentRound}`;
    state.progress[key] = state.progress[key] || [];
    if (!state.progress[key].includes(index)) {
      state.progress[key].push(index);
      saveToLocalStorage();
    }
  },
  
  toggleStarCurrentCard() {
    const card = this.currentCards[state.currentCardIndex];
    if (!card) return;
    
    const index = state.notebook.starred.findIndex(s => s.question === card.question && s.round === state.currentRound);
    const starBtn = document.getElementById("card-star-btn");
    
    if (index > -1) {
      // 取消收藏
      state.notebook.starred.splice(index, 1);
      starBtn.classList.remove("active");
      starBtn.innerHTML = '<i class="fa-regular fa-star"></i>';
    } else {
      // 新增收藏
      state.notebook.starred.push({
        round: state.currentRound,
        type: card.type,
        question: card.question,
        answer: card.answer,
        note: card.note
      });
      starBtn.classList.add("active");
      starBtn.innerHTML = '<i class="fa-solid fa-star"></i>';
    }
    
    saveToLocalStorage();
  },
  
  // ==========================================================================
  // 模擬測驗邏輯 (Quiz Mode)
  // ==========================================================================
  startQuiz(roundNum) {
    state.currentRound = roundNum;
    state.quiz.playerName = getSavedPlayerName();
    
    // 獲取該回所有考題
    const allQuestions = RAW_SHEET_DATA.filter(item => item.round === roundNum);
    
    state.quiz.questions = this.getQuestionSet(allQuestions, PERSONAL_QUIZ_QUESTION_COUNT);
    state.quiz.currentIndex = 0;
    state.quiz.score = 0;
    state.quiz.correctCount = 0;
    state.quiz.wrongCount = 0;
    state.quiz.answeredCorrect = new Set();
    state.quiz.retryQuestion = false;
    state.quiz.failedByMistakes = false;
    state.quiz.wrongAnswersCollected = [];
    state.quiz.startedAt = Date.now();
    state.quiz.leaderboardSubmitted = false;
    
    // 顯示測驗容器
    document.getElementById("quiz-active-container").style.display = "block";
    document.getElementById("quiz-result-container").style.display = "none";
    
    this.renderQuizQuestion();
    this.showPage("quiz");
  },
  
  startQuizFromReview() {
    this.startQuiz(state.currentRound);
  },
  
  restartQuiz() {
    this.startQuiz(state.currentRound);
  },
  
  // 隨機選取陣列子項
  getRandomSubarray(arr, size) {
    let shuffled = arr.slice(0), i = arr.length, temp, index;
    while (i--) {
      index = Math.floor((i + 1) * Math.random());
      temp = shuffled[index];
      shuffled[index] = shuffled[i];
      shuffled[i] = temp;
    }
    return shuffled.slice(0, size);
  },

  getQuestionSet(arr, size) {
    if (!arr.length) return [];
    const selected = [];
    while (selected.length < size) {
      selected.push(...this.getRandomSubarray(arr, arr.length).map(item => ({ ...item })));
    }
    return selected.slice(0, size);
  },
  
  renderQuizQuestion() {
    const questionData = state.quiz.questions[state.quiz.currentIndex];
    if (!questionData) return;
    questionData.currentOptions = this.getRandomSubarray(questionData.options, questionData.options.length);
    
    // 隱藏解析面板
    document.getElementById("quiz-explanation-box").style.display = "none";
    
    // 設定題號與進度
    document.getElementById("quiz-progress-text").textContent = `題號: ${state.quiz.currentIndex + 1} / ${state.quiz.questions.length}`;
    
    // 設定題目類型標籤與題目內容
    const typeBadge = document.getElementById("quiz-question-type");
    typeBadge.textContent = getQuestionTypeLabel(questionData.type);
    
    let questionText = "";
    if (questionData.type === "shape") {
      questionText = `下列括號中的字，正確寫法為何？<br><strong style="font-family:'Noto Serif TC',serif; font-size:1.8rem; display:block; margin: 10px 0; letter-spacing:2px;">${questionData.question}</strong>`;
    } else if (questionData.type === "meaning") {
      questionText = `下列詞語中括號字的字義為何？<br><strong style="font-family:'Noto Serif TC',serif; font-size:1.8rem; display:block; margin: 10px 0; letter-spacing:2px;">${questionData.question}</strong>`;
    } else {
      questionText = `下列括號中的字，標準讀音為何？<br><strong style="font-family:'Noto Serif TC',serif; font-size:1.8rem; display:block; margin: 10px 0; letter-spacing:2px;">${questionData.question}</strong>`;
    }
    document.getElementById("quiz-question-text").innerHTML = questionText;
    
    // 渲染選項
    const optionsContainer = document.getElementById("quiz-options");
    optionsContainer.innerHTML = "";
    
    const letters = ["A", "B", "C", "D"];
    questionData.currentOptions.forEach((opt, idx) => {
      const btn = document.createElement("button");
      btn.className = "option-btn";
      btn.innerHTML = `
        <span class="option-letter">${letters[idx]}</span>
        <span class="option-text">${opt}</span>
      `;
      btn.addEventListener("click", () => this.selectOption(idx));
      optionsContainer.appendChild(btn);
    });
    
    state.quiz.selectedOption = null;
    
    // 每題限時，自動跳題，並顯示倒數秒數
    this.startQuizTimer();
  },
  
  startQuizTimer() {
    if (state.quiz.timer) {
      clearInterval(state.quiz.timer);
    }
    
    state.quiz.timeLeft = QUIZ_AUTO_ADVANCE_SECONDS;
    this.updateQuizTimerDisplay();
    
    state.quiz.timer = setInterval(() => {
      state.quiz.timeLeft--;
      this.updateQuizTimerDisplay();
      
      if (state.quiz.timeLeft <= 0) {
        clearInterval(state.quiz.timer);
        state.quiz.timer = null;
        this.handleQuizTimeout();
      }
    }, 1000);
  },

  updateQuizTimerDisplay() {
    const timerEl = document.getElementById("quiz-timer");
    if (!timerEl) return;

    const seconds = Math.max(state.quiz.timeLeft, 0);
    timerEl.innerHTML = `<i class="fa-regular fa-clock"></i> 倒數 ${seconds} 秒`;
    timerEl.classList.toggle("urgent", seconds <= 2);
  },
  
  handleQuizTimeout() {
    const questionData = state.quiz.questions[state.quiz.currentIndex];
    const activeOptions = questionData.currentOptions || questionData.options;
    const correctIndex = activeOptions.indexOf(questionData.answer);
    
    // 時間結束直接選出正確答案，然後進到下一題
    this.revealAnswer(correctIndex);
  },
  
  selectOption(optionIndex) {
    const questionData = state.quiz.questions[state.quiz.currentIndex];
    const activeOptions = questionData.currentOptions || questionData.options;
    const correctIndex = activeOptions.indexOf(questionData.answer);
    
    if (optionIndex === correctIndex) {
      // 點選到正確答案，清除計時器並揭曉/推進下一題
      if (state.quiz.timer) {
        clearInterval(state.quiz.timer);
        state.quiz.timer = null;
      }
      state.quiz.selectedOption = optionIndex;
      this.revealAnswer(correctIndex);
    } else {
      // 點選到錯誤選項：不計錯誤、不停止倒數、不推進下一題，僅將該選項標示為錯誤樣式，直到點中正確答案為止
      const optionsContainer = document.getElementById("quiz-options");
      const optionButtons = optionsContainer.querySelectorAll(".option-btn");
      if (optionButtons[optionIndex]) {
        optionButtons[optionIndex].classList.add("disabled", "wrong-ans");
      }
    }
  },
  
  revealAnswer(correctIndex) {
    const questionData = state.quiz.questions[state.quiz.currentIndex];
    const optionsContainer = document.getElementById("quiz-options");
    const optionButtons = optionsContainer.querySelectorAll(".option-btn");
    
    // 標示正確選項並禁用按鈕
    optionButtons.forEach((btn, idx) => {
      btn.classList.add("disabled");
      if (idx === correctIndex) {
        btn.classList.add("correct-ans");
      }
    });
    
    const explanationBox = document.getElementById("quiz-explanation-box");
    const statusEl = document.getElementById("explanation-status");
    const textEl = document.getElementById("explanation-text");
    const nextBtn = explanationBox.querySelector("button");
    
    if (!state.quiz.answeredCorrect.has(state.quiz.currentIndex)) {
      state.quiz.answeredCorrect.add(state.quiz.currentIndex);
      state.quiz.correctCount++;
    }
    state.quiz.retryQuestion = false;
    state.quiz.score = Math.round((state.quiz.correctCount / state.quiz.questions.length) * 100);
    
    statusEl.className = "explanation-status correct-status";
    statusEl.innerHTML = '<i class="fa-solid fa-circle-check"></i> 正確答案！';
    if (nextBtn) nextBtn.innerHTML = '下一題 <i class="fa-solid fa-arrow-right"></i>';
    
    textEl.innerHTML = `正確答案為：<strong>${questionData.answer}</strong><br><br>${questionData.note}`;
    explanationBox.style.display = "block";
    state.quiz.autoNextTimer = setTimeout(() => {
      state.quiz.autoNextTimer = null;
      this.nextQuestion();
    }, 700);
  },
  
  nextQuestion() {
    if (state.quiz.autoNextTimer) {
      clearTimeout(state.quiz.autoNextTimer);
      state.quiz.autoNextTimer = null;
    }
    state.quiz.currentIndex++;
    if (state.quiz.currentIndex < state.quiz.questions.length) {
      this.renderQuizQuestion();
    } else {
      this.showQuizResult();
    }
  },

  retryCurrentQuestion() {
    state.quiz.retryQuestion = false;
    state.quiz.selectedOption = null;
    this.renderQuizQuestion();
  },

  failQuizRound() {
    if (state.quiz.timer) {
      clearInterval(state.quiz.timer);
      state.quiz.timer = null;
    }
    if (state.quiz.autoNextTimer) {
      clearTimeout(state.quiz.autoNextTimer);
      state.quiz.autoNextTimer = null;
    }

    document.getElementById("quiz-active-container").style.display = "none";
    document.getElementById("quiz-result-container").style.display = "block";
    document.getElementById("result-score").textContent = state.quiz.score;
    document.getElementById("result-medal").textContent = "💥";
    document.getElementById("result-title").textContent = "本回合需要重新開始";
    document.getElementById("result-summary-text").textContent =
      `第 ${state.currentRound} 回只能錯 ${PERSONAL_QUIZ_WRONG_CHANCES} 次。本次已超過錯誤次數，請重新開始本回合。`;
    this.prepareLeaderboardSubmit(false);

    const wrongBox = document.getElementById("wrong-questions-box");
    const wrongList = document.getElementById("wrong-questions-list");
    wrongList.innerHTML = "";
    if (state.quiz.wrongAnswersCollected.length > 0) {
      wrongBox.style.display = "block";
      state.quiz.wrongAnswersCollected.forEach(q => {
        const item = document.createElement("div");
        item.className = "wrong-item";
        item.innerHTML = `
          <span class="wrong-item-text">${q.question.replace("「", "【").replace("」", "】")}</span>
          <span class="wrong-item-ans">答案：${q.answer}</span>
        `;
        wrongList.appendChild(item);
      });
    } else {
      wrongBox.style.display = "none";
    }
  },
  
  showQuizResult() {
    // 停止任何計時器
    if (state.quiz.timer) {
      clearInterval(state.quiz.timer);
    }
    
    // 更新最高分
    state.quiz.score = Math.round((state.quiz.correctCount / state.quiz.questions.length) * 100);
    const scoreKey = `quiz${state.currentRound}`;
    if (state.quiz.score > (state.scores[scoreKey] || 0)) {
      state.scores[scoreKey] = state.quiz.score;
    }
    saveToLocalStorage();
    this.prepareLeaderboardSubmit(true);
    
    document.getElementById("quiz-active-container").style.display = "none";
    document.getElementById("quiz-result-container").style.display = "block";
    
    // 渲染得分與回饋文字
    document.getElementById("result-score").textContent = state.quiz.score;
    
    const medalEl = document.getElementById("result-medal");
    const titleEl = document.getElementById("result-title");
    const summaryEl = document.getElementById("result-summary-text");
    
    if (state.quiz.score === 100) {
      medalEl.textContent = "完美";
      titleEl.textContent = "完美通關！A++ 級達人";
      summaryEl.textContent = `太強了！本關 ${state.quiz.questions.length} 題全部答對！`;
    } else {
      medalEl.textContent = "通關";
      titleEl.textContent = "測驗完成！";
      summaryEl.textContent = `你答對了 ${state.quiz.correctCount} / ${state.quiz.questions.length} 題。`;
    }
    
    // 顯示錯題清單
    const wrongBox = document.getElementById("wrong-questions-box");
    const wrongList = document.getElementById("wrong-questions-list");
    
    wrongList.innerHTML = "";
    if (state.quiz.wrongAnswersCollected.length > 0) {
      wrongBox.style.display = "block";
      state.quiz.wrongAnswersCollected.forEach(q => {
        const item = document.createElement("div");
        item.className = "wrong-item";
        item.innerHTML = `
          <span class="wrong-item-text">${q.question.replace("「", "【").replace("」", "】")}</span>
          <span class="wrong-item-ans">答案：${q.answer}</span>
        `;
        wrongList.appendChild(item);
      });
    } else {
      wrongBox.style.display = "none";
    }
  },

  prepareLeaderboardSubmit(completed) {
    const panel = document.getElementById("leaderboard-submit-panel");
    const nameInput = document.getElementById("leaderboard-player-name");
    const scoreInput = document.getElementById("leaderboard-score-input");
    const submitBtn = document.getElementById("leaderboard-submit-btn");
    const status = document.getElementById("leaderboard-submit-status");
    if (!panel || !nameInput || !scoreInput || !submitBtn || !status) return;

    panel.style.display = "block";
    panel.dataset.completed = completed ? "true" : "false";
    nameInput.value = getSavedPlayerName();
    scoreInput.value = state.quiz.score;
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> 加入排行榜';
    status.textContent = "不加入也可以直接回首頁或再測一次。";
  },

  submitRoundLeaderboard() {
    if (state.quiz.leaderboardSubmitted) return;

    const panel = document.getElementById("leaderboard-submit-panel");
    const nameInput = document.getElementById("leaderboard-player-name");
    const scoreInput = document.getElementById("leaderboard-score-input");
    const submitBtn = document.getElementById("leaderboard-submit-btn");
    const status = document.getElementById("leaderboard-submit-status");
    if (!panel || !nameInput || !scoreInput || !submitBtn || !status) return;

    const score = Number(scoreInput.value);
    if (!Number.isFinite(score) || score < 0 || score > 100) {
      status.textContent = "請輸入 0 到 100 之間的成績。";
      scoreInput.focus();
      return;
    }

    const playerName = normalizePlayerName(nameInput.value);
    state.quiz.playerName = playerName;
    localStorage.setItem("yy_player_name", playerName);
    recordRoundLeaderboardAttempt({
      completed: panel.dataset.completed === "true",
      name: playerName,
      score
    });
    state.quiz.leaderboardSubmitted = true;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i> 已加入排行榜';
    status.textContent = `已加入第 ${state.currentRound} 回排行榜。`;
  },
  confirmExitQuiz() {
    if (confirm("測驗尚未結束，確定要離開嗎？（離開將不記錄本次成績）")) {
      this.showPage("dashboard");
    }
  },
  
  // ==========================================================================
  // 錯題與收藏本渲染 (Notebook Mode)
  // ==========================================================================
  currentNotebookTab: "starred",
  
  switchNotebookTab(tabName) {
    this.currentNotebookTab = tabName;
    
    const tabStarred = document.getElementById("tab-starred");
    const tabWrong = document.getElementById("tab-wrong");
    const secStarred = document.getElementById("starred-list-section");
    const secWrong = document.getElementById("wrong-list-section");
    
    if (tabName === "starred") {
      tabStarred.classList.add("active");
      tabWrong.classList.remove("active");
      secStarred.classList.add("active");
      secWrong.classList.remove("active");
    } else {
      tabStarred.classList.remove("active");
      tabWrong.classList.add("active");
      secStarred.classList.remove("active");
      secWrong.classList.add("active");
    }
    this.renderNotebook();
  },
  
  renderNotebook() {
    // 顯示計數
    document.getElementById("starred-count-badge").textContent = state.notebook.starred.length;
    document.getElementById("wrong-count-badge").textContent = state.notebook.wrong.length;
    
    const starredGrid = document.getElementById("starred-cards-grid");
    const starredEmpty = document.getElementById("starred-empty");
    const wrongList = document.getElementById("wrong-quiz-items-list");
    const wrongEmpty = document.getElementById("wrong-empty");
    
    // 1. 渲染收藏字卡
    starredGrid.innerHTML = "";
    if (state.notebook.starred.length > 0) {
      starredEmpty.style.display = "none";
      state.notebook.starred.forEach((item, idx) => {
        const card = document.createElement("div");
        card.className = "starred-item-card";
        card.innerHTML = `
          <div class="starred-item-top">
            <span class="starred-item-badge">回數 ${item.round} · ${getNotebookTypeLabel(item.type)}</span>
            <button class="unstar-btn" onclick="app.removeStarred(${idx})" title="取消收藏">
              <i class="fa-solid fa-star"></i>
            </button>
          </div>
          <div class="starred-item-word">${item.question}</div>
          <div class="starred-item-ans">${item.answer}</div>
          <div class="starred-item-desc">${item.note}</div>
        `;
        starredGrid.appendChild(card);
      });
    } else {
      starredEmpty.style.display = "flex";
    }
    
    // 2. 渲染測驗錯題
    wrongList.innerHTML = "";
    if (state.notebook.wrong.length > 0) {
      wrongEmpty.style.display = "none";
      state.notebook.wrong.forEach((item, idx) => {
        const row = document.createElement("div");
        row.className = "wrong-quiz-item";
        row.innerHTML = `
          <div class="wrong-quiz-content">
            <div class="wrong-quiz-round">第 ${item.round} 回 · 模擬測驗錯題</div>
            <div class="wrong-quiz-q">${item.question.replace("「", "【").replace("」", "】")}</div>
            <div class="wrong-quiz-a">正確答案為：<strong>${item.answer}</strong><br>${item.explanation}</div>
          </div>
          <button class="delete-wrong-btn" onclick="app.removeWrong(${idx})" title="刪除此紀錄">
            <i class="fa-solid fa-trash"></i>
          </button>
        `;
        wrongList.appendChild(row);
      });
    } else {
      wrongEmpty.style.display = "flex";
    }
  },
  
  removeStarred(index) {
    state.notebook.starred.splice(index, 1);
    saveToLocalStorage();
    this.renderNotebook();
  },
  
  removeWrong(index) {
    state.notebook.wrong.splice(index, 1);
    saveToLocalStorage();
    this.renderNotebook();
  },
  
  clearNotebook() {
    if (confirm("確定要清空所有收藏與測驗錯題記錄嗎？此動作不可復原。")) {
      state.notebook.starred = [];
      state.notebook.wrong = [];
      saveToLocalStorage();
      this.renderNotebook();
    }
  }
};

// ==========================================================================
// 六組打怪闖關遊戲控制邏輯 (Boss Battle Game)
// ==========================================================================
const GAME_GROUPS = [
  { id: 1, title: "第一組", name: "第一組同學", boss: "總複習魔王", icon: "fa-users" },
  { id: 2, title: "第二組", name: "第二組同學", boss: "總複習魔王", icon: "fa-users" },
  { id: 3, title: "第三組", name: "第三組同學", boss: "總複習魔王", icon: "fa-users" },
  { id: 4, title: "第四組", name: "第四組同學", boss: "總複習魔王", icon: "fa-users" },
  { id: 5, title: "第五組", name: "第五組同學", boss: "總複習魔王", icon: "fa-users" },
  { id: 6, title: "第六組", name: "第六組同學", boss: "總複習魔王", icon: "fa-users" }
];

const GROUP_TEST_WRONG_CHANCES = Infinity;
const GROUP_TEST_QUESTION_COUNT = 10;
const FIRST_GROUP_BATTLE_ROUNDS = [1, 2, 3, 4, 5, 6];
const GROUP_TEST_TOTAL_QUESTIONS = GROUP_TEST_QUESTION_COUNT * FIRST_GROUP_BATTLE_ROUNDS.length;

const GROUP_BATTLE_SETS = [
  { id: 1, label: "第一次團體戰", shortLabel: "第一次", desc: "六回總複習後的分組PK" }
];

function createGroupBattleRecord() {
  return {
    gameHigh: 0,
    gameClearedGroups: [],
    gameGroupBest: {},
    gameGroupBestTime: {},
    gameGroupFinishOrder: [],
    gameGroupStats: {}
  };
}

function normalizeGroupBattleRecord(record = {}) {
  const normalized = {
    ...createGroupBattleRecord(),
    ...record,
    gameClearedGroups: record.gameClearedGroups || [],
    gameGroupBest: record.gameGroupBest || {},
    gameGroupBestTime: record.gameGroupBestTime || {},
    gameGroupFinishOrder: record.gameGroupFinishOrder || [],
    gameGroupStats: record.gameGroupStats || {}
  };

  Object.keys(normalized.gameGroupStats).forEach(groupId => {
    normalized.gameGroupStats[groupId] = normalizeGroupStats(normalized.gameGroupStats[groupId]);
  });

  return normalized;
}

function normalizeGroupStats(stats = {}) {
  const attempts = Number(stats.attempts) || 0;
  const total = Number(stats.total) || attempts * GROUP_TEST_TOTAL_QUESTIONS;
  return {
    correct: Number(stats.correct) || 0,
    totalTime: Number(stats.totalTime) || 0,
    attempts,
    total,
    lastCorrect: Number(stats.lastCorrect) || 0,
    lastTime: Number(stats.lastTime) || 0,
    playerRecords: stats.playerRecords || {},
    players: stats.players || []
  };
}

function getGroupAccuracy(stats = {}) {
  const total = Number(stats.total) || 0;
  return total > 0 ? (Number(stats.correct) || 0) / total : 0;
}

function formatGroupAccuracy(stats = {}) {
  return `${Math.round(getGroupAccuracy(stats) * 100)}%`;
}

function normalizeGroupPlayerKey(name) {
  return String(name || "").trim().replace(/\s+/g, " ").toLowerCase();
}

function ensureGroupBattleState() {
  state.scores.activeGroupBattle = GROUP_BATTLE_SETS.some(set => set.id === Number(state.scores.activeGroupBattle))
    ? Number(state.scores.activeGroupBattle)
    : 1;
  state.scores.groupBattles = state.scores.groupBattles || {};

  const hasLegacyStats = Object.keys(state.scores.gameGroupStats || {}).length > 0;
  if (!state.scores.groupBattles[1] && hasLegacyStats) {
    state.scores.groupBattles[1] = normalizeGroupBattleRecord({
      gameHigh: state.scores.gameHigh || 0,
      gameClearedGroups: state.scores.gameClearedGroups || [],
      gameGroupBest: state.scores.gameGroupBest || {},
      gameGroupBestTime: state.scores.gameGroupBestTime || {},
      gameGroupFinishOrder: state.scores.gameGroupFinishOrder || [],
      gameGroupStats: state.scores.gameGroupStats || {}
    });
  }

  GROUP_BATTLE_SETS.forEach(set => {
    state.scores.groupBattles[set.id] = normalizeGroupBattleRecord(state.scores.groupBattles[set.id]);
  });
  Object.keys(state.scores.groupBattles).forEach(id => {
    if (!GROUP_BATTLE_SETS.some(set => String(set.id) === String(id))) {
      delete state.scores.groupBattles[id];
    }
  });
}

const game = {
  activeBattleId: 1,
  active: false,
  score: 0,
  hearts: GROUP_TEST_WRONG_CHANCES,
  timeLeft: 45,
  timer: null,
  combo: 0,
  currentGroup: GAME_GROUPS[0],
  currentPlayerName: "",
  currentPlayerKey: "",
  currentQuestion: null,
  groupQuestions: [],
  questionIndex: 0,
  correctCount: 0,
  wrongCount: 0,
  monsterHp: 500,
  monsterMaxHp: 500,

  showMenu() {
    this.stop();
    document.getElementById("game-menu").style.display = "block";
    document.getElementById("game-play").style.display = "none";
    document.getElementById("game-over").style.display = "none";
    this.renderGroupMap();
  },

  getActiveBattle() {
    ensureGroupBattleState();
    this.activeBattleId = Number(state.scores.activeGroupBattle) || 1;
    return state.scores.groupBattles[this.activeBattleId];
  },

  getBattleConfig() {
    return GROUP_BATTLE_SETS.find(set => set.id === this.activeBattleId) || GROUP_BATTLE_SETS[0];
  },

  setBattle(battleId) {
    this.stop();
    state.scores.activeGroupBattle = Number(battleId) || 1;
    this.activeBattleId = state.scores.activeGroupBattle;
    ensureGroupBattleState();
    saveToLocalStorage();
    this.renderGroupMap();
  },

  getGroupStats(groupId) {
    const battle = this.getActiveBattle();
    const key = String(groupId);
    battle.gameGroupStats[key] = normalizeGroupStats(battle.gameGroupStats[key]);
    return battle.gameGroupStats[key];
  },

  getGroupRankings() {
    return GAME_GROUPS
      .map(group => ({ group, stats: this.getGroupStats(group.id) }))
      .filter(entry => entry.stats.attempts > 0)
      .sort((a, b) => {
        const accuracyDiff = getGroupAccuracy(b.stats) - getGroupAccuracy(a.stats);
        if (Math.abs(accuracyDiff) > 0.0001) return accuracyDiff;
        if (a.stats.totalTime !== b.stats.totalTime) return a.stats.totalTime - b.stats.totalTime;
        return a.group.id - b.group.id;
      });
  },

  getGroupRank(groupId) {
    const rankings = this.getGroupRankings();
    const index = rankings.findIndex(entry => entry.group.id === groupId);
    return index >= 0 ? index + 1 : 0;
  },
  renderGroupMap() {
    const grid = document.getElementById("boss-groups-grid");
    if (!grid) return;

    this.getActiveBattle();
    const config = this.getBattleConfig();
    const title = document.getElementById("game-battle-title");
    const desc = document.getElementById("game-battle-desc");
    const summary = document.getElementById("battle-set-summary");
    if (title) title.textContent = config.label;
    if (desc) desc.textContent = `${config.desc}，每位同學輸入姓名後只能作答一次，人數不限；排名先比正確率，同分再比累積秒數。`;
    if (summary) summary.textContent = `目前顯示：${config.label}，排名以正確率優先，同分比較少秒數。`;
    GROUP_BATTLE_SETS.forEach(set => {
      const btn = document.getElementById(`battle-set-${set.id}`);
      if (btn) btn.classList.toggle("active", set.id === this.activeBattleId);
    });

    grid.innerHTML = "";
    GAME_GROUPS.forEach(group => {
      const stats = this.getGroupStats(group.id);
      const rank = this.getGroupRank(group.id);
      const count = this.getGroupQuestions(group.id).length;
      const card = document.createElement("button");
      card.className = `boss-group-card${stats.attempts > 0 ? " cleared" : ""}`;
      card.type = "button";
      card.onclick = () => this.start(group.id);
      const stateText = rank > 0 ? `${config.shortLabel}第 ${rank} 名` : `${config.shortLabel}尚未挑戰`;
      card.innerHTML = `
        <span class="boss-group-state">${stateText}</span>
        <span class="boss-group-icon"><i class="fa-solid ${group.icon}"></i></span>
        <span class="boss-group-title">${group.title}</span>
        <strong>${group.name}</strong>
        <span class="boss-name"><i class="fa-solid fa-dragon"></i> ${group.boss}</span>
        <span class="boss-best">人數不限 · 一人限答一次 · 每人 ${count} 題</span>
        <span class="boss-best">正確率 ${formatGroupAccuracy(stats)} · ${stats.correct}/${stats.total || 0} 題</span>
        <span class="boss-best">累積秒數 ${this.formatTime(stats.totalTime)}（${stats.totalTime}秒） · ${stats.attempts} 人</span>
      `;
      grid.appendChild(card);
    });
  },
  getGroupQuestions(groupId) {
    return FIRST_GROUP_BATTLE_ROUNDS.flatMap(roundNum => {
      const roundQuestions = RAW_SHEET_DATA.filter(item => item.round === roundNum);
      return this.shuffle(roundQuestions).slice(0, GROUP_TEST_QUESTION_COUNT).map(item => ({ ...item }));
    });
  },

  formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${String(sec).padStart(2, "0")}`;
  },

  resetRace() {
    this.getActiveBattle();
    const config = this.getBattleConfig();
    if (!confirm(`確定要重置${config.label}的六組累積排行嗎？答對題數、總時長與名次會重新開始。`)) return;
    state.scores.groupBattles[this.activeBattleId] = createGroupBattleRecord();
    if (this.activeBattleId === 1) {
      state.scores.gameHigh = 0;
      state.scores.gameClearedGroups = [];
      state.scores.gameGroupBest = {};
      state.scores.gameGroupBestTime = {};
      state.scores.gameGroupFinishOrder = [];
      state.scores.gameGroupStats = {};
    }
    saveToLocalStorage();
    updateDashboardStats();
    this.renderGroupMap();
  },
  start(groupId = 1) {
    this.currentGroup = GAME_GROUPS.find(group => group.id === groupId) || GAME_GROUPS[0];
    const playerName = prompt(`${this.getBattleConfig().shortLabel} · ${this.currentGroup.title}\n請輸入作答者姓名（一人只能作答一次）：`, "");
    const playerKey = normalizeGroupPlayerKey(playerName);
    if (!playerKey) {
      alert("請先輸入姓名，才能進入團體戰。");
      return;
    }

    const stats = this.getGroupStats(this.currentGroup.id);
    if (stats.playerRecords[playerKey]) {
      alert(`${playerName.trim()} 已經為 ${this.currentGroup.title} 作答過，團體戰一人只能作答一次。`);
      return;
    }

    this.currentPlayerName = playerName.trim();
    this.currentPlayerKey = playerKey;
    this.groupQuestions = this.shuffle(this.getGroupQuestions(this.currentGroup.id));
    this.active = true;
    this.score = 0;
    this.hearts = GROUP_TEST_WRONG_CHANCES;
    this.timeLeft = 0;
    this.combo = 0;
    this.questionIndex = 0;
    this.correctCount = 0;
    this.wrongCount = 0;
    this.monsterMaxHp = this.groupQuestions.length * 100;
    this.monsterHp = this.monsterMaxHp;

    const attemptStats = this.getGroupStats(this.currentGroup.id);
    attemptStats.attempts += 1;
    attemptStats.total += this.groupQuestions.length;
    attemptStats.playerRecords[this.currentPlayerKey] = {
      name: this.currentPlayerName,
      correct: 0,
      total: this.groupQuestions.length,
      time: 0,
      wrong: 0,
      completed: false,
      startedAt: new Date().toISOString()
    };
    attemptStats.players = Object.values(attemptStats.playerRecords).map(record => record.name);
    saveToLocalStorage();

    
    document.getElementById("game-menu").style.display = "none";
    document.getElementById("game-over").style.display = "none";
    document.getElementById("game-play").style.display = "block";
    
    document.getElementById("game-group-label").textContent = `${this.getBattleConfig().shortLabel} · ${this.currentGroup.title} · ${this.currentGroup.name}`;
    document.getElementById("game-boss-name").textContent = this.currentGroup.boss;
    this.updateHeartsUI();
    this.updateBattleStats();
    document.getElementById("game-current-score").textContent = this.correctCount;
    document.getElementById("game-time-left").textContent = this.formatTime(this.timeLeft);
    document.getElementById("game-combo-box").style.opacity = 0;
    document.getElementById("game-timer-bar").style.width = "0%";
    
    this.startTimer();
    this.nextLevel();
  },

  restartCurrentGroup() {
    this.start(this.currentGroup.id);
  },

  shuffle(arr) {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  },
  
  startTimer() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    
    this.timer = setInterval(() => {
      this.timeLeft++;
      document.getElementById("game-time-left").textContent = this.formatTime(this.timeLeft);
      
      const pct = Math.min((this.questionIndex / Math.max(this.groupQuestions.length, 1)) * 100, 100);
      document.getElementById("game-timer-bar").style.width = `${pct}%`;
      
      const barFill = document.getElementById("game-timer-bar");
      barFill.style.background = "var(--success-gradient)";
    }, 1000);
  },
  
  nextLevel() {
    if (this.questionIndex >= this.groupQuestions.length) {
      this.end(true);
      return;
    }

    this.currentQuestion = this.groupQuestions[this.questionIndex];
    this.currentQuestion.currentOptions = this.shuffle(this.currentQuestion.options);
    document.getElementById("game-feedback-overlay").style.display = "none";
    this.updateBattleStats();
    
    const container = document.getElementById("game-letters-box");
    container.innerHTML = "";
    document.getElementById("game-question-text").innerHTML = `
      <span class="quiz-question-type">${getQuestionTypeLabel(this.currentQuestion.type, true)}</span>
      <strong>${this.currentQuestion.question}</strong>
    `;
    
    const letters = ["A", "B", "C", "D"];
    this.currentQuestion.currentOptions.forEach((option, idx) => {
      const btn = document.createElement("button");
      btn.className = "option-btn game-option-btn";
      btn.innerHTML = `
        <span class="option-letter">${letters[idx]}</span>
        <span class="option-text">${option}</span>
      `;
      btn.addEventListener("click", () => this.handleLetterClick(idx, btn));
      container.appendChild(btn);
    });
  },
  
  handleLetterClick(clickedIdx, btnElement) {
    if (!this.active) return;
    
    const activeOptions = this.currentQuestion.currentOptions || this.currentQuestion.options;
    const correctIndex = activeOptions.indexOf(this.currentQuestion.answer);
    
    if (clickedIdx === correctIndex) {
      this.combo++;
      const comboBonus = Math.floor(this.combo / 3) * 30;
      const gainedScore = 100 + comboBonus;
      this.score += gainedScore;
      this.correctCount++;
      this.monsterHp = Math.max(this.monsterHp - 100, 0);
      this.questionIndex++;
      
      document.getElementById("game-current-score").textContent = this.correctCount;
      this.updateBattleStats();
      
      const comboEl = document.getElementById("game-combo-box");
      const comboCount = document.getElementById("game-combo-count");
      if (this.combo > 1) {
        comboCount.textContent = this.combo;
        comboEl.style.opacity = 1;
        comboEl.style.transform = "scale(1.2)";
        setTimeout(() => comboEl.style.transform = "scale(1)", 150);
      }
      
      btnElement.classList.add("correct-highlight");
      this.active = false;
      this.showFeedback(true, gainedScore);
      const finishedGroup = this.questionIndex >= this.groupQuestions.length;
      if (finishedGroup && this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
      
      setTimeout(() => {
        this.active = true;
        this.nextLevel();
      }, 1800);
      
    } else {
      this.combo = 0;
      this.wrongCount++;
      document.getElementById("game-combo-box").style.opacity = 0;
      this.updateHeartsUI();
      btnElement.classList.add("shake");
      setTimeout(() => btnElement.classList.remove("shake"), 500);
    }
  },

  showFeedback(isCorrect, gainedScore) {
    const feedbackOverlay = document.getElementById("game-feedback-overlay");
    feedbackOverlay.className = "game-feedback-overlay";
    document.getElementById("game-feedback-icon").innerHTML = '<i class="fa-solid fa-circle-check"></i>';
    document.getElementById("game-feedback-title").textContent = `命中！-${100} 血 / +${gainedScore}分`;
    document.getElementById("game-feedback-desc").innerHTML = `
      正確答案是【<strong>${this.currentQuestion.answer}</strong>】。<br>
      <span style="display:block; margin-top:8px; font-size:0.9rem; color:var(--text-muted);">${this.currentQuestion.note}</span>
    `;
    feedbackOverlay.style.display = "flex";
  },

  updateBattleStats() {
    document.getElementById("game-question-count").textContent = `${Math.min(this.questionIndex + 1, this.groupQuestions.length)} / ${this.groupQuestions.length}`;
    document.getElementById("boss-hp-text").textContent = `${this.monsterHp} / ${this.monsterMaxHp}`;
    const hpPct = this.monsterMaxHp > 0 ? (this.monsterHp / this.monsterMaxHp) * 100 : 0;
    document.getElementById("boss-hp-fill").style.width = `${hpPct}%`;
  },
  
  updateHeartsUI() {
    const container = document.getElementById("game-hearts");
    container.innerHTML = "";
    
    const heart = document.createElement("i");
    heart.className = "fa-solid fa-heart";
    container.appendChild(heart);

    const label = document.createElement("span");
    label.className = "mistakes-left";
    label.textContent = `無限容錯 (已錯 ${this.wrongCount} 次)`;
    container.appendChild(label);
  },
  
  stop() {
    this.active = false;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  },
  
  end(cleared = false) {
    this.stop();

    const battle = this.getActiveBattle();
    const stats = this.getGroupStats(this.currentGroup.id);
    const playerRecord = stats.playerRecords[this.currentPlayerKey];
    if (playerRecord && !playerRecord.completed) {
      stats.correct += this.correctCount;
      stats.totalTime += this.timeLeft;
      playerRecord.correct = this.correctCount;
      playerRecord.time = this.timeLeft;
      playerRecord.wrong = this.wrongCount;
      playerRecord.completed = true;
      playerRecord.finishedAt = new Date().toISOString();
    }
    stats.lastCorrect = this.correctCount;
    stats.lastTime = this.timeLeft;
    stats.players = Object.values(stats.playerRecords).map(record => record.name);

    const accuracyScore = Math.round(getGroupAccuracy(stats) * 100);
    if (accuracyScore > battle.gameHigh) {
      battle.gameHigh = accuracyScore;
    }
    if (accuracyScore > (battle.gameGroupBest[this.currentGroup.id] || 0)) {
      battle.gameGroupBest[this.currentGroup.id] = accuracyScore;
    }
    battle.gameGroupBestTime[this.currentGroup.id] = stats.totalTime;

    if (!battle.gameClearedGroups.includes(this.currentGroup.id)) {
      battle.gameClearedGroups.push(this.currentGroup.id);
    }
    battle.gameGroupFinishOrder = this.getGroupRankings().map(entry => entry.group.id);
    if (this.activeBattleId === 1) {
      state.scores.gameHigh = battle.gameHigh;
      state.scores.gameClearedGroups = battle.gameClearedGroups;
      state.scores.gameGroupBest = battle.gameGroupBest;
      state.scores.gameGroupBestTime = battle.gameGroupBestTime;
      state.scores.gameGroupFinishOrder = battle.gameGroupFinishOrder;
      state.scores.gameGroupStats = battle.gameGroupStats;
    }
    saveToLocalStorage();

    document.getElementById("game-play").style.display = "none";
    document.getElementById("game-over").style.display = "block";
    document.getElementById("game-final-score").textContent = `${this.correctCount} / ${this.groupQuestions.length}`;

    const summaryEl = document.getElementById("game-summary-text");
    const rank = this.getGroupRank(this.currentGroup.id);
    const wrongText = this.wrongCount === 0 ? "完全沒有失誤" : `本次錯 ${this.wrongCount} 次`;
    const accuracyText = formatGroupAccuracy(stats);
    const playerText = this.currentPlayerName ? `${this.currentPlayerName} ` : "";
    summaryEl.textContent = `${this.getBattleConfig().label} · ${this.currentGroup.title} ${playerText}本次答對 ${this.correctCount}/${this.groupQuestions.length} 題，${wrongText}，本次用時 ${this.formatTime(this.timeLeft)}。目前本組正確率 ${accuracyText}（${stats.correct}/${stats.total || 0} 題）、累積秒數 ${this.formatTime(stats.totalTime)}（${stats.totalTime}秒），排名第 ${rank} 名。`;
  }
};