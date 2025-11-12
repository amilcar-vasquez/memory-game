// ==============================
// Memory Card Game — Student Starter (Option A)
// ==============================
// You have guided TODOs. Complete each TODO to make the game work.
// Files provided: index.html, styles.css, data/card_info.json, images/*.svg
// Open with a local server so fetch() works (e.g., VS Code Live Server).

// ------------- State & DOM refs -------------
let cards = [];
const cardTable = document.querySelector(".card-table");
let firstCard = null;
let secondCard = null;
let noFlipping = false;
let triesRemaining = 10;
let winCounter = null;

const counter = document.querySelector(".tries-remaining");
counter.textContent = triesRemaining;

// Restart (initial simple behavior)
document.getElementById('restart').addEventListener('click', () => window.location.reload());

// ------------- Fetch the deck -------------
fetch("./data/card_info.json")
  .then(res => res.json())
  .then(data => {
    winCounter = data.length;            // # of unique pairs to match
    cards = [...data, ...data];          // duplicate to make pairs
    const shuffled = shuffle(cards);     // TODO: implement shuffle()
    dealCards(shuffled);                 // TODO: build and attach card elements
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
  // Your code here ↓
  const copy = [...arr];
  // TODO: loop i from copy.length - 1 down to 1
  // TODO: generate j = Math.floor(Math.random() * (i + 1))
  // TODO: swap copy[i] and copy[j]
  return copy; // replace with real shuffled copy
}

// ------------- TODO #2: Deal cards to the DOM -------------
function dealCards(deck) {
  // Goal: create DOM nodes for each card and append to .card-table efficiently.
  // Use a DocumentFragment. Card structure:
  // <div class="card" data-name="...">
  //   <div class="back"><img class="back-image" src="./images/<name>.svg" alt="<name>"></div>
  //   <div class="front"></div>
  // </div>
  const frag = document.createDocumentFragment();

  // TODO: for...of deck
  //   - create .card
  //   - set data-name
  //   - create .back with <img>, and .front
  //   - append back & front into .card
  //   - add click listener -> flipCard
  //   - append .card to fragment

  // TODO: append fragment to cardTable
}

// ------------- TODO #3: Flip logic & guarding -------------
function flipCard() {
  // Requirements:
  // - If noFlipping is true, ignore clicks.
  // - Add class "flipped" to show the back.
  // - Prevent double-clicking the same card (if this === firstCard).
  // - If firstCard is empty, set it and return.
  // - Otherwise, set secondCard, lock (noFlipping = true), and call checkForMatch().

  // Your code here ↓
}

// ------------- TODO #4: Decide match vs unflip -------------
function checkForMatch() {
  // Compute isMatch by comparing dataset.name on firstCard and secondCard.
  // If match -> call matchCards(); else -> call unflipCards().
  // Your code here ↓
}

// ------------- TODO #5: Handle unflip + tries + lose -------------
function unflipCards() {
  // After ~900ms:
  // - decrement triesRemaining; update counter text
  // - if triesRemaining === 0 -> show loss overlay (showImageOverlay()) and return
  // - otherwise remove "flipped" from both cards
  // - call resetFlags()

  // Your code here ↓
}

// ------------- TODO #6: Handle match + win -------------
function matchCards() {
  // - Decrement winCounter. If 0 -> trigger win (alert + falling stars for 5s).
  // - Remove click listeners from both cards (they should remain flipped).
  // - Set a green background on matched pairs (setCardBackground(card, "greenyellow")).
  // - Reset flags.

  // Your code here ↓
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
  // Your code here ↓
}

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
