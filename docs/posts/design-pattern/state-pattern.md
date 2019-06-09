---
title: 状态模式
tags: [JavaScript, 设计模式]
categories: [design-pattern]
---
### 定义
**允许一个对象在其内部状态改变时来改变它的行为**，对象看起来似乎修改了它的类。在状态模式中，我们把状态封装成独立的类，并将请求委托给当前的状态对象，所以当对象内部的状态改变时，对象会有不同的行为。状态模式的关键就是区分对象的内部状态。

### 电灯程序
#### 先实现一个不用状态模式的电灯程序：
```javascript
class Light {
  construct () {
    this.state = 'off'
    this.button = null
  }

  // 创建一个button负责控制电灯的开关
  init () {
    const button = document.createElement('button')
    this.button = document.body.appendChild(button)
    this.button.innerHTML = '开关'

    this.button.onclick = () => {
      this.buttonWasPressed()
    }
  }

  buttonWasPressed () {
    if (this.state === 'off') {
      console.log('开灯')
      this.state = 'on'
    } else if (this.state === 'on') {
      console.log('关灯')
      this.state = 'off'
    }
  }
}

const light = new Light()
light.init()
```
上面代码实现了一个强壮的状态机，看起来这段代码设计得无懈可击了，这个程序没有任何Bug。
<br>
<br>
比较可惜的是，世界上的电灯并非都只有开关两种状态，一些酒店里的电灯只有一个开关，但是它的表现是：第一次按下打开弱光，第二次按下打开强光，第三次才是关闭电灯。于是，我们需要修改前面的代码：
```javascript
buttonWasPressed () {
    if (this.state === 'off') {
      console.log('弱光')
      this.state = 'weakLight'
    } else if (this.state === 'weakLight') {
      console.log('强光')
      this.state = 'strongLight'
    } else if (this.state === 'strongLight') {
      console.log('关灯')
      this.state = 'off'
  }
```
现在我们来总结下上面的程序的缺点：
- 首先，buttonWasPressed方法违反开放-封闭原则，每次新增或者修改light的状态就需要修改该方法中的代码。
- 所有跟状态相关的代码都封装在buttonWasPressed方法，导致这个方法会因为持续的加需求而膨胀到难以维护的地步。特别是在实际的开发中，每个状态可能要处理的逻辑比例子中的多很多。
- 状态切换不明显，仅仅只是一句this.state = 'off'的赋值，这样的代码很容易被遗漏掉，要想了解电灯的所有状态，我们必须深入到代码内部，耐心读完buttonWasPressed方法。
- 状态之间切换，是通过if-else语句来实现，增加或者修改一个状态可能需要改变若干个操作，这将使得buttonWasPressed方法更加难以维护。
  
#### 使用状态模式来改进电灯程序
首先我们先确定电灯的状态种类，然后把它们封装成单独的类，封装一般是封装对象的行为，而不是对象的状态。但是在状态模式中，关键的就是把每种状态封装成单独的类，跟状态相关的行为都封装在类的内部。从之前的代码得知，电灯有三种状态： OffLightState、WeakLightState、StrongLightState。首先编写状态类：
```javascript
class OffLightState {
  construct (light) {
    this.light = light
  }

  buttonWasPressed () {
    console.log('弱光')
    this.light.setState(this.light.weakLightState)
  }
}

class WeakLightState {
  construct (light) {
    this.light = light
  }

  buttonWasPressed () {
    console.log('强光')
    this.light.setState(this.light.strongLightState)
  }
}

class StrongLightState {
  construct (light) {
    this.light = light
  }

  buttonWasPressed () {
    console.log('关灯')
    this.light.setState(this.light.offLightState)
  }
}
```
接下来编写Light类，我们不再需要一个字符串来记录当前的状态，而是使用更加立体化的状态对象，在初始化Light类的时候就为每一个state类创建一个状态对象：
```javascript
class Light {
  construct () {
    this.offLightState = new OffLightState(this)
    this.weakLightState = new WeakLightState(this)
    this.strongLightState = new StrongLightState(this)

    this.currentState = this.offLightState // 初始化电灯状态
    this.button = null
  }

  init () {
    const button = document.createElement('button')
    this.button = document.body.appendChild(button)
    this.button.innerHTML = '开关'

    this.button.onclick = () => {
      this.currentState.buttonWasPressed()
    }
  }

  setState (newState) {
    this.currentState = newState
  }
}

const light = new Light()
light.init()
```
通过使用状态模式重构之后，我们看到程序有很多优点：
- 每种状态和它对应的行为之间的关系局部化，这些行为被分散在各个对象的状态类之中，便于阅读和管理。
- 状态之间的切换逻辑分布在状态类内部，这使得我们无需编写if-else语句来控制状态直接的切换。
- 当我们需要为Light类增加一种新的状态时，只需要增加一个新的状态类，再稍微改变一下现有的代码。
  
