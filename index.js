import { LEVEL, OBJECT_TYPE } from "./setup";
import GameBoard from "./GameBoard";
import Pacman from "./Pacman";
import { randomMovement } from "./ghostMove";
import Ghost from "./Ghost";

// sounds
// TODO Rename sounds properly
import soundDot from "./audio/munch.wav";
import soundPill from "./audio/pill.wav";
import soundGameStart from "./audio/game_start.wav";
import soundGameOver from "./audio/death.wav";
import soundGhost from "./audio/eat_ghost.wav";

// DOM Elements
const gameGrid = document.querySelector("#game");
const scoreTable = document.querySelector("#score");
const startButton = document.querySelector("#start-button");

//  GAME CONSTANTS
const POWER_PILL_TIME = 10000; //MS

const GLOBAL_SPEED = 80; //ms
const gameBoard = GameBoard.createGameBoard(gameGrid, LEVEL);

// Initial setups
let score = 0;
let timer = null;
let gameWin = false;
let powerPillActive = false;
let powerPillTimer = null;
//  Audio
function playAudio(audio) {
  const soundEffect = new Audio(audio);
  soundEffect.play();
}

function gameOver(pacman, grid) {
  playAudio(soundGameOver);
  document.removeEventListener("keydown", (e) => {
    pacman.handleKeyInput(e, gameBoard.objectExist);
  });

  gameBoard.showGameStatus(gameWin);

  clearInterval(timer);

  startButton.classList.remove("hide");
}

function checkCollision(pacman, ghosts) {
  const collidedGhost = ghosts.find(
    (ghost) => pacman.position === ghost.position
  );

  if (collidedGhost) {
    if (pacman.powerPill) {
      playAudio(soundGhost);
      gameBoard.removeObject(collidedGhost.position, [
        OBJECT_TYPE.GHOST,
        OBJECT_TYPE.SCARED,
        collidedGhost.name,
      ]);
      collidedGhost.position = collidedGhost.startPosition;
      score += 100;
    } else {
      gameBoard.removeObject(pacman.position, [OBJECT_TYPE.PACMAN]);
      gameBoard.rotateDiv(pacman.position, 0);
      gameOver(pacman, gameGrid);
    }
  }
}

function gameLoop(pacman, ghosts) {
  gameBoard.moveCharacter(pacman);
  checkCollision(pacman, ghosts);

  ghosts.forEach((ghost) => gameBoard.moveCharacter(ghost));
  checkCollision(pacman, ghosts);

  // check pacman eats a dot
  if (gameBoard.objectExist(pacman.position, OBJECT_TYPE.DOT)) {
    playAudio(soundDot);
    gameBoard.removeObject(pacman.position, [OBJECT_TYPE.DOT]);
    gameBoard.dotCount--;
    score += 10;
  }

  // check if pacman eats a power pill
  if (gameBoard.objectExist(pacman.position, OBJECT_TYPE.PILL)) {
    playAudio(soundPill);
    gameBoard.removeObject(pacman.position, [OBJECT_TYPE.PILL]);

    pacman.powerPill = true;
    score += 50;

    clearTimeout(powerPillTimer);
    powerPillTimer = setTimeout(
      () => (pacman.powerPill = false),
      POWER_PILL_TIME
    );
  }

  // change ghost mode depending on power pill
  if (pacman.powerPill !== powerPillActive) {
    powerPillActive = pacman.powerPill;
    ghosts.forEach((ghost) => (ghost.isScared = pacman.powerPill));
  }

  // check if all dots have been eaten
  if (gameBoard.dotCount === 0) {
    gameWin = true;
    gameOver(pacman, ghosts);
  }

  // show score
  scoreTable.innerHTML = score;
}

function startGame() {
  playAudio(soundGameStart);
  gameWin = false;
  powerPillActive = false;
  score = 0;

  startButton.classList.add("hide");

  gameBoard.createGrid(LEVEL);
  const pacman = new Pacman(2, 287);

  gameBoard.addObject(287, [OBJECT_TYPE.PACMAN]);
  document.addEventListener("keydown", (e) => {
    pacman.handleKeyInput(e, gameBoard.objectExist);
  });

  const ghosts = [
    new Ghost(5, 188, randomMovement, OBJECT_TYPE.BLINKY),
    new Ghost(4, 209, randomMovement, OBJECT_TYPE.PINKY),
    new Ghost(3, 230, randomMovement, OBJECT_TYPE.INKY),
    new Ghost(2, 251, randomMovement, OBJECT_TYPE.CLYDE),
  ];

  timer = setInterval(() => gameLoop(pacman, ghosts), GLOBAL_SPEED);
}

//  initialize game
startButton.addEventListener("click", startGame);
