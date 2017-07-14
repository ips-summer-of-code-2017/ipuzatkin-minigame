import {GameContext} from "../../object/GameContext";
import {Ball} from "../../object/Ball";
import {Platform} from "../../object/Platform";
import {GameField} from "../../object/GameField";
import {Direction} from "../../direction";
import {Brick} from "../../object/Brick";

export function processGamePhysics(gameContext: GameContext, deltaTime: number) {
  collision.ballAndBorder(gameContext.ball, gameContext.platform);
  collision.ballAndPlatform(gameContext.ball, gameContext.platform);
  for (const brick of gameContext.bricks) {
    collision.ballAndBrick(gameContext.ball, brick);
  }

  gameContext.ball.move(deltaTime);
  gameContext.platform.move(gameContext.ball, deltaTime);
}

namespace collision {
  export function ballAndBorder(ball: Ball, platform: Platform) {
    const ballLeft = ball._x;
    const ballRight = ball._x + ball._radius;

    if (ballLeft < ball._radius + GameField.WIDTH_BORDER_GAMES_FIELD) {
      ball.setDirectionX(Direction.RIGHT);
      ball._x = ball._radius + GameField.WIDTH_BORDER_GAMES_FIELD;
    } else if (ballRight >= GameField.WIDTH_CANVAS - GameField.WIDTH_BORDER_GAMES_FIELD) {
      ball.setDirectionX(Direction.LEFT);
      ball._x = GameField.WIDTH_CANVAS - ball._radius - GameField.WIDTH_BORDER_GAMES_FIELD;
    }

    const ballUp = ball._y;
    const ballDown = ball._y + ball._radius - GameField.WIDTH_BORDER_GAMES_FIELD;

    if (ballUp < ball._radius + GameField.WIDTH_BORDER_GAMES_FIELD) {
      ball.setDirectionY(Direction.DOWN);
      ball._y = ball._radius + GameField.WIDTH_BORDER_GAMES_FIELD;
    } else if (ballDown >= GameField.HEIGHT_CANVAS) {
      ball.setDirectionY(Direction.UP);
      ball.setDirectionX(Direction.LEFT);
      platform.installCoordinates(ball);
    }
  }

  export function ballAndPlatform(ball: Ball, platform: Platform) {
    const coordXBall = ball._x + ball._radius;
    const coordYBall = ball._y + ball._radius;
    const coordXPlatform = platform._x + platform._length;
    const coordYPlatform = platform._y + platform._height;

    if (coordXBall >= platform._x && coordXBall <= coordXPlatform && coordYBall >= platform._y && coordYBall < coordYPlatform) {
      ball.setDirectionY(Direction.UP);
    }
  }

  export function ballAndBrick(ball: Ball, brick: Brick) {
    const coordX = ball._x + ball._radius;
    const coordY = ball._y + ball._radius;
    const coordX2 = ball._x - ball._radius;
    const coordY2 = ball._y - ball._radius;

    if (!brick._isBroken) {
      if (coordX >= brick._x && coordX2 <= brick._x + Brick._WIDTH) {
        if (ball._directionX === Direction.RIGHT) {
          if (ball._directionY === Direction.DOWN) {
            if (coordY >= brick._y && coordY <= brick._y && coordX >= brick._x && coordX <= brick._x) {
              ball.setDirectionX(Direction.LEFT);
              ball.setDirectionY(Direction.UP);
              brick._isBroken = true;
            } else if (coordY >= brick._y && coordY <= brick._y) {
              ball.setDirectionY(Direction.UP);
              brick._isBroken = true;
            } else if (ball._y > brick._y && ball._y <= brick._y + Brick._HEIGHT) {
              ball.setDirectionX(Direction.LEFT);
              ball.setDirectionY(Direction.DOWN);
              brick._isBroken = true;
            }
          } else if (ball._directionY === Direction.UP) {
            if (coordY2 >= brick._y && coordY2 <= brick._y && coordX >= brick._x && coordX <= brick._x) {
              ball.setDirectionX(Direction.LEFT);
              ball.setDirectionY(Direction.DOWN);
              brick._isBroken = true;
            } else if (coordY2 >= brick._y && coordY2 <= brick._y) {
              ball.setDirectionY(Direction.DOWN);
              brick._isBroken = true;
            } else if (ball._y > brick._y && ball._y <= brick._y + Brick._HEIGHT) {
              ball.setDirectionX(Direction.RIGHT);
              ball.setDirectionY(Direction.DOWN);
              brick._isBroken = true;
            }
          }
        } else if (ball._directionX === Direction.LEFT) {
          if (ball._directionY === Direction.DOWN) {
            if (coordY >= brick._y && coordY <= brick._y && coordX2 >= brick._x && coordX2 <= brick._x) {
              ball.setDirectionX(Direction.RIGHT);
              ball.setDirectionY(Direction.UP);
              brick._isBroken = true;
            } else if (coordY >= brick._y && coordY <= brick._y) {
              ball.setDirectionY(Direction.UP);
              brick._isBroken = true;
            } else if (ball._y > brick._y && ball._y <= brick._y + Brick._HEIGHT) {
              ball.setDirectionX(Direction.RIGHT);
              ball.setDirectionY(Direction.DOWN);
              brick._isBroken = true;
            }
          } else if (ball._directionY === Direction.UP) {
            if (coordY2 >= brick._y && coordY2 <= brick._y && coordX >= brick._x && coordX <= brick._x) {
              ball.setDirectionX(Direction.RIGHT);
              ball.setDirectionY(Direction.DOWN);
              brick._isBroken = true;
            } else if (coordY2 >= brick._y && coordY2 <= brick._y) {
              ball.setDirectionY(Direction.DOWN);
              brick._isBroken = true;
            } else if (ball._y > brick._y && ball._y <= brick._y + Brick._HEIGHT) {
              ball.setDirectionX(Direction.LEFT);
              ball.setDirectionY(Direction.DOWN);
              brick._isBroken = true;
            }
          }
        }
      }
    }
  }
}