// Click a button or object to earn points so that I can increase my score.
// See my current score during the game so that I know how well I am doing.
// See a countdown timer so that I know how much time is left. setInterval();

// Variables
let score = 0;
let timeLeft = 60;
let gameStarted = false;
let gameEnded = false;
let interval = null;

// HTML DOM
const button1 = document.getElementById('button1');
const button2 = document.getElementById('button2');
const scoreDisplay = document.getElementById('scoreDisplay');
const timerDisplay = document.getElementById('timerDisplay');
const label1 = document.getElementById('label1');
const input1 = document.getElementById('name');


const SCORES_URL = "https://docs.google.com/spreadsheets/d/1qTKVWJB7PBRo386N45ahJFaPE9kZUNS-aEfKCiaVmuE/gviz/tq?tqx=out:csv&gid=0&tq=select%20A,B%20order%20by%20B%20desc";
const message = document.createElement('p');
document.body.appendChild(message);

const scoreboardTitle = document.createElement('h2');
scoreboardTitle.innerText = 'Scoreboard';
document.body.appendChild(scoreboardTitle);

const scoreboard = document.createElement('ol');
document.body.appendChild(scoreboard);

// UI Functions
button1.addEventListener('click', () => {
  if (!gameEnded) {
    increaseScore();
  }

  if (!gameStarted) {
    startGame();
  }
})

input1.style.display = 'none';
label1.style.display = 'none';
button2.style.display = 'none';

button2.addEventListener('click', () => {
  submitHighScore();
})


// Functions
function increaseScore() {
  score++;
  console.log(score);
  scoreDisplay.innerText = score;
}

function countdown() {
  timeLeft--;
  timerDisplay.innerText = timeLeft;

  if (timeLeft <= 0) {
    timerDisplay.innerText = 0;
    endGame();
  }
}

function startGame() {
  interval = setInterval(countdown, 1000);
  gameStarted = true;
}

function endGame() {
  gameEnded = true;
  clearInterval(interval);
  button1.style.display = 'none';
  input1.style.display = 'block';
  label1.style.display = 'block';
  button2.style.display = 'block';
  message.innerText = 'Game over! Your score is ' + score;
}

async function submitHighScore() {
  console.log(input1.value);


  const response = await fetch("https://hooks.zapier.com/hooks/catch/8338993/ujs9jj9/", {
    method: "POST",
    body: JSON.stringify({name: input1.value, score: score}),
  });

  if (response.ok) {
  message.innerText = 'Score saved.';
  loadScoreboard();
} else {
  message.innerText = 'Score was not saved.';
}
}

async function loadScoreboard() {
  const response = await fetch(SCORES_URL);
  const data = await response.text();
  const rows = data.replaceAll('"', '').split('\n');

  scoreboard.innerHTML = '';

  for (let i = 1; i < rows.length; i++) {
    let row = rows[i].split(',');
    scoreboard.innerHTML += '<li>' + row[0] + ': ' + row[1] + '</li>';
  }
}

loadScoreboard();
