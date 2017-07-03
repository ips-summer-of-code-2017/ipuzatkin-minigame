'use strict';

const WIDTH_CANVAS = 1500;
const HEIGHT_CANVAS = 600;
const WIDTH_BORDER_GAMES_FIELD = 25;
const DIRECTION = {
  UP: "direction_up",
  LEFT: "direction_left",
  RIGHT:"direction_right",
  DOWN: "direction_down",
};
const LENGTH_PLATFORM = 100;
const INITIAL_POSITION_BALL_X = WIDTH_CANVAS / 2;
const INITIAL_POSITION_BALL_Y = 505;
const INITIAL_POSITION_PLATFORM_X = INITIAL_POSITION_BALL_X - LENGTH_PLATFORM / 2;
const INITIAL_POSITION_PLATFORM_Y = 515;
const INITIAL_LEVEL_GAME = 0;

class Ball {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.isFlying = false;
  }

  draw(context) {
    this.radius = 10;
    context.beginPath();
    context.lineWidth = 2;
    context.fillStyle = "#923b13";
    context.strokeStyle = "#cbe307";
    context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    context.fill();
    context.stroke();
    context.closePath();
    context.beginPath();
    const radiusSmallBall = 3;
    const xSmallBall = this.x + 3;
    const ySmallBall = this.y - 3;
    context.fillStyle = "#ffffff";
    context.arc(xSmallBall, ySmallBall, radiusSmallBall, 0, 2 * Math.PI);
    context.fill();
    context.closePath();
  }

  setDirectionX(direction) {
    this.directionX = direction;
  }

  setDirectionY(direction) {
    this.directionY = direction;
  }

  move(deltaTime) {
    const SPEED = 200;
    const DELTA_MOVE = SPEED * deltaTime / 1000;
    if (this.isFlying) {
      this.x += (this.directionX === DIRECTION.RIGHT) ? DELTA_MOVE : -DELTA_MOVE;
      this.y += (this.directionY === DIRECTION.DOWN) ? DELTA_MOVE : -DELTA_MOVE;
    }
  }
}


class Platform {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  draw(context) {
    this.height = 20;
    const radiusSemicircle = this.height / 2;
    context.beginPath();
    context.fillStyle = "#3ac40f";
    context.strokeStyle = "#ffffff";
    context.lineWidth = 3;
    context.arc(this.x + radiusSemicircle, this.y + radiusSemicircle, radiusSemicircle, 0.5 * Math.PI, 1.5 * Math.PI);
    context.moveTo(this.x + radiusSemicircle, this.y);
    context.lineTo(this.x + LENGTH_PLATFORM - radiusSemicircle, this.y);
    context.arc(this.x + LENGTH_PLATFORM - radiusSemicircle, this.y + radiusSemicircle, radiusSemicircle, 1.5 * Math.PI, 2.5 * Math.PI);
    context.lineTo(this.x + radiusSemicircle, this.y + this.height);
    context.stroke();
    context.fill();
    context.closePath();
  }

  move(ball, deltaTime) {
    const STEP = 500;
    const DELTA_MOVE = STEP * deltaTime / 1000;
    const MAX_POSITION = WIDTH_CANVAS - LENGTH_PLATFORM - WIDTH_BORDER_GAMES_FIELD;
    const MIN_POSITION = WIDTH_BORDER_GAMES_FIELD;
    if (this.directionPlatform === DIRECTION.RIGHT) {
      this.x += DELTA_MOVE;
      if (this.x > MAX_POSITION) {
        this.x = MAX_POSITION;
      }
    } else if (this.directionPlatform === DIRECTION.LEFT) {
      this.x -= DELTA_MOVE;
      if (this.x < MIN_POSITION) {
        this.x = MIN_POSITION;
      }
    }
    if  (!ball.isFlying) {
      ball.x = this.x + LENGTH_PLATFORM / 2;
    }
    this.directionPlatform = "";
  }
}

class Brick {
  constructor(x, y, colorBrick) {
    this.x = x;
    this.y = y;
    this.colorBrick = colorBrick;
    this.isBroken = false;
  }

  draw(context) {
    context.beginPath();
    context.fillStyle = this.colorBrick;
    context.strokeStyle = "#000000";
    context.lineWidth = 1;
    context.fillRect(this.x, this.y, Brick.WIDTH, Brick.HEIGHT);
    context.strokeRect(this.x, this.y, Brick.WIDTH, Brick.HEIGHT);
    context.closePath();
  }
}
Brick.WIDTH = 50;
Brick.HEIGHT = 20;

