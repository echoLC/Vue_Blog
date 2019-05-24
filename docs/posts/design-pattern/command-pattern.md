---
title: 命令模式
tags: [JavaScript, 设计模式]
categories: [design-pattern]
---
### 定义
命令模式是最简单和优雅的设计模式之一，命令模式中的“命令”指的是执行某些特定操作的指令。命令模式最常用的场景是：有时候需要向某些对象发送请求，但是不知道请求的接收者是谁，也不知道被请求的操作是什么。这时候就可以通过命令模式使得请求发送者和请求接收者能够消除彼此之间的耦合关系。

### 一个例子--实现菜单
假设我们在实现一个菜单的功能，菜单上有很多按钮，点击不同的按钮将会执行不同的操作。因为程序复杂，所以将按钮的绘制和点击按钮具体的行为分配给不同的人员编写。对于绘制按钮的程序员来说，他完全不知道某个按钮将来要做什么，他知道点击每个按钮会做一些操作。分析应用场景之后，我们发现这个需求很适合用命令模式来设计。理由如下：点击按钮之后，必须向某些负责具体行为的对象发送请求，这些对象就是行为的接收者。但是目前不知道接收者是什么对象，也不知道接收者具体做什么操作，借助命令模式，就可以解耦按钮和行为对象之间的关系。下面看具体的代码：
```html
<body>
  <div class="menu-list">
    <button id="btn1">按钮1</button>
    <button id="btn2">按钮2</button>
    <button id="btn3">按钮3</button>
  </div>
<body>

<script>
  const btn1 = document.getElementById('btn1')
  const btn2 = document.getElementById('btn2')
  const btn3 = document.getElementById('btn3')
</script>
```
定义setCommand函数：
```javascript
function setCommand (btn, command) {
  btn.onclick = function () {
    command.excute()
  }
}
```
定义菜单的行为，先实现刷新菜单界面、增加子菜单和删除子菜单的功能：
```javascript
const menuBar = {
  refresh () {
    console.log('刷新菜单')
  }
}

const subMenu = {
  add () {
    console.log('增加子菜单')
  },
  del () {
    console.log('删除子菜单')
  }
}
```
封装命令类：
```javascript
function RefreshMenuBarCommand (receiver) {
  this.receiver = receiver
}

RefreshMenuBarCommand.prototype.excute = function () {
  this.receiver.refresh()
}

function AddSubMenuCommand (receiver) {
  this.receiver = receiver
}

AddSubMenuCommand.prototype.excute = function () {
  this.receiver.add()
}

function DelSubMenuCommand (receiver) {
  this.receiver = receiver
}

DelSubMenuCommand.prototype.excute = function () {
  this.receiver.del()
}
```
最后把命令接收者传入到command对象中，并把command对象安装到button上：
```javascript
const refreshMenuBarCommand = new RefreshMenuBarCommand(menuBar)
const addSubMenuCommand = new AddSubMenuCommand(subMenu)
const delSubMenuCommand = new DelSubMenuCommand(subMenu)

setCommand(btn1, refreshMenuBarCommand)
setCommand(btn2, addSubMenuCommand)
setCommand(btn3, delSubMenuCommand)
```
这样就实现了一个简单的命令模式，从中可以看出命令模式是如何将请求的发送者和接收者解耦的。

### JavaScript中的命令模式
在JavaScript中，函数作为一等对象，是可以作为参数四处传递的。命令模式中的运算块不一定要封装在command.excute方法中，也可以封装在普通的函数中。如果我们需要请求的”接收者”，也可以通过闭包来实现。下面通过JavaScript直接实现命令模式：
```javascript
const setCommand = function (btn, command) {
  btn.onclick = function () {
    command.excute()
  }
}

const menuBar = {
  refresh () {
    console.log('刷新菜单')
  }
}

const RefreshMenuBarCommand = function (receiver) {
  return {
    excute: function () {
      receiver.refresh()
    }
  }
}

const refreshMenuBarCommand = new RefreshMenuBarCommand(menuBar)
setCommand(btn1, refreshMenuBarCommand)
```

