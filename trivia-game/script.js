/**
 * Trivia Game – Cookies + localStorage (per your notes)
 * - Cookies: document.cookie (set with expires UTC + path=/, get via split/find, delete via past date)
 * - localStorage: setItem/getItem with JSON.stringify/parse
 */
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("trivia-form");
  const questionContainer = document.getElementById("question-container");
  const newPlayerButton = document.getElementById("new-player");
  const usernameInput = document.getElementById("username");
  const loadingContainer = document.getElementById("loading-container");
  const scoreTbody = document.querySelector("#score-table tbody");
  const sessionStatus = document.getElementById("session-status");

  // ---- Init ----
  checkUsername();
  fetchQuestions();
  displayScores();

  // ---- API: fetch and render questions ----
  function fetchQuestions() {
    showLoading(true);
    fetch("https://opentdb.com/api.php?amount=10&type=multiple")
      .then((response) => response.json())
      .then((data) => {
        displayQuestions(data.results || []);
        showLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching questions:", error);
        showLoading(false);
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
      // Keep structure consistent with starter
      div.innerHTML = `
        <p>${q.question}</p>
        ${createAnswerOptions(q.correct_answer, q.incorrect_answers, i)}
      `;
      questionContainer.appendChild(div);
    });
  }

  function createAnswerOptions(correctAnswer, incorrectAnswers, idx) {
    const all = [correctAnswer, ...(incorrectAnswers || [])].sort(
      () => Math.random() - 0.5
    );
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

  // ---- Cookies (exactly like your notes patterns) ----
  function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + value + "; " + expires + "; path=/";
  }

  function getCookie(name) {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${name}=`))
      ?.split("=")[1];
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
      const checked = questionContainer.querySelector(
        `input[name="answer${i}"]:checked`
      );
      if (checked && checked.dataset.correct === "true") score++;
    });
    return score;
  }

  function saveScore(playerName, score) {
    const raw = localStorage.getItem("scores"); // strings only in localStorage
    const scores = raw ? JSON.parse(raw) : [];
    scores.push({ name: playerName, score, when: new Date().toISOString() });
    localStorage.setItem("scores", JSON.stringify(scores));
  }

  function displayScores() {
    const raw = localStorage.getItem("scores");
    const scores = raw ? JSON.parse(raw) : [];
    scores.sort((a, b) => b.score - a.score); // highest first

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

    // Use cookie if present; else read from input and set cookie for 30 days
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

    // New round
    fetchQuestions();
    checkUsername();

    // Clear selections
    form.querySelectorAll('input[type="radio"]').forEach((r) => (r.checked = false));
  }

  // ---- Events ----
  form.addEventListener("submit", handleFormSubmit);
  newPlayerButton.addEventListener("click", newPlayer);
});
