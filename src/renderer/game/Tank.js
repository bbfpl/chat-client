import Bullet from "./Bullet";
import Direction from "./Direction";
import Tool from "./Tool";
//坦克类

let Tank = function() {
  this.uid = "";
  this.playName = "坦克大侠";
  this.playNamePos = {
    x: 0,
    y: 0
  };
  this.tankWidth = 30;
  this.tankHeight = 30;

  this.gunturretWidth = 15;
  this.gunturretHeight = 15;

  this.cannonHeight = 15;
  this.cannonDiameter = 4;

  // tank的圆角
  this.borderRadius = 8;
  this.slotBulletFlag = true;
  this.margin = 5;
  // tank的重心坐标
  this.x = 0;
  this.y = 0;

  //往上
  this.direction = 0;
  this.directionName = "up";

  this.speed = 2;

  this.bullets = [];
  this.blood = 3;

  //血量
  this.heart = 9;
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

Tank.prototype.move = function(type, p) {
  this.directionName = type;
  if (type == "left") {
    this.goLeft(p);
  } else if (type == "right") {
    this.goRight(p);
  } else if (type == "up") {
    this.goUp(p);
  } else {
    this.goDown(p);
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
  this.bullets.push(new Bullet(this.x,this.y,this.direction));
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
  for(let i = 0; i < this.bullets.length; i++){
    this.bullets[i].render(p);
    this.bullets[i].update(p);
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

  //血量
  // p.fill(219,112,147);
  // p.rect(
  //   -this.tankWidth / 2,
  //   this.gunturretHeight,
  //   this.tankWidth,
  //   5
  // );

  p.pop();

  this.showName(p);
};
Tank.prototype.showName = function(p) {
  if (this.directionName == "up") {
    this.playNamePos.x = this.x - 18;
    this.playNamePos.y = this.y + 40;
  } else if (this.directionName == "down") {
    this.playNamePos.x = this.x - 18;
    this.playNamePos.y = this.y - 30;
  } else if (this.directionName == "left") {
    this.playNamePos.x = this.x - 18;
    this.playNamePos.y = this.y - 30;
  } else {
    this.playNamePos.x = this.x - 18;
    this.playNamePos.y = this.y - 30;
  }
  
  p.textSize(12);
  p.fill(30, 144, 255);
  p.text(
    Tool.setString(this.playName, 4) + "[" + this.heart + "]",
    this.playNamePos.x,
    this.playNamePos.y
  );
};

export default Tank;
