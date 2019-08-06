import Tank from "./Tank";
import Bullet from "./Bullet";
//敌军坦克
let EnemyTank = function(min, x_max, y_max) {
  Tank.call(this);
  this.edge_min = min;
  this.edge_x_max = x_max;
  this.edge_y_max = y_max;
  this.speed = 1;
  this.bullet = "";
  this.bulletsDistance = 60;
  this.bulletsCount = 5;
  this.color = "hsba(160, 100%, 50%, 0.5)";
};

EnemyTank.prototype = new Tank();

EnemyTank.prototype.autoMove = function(p) {
  this.render(p);
};

EnemyTank.prototype.setLocationAndDirection = function(x, y, direction) {
  this.setLocation(x, y);
  this.setDirection(direction);
};

EnemyTank.prototype.isEdges = function() {
  if (
    this.x <= this.edge_min ||
    this.x >= this.edge_x_max ||
    this.y <= this.edge_min ||
    this.y >= this.edge_y_max
  ) {
    return true;
  }
  return false;
};

EnemyTank.prototype.render = function(p) {
  // render bullets
  // for (let i = 0; i < this.bullets.length; i++) {
  //   this.bullets[i].render(p);
  //   this.bullets[i].update(p);
  // }

  p.push();
  // 坦克的body

  p.fill(p.color(this.color));

  p.translate(this.x, this.y);
  p.rotate(this.direction);

  p.rect(
    -this.tankWidth / 2,
    -this.tankHeight / 2,
    this.tankWidth,
    this.tankHeight,
    this.borderRadius
  );
  //坦克的炮台

  p.rect(
    -this.gunturretWidth / 2,
    -this.gunturretHeight / 2,
    this.gunturretWidth,
    this.gunturretHeight,
    this.borderRadius
  );
  // 坦克的大炮
  p.rect(
    -this.cannonDiameter / 2,
    -this.gunturretHeight / 2 - this.cannonHeight,
    this.cannonDiameter,
    this.cannonHeight
  );
  p.pop();
};

EnemyTank.prototype.setColor = function(color) {
  this.color = color;
};

EnemyTank.prototype.changeDirctionWhenCollision = function() {
  this.setDirection(this.direction + Math.PI);
};

EnemyTank.prototype.initBullets = function(dir) {
  this.bullet = new Bullet(this.x, this.y, this.direction);
};

EnemyTank.prototype.bulletsRender = function(p) {
  this.bullet.render(p);
  if (
    this.bullet.x <= 0 ||
    this.bullet.x >= this.edge_x_max ||
    this.bullet.y >= this.edge_y_max ||
    this.bullet.y <= 0
  ) {
    this.bullet.setLocation(this.x, this.y);
    this.bullet.setDirection(this.direction);
  }
  this.bullet.update();
};

export default EnemyTank;
