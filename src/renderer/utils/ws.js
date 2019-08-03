let WS = function() {
  //socket
  this.socket = null;
  //
  this.setIntervalWsPush = false;
  //消息队列
  this.socketMsgQueue = [];
};

//创建socket
WS.prototype.init = function(url, options) {
  if (!this.socket) {
    console.log("建立websocket连接");
    this.socket = new WebSocket(url);
    this.socket.onopen = () => {
      console.log("SOCKET连接成功");
      //发送心跳
      // this.ping();

      //发送队列里的消息
      for (var i = 0; i < this.socketMsgQueue.length; i++) {
        this.send(this.socketMsgQueue[i]);
      }
      //清空队列
      this.socketMsgQueue = [];

      if (options.Open) {
        options.Open();
      }
    };
    this.socket.onmessage = msg => {
      if (options.Receive) {
        options.Receive(JSON.parse(msg.data));
      }
    };
    this.socket.onerror = () => {
      this.errorWs();
      if (options.Error) {
        options.Error();
      }
    };
    this.socket.onclose = () => {
      this.closeWs();
      if (options.Close) {
        options.Close();
      }
    };
  } else {
    console.log("websocket已连接");
  }
};

//ping 心跳检测
WS.prototype.ping = function() {
  this.socket.send("ping");
  //5s发送一次
  this.setIntervalWsPush = setInterval(() => {
    this.socket.send("ping");
  }, 5000);
};

//发送数据
WS.prototype.send = function(data) {
  if (this.socket !== null && this.socket.readyState === 3) {
    //socket关闭
    this.socket.close();
    //重连
    this.createSocket();
    //放入队列
    this.socketMsgQueue.push(data);
  }
  //延迟发送
  if (this.socket.readyState === 0) {
    setTimeout(() => {
      this.socket.send(JSON.stringify(data));
    }, 3000);
  }
  //send
  if (this.socket.readyState === 1) {
    this.socket.send(JSON.stringify(data));
  }
};

//关闭ws
WS.prototype.closeWs = function() {
  clearInterval(this.setIntervalWsPush);
  console.log("websocket已断开");
};

//连接失败重连
WS.prototype.errorWs = function() {
  clearInterval(this.setIntervalWsPush);
  this.socket.close();
  this.createSocket();
  console.log("连接失败重连");
};

export default WS;
