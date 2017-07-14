import {Ball} from "./Ball";
import {Direction} from "../direction";
import {GameField} from "./GameField";

export class Platform {
  public _x: number;
  public _y: number;
  public _height: number;
  public _directionPlatform: Direction;
  public _length: number;

  constructor() {
    this._length = 100;
  }

  draw(context: CanvasRenderingContext2D) {
    this._height = 20;
    const radiusSemicircle = this._height / 2;
    context.beginPath();
    context.fillStyle = "#3ac40f";
    context.strokeStyle = "#ffffff";
    context.lineWidth = 3;
    context.arc(this._x + radiusSemicircle, this._y + radiusSemicircle, radiusSemicircle, 0.5 * Math.PI, 1.5 * Math.PI);
    context.moveTo(this._x + radiusSemicircle, this._y);
    context.lineTo(this._x + this._length - radiusSemicircle, this._y);
    context.arc(this._x + this._length - radiusSemicircle, this._y + radiusSemicircle, radiusSemicircle, 1.5 * Math.PI, 2.5 * Math.PI);
    context.lineTo(this._x + radiusSemicircle, this._y + this._height);
    context.stroke();
    context.fill();
    context.closePath();
  }

  move(ball: Ball, deltaTime: number) {
    const STEP: number = 500;
    const DELTA_MOVE: number = STEP * deltaTime / 1000;
    const MAX_POSITION: number = GameField.WIDTH_CANVAS - this._length - GameField.WIDTH_BORDER_GAMES_FIELD;
    const MIN_POSITION: number = GameField.WIDTH_BORDER_GAMES_FIELD;
    if (this._directionPlatform === Direction.RIGHT) {
      this._x += DELTA_MOVE;
      if (this._x > MAX_POSITION) {
        this._x = MAX_POSITION;
      }
    } else if (this._directionPlatform === Direction.LEFT) {
      this._x -= DELTA_MOVE;
      if (this._x < MIN_POSITION) {
        this._x = MIN_POSITION;
      }
    }
    if  (!ball._isFlying) {
      ball._x = this._x + this._length / 2;
    }
    this._directionPlatform = Direction.Close;
  }

  installCoordinates(ball: Ball) {
    this._x = GameField.WIDTH_CANVAS / 2 - this._length / 2;
    this._y = GameField.HEIGHT_CANVAS - 100;
    ball._x = GameField.WIDTH_CANVAS / 2;
    ball._y = this._y - ball._radius;
    ball._isFlying = false;
  }
}