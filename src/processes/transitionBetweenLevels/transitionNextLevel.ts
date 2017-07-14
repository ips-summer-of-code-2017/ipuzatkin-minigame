import {GameContext} from "../../object/GameContext";
import {createGameLevel1} from "./gameLevel1";
import {createGameLevel2} from "./gameLevel2";

export function transitionNextLevel(gameContext: GameContext) {
  gameContext.platform.installCoordinates(gameContext.ball);
  gameContext.currentLevel = gameContext.currentLevel % 2 + 1;
  createLevelGame(gameContext);
}

function createLevelGame(gameContext: GameContext) {
  switch (gameContext.currentLevel) {
    case 1:
      gameContext.bricks = createGameLevel1();
      break;
    case 2:
      gameContext.bricks = createGameLevel2();
      break;
  }
}