const gameContext = {
  ball: new Ball(INITIAL_POSITION_BALL_X, INITIAL_POSITION_BALL_Y),

  platform: new Platform(INITIAL_POSITION_PLATFORM_X, INITIAL_POSITION_PLATFORM_Y),

  bricks: [],

  keyMap: {
    KEY_LEFT: false,
    KEY_RIGHT: false,
    KEY_SPACE: false,
  },

  lastTimeFrame: Date.now(),
  currentLevel: INITIAL_LEVEL_GAME,
};

function processDraw(canvasContext, gameContext) {
  canvasContext.clearRect(0, 0, WIDTH_CANVAS, HEIGHT_CANVAS);
  drawBorderGamesField(canvasContext);
  gameContext.ball.draw(canvasContext);
  gameContext.platform.draw(canvasContext);
  for (const brick of gameContext.bricks) {
    if (!brick.isBroken){
      brick.draw(canvasContext);
    }
  }
}

function processGamePhysics(gameContext, deltaTime) {
  collisionBallAndBorder(gameContext.ball, gameContext.platform);
  collisionBallAndPlatform(gameContext.ball, gameContext.platform);
  for (const brick of gameContext.bricks) {
    collisionBallAndBrick(gameContext.ball, brick);
  }

  gameContext.ball.move(deltaTime);
  gameContext.platform.move(gameContext.ball, deltaTime);
}

function isLevelOver(gameContext) {
  for (const brick of gameContext.bricks) {
    if (!brick.isBroken) {
      return false
    }
  }
  return true;
}

function createGameLevel1() {
  return [
    new Brick(725, 250, "#3fab12"),
    new Brick(700, 230, "#3fab12"),
    new Brick(750, 230, "#3fab12"),
    new Brick(675, 210, "#3fab12"),
    new Brick(725, 210, "#3fab12"),
    new Brick(775, 210, "#3fab12"),
    new Brick(650, 190, "#3fab12"),
    new Brick(700, 190, "#3fab12"),
    new Brick(750, 190, "#3fab12"),
    new Brick(800, 190, "#3fab12"),
    new Brick(625, 170, "#3fab12"),
    new Brick(675, 170, "#3fab12"),
    new Brick(725, 170, "#3fab12"),
    new Brick(775, 170, "#3fab12"),
    new Brick(825, 170, "#3fab12"),
    new Brick(600, 150, "#3fab12"),
    new Brick(650, 150, "#3fab12"),
    new Brick(700, 150, "#3fab12"),
    new Brick(750, 150, "#3fab12"),
    new Brick(800, 150, "#3fab12"),
    new Brick(850, 150, "#3fab12"),
    new Brick(575, 130, "#3fab12"),
    new Brick(625, 130, "#3fab12"),
    new Brick(675, 130, "#3fab12"),
    new Brick(725, 130, "#3fab12"),
    new Brick(775, 130, "#3fab12"),
    new Brick(825, 130, "#3fab12"),
    new Brick(875, 130, "#3fab12"),
    new Brick(550, 110, "#3fab12"),
    new Brick(600, 110, "#3fab12"),
    new Brick(650, 110, "#3fab12"),
    new Brick(700, 110, "#3fab12"),
    new Brick(750, 110, "#3fab12"),
    new Brick(800, 110, "#3fab12"),
    new Brick(850, 110, "#3fab12"),
    new Brick(900, 110, "#3fab12"),
    new Brick(525, 90, "#3fab12"),
    new Brick(575, 90, "#3fab12"),
    new Brick(625, 90, "#3fab12"),
    new Brick(675, 90, "#3fab12"),
    new Brick(725, 90, "#3fab12"),
    new Brick(775, 90, "#3fab12"),
    new Brick(825, 90, "#3fab12"),
    new Brick(875, 90, "#3fab12"),
    new Brick(925, 90, "#3fab12"),
    new Brick(25, 90, "#3fab12"),
    new Brick(25, 110, "#3fab12"),
    new Brick(25, 130, "#3fab12"),
    new Brick(25, 150, "#3fab12"),
    new Brick(25, 170, "#3fab12"),
    new Brick(25, 190, "#3fab12"),
    new Brick(25, 210, "#3fab12"),
    new Brick(25, 230, "#3fab12"),
    new Brick(25, 250, "#3fab12"),
    new Brick(75, 230, "#3fab12"),
    new Brick(75, 210, "#3fab12"),
    new Brick(75, 190, "#3fab12"),
    new Brick(75, 170, "#3fab12"),
    new Brick(75, 150, "#3fab12"),
    new Brick(75, 130, "#3fab12"),
    new Brick(75, 110, "#3fab12"),
    new Brick(125, 130, "#3fab12"),
    new Brick(125, 150, "#3fab12"),
    new Brick(125, 170, "#3fab12"),
    new Brick(125, 190, "#3fab12"),
    new Brick(125, 210, "#3fab12"),
    new Brick(175, 190, "#3fab12"),
    new Brick(175, 170, "#3fab12"),
    new Brick(175, 150, "#3fab12"),
    new Brick(225, 170, "#3fab12"),
    new Brick(1425, 90, "#3fab12"),
    new Brick(1425, 110, "#3fab12"),
    new Brick(1425, 130, "#3fab12"),
    new Brick(1425, 150, "#3fab12"),
    new Brick(1425, 170, "#3fab12"),
    new Brick(1425, 190, "#3fab12"),
    new Brick(1425, 210, "#3fab12"),
    new Brick(1425, 230, "#3fab12"),
    new Brick(1425, 250, "#3fab12"),
    new Brick(1375, 230, "#3fab12"),
    new Brick(1375, 210, "#3fab12"),
    new Brick(1375, 190, "#3fab12"),
    new Brick(1375, 170, "#3fab12"),
    new Brick(1375, 150, "#3fab12"),
    new Brick(1375, 130, "#3fab12"),
    new Brick(1375, 110, "#3fab12"),
    new Brick(1325, 130, "#3fab12"),
    new Brick(1325, 150, "#3fab12"),
    new Brick(1325, 170, "#3fab12"),
    new Brick(1325, 190, "#3fab12"),
    new Brick(1325, 210, "#3fab12"),
    new Brick(1275, 190, "#3fab12"),
    new Brick(1275, 170, "#3fab12"),
    new Brick(1275, 150, "#3fab12"),
    new Brick(1225, 170, "#3fab12"),
  ]
}

