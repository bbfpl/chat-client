import Direction from "./Direction";
import UUID from "./UUID";
//子弹类
let Bullet = function(x, y, direction) {
  this.bulletSize = 4;
  this._index = UUID(20);
  this.x = x;
  this.y = y;
  this.grap = 4;
  this.direction = direction;
  this.power = 1;
  this.isLive = true;
};

Bullet.prototype.render = function(p) {
  p.rect(
    this.x - this.bulletSize / 2,
    this.y - this.bulletSize,
    this.bulletSize,
    this.bulletSize
  );
};

Bullet.prototype.getX = function() {
  return this.x;
};

Bullet.prototype.init = function(x, y, direction) {
  this.setLocation(x, y);
  this.setDirection(direction);
};
Bullet.prototype.setLocation = function(x, y) {
  this.x = x;
  this.y = y;
};

Bullet.prototype.setDirection = function(direction) {
  this.direction = direction;
};

Bullet.prototype.update = function(p) {
  switch (this.direction) {
    case Direction.UP:
      this.y -= this.grap;
      break;
    case Direction.DOWN:
      this.y += this.grap;
      break;
    case Direction.RIGHT:
      this.x += this.grap;
      break;
    case Direction.LEFT:
      this.x -= this.grap;
      break;
    default:
      this.x += this.grap;
  }
};

Bullet.prototype.checkEdges = function(edge_x, edge_y, x, y, direction) {
  if (this.x >= edge_x || this.x <= 0 || this.y >= edge_y || this.y <= 0) {
    this.init(x, y, direction);
  }
};

Bullet.prototype.checkShot = function(x, y, range, p) {
  if (p.dist(this.x, this.y, x, y) <= range) {
    return true;
  }
  return false;
};

export default Bullet;
