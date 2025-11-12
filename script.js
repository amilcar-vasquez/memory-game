// ==============================
// Memory Card Game — Student Starter (Option A)
// ==============================
// You have guided TODOs. Complete each TODO to make the game work.
// Files provided: index.html, styles.css, data/card_info.json, images/*.svg
// Open with a local server so fetch() works (e.g., VS Code Live Server).

// ------------- State & DOM refs -------------
let allCards = [];
let cards = [];
const cardTable = document.querySelector(".card-table");
let firstCard = null;
let secondCard = null;
let noFlipping = false;
let triesRemaining = 10;
let winCounter = null;
let timerInterval = null;
let timeElapsed = 0; // seconds

const counter = document.querySelector(".tries-remaining");
const timeEl = document.querySelector('.time-elapsed');
const bestEl = document.querySelector('.best-time');
const difficultySelect = document.getElementById('difficulty');

counter.textContent = triesRemaining;

// Restart behavior (in-page)
document.getElementById('restart').addEventListener('click', () => initGame());

// Modal buttons
document.getElementById('modal-close').addEventListener('click', () => closeModal());
document.getElementById('modal-restart').addEventListener('click', () => { closeModal(); initGame(); });

// Difficulty change
difficultySelect.addEventListener('change', () => initGame());

// ------------- Fetch the deck once -------------
fetch("./data/card_info.json")
  .then(res => res.json())
  .then(data => {
    allCards = data;
    // start initial game
    initGame();
  })
  .catch(err => console.error("Fetch error:", err));

