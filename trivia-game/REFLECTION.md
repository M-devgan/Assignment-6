## Explanation of Code Functionality

The app fetches 10 multiple-choice questions from the Open Trivia Database and renders them to the page. A username is stored in a cookie using setCookie(name,value,days) and read by getCookie(name) to keep the player “logged in” across sessions. When the form is submitted, handleFormSubmit prevents the default reload, ensures a username exists (from cookie or input), calculates the score with calculateScore by checking which options have data-correct="true", and then persists a record {name, score, when} to localStorage via saveScore. The scoreboard is rebuilt by displayScores, which reads and sorts saved scores and inserts table rows so the player can see prior results.

## Description of Coding Process

--I started from the provided HTML/CSS skeleton, then implemented the JavaScript in small steps:

--API & Render: built fetchQuestions to call the API and displayQuestions to create 10 question blocks with shuffled answers.

--Client Storage: added cookie helpers (setCookie, getCookie, deleteCookie) based on my notes; added checkUsername to toggle UI between returning and new players.

--Game Flow: wrote handleFormSubmit to coordinate session check → score calculation → saving → refreshing questions + scoreboard.

--Persistence UI: wrote saveScore (append to an array in localStorage) and displayScores (sort and show top 10).

--Debugging: used three breakpoints (submit, fetch, scoreboard) to verify before/after states and DOM updates; captured screenshots and documented steps.

## Challenges Faced and How I Solved Them

--Nothing to compare in PR: main and feature branches had identical commits, so GitHub showed “There isn’t anything to compare.” I created a small commit on the feature branch (README note) and opened the PR with base main and compare feature/session-and-scores.

--Console errors during debugging (undefined variables): when pausing mid-function, trying to print variables not yet in scope caused errors (e.g., raw is not defined). I fixed this by stepping to the line after the variable assignment, then inspecting.

--Rendering count mismatch: verified data.results.length === 10 but the DOM showed fewer nodes until I stepped over the render call; confirming questionContainer.children.length === 10 proved the render executed after the fetch resolved.
## Consideration of Improvements

--Validation & Accessibility: disable the submit button until all questions are answered; add ARIA attributes and keyboard focus styles for radios.

--Data Quality: show category/difficulty chips; allow the user to pick difficulty and number of questions.

--Scoreboard Features: filter by player name; show best score and average; add a “Clear my scores” action with confirmation.

--Error Handling: display a friendly message and a “Retry” button if the API call fails; log failures with timestamps in localStorage for debugging.

--Security & Privacy: document cookie lifetime and provide a “Log out / New Player” button (implemented) with a brief privacy note.
