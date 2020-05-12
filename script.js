const cellElements = document.querySelectorAll("[data-cell]");
const X_CLASS = "x";
const CIRCLE_CLASS = "circle";
let circleTurn = false;
let human_first = true;
let single_player = true;
if (!single_player) human_first = true;

const winList = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const board = document.querySelector(".board");
board.classList.add("x");

function startGame(players = 2, first = "H") {
  human_first = first == "H" ? true : false;
  single_player = players == 2 ? false : true;
  if (!single_player) human_first = true;
  //    console.log(
  //     `single player:${single_player}, ${players}, human first: ${human_first}, ${first}`
  //   );
  document.querySelector("[data-winning-message-text]").textContent = "";
  document.querySelector(".winning-message").classList.remove("show");
  cellElements.forEach((cell) => {
    cell.classList.remove(X_CLASS);
    cell.classList.remove(CIRCLE_CLASS);
    cell.removeEventListener("click", handleClick);
    cell.addEventListener("click", handleClick, { once: true });
  });
  circleTurn = true;
  swapTurns();
  // AI();
  //   human();
  human_first ? human() : AI();
}

function twoplay() {
  startGame(2, "H");
}

function hf() {
  startGame(1, "H");
}

function af() {
  startGame(1, "A");
}

document.querySelector("#restartButton").addEventListener("click", twoplay);
document.querySelector("#AIfirst").addEventListener("click", af);
document.querySelector("#HumanFirst").addEventListener("click", hf);

function handleClick(e) {
  //place marker
  const cell = e.target;
  currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS;

  placeMark(cell, currentClass);
  //check for win

  if (draw()) {
    document.querySelector("[data-winning-message-text]").textContent = "Draw!";
    document.querySelector(".winning-message").classList.add("show");
  } else if (checkWin() === -10) {
    console.log("hello");

    document.querySelector(
      "[data-winning-message-text]"
    ).textContent = `O\'s Won!`;
    document.querySelector(".winning-message").classList.add("show");
  } else if (checkWin()) {
    document.querySelector(
      "[data-winning-message-text]"
    ).textContent = `X's Won!`;
    document.querySelector(".winning-message").classList.add("show");
  }
  //check for draw
  //switch player
  else {
    // circleTurn = true;
    swapTurns();
    if (single_player) AI();
  }
}

function placeMark(cell, currentClass) {
  cell.classList.add(currentClass);
}

function swapTurns() {
  if (circleTurn) {
    circleTurn = false;
    board.classList.add(X_CLASS);
    board.classList.remove(CIRCLE_CLASS);
  } else {
    circleTurn = true;
    board.classList.remove(X_CLASS);
    board.classList.add(CIRCLE_CLASS);
  }
}

function draw() {
  return [...cellElements].every((cell) => {
    return (
      cell.classList.contains(CIRCLE_CLASS) || cell.classList.contains(X_CLASS)
    );
  });
}

function checkWin() {
  if (
    winList.some((triplet) => {
      return triplet.every((index) => {
        return cellElements[index].classList.contains(X_CLASS);
      });
    })
  ) {
    return 10;
  }

  if (
    winList.some((triplet) => {
      return triplet.every((index) => {
        return cellElements[index].classList.contains(CIRCLE_CLASS);
      });
    })
  ) {
    return -10;
  }

  return 0;
}

function AI() {
  circleTurn = false;
  board.classList.add(X_CLASS);
  board.classList.remove(CIRCLE_CLASS);
  let bestScore = -Infinity;
  let nextMove;
  [...cellElements].forEach((Element) => {
    if (
      !Element.classList.contains(X_CLASS) &&
      !Element.classList.contains(CIRCLE_CLASS)
    ) {
      Element.classList.add(X_CLASS);
      let score = miniMax(false, -20, 20);
      Element.classList.remove(X_CLASS);
      if (score > bestScore) {
        bestScore = score;
        nextMove = Element;
      }
    }
  });
  nextMove.classList.add(X_CLASS);
  nextMove.removeEventListener("click", handleClick);
  if (draw()) {
    document.querySelector("[data-winning-message-text]").textContent = "Draw!";
    document.querySelector(".winning-message").classList.add("show");
  }
  if (checkWin()) {
    document.querySelector(
      "[data-winning-message-text]"
    ).textContent = `X's Won!`;
    document.querySelector(".winning-message").classList.add("show");
  }
  human();
}

function miniMax(maxPlayer, alpha, beta) {
  if (checkWin() === 10) {
    return 1;
  }
  if (checkWin() === -10) {
    return -1;
  }
  if (draw()) {
    return 0;
  }

  if (maxPlayer) {
    let bestScore = -Infinity;
    [...cellElements].some((Element) => {
      if (
        !Element.classList.contains(X_CLASS) &&
        !Element.classList.contains(CIRCLE_CLASS)
      ) {
        Element.classList.add(X_CLASS);
        let score = miniMax(false, alpha, beta);
        Element.classList.remove(X_CLASS);
        if (score > bestScore) {
          bestScore = score;
        }
        if (score > alpha) alpha = score;

        if (beta <= alpha) {
          // console.log("pruned");
          return true;
        }
      }
    });
    return bestScore;
  }

  if (!maxPlayer) {
    let bestScore = Infinity;
    [...cellElements].some((Element) => {
      if (
        !Element.classList.contains(X_CLASS) &&
        !Element.classList.contains(CIRCLE_CLASS)
      ) {
        Element.classList.add(CIRCLE_CLASS);
        let score = miniMax(true, alpha, beta);
        Element.classList.remove(CIRCLE_CLASS);
        if (score < bestScore) {
          bestScore = score;
        }
        if (score < beta) beta = score;

        if (beta <= alpha) {
          // console.log("pruned");
          return true;
        }
      }
    });
    return bestScore;
  }
}

function human() {
  circleTurn = true;
  board.classList.remove(X_CLASS);
  board.classList.add(CIRCLE_CLASS);
}
