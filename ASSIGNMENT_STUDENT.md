# Memory Card Game — Option A (Guided TODOs)

## What to do
Fill in the TODOs inside `script.js`:
1. `shuffle(arr)` — implement Fisher–Yates.
2. `dealCards(deck)` — build the DOM with `createElement` and a `DocumentFragment`.
3. `flipCard()` — manage `firstCard`, `secondCard`, and `noFlipping` lock.
4. `checkForMatch()` — compare `dataset.name` and branch.
5. `unflipCards()` — decrement tries; update UI; flip back on mismatch; handle loss.
6. `matchCards()` — lock matched pair, set green background, handle win.
7. `showImageOverlay()` — display SVG overlay on loss.

## Checkpoints
- ✅ Deck loads from JSON and duplicates
- ✅ Shuffle returns a **new** randomized array
- ✅ Cards render with images and flip on click
- ✅ Matching sticks; mismatching unflips after a delay
- ✅ Tries remaining decrements; loss overlay appears at 0
- ✅ Win triggers celebration

## Stretch Goals (choose one)
- Restart without page reload
- Timer & best time in `localStorage`
- Difficulty levels (4×3, 4×4, 5×4)
- Replace `alert()` with a custom modal dialog

## Submission
- Link to repo with your completed TODOs
- Short README describing what you built and one challenge you solved
- (Optional) 60–90s screencast walkthrough
