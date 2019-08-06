import Storage from "@/utils/Storage";
import _Ws from "@/utils/ws";

import Tank from "./Tank";
import EnemyTank from "./EnemyTank";
import Bullet from "./Bullet";

let WS = new _Ws();

let Game = function(p5) {
  this.p5 = p5;

  this.EDGE_MIN = 40;
  this.tank = null;
  this.enemyTank = [];
  this.enemyTankBullets = {};
  this.score = 0;
  this.heart;
  this.lives;
  this.start = true;

  this.p5init();
  this.ws();
};

Game.prototype.ws = function() {
  let that = this;
  WS.init("ws://192.168.5.222:8090/ws/game?token=" + Storage.get("token"), {
    Open: function() {},
    Receive: function(data) {
      if (data.type == "playJoin") {
        for (let key in data.data) {
          let _data = data.data[key];
          if (key == Storage.get("uid")) {
            that.tank = new Tank();
            that.tank.setLocation(parseInt(_data.x), parseInt(_data.y));
            that.tank.setDirection(_data.direction);
          }

          if (key != Storage.get("uid")) {
            let enemy = new EnemyTank(
              that.EDGE_MIN,
              that.p5.width - that.EDGE_MIN,
              that.p5.height - that.EDGE_MIN
            );
            enemy.uid = key;
            enemy.setLocation(parseInt(_data.x), parseInt(_data.y));
            enemy.setDirection(_data.direction);
            that.enemyTank.push(enemy);
            console.log(enemy);
            enemy.initBullets();
          }
        }
      }

      // console.log(data);
      // console.log(data.type == "pos" || data.uid != Storage.get("uid"));

      if (data.type == "pos") {
        for (let i = 0; i <= that.enemyTank.length; i++) {
          if (that.enemyTank[i] != undefined) {
            if (that.enemyTank[i].uid == data.uid) {
              that.enemyTank[i].x = data.x;
              that.enemyTank[i].y = data.y;
              that.enemyTank[i].direction = data.direction;
            }
          }
        }
      }

      if (data.type == "bullets") {
        // console.log(data.bullets);
        let v = data.bullets;
        if (v.uid != Storage.get("uid")) {
          if (that.enemyTankBullets[v.index]) {
            //有值
            that.enemyTankBullets[v.index].setLocation(v.x, v.y);
            that.enemyTankBullets[v.index].setDirection(v.direction);
          } else {
            //无值
            that.enemyTankBullets[v.index] = new Bullet(v.x, v.y, v.direction);
          }
        }
      }
    },
    Error: function() {
      console.log("出现error");
    },
    Close: function() {
      console.log("出现close");
    }
  });
};
Game.prototype.p5init = function() {
  let that = this;
  this.p5.preload = function() {
    that.preload();
  };
  this.p5.setup = function() {
    that.setup();
  };
  this.p5.draw = function() {
    that.draw();
  };
  this.p5.keyPressed = function() {
    that.keyPressed();
  };
};
Game.prototype.preload = function() {
  this.heart = this.p5.loadImage(require("./heart.png"));
};
Game.prototype.setup = function() {
  this.lives = 3;
  this.p5.createCanvas(590, 546);
  this.p5.background(224);
  this.p5.fill(255, 204, 0);
};

Game.prototype.draw = function() {
  if (this.start) {
    this.p5.background(224);

    //子弹的渲染
    if (Object.keys(this.enemyTankBullets).length > 0) {
      console.log("子弹的渲染");
      for (let key in this.enemyTankBullets) {
        this.enemyTankBullets[key].render(this.p5);
        this.enemyTankBullets[key].update(this.p5);

        if (
          this.enemyTankBullets[key].x <= 0 ||
          this.enemyTankBullets[key].y <= 0 ||
          this.enemyTankBullets[key].x >= this.p5.width ||
          this.enemyTankBullets[key].y >= this.p5.height
        ) {
          delete this.enemyTankBullets[key];
        }
      }
    }

    // 控制tank的方向
    this.controlTankDirection();
    if (this.tank) {
      this.tank.render(this.p5);
    }
    // render enemytank
    for (let i = 0; i < this.enemyTank.length; i++) {
      // this.enemyTank[i].bulletsRender(this.p5);
      this.enemyTank[i].autoMove(this.p5);
    }
    // this.showScore();
    this.showlives();

    if (this.tank) {
      this.enemyTankGetShoted();
      this.tankGetScore();
      this.tankGetShoted();
    }

    // enemyTanksgetCollisioned();
  } else {
    this.p5.clear();
    this.p5.textSize(36);
    this.p5.text(
      "你的得分: " + this.score,
      this.p5.width / 2,
      this.p5.height / 2
    );
  }
};
Game.prototype.keyPressed = function() {
  if (this.p5.keyCode === 32) {
    if (!this.tank.bullet) {
      this.tank.slotBullet();
    }
  }
};