### 撤销命令
命令模式的另一个作用就是可以很方便地给命令对象增加撤销操作，就像在美团上下单之后也可以取消订单。下面通过一个例子来实现撤销功能，实现一个动画，这个动画是让在页面上的小球可以移动到水平方向的某个位置。页面有一个输入框和按钮，输入框中可以输入小球移动到的水平位置，点击按钮小球将开始移动到指定的坐标，使用命令模式实现代码如下：
```html
<body>
  <div id="ball"></div>
  输入小球移动后的位置：<input id="pos"/>
  <button id="moveBtn">开始移动</button>
</body>

<script>
  const ball = document.getElementById('ball')
  const pos = document.getElementById('pos')
  const moveBtn = document.getElementById('moveBtn')

  const MoveCommand = function (receiver, pos) {
    this.receiver = receiver
    this.pos = pos
  }

  MoveCommand.prototype.excute = function () {
    this.receiver.start('left', this.pos, 1000, 'strongEaseOut')
  }

  let moveCommand

  moveBtn.onclick = function () {
    const animate = new Animate(ball)
    moveCommand = new MoveCommand(animate, pos.value)
    moveCommand.excute()
  }
</script>
```
增加取消按钮：
```html
<body>
  <div id="ball"></div>
  输入小球移动后的位置：<input id="pos"/>
  <button id="moveBtn">开始移动</button>
  <button id="cancelBtn">取消</button>
</body>
```
增加撤销功能，一般是给命令对象增加一个undo的方法：
```javascript
 const ball = document.getElementById('ball')
  const pos = document.getElementById('pos')
  const moveBtn = document.getElementById('moveBtn')
  const cancelBtn = document.getElementById('cancelBtn')

  const MoveCommand = function (receiver, pos) {
    this.receiver = receiver
    this.pos = pos
    this.oldPos = null
  }

  MoveCommand.prototype.excute = function () {
    this.receiver.start('left', this.pos, 1000, 'strongEaseOut')
    // 记录小球的位置
    this.oldPos = this.receiver.dom.getBoundingClientReact()[this.receiver.propertyName]
  }

  MoveCommand.prototype.undo = function () {
    this.receiver.start('left', this.oldPos, 1000, 'strongEaseOut')
  }

  let moveCommand

  moveBtn.onclick = function () {
    const animate = new Animate(ball)
    moveCommand = new MoveCommand(animate, pos.value)
    moveCommand.excute()
  }

  cancelBtn.onclick = function () {
    moveCommand.undo()
  }
```
这样就完成了撤销的功能，如果使用普通的方法来实现，可能要每次记录小球的运动轨迹，才能让它回到之前的位置。而命令模式中小球的原始位置已经在小球移动之前作为command对象的属性存起来了，所以只需要编写undo方法，在这个方法中让小球回到记录的位置就可以了。

### 撤销和重做
上面我们实现了小球回到上一个位置的撤销功能，有时候我们要实现多次撤销，比如下棋游戏中，我们可能需要悔棋5步，这时候需要使用一个历史列表来记录之前下棋的命令，然后倒序循环来每一次执行这些命令的undo操作，直到回到我们需要的那个状态。
<br>
<br>
但是在一些场景下，无法顺利地使用undo操作让对象回到上一个状态。例如在Canvas画图中，画布上有一些点，我们在这些点之间画了很多线，如果这是用命令模式来实现的，就很难实现撤销操作，因为在Canvas中，擦除一条线相对不容易实现。
<br>
这时候最好的办法就是擦除整个画布，然后把之前的命令全部重新执行一遍，我们只需要实现一个历史列表记录之前的命令。对于处理不可逆的命令，这种方式是最好的。

### 命令队列
在现实生活中，我们出去吃饭，点菜下单后，如果订单数量过多，餐厅的厨师人手不够，就需要对订单进行排队处理。这时候命令模式把请求封装成命令对象的优点再次体现了出来，对象的生命周期几乎是永久的，除非我们主动回收它。换句话来说，命令对象的生命周期跟初始请求发生的时间无关，我们可以在任何时刻执行command对象的excute方法。
<br>
<br>
拿前面的动画例子来说，我们可以把div的运动过程封装成命令对象，再把他们压入一个队列，当动画执行完，当command对象的职责完成后，然后主动通知队列，此时从队列中取出下一个命令对象，然后执行它。这样如果用户重复点击执行按钮，那么不会出现上一个动画还没执行完，下一个动画已经开始的问题，用户可以完整看到每一个动画的执行过程。

### 宏命令
宏命令是一组命令的集合，通过执行宏命令，可以一次执行一组命令。如果在你家里有一个万能遥控器，每天回家的时候，只要按一个按钮，就可以帮我们打开电脑，打开电视，打开空调。下面实现这个宏命令：
```javascript
const openComputerCommand = {
  excute () {
    console.log('打开电脑')
  }
}

const openTVCommand = {
  excute () {
    console.log('打开电视')
  }
}

const openAirCommand = {
  excute () {
    console.log('打开空调')
  }
}

const MacroCommand = function {
  return {
    commandList: [],
    add (command) {
      this.commandList.push(command)
    },
    excute () {
      for (let i = 0, len = this.commandList.length; i < len; i++) {
        const command = this.commandList[i]
        command.excute()
      }
    }
  }
}
```
我们也可以为宏命令添加undo操作，跟excute方法类似，调用宏命令的undo方法就是把命令列表里的每个命令对象都执行对应的undo方法。

### 总结
跟传统的面向对象的方式实现命令模式不同的是，在JavaScript中，可以用高阶函数和闭包来实现命令模式，这种方式更加简单。