export class Brick {
  public _x: number;
  public _y: number;
  private _color: string;
  public _isBroken: boolean;
  public static _WIDTH: number = 50;
  public static _HEIGHT: number = 20;

 constructor(x: number, y: number, color: string) {
   this._x = x;
   this._y = y;
   this._color = color;
   this._isBroken = false;
 }

 draw(context) {
   context.beginPath();
   context.fillStyle = this._color;
   context.strokeStyle = "#000000";
   context.lineWidth = 1;
   context.fillRect(this._x, this._y, Brick._WIDTH, Brick._HEIGHT);
   context.strokeRect(this._x, this._y, Brick._WIDTH, Brick._HEIGHT);
   context.closePath();
 }
}
