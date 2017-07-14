import {GameContext} from "../object/GameContext";
import {gameLoop} from "./gameLoop";
import {GameField} from "../object/GameField";

export function gameStart(gameContext: GameContext) {
  const canvas = <HTMLCanvasElement>document.getElementById("canvas");
  const context: CanvasRenderingContext2D = canvas.getContext("2d");

  canvas.width = GameField.WIDTH_CANVAS;
  canvas.height = GameField.HEIGHT_CANVAS;

  const keyControl = function(key, isPressed) {
    const definitionCodeKey = key.code;

    switch(definitionCodeKey) {
      case "ArrowRight":
        gameContext.keyMap.KEY_RIGHT = isPressed;
        break;
      case "ArrowLeft":
        gameContext.keyMap.KEY_LEFT = isPressed;
        break;
      case "Space":
        gameContext.keyMap.KEY_SPACE = isPressed;
        break;
    }
  };

  window.addEventListener("keydown", (key) => {keyControl(key, true)});
  window.addEventListener("keyup", (key) => {keyControl(key, false)});

  gameLoop(context, gameContext);
}