function createGameLevel2() {
  return [
    new Brick(450, 150, "#ab0b0c"),
    new Brick(450, 170, "#ab0b0c"),
    new Brick(450, 190, "#ab0b0c"),
    new Brick(450, 210, "#ab0b0c"),
    new Brick(450, 230, "#ab0b0c"),
    new Brick(450, 250, "#ab0b0c"),
    new Brick(450, 270, "#ab0b0c"),
    new Brick(450, 290, "#ab0b0c"),
    new Brick(400, 170, "#0d1dab"),
    new Brick(400, 190, "#0d1dab"),
    new Brick(400, 210, "#0d1dab"),
    new Brick(400, 230, "#0d1dab"),
    new Brick(400, 250, "#0d1dab"),
    new Brick(400, 270, "#0d1dab"),
    new Brick(350, 190, "#15c400"),
    new Brick(350, 210, "#15c400"),
    new Brick(350, 230, "#15c400"),
    new Brick(350, 250, "#15c400"),
    new Brick(500, 210,"#fffa82"),
    new Brick(500, 230, "#fffa82"),
    new Brick(550, 210, "#fffa82"),
    new Brick(550, 230, "#fffa82"),
    new Brick(600, 210, "#fffa82"),
    new Brick(600, 230, "#fffa82"),
    new Brick(650, 210, "#fffa82"),
    new Brick(650, 230, "#fffa82"),
    new Brick(700, 210, "#fffa82"),
    new Brick(700, 230, "#fffa82"),
    new Brick(750, 210, "#fffa82"),
    new Brick(750, 230, "#fffa82"),
    new Brick(800, 210, "#fffa82"),
    new Brick(800, 230, "#fffa82"),
    new Brick(850, 210, "#fffa82"),
    new Brick(850, 230, "#fffa82"),
    new Brick(900, 210, "#fffa82"),
    new Brick(900, 230, "#fffa82"),
    new Brick(950, 210, "#fffa82"),
    new Brick(950, 230, "#fffa82"),
    new Brick(1000, 210, "#fffa82"),
    new Brick(1000, 230, "#fffa82"),
    new Brick(1050, 150, "#ab0b0c"),
    new Brick(1050, 170, "#ab0b0c"),
    new Brick(1050, 190, "#ab0b0c"),
    new Brick(1050, 210, "#ab0b0c"),
    new Brick(1050, 230, "#ab0b0c"),
    new Brick(1050, 250, "#ab0b0c"),
    new Brick(1050, 270, "#ab0b0c"),
    new Brick(1050, 290, "#ab0b0c"),
    new Brick(1100, 170, "#0d1dab"),
    new Brick(1100, 190, "#0d1dab"),
    new Brick(1100, 210, "#0d1dab"),
    new Brick(1100, 230, "#0d1dab"),
    new Brick(1100, 250, "#0d1dab"),
    new Brick(1100, 270, "#0d1dab"),
    new Brick(1150, 190, "#15c400"),
    new Brick(1150, 210, "#15c400"),
    new Brick(1150, 230, "#15c400"),
    new Brick(1150, 250, "#15c400"),
  ]
}

