import {Direction} from "../direction";

export class Ball {
  public _x: number;
  public _y: number;
  public _isFlying = false;
  public _radius = 10;
  public _directionX: Direction;
  public _directionY: Direction;

  constructor() {
  }

  draw(context: CanvasRenderingContext2D) {
    context.beginPath();
    context.lineWidth = 2;
    context.fillStyle = "#923b13";
    context.strokeStyle = "#cbe307";
    context.arc(this._x, this._y, this._radius, 0, 2 * Math.PI);
    context.fill();
    context.stroke();
    context.closePath();
    context.beginPath();
    const radiusSmallBall: number = 3;
    const xSmallBall: number = this._x + 3;
    const ySmallBall: number = this._y - 3;
    context.fillStyle = "#ffffff";
    context.arc(xSmallBall, ySmallBall, radiusSmallBall, 0, 2 * Math.PI);
    context.fill();
    context.closePath();
  }

  setDirectionX(direction: Direction) {
    this._directionX = direction;
  }

  setDirectionY(direction: Direction) {
    this._directionY = direction;
  }

  move(deltaTime: number) {
    const SPEED: number = 200;
    const DELTA_MOVE: number = SPEED * deltaTime / 1000;
    if (this._isFlying) {
      this._x += (this._directionX === Direction.RIGHT) ? DELTA_MOVE : -DELTA_MOVE;
      this._y += (this._directionY === Direction.DOWN) ? DELTA_MOVE: -DELTA_MOVE;
    }
  }
}