import { GRID_SIZE, CELL_SIZE, OBJECT_TYPE, CLASS_LIST } from "./setup";

class GameBoard {
  constructor(DOMGrid) {
    this.dotCount = 0;
    this.grid = [];
    this.DOMGrid = DOMGrid;
  }

  showGameStatus(gameWin) {
    const div = document.createElement("div");
    div.classList.add("game-status");
    div.innerHTML = `${gameWin ? "WIN!" : "GAME OVER!"}`;
    this.DOMGrid.appendChild(div);
  }

  createGrid(level) {
    this.dotCount = 0;
    this.grid = [];
    this.DOMGrid.innerHTML = "";
    this.DOMGrid.style.cssText = `grid-template-columns: repeat(${GRID_SIZE},${CELL_SIZE}px)`;

    level.forEach((square, i) => {
      const div = document.createElement("div");
      div.classList.add("square", CLASS_LIST[square]);
      div.style.cssText = `width:${CELL_SIZE}px; height:${CELL_SIZE}px`;
      this.DOMGrid.appendChild(div);
      this.grid.push(div);
      if (CLASS_LIST[square] === OBJECT_TYPE.DOT) {
        this.dotCount++;
      }
    });
  }

  addObject(pos, classes) {
    this.grid[pos].classList.add(...classes);
  }

  removeObject(pos, classes) {
    this.grid[pos].classList.remove(...classes);
  }

  objectExist = (pos, object) => {
    return this.grid[pos].classList.contains(object);
  };

  rotateDiv(pos, deg) {
    this.grid[pos].style.transform = `rotate(${deg}deg)`;
  }

  moveCharacter(character) {
    if (character.shouldMove()) {
      const { nextMovePosition, direction } = character.getNextMove(
        this.objectExist.bind(this)
      );
      const { classesToRemove, classesToAdd } = character.makeMove();

      if (character.rotation && nextMovePosition !== character.position) {
        this.rotateDiv(nextMovePosition, character.direction.rotation);
        this.rotateDiv(character.position, 0);
      }

      this.removeObject(character.position, classesToRemove);
      this.addObject(nextMovePosition, classesToAdd);

      character.setNewPosition(nextMovePosition, direction);
    }
  }

  static createGameBoard(DOMGrid, level) {
    const board = new this(DOMGrid);
    board.createGrid(level);
    return board;
  }
}

export default GameBoard;
