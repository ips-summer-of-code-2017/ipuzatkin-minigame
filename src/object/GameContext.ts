import {Ball} from "./Ball";
import {Brick} from "./Brick";
import {Platform} from "./Platform";

export class GameContext {
  public ball = new Ball();
  public platform = new Platform();
  public bricks: Brick[] = [];
  public keyMap = {
    KEY_LEFT: false,
    KEY_RIGHT: false,
    KEY_SPACE: false,
  };
  public lastTimeFrame = Date.now();
  public currentLevel = 0;

  public isLevelOver() {
    for (const brick of this.bricks) {
      if (!brick._isBroken) {
        return false
      }
    }
    return true;
  }
}