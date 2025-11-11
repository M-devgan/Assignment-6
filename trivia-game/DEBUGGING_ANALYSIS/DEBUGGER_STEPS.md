Goal: To show how I used the Chrome debugger to test form submission, API fetching, and score table rendering in my Trivia Game project.

BP1 –
Purpose: To check if the player’s name and score are saved properly using cookies and localStorage.

Steps:

1.Set a breakpoint inside the handleFormSubmit function on the line with e.preventDefault().

2.Ran the game, entered my name, and clicked the submit button.

3.Before saving, checked in the Console if the cookie existed and how many scores were in localStorage.

4.Stepped over the code that calculates and saves the score.

5.Checked localStorage again to see if the number of scores increased and the new one appeared.

Took screenshots bp1_A.png and bp1_B.png for before and after.

Result: The cookie was present and a new score was successfully saved in localStorage, proving the form works correctly.

BP2 -
Purpose: To confirm that 10 questions are fetched from the Trivia API and displayed on the page.

Steps:

1.Set a breakpoint inside fetchQuestions() on the line .then((data) => { ... }).

2.Reloaded the page to pause when the API data arrived.

3.Checked in the Console that data.results.length was 10.

4.Looked at the first result to confirm it had question text and answers.

5.Stepped over the display function to render questions.

6.Checked that the question container now had 10 child elements.

Took screenshots bp2_A.png and bp2_B.png.

Result: API fetched 10 questions successfully, and the page rendered all of them correctly.

BP3 –
Purpose: To verify that saved scores are read from localStorage and displayed in the table.

Steps:

1.Set a breakpoint inside displayScores() at the start (reading localStorage).

2.Triggered the function by submitting a new game score.

3.Checked that the raw JSON data existed in localStorage.

4.Stepped through the loop that adds rows to the table.

5.After the loop, confirmed that the table had 10 rows with names, scores, and dates.

Took screenshots bp3_A.png and bp3_B.png.
Result: The saved scores were read correctly and shown in the score table on screen.