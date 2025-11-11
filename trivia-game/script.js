document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("trivia-form");
  const questionContainer = document.getElementById("question-container");
  const newPlayerButton = document.getElementById("new-player");
  const usernameInput = document.getElementById("username");
  const loadingContainer = document.getElementById("loading-container");
  const scoreTbody = document.querySelector("#score-table tbody");
  const sessionStatus = document.getElementById("session-status");

  // Init
  checkUsername();
  fetchQuestions();
  displayScores();

  // --- API & render ---
  function fetchQuestions() {
    showLoading(true);
    fetch("https://opentdb.com/api.php?amount=10&type=multiple")
      .then((response) => response.json())
      .then((data) => {
        displayQuestions(data.results || []);
        showLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching questions:", err);
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
      div.innerHTML = `
        <p>${q.question}</p>
        ${createAnswerOptions(q.correct_answer, q.incorrect_answers, i)}
      `;
      questionContainer.appendChild(div);
    });
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

  // --- Cookies (per notes) ---
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

  // --- Session ---
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

  // --- Scoring & persistence ---
  function calculateScore() {
    let score = 0;
    for (let i = 0; i < 10; i++) {
      const checked = questionContainer.querySelector(`input[name="answer${i}"]:checked`);
      if (checked && checked.dataset.correct === "true") score++;
    }
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

  // --- Submit ---
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

    // next round
    fetchQuestions();
    checkUsername();
    form.querySelectorAll('input[type="radio"]').forEach((r) => (r.checked = false));
  }

  // Events
  form.addEventListener("submit", handleFormSubmit);
  newPlayerButton.addEventListener("click", newPlayer);
});
