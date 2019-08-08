# chat-client
聊天客户端
## 先上图

登录界面

![1](http://demo.uihtml.com/gitimg/chatclient/1.png "1")

登录成功

![2](http://demo.uihtml.com/gitimg/chatclient/2.png "2")

聊天界面

![3](http://demo.uihtml.com/gitimg/chatclient/3.png "3")

游戏界面

![4](http://demo.uihtml.com/gitimg/chatclient/4.png "4")


##使用
electron
vue
websocket

需要后端配合[go-server](https://github.com/bbfpl/go-server "go-server")
登录走普通接口/login ,登录成功后获取token(uid和name构成)
客户端缓存保存uid和name

websocket的onmessage接收数据
根据type的不同做不同的处理
暂时定义了 msg,userJoin,userOut
msg 消息
userJoin 有新用户加入
userOut 用户退出


## 目录：
```javascript
E:.
│  App.vue(略过)
│  config.js(配置文件)
│  main.js(略过)
│
├─assets(静态文件目录)
│  ├─chat
│  │      time.png
│  │
│  ├─games
│  │      tank.png
│  │
│  ├─header
│  │      close.png
│  │      close_hover.png
│  │      goback.png
│  │      min.png
│  │      min_hover.png
│  │      out.png
│  │
│  └─style
│          reset.css
│
├─components(略过)
│  └─message(封装的消息提示组件)
│      │  index.js
│      │
│      └─src
│              index.js
│              message.vue
│
├─game(坦克游戏)
│      Bullet.js(子弹类)
│      Direction.js(方向)
│      EnemyTank.js(敌方坦克类)
│      Game.js(游戏类)
│      main.js(入口)
│      Tank.js(坦克类)
│      Tool.js(工具函数)
│
├─page
│      chat.vue(聊天界面)
│      header.vue(头部)
│      login.vue(登录界面)
│
├─router
│      index.js(略过)
│
├─store(略过)
│  │  index.js
│  │
│  └─modules
│          Counter.js
│          index.js
│
└─utils
        Storage.js(localStorage)
        ws.js(简单封装了一下websocket)
```
