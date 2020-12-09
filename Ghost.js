import { DIRECTIONS, OBJECT_TYPE } from "./setup";
import { randomMovement } from "./ghostMove";

class Ghost {
  constructor(speed = 5, startPosition, movement, name) {
    this.name = name;
    this.movement = movement;
    this.startPosition = startPosition;
    this.position = startPosition;
    this.direction = DIRECTIONS.ArrowRight;
    this.speed = speed;
    this.timer = 0;
    this.isScared = false;
    this.rotation = false;
  }

  shouldMove() {
    if (this.timer === this.speed) {
      this.timer = 0;
      return true;
    }
    this.timer++;
    return false;
  }

  getNextMove(objectExist) {
    const { nextMovePosition, direction } = this.movement(
      this.position,
      this.direction,
      objectExist
    );
    return { nextMovePosition, direction };
  }

  makeMove() {
    const classesToRemove = [OBJECT_TYPE.GHOST, OBJECT_TYPE.SCARED, this.name];
    let classesToAdd = [OBJECT_TYPE.GHOST, this.name];

    if (this.isScared) {
      classesToAdd = [...classesToAdd, OBJECT_TYPE.SCARED];
    }
    return { classesToRemove, classesToAdd };
  }

  setNewPosition(nextMovePosition, direction) {
    this.position = nextMovePosition;
    this.direction = direction;
  }
}

export default Ghost;
