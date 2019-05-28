---
title: 中介者模式
tags: [JavaScript, 设计模式]
categories: [design-pattern]
---
### 定义
中介者模式的作用就是解除对象与对象之间的紧耦合关系，所有对象通过中介者来通信，而不是互相引用，所以当一个对象发生改变时，只需要通知中介者对象即可。
<br>
<center>
![objects image](/objects.png)
<br>
图一
</center>
<br>
<center>
![mediator image](/mediator.png)
<br>
图二
</center>
<br>
图一中对象之间关系复杂，是多对多的关系；使用中介者模式后，将图一中的多对多关系变成了图二的一对多的关系。

### 应用
下面通过一个泡泡糖游戏来介绍中介者模式的应用。
<br>
在刚开始设计游戏的时候，只支持两个玩家同时进行对战。首先定义一个玩家类，他有三个方法win、lose、die，因为玩家的数目是2，所以当其中一个玩家死亡游戏并结束了，同时通知他的对手胜利。于是有下面的代码：
```javascript
class Player {
  construct(name) {
    this.name = name
    this.enemy = null  // 敌人
  }

  win () {
    console.log(`${this.name} won`)
  }

  lose () {
    console.log(`${this.name} lost`)
  }

  die () {
    this.lose()
    this.enemy.win()
  }
}

// 创建两个玩家
const player1 = new Player('蘑菇头')
const player2 = new Player('闰土')

// 给玩家互设敌人
player1.enemy = player2
player2.enemy = player1
```
当玩家player1死亡的时候，只需要调用die方法，并结束了这局游戏：
```javascript
player1.die()  // 蘑菇头 lost，闰土 won
```
两个玩家的游戏没什么意思，满足不了一堆玩家一起玩，于是加了需求，可以组队玩。
<br>
**给游戏增加队伍**
<br>
首先定义一个数组players保存所有玩家，每次创建玩家，循环players给每个玩家添加敌人或者队友，然后给玩家添加队友列表、敌人列表、队伍颜色、玩家状态，所以我们改写Player类：
```javascript
let players = []  // 

class Player {
  construct(name, teamColor) {
    this.name = name
    this.partners = []
    this.enemies = []
    this.state = 'live'
    this.teamColor = teamColor
  }

  win () {
    console.log(`${this.name} won`)
  }

  lose () {
    console.log(`${this.name} lost`)
  }

  die () {
    let all_dead = true
    
    this.state = 'dead'  // 修改玩家的状态

    for (let i = 0, partner; partner = this.partners[i++];) {
      if (partner.state !== 'dead') {
        all_dead = false
        break
      }
    }

    if (all_dead === true) {
      this.lose()

      for (let i = 0, partner; partner = this.partners[i++];) {
        partner.lose()
      }

      for (let i = 0, enemy; enemy = this.enemies[i++];) {
        enemy.win()
      }
    }

  }
}
```
最后定义工厂函数来创建玩家：
```javascript
const playerFactory = function (name, teamColor) {
  const newPlayer = new Player(name, teamColor)
  
  for (let i = 0, player; player = players[i++];) {
    if (player.teamColor === newPlayer.teamColor) {
      player.partners.push(newPlayer)
      newPlayer.partners.push(player)
    } else {
      player.enemies.push(newPlayer)
      newPlayer.enemies.push(player)
    }
  }

  players.push(newPlayer)
  return newPlayer
}
```
创建玩家两队玩家：
```javascript
const player1 = playerFactory('A', 'red')
const player2 = playerFactory('B', 'red')
const player3 = playerFactory('C', 'red')
const player4 = playerFactory('D', 'red')

const player5 = playerFactory('E', 'blue')
const player6 = playerFactory('F', 'blue')
const player7 = playerFactory('G', 'blue')
const player8 = playerFactory('H', 'blue')
```
然后让红队玩家全部死亡:
```javascript
player1.die()  // A lost
player2.die()  // B lost
player3.die()  // C lost
player4.die()  // D lost， E won、 F won、 G won、 H won
```
上面的代码虽然能完成最后我们想要的结果，但是我们可以看到每个玩家之间都是紧密相关的，每个玩家都会有一个partners和enemyies来保存其它玩家的引用，每个玩家死亡或者其它操作，都要显示地通知其它玩家。在上面的例子中，只有8个玩家可能还没有对你产生足够多的困扰。但是在实际当中，每个游戏都有成千上万的玩家，几十支队伍互相厮杀，这时候玩家状态改变，如果通过循环去通知其它玩家，估计游戏随时会崩溃。
<br>
**用中介者模式改造游戏**
<br>
首先还是定义玩家类，只不过在玩家的类方法中，不在负责执行具体的逻辑，而是把操作交给中介者，我们命名中介者为playDirector。看代码：
```javascript
class Player {
  constructor (name, teamColor) {
    this.name = name
    this.teamColor = teamColor
    this.state = 'live'
  }

  win () {
    console.log(`${this.name} won`)
  }

  lose () {
    console.log(`${this.name} lost`)
  }

  die () {
    this.state = 'dead'
    playDirector.receiveMessage('playerDead', this)
  }

  // 移除玩家
  remove () {
    playDirector.receiveMessage('removePlayer', this)
  }

  // 玩家换队
  changeTeam () {
    playDirector.receiveMessage('changeTeam', this)
  }
}
```
改写创建玩家的工厂函数，这个工厂只需要创建玩家，不在需要给玩家设置队友和敌人：
```javascript
const playerFactory = function (name, teamColor) {
  const newPlayer = new Player(name, teamColor)
  playDirector.receiveMessage('addPlayer', newPlayer)

  return newPlayer
}
```
通过前面的代码，我们可以看出，中介者需要暴露一个receiveMessage接口，负责接收player对象发送的消息，然后中介者收到消息后进行处理。下面实现中介者：
```javascript
const playDirector = (function () {
  let players = {},  // 保存所有玩家
    operations = {} // 中介者可以执行的操作

  operations.addPlayer = function (player) {
    const teamColor = player.teamColor
    players[teamColor] = players[teamColor] || []

    players[teamColor].push(player)
  }

  operations.removePlayer = function (player) {
    let teamColor = player.teamColor,
      teamPlayers = players[teamColor] || []
    
    teamPlayers = teamPlayers.filter((item) => {
      return item !== player
    })
  }

  operations.changeTeam = function (player, teamColor) {
    operations.removePlayer(player)
    player.teamColor = teamColor

    operations.addPlayer(player)
  }

  operations.playerDead = function (player) {
    let teamColor = player.teamColor,
      teamPlayers = players[teamColor] || []

    let all_dead = true
    
    this.state = 'dead'  // 修改玩家的状态

    for (let i = 0, player; player = teamPlayers[i++];) {
      if (player.state !== 'dead') {
        all_dead = false
        break
      }
    }

    if (all_dead === true) {

      for (let i = 0, player; player = teamPlayers[i++];) {
        player.lose()
      }

      for (let color in players) {
        if (color !== teamColor) {
          let teamPlayers = players[color]
          for (let i = 0, player; player = teamPlayers[i++];) {
            player.win()
          }
        }
      }
    }
  }

  const receiveMessage = function () {
    const message = arguments[0]
    operations[message].apply(this, Array.prototype.slice.call(arguments, 1))
  }

  return {
    receiveMessage
  }
})()
```
通过添加中介者，玩家与玩家之间的耦合关系已经解除，某个玩家的操作不需要通知其它玩家，而只需要给中介者发送一个消息，中介者处理完消息之后再把结果反馈给其它玩家。
<br>
测试代码：
```javascript
const player1 = playerFactory('A', 'red')
const player2 = playerFactory('B', 'red')
const player3 = playerFactory('C', 'red')
const player4 = playerFactory('D', 'red')

const player5 = playerFactory('E', 'blue')
const player6 = playerFactory('F', 'blue')
const player7 = playerFactory('G', 'blue')
const player8 = playerFactory('H', 'blue')

player1.die()
player2.die()
player3.die()
player4.die()
```
得到结果：
![ result image](/result.png)

### 总结
中介者模式是迪米特法则的一种实现，迪米特法则也叫最少知识原则，是指一个对象应该尽可能少了解其它的对象。如果对象之间耦合性太高。一个对象的变化将会影响其它对象，在中介者模式中，对象之间几乎不知道彼此的存在，它们之间通过中介者来相互影响。
<br>
中介者模式也存在一些缺点，最大的缺点是系统中会新增一个巨大的中介者对象，因为中介者对象之间交互的复杂性，全部转移到中介者对象上，所以维护中介者也是很困难的事。中介者模式可以很方便地解耦对象之间的关系，但是对象之间的关系并不一定需要解耦，所以在写代码时需要权衡对象之间的耦合程度。一般来说，如果对象之间的复杂耦合确实导致了调用和维护困难，而且这些耦合会随着项目的变化还在继续增加，我们就可以考虑使用中介者模式来重构代码。