function createGameLevel(gameContext) {
  gameContext.ball.x = INITIAL_POSITION_BALL_X;
  gameContext.ball.y = INITIAL_POSITION_BALL_Y;
  gameContext.ball.isFlying = false;
  gameContext.platform.x = INITIAL_POSITION_PLATFORM_X;
  gameContext.platform.y = INITIAL_POSITION_PLATFORM_Y;
  gameContext.currentLevel = gameContext.currentLevel % 2 + 1;
  switch (gameContext.currentLevel){
    case 1:
      gameContext.bricks = createGameLevel1();
    break;
    case 2:
      gameContext.bricks = createGameLevel2();
    break;
  }
}

const gameLoop = function(canvasContext, gameContext) {

  if (gameContext.keyMap.KEY_LEFT) {
    gameContext.platform.directionPlatform = DIRECTION.LEFT;
  } else if (gameContext.keyMap.KEY_RIGHT) {
    gameContext.platform.directionPlatform = DIRECTION.RIGHT;
  }
  if (gameContext.keyMap.KEY_SPACE) {
    if (!gameContext.ball.isFlying) {
      gameContext.ball.directionX = DIRECTION.LEFT;
      gameContext.ball.directionY = DIRECTION.UP;
    }
    gameContext.ball.isFlying = true;
  }

  let currentTimeFrame = Date.now();
  let deltaTime = currentTimeFrame - gameContext.lastTimeFrame;
  gameContext.lastTimeFrame = currentTimeFrame;

  processGamePhysics(gameContext, deltaTime);
  if (isLevelOver(gameContext)) {
    createGameLevel(gameContext);
  }
  processDraw(canvasContext, gameContext);
  requestAnimationFrame(function() {
    gameLoop(canvasContext, gameContext);
  });
};


