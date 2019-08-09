import Message from "@/components/message";
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
      //玩家加入
      if (data.type == "playJoin") {
        for (let key in data.data) {
          let _data = data.data[key];
          // console.log(_data);
          if (key == Storage.get("uid")) {
            that.tank = new Tank();
            that.tank.playName = _data.user;
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
            enemy.playName = _data.user;
            enemy.setLocation(parseInt(_data.x), parseInt(_data.y));
            enemy.setDirection(_data.direction);
            that.enemyTank.push(enemy);

            enemy.initBullets();
          }
        }
      }

      //中弹复活
      if (data.type == "injured") {
        Message({
          type: "warning",
          text: data.user + "中弹"
        });
        if (data.uid == Storage.get("uid")) {
          that.tank = null;
          setTimeout(() => {
            that.tank = new Tank();
            that.tank.playName = data.user;
            that.tank.heart = data.heart;
            that.tank.setLocation(parseInt(data.x), parseInt(data.y));
            that.tank.setDirection(data.direction);
          }, 1000);
        }

        if (data.uid != Storage.get("uid")) {
          // 先删除
          that.enemyTank.forEach((v, i) => {
            if (v.uid == data.uid) {
              that.enemyTank.splice(i, 1);
            }
          });
          setTimeout(() => {
            // 在添加
            let enemy = new EnemyTank(
              that.EDGE_MIN,
              that.p5.width - that.EDGE_MIN,
              that.p5.height - that.EDGE_MIN
            );
            enemy.uid = data.uid;
            enemy.playName = data.user;
            enemy.heart = data.heart;
            enemy.setLocation(parseInt(data.x), parseInt(data.y));
            enemy.setDirection(data.direction);
            that.enemyTank.push(enemy);
            enemy.initBullets();
          }, 1000);
        }
      }

      //位置变化
      if (data.type == "pos") {
        for (let i = 0; i <= that.enemyTank.length; i++) {
          if (that.enemyTank[i] != undefined) {
            if (that.enemyTank[i].uid == data.uid) {
              // console.log(that.enemyTank[i]);
              that.enemyTank[i].playName = data.user;
              that.enemyTank[i].x = parseInt(data.x);
              that.enemyTank[i].y = parseInt(data.y);
              that.enemyTank[i].direction = data.direction;
            }
          }
        }
      }

      //子弹位置
      if (data.type == "bullets") {
        let _data = data.bullets;
        _data.forEach(v => {
          if (v.uid != Storage.get("uid")) {
            if (that.enemyTankBullets[v.index]) {
              //有值
              that.enemyTankBullets[v.index].setLocation(v.x, v.y);
              that.enemyTankBullets[v.index].setDirection(v.direction);
            } else {
              //无值
              that.enemyTankBullets[v.index] = new Bullet(
                v.x,
                v.y,
                v.direction
              );
            }
          }
        });
        // console.log(that.enemyTankBullets);
      }

      //死掉了
      if (data.type == "gameOver") {
        Message({
          type: "error",
          text: data.user + "已经死掉了，进入观察者模式"
        });
        if (data.uid == Storage.get("uid")) {
          that.tank = null;
        }
        if (data.uid != Storage.get("uid")) {
          // 先删除
          that.enemyTank.forEach((v, i) => {
            if (v.uid == data.uid) {
              that.enemyTank.splice(i, 1);
            }
          });
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
    // 暂无图片加载
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

Game.prototype.setup = function() {
  this.lives = 10;
  this.p5.createCanvas(790, 745);
  this.p5.background(224);
  this.p5.fill(255, 204, 0);
};

Game.prototype.draw = function() {
  if (this.start) {
    this.p5.background(224);

    //子弹的渲染
    if (Object.keys(this.enemyTankBullets).length > 0) {
      // console.log("子弹的渲染");
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

    if (this.tank) {
      // 控制tank的方向
      this.controlTankDirection();
      this.tank.render(this.p5);
    }
    // render enemytank
    for (let i = 0; i < this.enemyTank.length; i++) {
      this.enemyTank[i].render(this.p5);
    }

    if (this.tank) {
      this.enemyTankGetShoted();
      this.tankBullet();
      this.tankGetShoted();
    }
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
    this.tank.slotBullet();
  }
};

Game.prototype.controlTankDirection = function() {
  let that = this;
  if (this.p5.keyIsDown(this.p5.LEFT_ARROW)) {
    that.tank.move("left", this.p5);
    that.sendPos();
  } else if (this.p5.keyIsDown(this.p5.UP_ARROW)) {
    that.tank.move("up", this.p5);
    that.sendPos();
  } else if (this.p5.keyIsDown(this.p5.DOWN_ARROW)) {
    that.tank.move("down", this.p5);
    that.sendPos();
  } else if (this.p5.keyIsDown(this.p5.RIGHT_ARROW)) {
    that.tank.move("right", this.p5);
    that.sendPos();
  } else {
    // console.log("啥都没有");
  }
};

Game.prototype.enemyTankGetShoted = function() {
  // 判断子弹击中enemyTank
  for (let i = 0; i < this.tank.bullets.length; i++) {
    for (let j = 0; j < this.enemyTank.length; j++) {
      let tankuid = this.enemyTank[j].uid;
      if (
        this.tank.bullets[i].checkShot(
          this.enemyTank[j].x,
          this.enemyTank[j].y,
          this.tank.tankWidth / 2,
          this.p5
        )
      ) {
        this.score++;
        // console.log("坦克被击中");
        this.enemyTank.splice(j, 1);

        this.injured(tankuid);
      }
    }
  }
};

Game.prototype.tankBullet = function() {
  for (let i = 0; i < this.tank.bullets.length; i++) {
    this.sendBulletPos(this.tank.bullets);
    if (
      this.tank.bullets[i].x <= 0 ||
      this.tank.bullets[i].y <= 0 ||
      this.tank.bullets[i].x >= this.p5.width ||
      this.tank.bullets[i] <= this.p5.height
    ) {
      this.tank.bullets.splice(i, 1);
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
      this.lives--;
      this.enemyTank[i].bullet.init(
        this.enemyTank[i].x,
        this.enemyTank[i].y,
        this.enemyTank[i].direction
      );
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
  let uid = Storage.get("uid");
  let values = [];
  bullets.forEach(v => {
    values.push({
      uid: uid,
      index: v._index,
      x: v.x.toString(),
      y: v.y.toString(),
      direction: v.direction.toString()
    });
  });

  WS.send({
    type: "bullets",
    bullets: values
  });
};

//受伤减血
Game.prototype.injured = function(uid) {
  WS.send({
    type: "injured",
    uid: uid
  });
};

export default function(p) {
  return new Game(p);
}
