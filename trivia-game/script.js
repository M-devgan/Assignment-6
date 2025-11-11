/**
 * Trivia Game – Funny Mode 🤪 (still notes-only: document.cookie + localStorage)
 * - Cookies: document.cookie (set/get/delete like your notes)
 * - localStorage: JSON.stringify/parse exactly like your notes
 */
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("trivia-form");
  const questionContainer = document.getElementById("question-container");
  const newPlayerButton = document.getElementById("new-player");
  const usernameInput = document.getElementById("username");
  const loadingContainer = document.getElementById("loading-container");
  const scoreTbody = document.querySelector("#score-table tbody");
  const sessionStatus = document.getElementById("session-status");
  const funnyToggle = document.getElementById("funny-mode");

  // Quips & emojis for Funny Mode
  const loadQuips = [
    "Summoning tricky questions… 🧙‍♀️",
    "Polishing brain cells… 🧠✨",
    "Borrowing questions from aliens… 👽",
    "Bribing the quiz master… 🤝😅",
  ];
  const endQuips = [
    (s) => `Score: ${s}/10 — Absolute legend! 🏆`,
    (s) => `Score: ${s}/10 — Brain = Big. 📈`,
    (s) => `Score: ${s}/10 — Not bad! Next round? 🔁`,
    (s) => `Score: ${s}/10 — You clicked vibes, not facts 😆`,
  ];
  const wrongNotes = ["nope 😂", "close-ish 🙈", "try again 😜", "almost… kinda 😅"];

  // ---- Init ----
  checkUsername();
  fetchQuestions();
  displayScores();

  // ---- API: fetch and render questions ----
  function fetchQuestions() {
    showLoading(true);
    if (funnyToggle?.checked) {
      sessionStatus.textContent = loadQuips[Math.floor(Math.random() * loadQuips.length)] || "";
    }
    fetch("https://opentdb.com/api.php?amount=10&type=multiple")
      .then((response) => response.json())
      .then((data) => {
        displayQuestions(data.results || []);
        showLoading(false);
        if (funnyToggle?.checked) sessionStatus.textContent = "Ready. May the odds be ever in your flavour 🍟";
      })
      .catch((error) => {
        console.error("Error fetching questions:", error);
        showLoading(false);
        sessionStatus.textContent = "Couldn’t fetch questions. Internet gremlins? 🧌";
      });
  }

  function showLoading(isLoading) {
    loadingContainer.classList = isLoading ? "" : "hidden";
    questionContainer.classList = isLoading ? "hidden" : "";
  }

  function displayQuestions(questions) {
    questionContainer.innerHTML = "";
    questions.forEach((q, i) => {
      const div = document.createElement("div");
      const header = renderFunnyHeader(q);
      div.innerHTML = `
        ${header}
        <p>${q.question}</p>
        ${createAnswerOptions(q.correct_answer, q.incorrect_answers, i)}
        <div class="micro-note" id="note-${i}"></div>
      `;
      // attach quick wrong-answer feedback (Funny Mode)
      div.addEventListener("change", (ev) => {
        if (!funnyToggle?.checked) return;
        const label = ev.target.closest("label");
        if (!label) return;
        // add tiny shake if wrong
        const checked = ev.target;
        const msg = document.getElementById(`note-${i}`);
        if (checked && checked.dataset.correct === "true") {
          msg.textContent = "Correct! 🥳";
          msg.style.color = "green";
        } else if (checked) {
          label.classList.add("shake");
          setTimeout(() => label.classList.remove("shake"), 350);
          msg.textContent = randomFrom(wrongNotes);
          msg.style.color = "#a00";
        }
      });
      questionContainer.appendChild(div);
    });
  }

  function renderFunnyHeader(q) {
    // add badges with emojis
    const cat = q.category ? `<span class="badge emoji">📚 ${q.category}</span>` : "";
    const diffEmoji = q.difficulty === "easy" ? "🟢" : q.difficulty === "medium" ? "🟡" : "🔴";
    const diff = q.difficulty ? `<span class="badge diff">${diffEmoji} ${capitalize(q.difficulty)}</span>` : "";
    return `<div>${cat}${diff}</div>`;
  }

  function createAnswerOptions(correctAnswer, incorrectAnswers = [], idx) {
    const all = [correctAnswer, ...incorrectAnswers].sort(() => Math.random() - 0.5);
    return all
      .map(
        (ans) => `
        <label>
          <input type="radio" name="answer${idx}" value="${ans}" ${
            ans === correctAnswer ? 'data-correct="true"' : ""
          }>
          ${ans}
        </label>`
      )
      .join("");
  }

  // ---- Cookies (your notes) ----
  function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + value + "; " + expires + "; path=/";
  }
  function getCookie(name) {
    return document.cookie.split("; ").find((row) => row.startsWith(`${name}=`))?.split("=")[1];
  }
  function deleteCookie(name) {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }

  // ---- Session handling with cookies ----
  function checkUsername() {
    const existing = getCookie("username");
    if (existing) {
      usernameInput.classList.add("hidden");
      newPlayerButton.classList.remove("hidden");
      sessionStatus.textContent = `Logged in as: ${decodeURIComponent(existing)}`;
    } else {
      usernameInput.classList.remove("hidden");
      newPlayerButton.classList.add("hidden");
      sessionStatus.textContent = "";
    }
  }
  function newPlayer() {
    deleteCookie("username");
    usernameInput.value = "";
    usernameInput.classList.remove("hidden");
    newPlayerButton.classList.add("hidden");
    sessionStatus.textContent = "";
    usernameInput.focus();
  }

  // ---- Score calculation + persistence (localStorage) ----
  function calculateScore() {
    let score = 0;
    const blocks = questionContainer.querySelectorAll("div");
    blocks.forEach((_, i) => {
      const checked = questionContainer.querySelector(`input[name="answer${i}"]:checked`);
      if (checked && checked.dataset.correct === "true") score++;
    });
    return score;
  }
  function saveScore(playerName, score) {
    const raw = localStorage.getItem("scores");
    const scores = raw ? JSON.parse(raw) : [];
    scores.push({ name: playerName, score, when: new Date().toISOString() });
    localStorage.setItem("scores", JSON.stringify(scores));
  }
  function displayScores() {
    const raw = localStorage.getItem("scores");
    const scores = raw ? JSON.parse(raw) : [];
    scores.sort((a, b) => b.score - a.score);
    scoreTbody.innerHTML = "";
    scores.slice(0, 10).forEach((r) => {
      const tr = document.createElement("tr");
      const date = new Date(r.when).toLocaleDateString();
      tr.innerHTML = `<td>${r.name}</td><td>${r.score}</td><td>${date}</td>`;
      scoreTbody.appendChild(tr);
    });
  }

  // ---- Form submission ----
  function handleFormSubmit(e) {
    e.preventDefault();

    let name = getCookie("username");
    if (!name) {
      const typed = (usernameInput.value || "").trim();
      if (!typed) {
        alert("Please enter your name.");
        return;
      }
      setCookie("username", encodeURIComponent(typed), 30);
      name = encodeURIComponent(typed);
    }

    const score = calculateScore();
    saveScore(decodeURIComponent(name), score);
    displayScores();

    // Funny Mode end message
    if (funnyToggle?.checked) {
      const msg = randomFrom(endQuips)(score);
      alert(msg);
    }

    // New round
    fetchQuestions();
    checkUsername();
    form.querySelectorAll('input[type="radio"]').forEach((r) => (r.checked = false));
  }

  // ---- Helpers & Events ----
  function randomFrom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
  function capitalize(s = "") {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
  form.addEventListener("submit", handleFormSubmit);
  newPlayerButton.addEventListener("click", newPlayer);
});