### 缺少抽象类的变通方式
在状态模式中，Light类被称为上下文（Context）。Context持有所有状态对象的引用 ，以便把请求委托给状态对象。在上面的例子中，请求最后委托到的是状态类的buttonWasPressed方法，所以所有的状态类都必须实现buttonWasPressed方法。
<br>
<br>
在Java中，所有的状态类必须继承自一个State抽象类，从而保证所有的状态子类都实现buttonWasPressed方法。遗憾的是，在JavaScript中没有抽象类，也没有接口的概念。我们可以编写一个状态类，然后实现buttonWasPressed方法，在函数体中抛出错误，如果继承它的子类没有实现buttonWasPressed方法就会在状态切换时抛出异常，这样至少在程序运行期间就可以发现错误，下面优化上面的代码：
```javascript
class State {
  buttonWasPressed () {
    throw new Error('父类的buttonWasPressed必须被重写')
  }
}

class OffLightState extend State {
  construct (light) {
    this.light = light
  }

  buttonWasPressed () {
    console.log('弱光')
    this.light.setState(this.light.weakLightState)
  }
}
```

### 状态模式中的性能优化点
在上面的例子，从性能方面考虑，还有一些可以优化的点：
- 有两种方式可以选择来管理state对象的创建和销毁。第一种是当state对象被需要的时候才创建并随后销毁；另一种是一开始就创建好所有的状态对象，并且始终不销毁它们。如果state对象比较大，可以用第一种方式来节省内存。如果状态改变很频繁，则最好是将state对象都创建出来，也没有必要销毁它们。
- 我们为每个Context对象都创建了一组state对象，实际上这些state对象之间是可以共享的，各个Context对象可以共享一个state对象，这也是享元模式的应用场景之一。

### 状态模式 VS 策略模式
状态模式和策略模式像一对双胞胎，它们都封装了一系列的算法或者行为，他们的类图看起来几乎一模一样，但是从意图上看它们有很大不同。
<br>
<br>
它们的相同点是，**都有一个上下文、一些策略类或者状态类，上下文把请求委托给这些类来执行**。它们之间的区别是策略模式中的各个策略类之间是平等又平行的，它们之间没有任何关系，所以客户必须熟知这些策略类的作用，以便客户自己可以随时主动切换算法。但是在状态模式中，状态和状态对应的行为早已被封装好，状态之间的切换也早就被规定，“改变行为”这件事发生在状态模式的内部，对于客户来说，不需要了解这些细节。

### JavaScript版本的状态机
上面我们使用的是传统的面向对象的方式实现状态模式，在JavaScript中，没有规定状态对象一定要从类中创建而来。另外，JavaScript可以非常方便利用委托技术，不需要事先让一个对象持有另一个对象，我们可以通过**Function.prototype.call**方法直接把请求委托给某个对象字面来执行。下面看下实现的代码：
```javascript
var FSM = {
  off: {
    buttonWasPressed: function () {
      console.log('关灯')
      this.currentState = FSM.on
    }
  },  
  on: {
    buttonWasPressed: function () {
      console.log('开灯')
      this.currentState = FSM.off
    }
  }
}

var Light = function () {
  this.currentState = FSM.off // 设置初始状态
  this.button = null
}

Light.prototype.init = function () {
  var self = this

  var button = document.createElement('button')
  this.button = document.body.appendChild(button)
  this.button.innerHTML = '开关'

  this.button.onclick = function () {
    self.currentState.buttonWasPressed.call(self)  // 把请求委托给状态机FSM
  }
}

const light = new Light()
light.init()
```
我们还可以使用**闭包**来编写这个例子，我们需要实现一个delegate函数：
```javascript
var delegate = function (client, delegation) {
  return {
    buttonWasPressed: function () {  // 将客户的请求委托给delegation对象
      return delegation.buttonWasPressed.apply(client, arguments)
    }
  }
}

var FSM = {
  off: {
    buttonWasPressed: function () {
      console.log('关灯')
      this.currentState = FSM.on
    }
  },  
  on: {
    buttonWasPressed: function () {
      console.log('开灯')
      this.currentState = FSM.off
    }
  }
}

var Light = function () {
  this.offState = delegate(this, FSM.off)
  this.onState = delegate(this, FSM.on)
  this.currentState = this.offState // 设置初始状态
  this.button = null
}

Light.prototype.init = function () {
  var self = this

  var button = document.createElement('button')
  this.button = document.body.appendChild(button)
  this.button.innerHTML = '开关'

  this.button.onclick = function () {
    self.currentState.buttonWasPressed()
  }
}
```

### 总结
在文章中，我们通过各种方式来实现状态模式，并且对比了使用状态模式前后程序的优缺点，从中我们也可以得出状态模式的优点和缺点。它的优点如下：
- 状态模式定义了状态和行为之间的关系，并它们封装在一个类里，使得添加新的状态和状态间的切换更容易。
- 避免了Context无限膨胀，状态切换的逻辑分布在状态类中，也避免了大量的if-else语句。
- 用对象代替字符串来记录当前状态，使得状态的切换更加一目了然。
- Context中的请求动作和状态类中封装的行为相互独立切互不影响，也使得修改更加容易。
  
状态模式的缺点：第一，我们需要在系统中定义许多状态类，编写很多的状态类是一项枯燥泛味的工作，这样也会导致系统中增加很多对象。第二，因为逻辑分散中状态类中，虽然避开了不受欢迎的条件语句，但也造成了逻辑分散的问题，我们无法在一个地方就看清整个状态机的逻辑。

