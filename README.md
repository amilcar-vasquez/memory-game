Age of Empires IV — Memory Match
=================================

Small memory card game themed with Age of Empires IV unit icons.

What this project is
---------------------
- A simple browser memory matching game that loads a deck from `data/card_info.json` and builds a grid of flipping cards.

AoE4 theme / modifications
---------------------------
- The deck was replaced with Age of Empires IV unit names (e.g. `spearman`, `archer`, `knight`, ...).


Stretch goals implemented
--------------------------
- Restart without a full page reload (the "Restart" button calls an in-page initializer).
- Timer showing elapsed time while playing.
- Best time persisted per difficulty using `localStorage`.
- Difficulty selector with three grid options: 4×3 (Easy), 4×4 (Normal), 5×4 (Hard).
- Custom modal dialog replaces `alert()` for win/loss messages.

Challenge solved
-----------------
- Implemented difficulty levels (grid sizes and pair counts) and adapted game initialization so the deck, tries, and grid layout update correctly when the difficulty changes.

