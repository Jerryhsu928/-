/**
 * 國中九年級形音義練習系統 - 核心控制邏輯 (script.js)
 */

// ==========================================================================
// 全域狀態管理
// ==========================================================================
// 💡 修改 1：可自由設定個人測驗的單題倒數秒數（例如改成 10 就填 10）
let QUIZ_AUTO_ADVANCE_SECONDS = 5; 

const PERSONAL_QUIZ_WRONG_CHANCES = Infinity;
const PERSONAL_QUIZ_CLEAR_WRONG_LIMIT = Infinity;
const PERSONAL_QUIZ_QUESTION_COUNT = 25;
const ROUND_COUNT = REVIEW_DATA.length;
const OPEN_ROUNDS_COUNT = ROUND_COUNT;

const state = {
  // 用戶學習數據
  notebook: {
    starred: [], // 收藏的字卡
    wrong: []    // 測驗錯題
  },
  progress: {
    round1: [], round2: [], round3: [],
    round4: [], round5: [], round6: []
  },
  scores: {
    quiz1: 0, quiz2: 0, quiz3: 0,
    quiz4: 0, quiz5: 0, quiz6: 0,
    gameHigh: 0,
    gameClearedGroups: [],
    gameGroupBest: {},
    gameGroupBestTime: {},
    gameGroupFinishOrder: [],
    gameGroupStats: {},
    activeGroupBattle: 1,
    groupBattles: {}
  },
  
  currentRound: 1,
  currentCardIndex: 0,
  isCardFlipped: false,
  
  quiz: {
    questions: [],
    currentIndex: 0,
    score: 0,
    selectedOption: null,
    timer: null,
    autoNextTimer: null,
    timeLeft: QUIZ_AUTO_ADVANCE_SECONDS,
    correctCount: 0,
    wrongCount: 0,
    answeredCorrect: new Set(),
    retryQuestion: false,
    failedByMistakes: false,
    wrongAnswersCollected: [],
    playerName: '',
    startedAt: 0,
    leaderboardSubmitted: false
  }
};

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
  loadFromLocalStorage();
  applyPreviewMode();
  initTheme();
  updateDashboardStats();
  
  document.getElementById("theme-toggle").addEventListener("click", toggleTheme);
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
  state.scores.gameGroupBest = { 1: 7500, 2: 7600, 3: 4100, 4: 0, 5: 7520, 6: 0 };
  state.scores.gameGroupBestTime = { 2: 356, 5: 384, 1: 421 };
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
    try { state.notebook = JSON.parse(savedNotebook); } catch (e) { console.error(e); }
  }
  
  const savedProgress = localStorage.getItem("yy_progress");
  if (savedProgress) {
    try { state.progress = { ...state.progress, ...JSON.parse(savedProgress) }; ensureRoundState(); } catch (e) { console.error(e); }
  }
  
  const savedScores = localStorage.getItem("yy_scores");
  if (savedScores) {
    try {
      state.scores = { ...state.scores, ...JSON.parse(savedScores) };
      ensureGroupBattleState();
      ensureRoundState();
    } catch (e) { console.error(e); }
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
// 主題切換
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

    totalCards += total;
    totalReviewed += reviewed;
    scores.push(state.scores[scoreKey] || 0);

    const fill = document.getElementById(`progress-r${roundNum}`);
    const text = document.getElementById(`progress-text-r${roundNum}`);
    if (fill) fill.style.width = `${pct}%`;
    if (text) text.textContent = `已複習 ${reviewed}/${total}`;
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

function recordRoundLeaderboardAttempt({ completed, name, score, time, wrong }) {
  const roundNum = state.currentRound;
  const elapsedSeconds = state.quiz.startedAt ? Math.max(1, Math.round((Date.now() - state.quiz.startedAt) / 1000)) : 0;
  
  const manualScore = Number.isFinite(Number(score)) ? Number(score) : state.quiz.score;
  const total = state.quiz.questions.length;
  
  const entry = {
    name: normalizePlayerName(name || state.quiz.playerName),
    score: manualScore,
    correct: Math.round((manualScore / 100) * total),
    total,
    wrong: Number.isFinite(Number(wrong)) ? Math.max(0, Math.round(Number(wrong))) : state.quiz.wrongCount,
    time: Number.isFinite(Number(time)) ? Math.max(0, Math.round(Number(time))) : elapsedSeconds,
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
}

// ==========================================================================
// SPA 路由與頁面切換控制
// ==========================================================================
const app = {
  showPage(pageId) {
    document.querySelectorAll(".page").forEach(page => page.classList.remove("active"));
    
    if (state.quiz.timer) { clearInterval(state.quiz.timer); state.quiz.timer = null; }
    if (state.quiz.autoNextTimer) { clearTimeout(state.quiz.autoNextTimer); state.quiz.autoNextTimer = null; }
    game.stop();
    
    const targetPage = document.getElementById(`page-${pageId}`);
    if (targetPage) {
      targetPage.classList.add("active");
      window.scrollTo(0, 0);
    }
    
    if (pageId === "dashboard") updateDashboardStats();
    else if (pageId === "notebook") this.renderNotebook();
    else if (pageId === "game") game.showMenu();
  },

  // ==========================================================================
  // 模擬測驗邏輯 (Quiz Mode)
  // ==========================================================================
  startQuiz(roundNum) {
    state.currentRound = roundNum;
    state.quiz.playerName = getSavedPlayerName();
    
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
    
    document.getElementById("quiz-active-container").style.display = "block";
    document.getElementById("quiz-result-container").style.display = "none";
    
    this.renderQuizQuestion();
    this.showPage("quiz");
  },

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
    
    document.getElementById("quiz-explanation-box").style.display = "none";
    document.getElementById("quiz-progress-text").textContent = `題號: ${state.quiz.currentIndex + 1} / ${state.quiz.questions.length}`;
    
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
    
    const optionsContainer = document.getElementById("quiz-options");
    optionsContainer.innerHTML = "";
    
    const letters = ["A", "B", "C", "D"];
    questionData.currentOptions.forEach((opt, idx) => {
      const btn = document.createElement("button");
      btn.className = "option-btn";
      btn.innerHTML = `<span class="option-letter">${letters[idx]}</span><span class="option-text">${opt}</span>`;
      btn.addEventListener("click", () => this.selectOption(idx));
      optionsContainer.appendChild(btn);
    });
    
    state.quiz.selectedOption = null;
    this.startQuizTimer();
  },
  
  startQuizTimer() {
    if (state.quiz.timer) clearInterval(state.quiz.timer);
    
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
  
  // 💡 修改 1：倒數到達 0 秒時自動顯示答案
  handleQuizTimeout() {
    const questionData = state.quiz.questions[state.quiz.currentIndex];
    const activeOptions = questionData.currentOptions || questionData.options;
    const correctIndex = activeOptions.indexOf(questionData.answer);
    
    this.revealAnswer(correctIndex, true);
  },
  
  selectOption(optionIndex) {
    const questionData = state.quiz.questions[state.quiz.currentIndex];
    const activeOptions = questionData.currentOptions || questionData.options;
    const correctIndex = activeOptions.indexOf(questionData.answer);
    
    if (optionIndex === correctIndex) {
      if (state.quiz.timer) {
        clearInterval(state.quiz.timer);
        state.quiz.timer = null;
      }
      state.quiz.selectedOption = optionIndex;
      this.revealAnswer(correctIndex, false);
    } else {
      const optionsContainer = document.getElementById("quiz-options");
      const optionButtons = optionsContainer.querySelectorAll(".option-btn");
      if (optionButtons[optionIndex]) {
        optionButtons[optionIndex].classList.add("disabled", "wrong-ans");
      }
    }
  },
  
  // 💡 修改 1 延伸：自動揭示答案邏輯與顯示樣式
  revealAnswer(correctIndex, isTimeout = false) {
    const questionData = state.quiz.questions[state.quiz.currentIndex];
    const optionsContainer = document.getElementById("quiz-options");
    const optionButtons = optionsContainer.querySelectorAll(".option-btn");
    
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
    
    if (!isTimeout) {
      if (!state.quiz.answeredCorrect.has(state.quiz.currentIndex)) {
        state.quiz.answeredCorrect.add(state.quiz.currentIndex);
        state.quiz.correctCount++;
      }
      statusEl.className = "explanation-status correct-status";
      statusEl.innerHTML = '<i class="fa-solid fa-circle-check"></i> 正確答案！';
    } else {
      statusEl.className = "explanation-status wrong-status";
      statusEl.innerHTML = '<i class="fa-solid fa-clock"></i> 時間到！自動顯示答案';
    }

    state.quiz.retryQuestion = false;
    state.quiz.score = Math.round((state.quiz.correctCount / state.quiz.questions.length) * 100);
    
    if (nextBtn) nextBtn.innerHTML = '下一題 <i class="fa-solid fa-arrow-right"></i>';
    
    textEl.innerHTML = `正確答案為：<strong>${questionData.answer}</strong><br><br>${questionData.note}`;
    explanationBox.style.display = "block";
    
    state.quiz.autoNextTimer = setTimeout(() => {
      state.quiz.autoNextTimer = null;
      this.nextQuestion();
    }, 1200);
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

  showQuizResult() {
    if (state.quiz.timer) clearInterval(state.quiz.timer);
    
    state.quiz.score = Math.round((state.quiz.correctCount / state.quiz.questions.length) * 100);
    const scoreKey = `quiz${state.currentRound}`;
    if (state.quiz.score > (state.scores[scoreKey] || 0)) {
      state.scores[scoreKey] = state.quiz.score;
    }
    saveToLocalStorage();
    this.prepareLeaderboardSubmit(true);
    
    document.getElementById("quiz-active-container").style.display = "none";
    document.getElementById("quiz-result-container").style.display = "block";
    document.getElementById("result-score").textContent = state.quiz.score;
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
  },

  submitRoundLeaderboard() {
    if (state.quiz.leaderboardSubmitted) return;

    const panel = document.getElementById("leaderboard-submit-panel");
    const nameInput = document.getElementById("leaderboard-player-name");
    const scoreInput = document.getElementById("leaderboard-score-input");
    const submitBtn = document.getElementById("leaderboard-submit-btn");
    if (!panel || !nameInput || !scoreInput || !submitBtn) return;

    const score = Number(scoreInput.value);
    const playerName = normalizePlayerName(nameInput.value);
    state.quiz.playerName = playerName;
    localStorage.setItem("yy_player_name", playerName);
    
    recordRoundLeaderboardAttempt({
      completed: panel.dataset.completed === "true",
      name: playerName,
      score: score
    });
    
    state.quiz.leaderboardSubmitted = true;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i> 已加入排行榜';
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
    ...record
  };
  Object.keys(normalized.gameGroupStats).forEach(groupId => {
    normalized.gameGroupStats[groupId] = normalizeGroupStats(normalized.gameGroupStats[groupId]);
  });
  return normalized;
}

function normalizeGroupStats(stats = {}) {
  const attempts = Number(stats.attempts) || 0;
  return {
    correct: Number(stats.correct) || 0,
    totalTime: Number(stats.totalTime) || 0,
    attempts,
    total: Number(stats.total) || attempts * (GROUP_TEST_QUESTION_COUNT * FIRST_GROUP_BATTLE_ROUNDS.length),
    playerRecords: stats.playerRecords || {},
    players: stats.players || []
  };
}

function normalizeGroupPlayerKey(name) {
  return String(name || "").trim().replace(/\s+/g, " ").toLowerCase();
}

function ensureGroupBattleState() {
  state.scores.activeGroupBattle = 1;
  state.scores.groupBattles = state.scores.groupBattles || {};
  GROUP_BATTLE_SETS.forEach(set => {
    state.scores.groupBattles[set.id] = normalizeGroupBattleRecord(state.scores.groupBattles[set.id]);
  });
}

const game = {
  activeBattleId: 1,
  active: false,
  score: 0,
  timeLeft: 0,
  timer: null,
  combo: 0,
  currentGroup: GAME_GROUPS[0],
  currentPlayerName: "",
  currentPlayerKey: "",
  currentQuestion: null,
  groupQuestions: [],
  questionIndex: 0,
  correctCount: 0,
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
    return state.scores.groupBattles[1];
  },

  getBattleConfig() {
    return GROUP_BATTLE_SETS[0];
  },

  getGroupStats(groupId) {
    const battle = this.getActiveBattle();
    const key = String(groupId);
    battle.gameGroupStats[key] = normalizeGroupStats(battle.gameGroupStats[key]);
    return battle.gameGroupStats[key];
  },

  renderGroupMap() {
    const grid = document.getElementById("boss-groups-grid");
    if (!grid) return;
    grid.innerHTML = "";
    GAME_GROUPS.forEach(group => {
      const stats = this.getGroupStats(group.id);
      const card = document.createElement("button");
      card.className = `boss-group-card${stats.attempts > 0 ? " cleared" : ""}`;
      card.type = "button";
      card.onclick = () => this.start(group.id);
      card.innerHTML = `
        <span class="boss-group-title">${group.title}</span>
        <strong>${group.name}</strong>
        <span class="boss-best">答對率：${stats.total > 0 ? Math.round((stats.correct/stats.total)*100) : 0}%</span>
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

  shuffle(arr) {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  },

  // 💡 修改 2：姓名重複時直接覆蓋舊成績
  start(groupId = 1) {
    this.currentGroup = GAME_GROUPS.find(group => group.id === groupId) || GAME_GROUPS[0];
    const playerName = prompt(`${this.currentGroup.title}\n請輸入作答者姓名：`, "");
    const playerKey = normalizeGroupPlayerKey(playerName);
    
    if (!playerKey) {
      alert("請先輸入姓名，才能進入團體戰。");
      return;
    }

    this.currentPlayerName = playerName.trim();
    this.currentPlayerKey = playerKey;
    this.groupQuestions = this.shuffle(this.getGroupQuestions(this.currentGroup.id));
    
    const stats = this.getGroupStats(this.currentGroup.id);
    
    // 如果已有舊紀錄，先扣除舊成績以進行「資料覆蓋」
    if (stats.playerRecords[playerKey]) {
      const oldRecord = stats.playerRecords[playerKey];
      if (oldRecord.completed) {
        stats.correct = Math.max(0, stats.correct - (oldRecord.correct || 0));
        stats.totalTime = Math.max(0, stats.totalTime - (oldRecord.time || 0));
      }
      stats.attempts = Math.max(0, stats.attempts - 1);
      stats.total = Math.max(0, stats.total - (oldRecord.total || 0));
    }

    this.active = true;
    this.score = 0;
    this.timeLeft = 0;
    this.combo = 0;
    this.questionIndex = 0;
    this.correctCount = 0;
    this.monsterMaxHp = this.groupQuestions.length * 100;
    this.monsterHp = this.monsterMaxHp;

    stats.attempts += 1;
    stats.total += this.groupQuestions.length;
    stats.playerRecords[this.currentPlayerKey] = {
      name: this.currentPlayerName,
      correct: 0,
      total: this.groupQuestions.length,
      time: 0,
      completed: false,
      startedAt: new Date().toISOString()
    };
    stats.players = Object.values(stats.playerRecords).map(record => record.name);
    saveToLocalStorage();

    document.getElementById("game-menu").style.display = "none";
    document.getElementById("game-over").style.display = "none";
    document.getElementById("game-play").style.display = "block";
    
    this.startTimer();
    this.nextLevel();
  },

  startTimer() {
    if (this.timer) clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.timeLeft++;
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
      btn.innerHTML = `<span class="option-letter">${letters[idx]}</span><span class="option-text">${option}</span>`;
      btn.addEventListener("click", () => this.handleLetterClick(idx, btn));
      container.appendChild(btn);
    });
  },
  
  // 💡 修改 3：答對 1 題額外多加 50 分
  handleLetterClick(clickedIdx, btnElement) {
    if (!this.active) return;
    
    const activeOptions = this.currentQuestion.currentOptions || this.currentQuestion.options;
    const correctIndex = activeOptions.indexOf(this.currentQuestion.answer);
    
    if (clickedIdx === correctIndex) {
      this.combo++;
      
      // 改成答對1題，多加50分 (公式：基礎 100 + 連擊數 * 50)
      const comboBonus = this.combo * 50; 
      const gainedScore = 100 + comboBonus;
      
      this.score += gainedScore;
      this.correctCount++;
      this.monsterHp = Math.max(this.monsterHp - 100, 0);
      this.questionIndex++;
      
      btnElement.classList.add("correct-highlight");
      this.active = false;
      this.showFeedback(true, gainedScore);
      
      setTimeout(() => {
        this.active = true;
        this.nextLevel();
      }, 1800);
      
    } else {
      this.combo = 0;
      btnElement.classList.add("shake");
      setTimeout(() => btnElement.classList.remove("shake"), 500);
    }
  },

  showFeedback(isCorrect, gainedScore) {
    const feedbackOverlay = document.getElementById("game-feedback-overlay");
    document.getElementById("game-feedback-title").textContent = `命中！+${gainedScore}分`;
    document.getElementById("game-feedback-desc").innerHTML = `正確答案是【<strong>${this.currentQuestion.answer}</strong>】。`;
    feedbackOverlay.style.display = "flex";
  },

  stop() {
    this.active = false;
    if (this.timer) { clearInterval(this.timer); this.timer = null; }
  },
  
  end(cleared = false) {
    this.stop();

    const stats = this.getGroupStats(this.currentGroup.id);
    const playerRecord = stats.playerRecords[this.currentPlayerKey];

    if (playerRecord && !playerRecord.completed) {
      stats.correct += this.correctCount;
      stats.totalTime += this.timeLeft;
      playerRecord.correct = this.correctCount;
      playerRecord.time = this.timeLeft;
      playerRecord.completed = true;
      playerRecord.finishedAt = new Date().toISOString();
    }

    saveToLocalStorage();

    document.getElementById("game-play").style.display = "none";
    document.getElementById("game-over").style.display = "block";
    document.getElementById("game-final-score").textContent = `${this.correctCount} / ${this.groupQuestions.length}`;
  }
};
