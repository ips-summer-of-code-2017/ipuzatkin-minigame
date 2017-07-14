import {GameContext} from "../object/GameContext";
import {processGamePhysics} from './gamePhysics/gamePhysics';
import {transitionNextLevel} from "./transitionBetweenLevels/transitionNextLevel";
import {Direction} from "../direction";
import {GameField} from "../object/GameField";

export function gameLoop(canvasContext: CanvasRenderingContext2D, gameContext: GameContext) {
  if (gameContext.keyMap.KEY_LEFT) {
    gameContext.platform._directionPlatform = Direction.LEFT;
  } else if (gameContext.keyMap.KEY_RIGHT) {
    gameContext.platform._directionPlatform = Direction.RIGHT;
  }
  if (gameContext.keyMap.KEY_SPACE) {
    if (!gameContext.ball._isFlying) {
      gameContext.ball._directionX = Direction.LEFT;
      gameContext.ball._directionY = Direction.UP;
    }
    gameContext.ball._isFlying = true;
  }

  let currentTimeFrame = Date.now();
  let deltaTime = currentTimeFrame - gameContext.lastTimeFrame;
  gameContext.lastTimeFrame = currentTimeFrame;

  processGamePhysics(gameContext, deltaTime);

  if (gameContext.isLevelOver()) {
    transitionNextLevel(gameContext);
  }
  GameField.draw(canvasContext);
  gameContext.ball.draw(canvasContext);
  gameContext.platform.draw(canvasContext);
  for (const brick of gameContext.bricks) {
    if (!brick._isBroken){
      brick.draw(canvasContext);
    }
  }
  requestAnimationFrame(function() {
    gameLoop(canvasContext, gameContext);
  });
}