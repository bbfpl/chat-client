import Bullet from "./Bullet";
import Direction from "./Direction";
//坦克类

let Tank = function() {
  this.uid = "";
  this.tankWidth = 50;
  this.tankHeight = 50;

  this.gunturretWidth = 30;
  this.gunturretHeight = 20;

  this.cannonHeight = 30;
  this.cannonDiameter = 6;

  // tank的圆角
  this.borderRadius = 5;
  this.slotBulletFlag = true;
  this.margin = 5;
  // tank的重心坐标
  this.x = 0;
  this.y = 0;

  this.direction = 0;
  this.speed = 2;

  this.bullet = null;
  this.blood = 3;
};

Tank.prototype.setLocation = function(x, y) {
  this.x = x;
  this.y = y;
};

Tank.prototype.updateCenter = function(x, y) {
  this.x = x;
  this.y = y;
};

Tank.prototype.rotate = function(deg) {
  this.direction = deg;
};

Tank.prototype.setDirection = function(direction) {
  if (this.direction !== direction) {
    this.rotate(direction);
  }
};

Tank.prototype.goLeft = function() {
  this.setDirection(Direction.LEFT);
  this.x -= this.speed;
  if (this.x <= this.tankWidth) {
    this.x = this.tankWidth;
  }
};

Tank.prototype.goRight = function(p) {
  this.setDirection(Direction.RIGHT);
  this.x += this.speed;
  if (this.x >= p.width - this.tankWidth) {
    this.x = p.width - this.tankWidth;
  }
};

Tank.prototype.goUp = function() {
  this.setDirection(Direction.UP);
  this.y -= this.speed;
  if (this.y <= this.tankHeight) {
    this.y = this.tankHeight;
  }
};

Tank.prototype.goDown = function(p) {
  this.setDirection(Direction.DOWN);
  this.y += this.speed;
  if (this.y >= p.height - this.tankHeight) {
    this.y = p.height - this.tankHeight;
  }
};

Tank.prototype.slotBullet = function() {
  this.bullet = new Bullet(this.x, this.y, this.direction);
};

Tank.prototype.checkCollision = function(x, y, p) {
  if (
    p.dist(this.x, this.y, x, y) <=
    Math.sqrt(2 * this.tankWidth * this.tankWidth)
  ) {
    return true;
  }
  return false;
};

Tank.prototype.render = function(p) {
  // render bullets
  if (this.bullet) {
    this.bullet.render(p);
    this.bullet.update(p);
  }

  p.push();
  // 坦克的body
  p.translate(this.x, this.y);
  p.rotate(this.direction);
  p.fill(255, 204, 0);
  p.rect(
    -this.tankWidth / 2,
    -this.tankHeight / 2,
    this.tankWidth,
    this.tankHeight,
    this.borderRadius
  );
  //坦克的炮台
  p.fill(153, 204, 0);
  p.rect(
    -this.gunturretWidth / 2,
    -this.gunturretHeight / 2,
    this.gunturretWidth,
    this.gunturretHeight,
    this.borderRadius
  );
  // 坦克的大炮
  p.fill(255, 255, 255);
  p.rect(
    -this.cannonDiameter / 2,
    -this.gunturretHeight / 2 - this.cannonHeight,
    this.cannonDiameter,
    this.cannonHeight
  );

  p.pop();
};
export default Tank;