function gameStart(gameContext) {
  const CANVAS = document.getElementById("canvas");
  const context = CANVAS.getContext("2d");

  CANVAS.width = WIDTH_CANVAS;
  CANVAS.height = HEIGHT_CANVAS;

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

gameStart(gameContext);

function drawBorderGamesField(context) {
  const x = 0;
  const y = 0;
  context.beginPath();
  context.fillStyle = "#484848";
  context.moveTo(x, y);
  context.lineTo(x, y + HEIGHT_CANVAS);
  context.lineTo(x + WIDTH_BORDER_GAMES_FIELD, y + HEIGHT_CANVAS);
  context.lineTo(x + WIDTH_BORDER_GAMES_FIELD, y + WIDTH_BORDER_GAMES_FIELD);
  context.lineTo(x + WIDTH_CANVAS - WIDTH_BORDER_GAMES_FIELD, y + WIDTH_BORDER_GAMES_FIELD);
  context.lineTo(x + WIDTH_CANVAS - WIDTH_BORDER_GAMES_FIELD, y + HEIGHT_CANVAS);
  context.lineTo(x + WIDTH_CANVAS, y + HEIGHT_CANVAS);
  context.lineTo(x + WIDTH_CANVAS, y);
  context.lineTo(x, y);
  context.fill();
  context.closePath();
}

function collisionBallAndBorder(ball, platform) {
  const ballLeft = ball.x;
  const ballRight = ball.x + ball.radius;

  if (ballLeft < ball.radius + WIDTH_BORDER_GAMES_FIELD) {
    ball.setDirectionX(DIRECTION.RIGHT);
    ball.x = ball.radius + WIDTH_BORDER_GAMES_FIELD;
  } else if (ballRight >= WIDTH_CANVAS - WIDTH_BORDER_GAMES_FIELD) {
    ball.setDirectionX(DIRECTION.LEFT);
    ball.x = WIDTH_CANVAS - ball.radius - WIDTH_BORDER_GAMES_FIELD;
  }

  const ballUp = ball.y;
  const ballDown = ball.y + ball.radius - WIDTH_BORDER_GAMES_FIELD;

  if (ballUp < ball.radius + WIDTH_BORDER_GAMES_FIELD) {
    ball.setDirectionY(DIRECTION.DOWN);
    ball.y = ball.radius + WIDTH_BORDER_GAMES_FIELD;
  } else if (ballDown >= HEIGHT_CANVAS) {
    ball.setDirectionY(DIRECTION.UP);
    ball.setDirectionX(DIRECTION.LEFT);
    ball.isFlying = false;
    ball.x = INITIAL_POSITION_BALL_X;
    ball.y = INITIAL_POSITION_BALL_Y;
    platform.x = INITIAL_POSITION_PLATFORM_X;
    platform.y = INITIAL_POSITION_PLATFORM_Y;
  }
}

function collisionBallAndPlatform(ball, platform) {
  const coordX = ball.x + ball.radius;
  const coordY = ball.y + ball.radius;

  if (coordX >= platform.x && coordX <= platform.x + LENGTH_PLATFORM && coordY >= INITIAL_POSITION_PLATFORM_Y && coordY < INITIAL_POSITION_PLATFORM_Y + platform.height) {
    ball.setDirectionY(DIRECTION.UP);
  }
}

function collisionBallAndBrick(ball, brick) {
  const coordX = ball.x + ball.radius;
  const coordY = ball.y + ball.radius;
  const coordXbelow = ball.x - ball.radius;
  const coordYbelow = ball.y - ball.radius;

  if (!brick.isBroken) {
    if (coordX >= brick.x && coordXbelow <= brick.x + Brick.WIDTH) {
      if (ball.directionX === DIRECTION.RIGHT) {
        if (ball.directionY === DIRECTION.DOWN) {
          if (coordY >= brick.y && coordY <= brick.y + 5 && coordX >= brick.x && coordX <= brick.x + 3) {
            ball.setDirectionX(DIRECTION.LEFT);
            ball.setDirectionY(DIRECTION.UP);
            brick.isBroken = true;
          } else if (coordY >= brick.y && coordY <= brick.y + 5) {
            ball.setDirectionY(DIRECTION.UP);
            brick.isBroken = true;
          } else if (ball.y > brick.y && ball.y <= brick.y + Brick.HEIGHT) {
            ball.setDirectionX(DIRECTION.LEFT);
            ball.setDirectionY(DIRECTION.DOWN);
            brick.isBroken = true;
          }
        } else if (ball.directionY === DIRECTION.UP) {
          if (coordYbelow >= brick.y && coordYbelow <= brick.y + 5 && coordX >= brick.x && coordX <= brick.x + 3) {
            ball.setDirectionX(DIRECTION.LEFT);
            ball.setDirectionY(DIRECTION.DOWN);
            brick.isBroken = true;
          } else if (coordYbelow >= brick.y && coordYbelow <= brick.y + 5) {
            ball.setDirectionY(DIRECTION.DOWN);
            brick.isBroken = true;
          } else if (ball.y > brick.y && ball.y <= brick.y + Brick.HEIGHT) {
            ball.setDirectionX(DIRECTION.RIGHT);
            ball.setDirectionY(DIRECTION.DOWN);
            brick.isBroken = true;
          }
        }
      } else if (ball.directionX === DIRECTION.LEFT) {
        if (ball.directionY === DIRECTION.DOWN) {
          if (coordY >= brick.y && coordY <= brick.y + 5 && coordXbelow >= brick.x && coordXbelow <= brick.x + 3) {
            ball.setDirectionX(DIRECTION.RIGHT);
            ball.setDirectionY(DIRECTION.UP);
            brick.isBroken = true;
          } else if (coordY >= brick.y && coordY <= brick.y + 5) {
            ball.setDirectionY(DIRECTION.UP);
            brick.isBroken = true;
          } else if (ball.y > brick.y && ball.y <= brick.y + Brick.HEIGHT) {
            ball.setDirectionX(DIRECTION.RIGHT);
            ball.setDirectionY(DIRECTION.DOWN);
            brick.isBroken = true;
          }
        } else if (ball.directionY === DIRECTION.UP) {
          if (coordYbelow >= brick.y && coordYbelow <= brick.y + 5 && coordX >= brick.x && coordX <= brick.x + 3) {
            ball.setDirectionX(DIRECTION.RIGHT);
            ball.setDirectionY(DIRECTION.DOWN);
            brick.isBroken = true;
          } else if (coordYbelow >= brick.y && coordYbelow <= brick.y + 5) {
            ball.setDirectionY(DIRECTION.DOWN);
            brick.isBroken = true;
          } else if (ball.y > brick.y && ball.y <= brick.y + Brick.HEIGHT) {
            ball.setDirectionX(DIRECTION.LEFT);
            ball.setDirectionY(DIRECTION.DOWN);
            brick.isBroken = true;
          }
        }
      }
    }
  }
}