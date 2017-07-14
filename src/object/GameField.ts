export class GameField {
  public static WIDTH_CANVAS = 1500;
  public static HEIGHT_CANVAS = 600;
  public static WIDTH_BORDER_GAMES_FIELD = 25;

  private static drawBorderGamesField(context: CanvasRenderingContext2D) {
    const x = 0;
    const y = 0;
    context.beginPath();
    context.fillStyle = "#484848";
    context.moveTo(x, y);
    context.lineTo(x, y + GameField.HEIGHT_CANVAS);
    context.lineTo(x + GameField.WIDTH_BORDER_GAMES_FIELD, y + GameField.HEIGHT_CANVAS);
    context.lineTo(x + GameField.WIDTH_BORDER_GAMES_FIELD, y + GameField.WIDTH_BORDER_GAMES_FIELD);
    context.lineTo(x + GameField.WIDTH_CANVAS - GameField.WIDTH_BORDER_GAMES_FIELD, y + GameField.WIDTH_BORDER_GAMES_FIELD);
    context.lineTo(x + GameField.WIDTH_CANVAS - GameField.WIDTH_BORDER_GAMES_FIELD, y + GameField.HEIGHT_CANVAS);
    context.lineTo(x + GameField.WIDTH_CANVAS, y + GameField.HEIGHT_CANVAS);
    context.lineTo(x + GameField.WIDTH_CANVAS, y);
    context.lineTo(x, y);
    context.fill();
    context.closePath();
  }

  public static draw(canvasContext: CanvasRenderingContext2D) {
    canvasContext.clearRect(0, 0, GameField.WIDTH_CANVAS, GameField.HEIGHT_CANVAS);
    GameField.drawBorderGamesField(canvasContext);
  }
}