//发送位置
Game.prototype.sendPos = function() {
  WS.send({
    type: "pos",
    user: Storage.get("name"),
    uid: Storage.get("uid"),
    x: this.tank.x.toString(),
    y: this.tank.y.toString(),
    direction: this.tank.direction.toString()
  });
};

//发送子弹位置
Game.prototype.sendBulletPos = function(bullets) {
  let uid = Storage.get("uid"); //"1234567"; //
  let values = {
    uid: uid,
    index: bullets._index,
    x: bullets.x.toString(),
    y: bullets.y.toString(),
    direction: bullets.direction.toString()
  };
  WS.send({
    type: "bullets",
    bullets: values
  });
};

Game.prototype.controlTankDirection = function() {
  let that = this;
  if (this.p5.keyIsDown(this.p5.LEFT_ARROW)) {
    that.tank.goLeft(this.p5);
    that.sendPos();
  }
  if (this.p5.keyIsDown(this.p5.UP_ARROW)) {
    that.tank.goUp(this.p5);
    that.sendPos();
  }
  if (this.p5.keyIsDown(this.p5.DOWN_ARROW)) {
    that.tank.goDown(this.p5);
    that.sendPos();
  }
  if (this.p5.keyIsDown(this.p5.RIGHT_ARROW)) {
    that.tank.goRight(this.p5);
    that.sendPos();
  }
};

Game.prototype.showScore = function() {
  this.p5.textSize(24);
  this.p5.fill("red");
  this.p5.text("分数: " + this.score, 30, 50);
};

Game.prototype.showlives = function() {
  switch (this.lives) {
    case 3:
      this.p5.image(this.heart, 10, 10);
      this.p5.image(this.heart, 50, 10);
      this.p5.image(this.heart, 90, 10);
      break;
    case 2:
      this.p5.image(this.heart, 50, 10);
      this.p5.image(this.heart, 90, 10);
      break;
    case 1:
      this.p5.image(this.heart, 90, 10);
      break;
    case 0:
      // this.start = false;
      break;
  }
};

Game.prototype.enemyTankGetShoted = function() {
  // 判断子弹击中enemyTank
  if (this.tank.bullet) {
    for (let j = 0; j < this.enemyTank.length; j++) {
      if (
        this.tank.bullet.checkShot(
          this.enemyTank[j].x,
          this.enemyTank[j].y,
          this.tank.tankWidth / 2,
          this.p5
        )
      ) {
        this.score++;
        this.enemyTank.splice(j, 1);
      }
    }
  }
};

Game.prototype.tankGetScore = function() {
  if (this.tank.bullet) {
    this.sendBulletPos(this.tank.bullet);
    if (
      this.tank.bullet.x <= 0 ||
      this.tank.bullet.y <= 0 ||
      this.tank.bullet.x >= this.p5.width ||
      this.tank.bullet.y >= this.p5.height
    ) {
      this.tank.bullet = null;
    }
  }
};
Game.prototype.tankGetShoted = function() {
  // 判断tank是否被击中
  for (let i = this.enemyTank.length - 1; i >= 0; i--) {
    if (
      this.p5.dist(
        this.enemyTank[i].bullet.x,
        this.enemyTank[i].bullet.y,
        this.tank.x,
        this.tank.y
      ) <=
      this.tank.tankWidth / 2
    ) {
      // this.lives--;
      this.enemyTank[i].bullet.init(
        this.enemyTank[i].x,
        this.enemyTank[i].y,
        this.enemyTank[i].direction
      );
    }
  }
};
Game.prototype.enemyTanksgetCollisioned = function() {
  for (let i = 0, len = this.enemyTank.length; i < len; i++) {
    for (let j = i + 1; j < len; j++) {
      if (
        this.enemyTank[i].checkCollision(
          this.enemyTank[j].x,
          this.enemyTank[j].y,
          this.p5
        )
      ) {
        this.enemyTank[i].changeDirctionWhenCollision();
      }
    }
  }
};

export default function(p) {
  return new Game(p);
}
