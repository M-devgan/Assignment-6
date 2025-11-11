# Reflection – Trivia Game (MCQ)

## What was the goal of this assignment?
The goal of this assignment was to create an interactive Trivia Game web app that uses client-side storage and connects with an external API.  
The project helped me learn how to use **cookies** to remember a user’s name and **localStorage** to save and display scores. It also showed me how data can be stored in the browser and stay even after refreshing or closing the page.

---

## What did I do well?
I think I did well in:
- Setting up the structure correctly with HTML, CSS, and JavaScript files.
- Using `document.cookie` exactly like we learned in notes to create, read, and delete cookies.
- Fetching questions from the **Open Trivia Database API** and displaying them dynamically as multiple-choice questions.
- Using `localStorage.setItem()` and `localStorage.getItem()` with `JSON.stringify()` and `JSON.parse()` to handle scores.
- Updating the score table so it shows the player’s name, score, and date each time.

---

## What was challenging for me?
The most challenging part was understanding how cookies and localStorage work differently.  
At first, I confused them, but after re-reading my notes and testing with `console.log(document.cookie)` and `localStorage.getItem("scores")`, I understood that:
- Cookies are smaller and expire after a set date.
- LocalStorage keeps data permanently until it’s cleared manually.  
Debugging was also tricky at first, but using **Chrome DevTools** breakpoints really helped me see how data changes step by step.

---

## What did I learn from debugging?
During debugging, I used three breakpoints:
1. **Form submission:** to check how `getCookie()` and `setCookie()` worked when I submitted the form.
2. **API fetch:** to see the trivia data coming from the API and confirm it had 10 questions.
3. **Display scores:** to check if the new score was added to localStorage and shown in the table.

By stepping through these points, I could actually see variables changing live, which helped me understand how my code runs behind the scenes.  
This made me more confident using the debugger instead of just console logs.

---

## How will this help me in the future?
This project gave me more practice with **JavaScript logic**, **event handling**, and **browser data storage**.  
These are all important skills for web developers.  
Now I feel more comfortable creating small apps that remember user data or fetch information from APIs.

---

## Overall reflection
I am happy with my final project because it runs smoothly and matches the rubric.  
It was a good mix of coding, problem solving, and learning how to test and debug my own program like a developer.