// ------------- TODO #1: Implement Fisher-Yates shuffle -------------
function shuffle(arr) {
  // Goal: return a new shuffled copy of arr using Fisher–Yates (in-place) algorithm.
  // Steps:
  // 1) Copy the incoming array (to avoid mutating original).
  // 2) Loop from end -> start. For each index i, pick random j in [0, i].
  // 3) Swap elements at i and j (use destructuring).
  // 4) Return the shuffled copy.
  const copy = [...arr];
  // TODO: loop i from copy.length - 1 down to 1
  for (let i = copy.length - 1; i > 0; i--) {
  // TODO: generate j = Math.floor(Math.random() * (i + 1))
    const j = Math.floor(Math.random() * (i + 1));
  // TODO: swap copy[i] and copy[j]
  [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// ------------- TODO #2: Deal cards to the DOM -------------
function dealCards(deck) {
  // Goal: create DOM nodes for each card and append to .card-table efficiently.
  // Use a DocumentFragment. Card structure:
  // <div class="card" data-name="...">
  //   <div class="back"><img class="back-image" src="./images/<name>.svg" alt="<name>"></div>
  //   <div class="front"></div>
  // </div>
  // Clear any existing cards first
  cardTable.innerHTML = '';
  const frag = document.createDocumentFragment();

  // TODO: for...of deck
  //   - create .card
  //   - set data-name
  //   - create .back with <img>, and .front
  //   - append back & front into .card
  //   - add click listener -> flipCard
  //   - append .card to fragment
  for (const cardInfo of deck) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.name = cardInfo.name;

    const back = document.createElement("div");
    back.classList.add("back");
    const img = document.createElement("img");
    img.classList.add("back-image");
  // Prefer an explicit image path from the card data (allows .png/.svg).
  img.src = cardInfo.image ? cardInfo.image : `./images/${cardInfo.name}.svg`;
  img.alt = cardInfo.name;
    back.appendChild(img);

    const front = document.createElement("div");
    front.classList.add("front");

  // TODO: append fragment to cardTable
    card.appendChild(back);
    card.appendChild(front);
    card.addEventListener("click", flipCard);
    frag.appendChild(card);
  }
  cardTable.appendChild(frag);
}

// Build a subset deck based on difficulty and start the round
function initGame() {
  // reset state
  resetFlags();
  stopTimer();
  timeElapsed = 0;
  timeEl.textContent = formatTime(timeElapsed);

  // determine difficulty -> pair counts and grid columns
  const diff = difficultySelect.value || '4x4';
  const [cols, rows] = diff.split('x').map(n => parseInt(n, 10));
  const pairCount = Math.floor((cols * rows) / 2);

  // set tries based on difficulty (simple heuristic)
  if (diff === '4x3') triesRemaining = Math.max(6, pairCount * 1);
  else if (diff === '5x4') triesRemaining = Math.max(12, pairCount * 2);
  else triesRemaining = Math.max(8, pairCount * 1 + 4);
  counter.textContent = triesRemaining;

  // pick a random subset of allCards (shuffle and slice)
  const shuffledAll = shuffle(allCards);
  const subset = shuffledAll.slice(0, pairCount);
  winCounter = subset.length;

  // prepare cards duplicated and shuffled
  cards = shuffle([...subset, ...subset]);

  // adjust grid columns
  cardTable.style.gridTemplateColumns = `repeat(${cols}, var(--card-w))`;

  dealCards(cards);
  // start timer
  startTimer();
}

// ------------- TODO #3: Flip logic & guarding -------------
function flipCard() {
  // Requirements:
  // - If noFlipping is true, ignore clicks.
  // - Add class "flipped" to show the back.
  // - Prevent double-clicking the same card (if this === firstCard).
  // - If firstCard is empty, set it and return.
  // - Otherwise, set secondCard, lock (noFlipping = true), and call checkForMatch().

  if (noFlipping) return;
  this.classList.add("flipped");

  if (this === firstCard) return;

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  noFlipping = true;
  checkForMatch();
}

// ------------- TODO #4: Decide match vs unflip -------------
function checkForMatch() {
  // Compute isMatch by comparing dataset.name on firstCard and secondCard.
  // If match -> call matchCards(); else -> call unflipCards().
  const isMatch = firstCard.dataset.name === secondCard.dataset.name;
  if (isMatch) {
    matchCards();
  } else {
    unflipCards();
  }
}

// ------------- TODO #5: Handle unflip + tries + lose -------------
function unflipCards() {
  // After ~900ms:
  // - decrement triesRemaining; update counter text
  // - if triesRemaining === 0 -> show loss overlay (showImageOverlay()) and return
  // - otherwise remove "flipped" from both cards
  // - call resetFlags()

  setTimeout(() => {
    triesRemaining--;
    counter.textContent = triesRemaining;
    if (triesRemaining === 0) {
      showImageOverlay();
      showModal('You lost', 'Out of tries — better luck next time.');
      return;
    }
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetFlags();
  }, 900);
}

// ------------- TODO #6: Handle match + win -------------
function matchCards() {
  // - Decrement winCounter. If 0 -> trigger win (alert + falling stars for 5s).
  // - Remove click listeners from both cards (they should remain flipped).
  // - Set a green background on matched pairs (setCardBackground(card, "greenyellow")).
  // - Reset flags.

  winCounter--;
  if (winCounter === 0) {
    // Stop timer and show custom modal with time/best
    stopTimer();
    const formatted = formatTime(timeElapsed);
    const diff = difficultySelect.value || '4x4';
    // update best time in localStorage
    const key = `bestTime-${diff}`;
    const prev = localStorage.getItem(key);
    if (!prev || timeElapsed < Number(prev)) {
      localStorage.setItem(key, String(timeElapsed));
    }
    updateBestDisplay();
    showModal('You win!', `Completed in ${formatted}`);
    const starInterval = setInterval(createStar, 200);
    setTimeout(() => clearInterval(starInterval), 5000);
  }
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);
  setCardBackground(firstCard, "greenyellow");
  setCardBackground(secondCard, "greenyellow");
  resetFlags();
}

// Utility: set matched background color on the "back" face
function setCardBackground(card, color) {
  card.children[0].style.background = color;
}

// Reset selection/lock
function resetFlags() {
  firstCard = null; 
  secondCard = null;
  noFlipping = false;
}

// ------------- TODO #7: Loss overlay -------------
function showImageOverlay() {
  // Create <div class="image-overlay"><img src="./images/loser.svg" alt="You lost"></div>
  // Append to body, then next frame set opacity to 1.
  const overlay = document.createElement("div");
  overlay.classList.add("image-overlay");
  const img = document.createElement("img");
  img.src = "./images/loser.svg";
  img.alt = "You lost";
  overlay.appendChild(img);
  document.body.appendChild(overlay);
  requestAnimationFrame(() => {
    overlay.style.opacity = "1";
  });
}

// ----- Timer helpers -----
function startTimer() {
  stopTimer();
  timerInterval = setInterval(() => {
    timeElapsed++;
    timeEl.textContent = formatTime(timeElapsed);
  }, 1000);
}
function stopTimer() {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = null;
}
function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}
function updateBestDisplay() {
  const diff = difficultySelect.value || '4x4';
  const key = `bestTime-${diff}`;
  const prev = localStorage.getItem(key);
  bestEl.textContent = prev ? formatTime(Number(prev)) : '—';
}

// ----- Modal -----
function showModal(title, body) {
  const modal = document.getElementById('modal');
  modal.querySelector('.modal-title').textContent = title;
  modal.querySelector('.modal-body').textContent = body;
  modal.setAttribute('aria-hidden', 'false');
}
function closeModal() {
  const modal = document.getElementById('modal');
  modal.setAttribute('aria-hidden', 'true');
}

// initialize best display when script loads
// (if difficultySelect isn't ready yet, guard)
if (difficultySelect) updateBestDisplay();

// Celebration stars (provided)
function createStar() {
  const star = document.createElement("div");
  star.classList.add("star");
  const randomX = Math.random() * window.innerWidth;
  star.style.left = `${randomX}px`;
  const duration = Math.random()*2 + 3;
  star.style.animationDuration = `${duration}s`;
  document.querySelector(".star-wrapper").appendChild(star);
  star.addEventListener('animationend', () => star.remove());
}
