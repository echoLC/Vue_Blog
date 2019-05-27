---
title: 模板方法模式
tags: [JavaScript, 设计模式]
categories: [design-pattern]
---
### 定义
模板方法模式是一种只需要使用继承就可以实现的设计模式，它通常由两部分组成，第一部分是抽象父类，第二部分是具体的实现子类。在抽象父类中封装了子类的算法框架，包括一些公共的方法以及子类中所有方法的执行顺序。子类通过继承父类，也继承了整个算法结构，以及重写父类中一些具体的方法。

### Coffee和Tea
下面通过咖啡与茶的经典例子来讲解模板方法模式的具体实现。
<br>
**先泡一杯咖啡**
<br>
泡一杯咖啡通常包括以下步骤：
1. 把水煮沸
2. 用沸水冲泡咖啡
3. 把咖啡倒进杯子
4. 加糖和牛奶

通过代码实现上述步骤为：
```javascript
class Coffee {
  boilWater () {
    console.log('把水煮沸')
  }

  brewCoffeeGriends () {
    console.log('用沸水冲泡咖啡')
  }

  pourInCup () {
    console.log('把咖啡倒进杯子里')
  }

  addSugarAndMilk () {
    console.log('加糖和牛奶')
  }

  init () {
    this.boilWater()
    this.brewCoffeeGriends()
    this.pourInCup()
    this.addSugarAndMilk()
  } 
}

const coffee = new Coffee()
coffee.init()
```
**泡一壶茶**
<br>
而泡一壶茶的步骤跟泡咖啡的步骤类似：
1. 把水煮沸
2. 用沸水浸泡茶叶
3. 把茶水倒进杯子
4. 加柠檬
 
用代码描述如下：

```javascript
class Tea {
  boilWater () {
    console.log('把水煮沸')
  }

  steepTeaBag () {
    console.log('用沸水浸泡茶叶')
  }

  pourInCup () {
    console.log('把茶水倒进杯子里')
  }

  addLemon () {
    console.log('加柠檬')
  }

  init () {
    this.boilWater()
    this.steepTeaBag()
    this.pourInCup()
    this.addLemon()
  } 
}

const tea = new Tea()
tea.init()
```
**分离出共同点**
<br>
对比泡咖啡和泡茶步骤:
| 泡咖啡         |  泡茶          |
|:-------------:|:-------------:|
| 把水煮沸       | 把水煮沸        |
| 用沸水煮咖啡    | 用沸水浸泡茶叶   |
| 把咖啡倒进杯子里 | 把茶水倒进杯子里 |
| 加糖和牛奶      | 加柠檬         |
分析表格我们得出泡咖啡和泡茶的不同点：
- 原料不同，一个是咖啡，一个是茶，我们可以抽象为“饮料”
- 泡的方式不同，咖啡是冲泡，茶是浸泡，我们可以抽象为“泡”
- 加入的调料不同，一个是加糖和饮料，一个是加柠檬，我们抽象为“调料”
  
于是不管是泡咖啡还是泡茶，我们可以用如下代码描述：
```javascript
class Beverage {
  boilWater () {
    console.log('把水煮沸')
  }

  // 空方法，由子类重写
  brew () {}

  // 空方法，由子类重写
  pourInCup () {}

  // 空方法，由子类重写
  addCondiments () {}

  init () {
    this.boilWater()
    this.brew()
    this.pourInCup()
    this.addCondiments()
  } 
}
```
创建泡咖啡子类：
```javascript
class Coffee extends Beverage {
  brew () {
    console.log('用沸水煮咖啡')
  }

  pourInCup () {
    console.log('把咖啡倒进杯子里')
  }

  addCondiments () {
    console.log('加糖和牛奶')
  }
}

const coffee = new Coffee()
coffee.init()
```
这样我们通过继承Beverage类，重写一些具体方法，就完成了泡咖啡子类的实现。泡茶的Tea实现类似，这里就不再具体写代码。

### 抽象类
其实模板方法是一种严重依赖抽象类的设计模式，在Java和其它一些静态类型的语言才有，而Javascript中是没有提供抽象的支持的。在Java中有两种类，一种是抽象类，一种是具体类。具体类是用来实例化的，而抽象类不能被实例化，是用来被继承的。上面的泡咖啡和泡茶的例子中，我们抽象了饮料类，里面包含了一些空方法，如果是抽象类实现的，那这些方法可以被定义为抽象方法，继承该抽象类的子类必须实现那些抽象方法，否则编译的时候就会报错。既然JavaSript中没有抽象类，那该怎么解决了？下面提供两种变通方案：
- 第一种方案是用鸭子类型来模拟接口检查，以便确保子类中确实重写了父类中的方法，它的缺点就是带来了程序的复杂性，要求程序员主动检查接口，就需要在业务代码中加一些与业务无关的代码。
- 第二种方案是让那些空方法抛出错误，如果因为粗心忘记重写方法，就会得到错误，但是缺点是我们得到的错误时间有点太靠后，只有在程序远行时才能看到错误。

### 应用
**架构师搭建项目**
<br>
模板方法模式常被架构师用来搭建项目的框架，架构师定义好了框架的骨架，程序员继承框架的结构之后，负责往里面填写内容。比如Java中的HttpServelet技术，一个基于HttpServelet的程序包含7个生命周期，七个生命周期对应7个do方法
1. doGet
2. doHead
3. doPost
4. doPut
5. doDelete
6. doOption
7. doTrace
   
它还提供了一个service方法，也就是模板方法，这个方法规定了这些do方法的执行顺序，而这些do方法的具体实现则需要HttpServelet的子类来提供。
<br>
<br>
**web构建UI组件**
<br>
我们知道构建一个组件的过程一般如下：
1. 初始化一个div容器
2. 通过ajax请求拉取相应的数据
3. 把数据填充到dom中，完成组件的构造
4. 通知用户组件渲染完毕
   
分析上述步骤，我们发现第一步和第四步一般是相同的，中间两步可能会有变化，于是我们可以把上面四步抽象到一个创建组件的父类中，父类提供第一步和第四步的实现，中间两步由具体的子类重写。   

### 钩子方法
在模板方法模式中，我们在父类中封装了子类的算法框架，这些算法框架适用大多数情况，但是也会有一些特殊情况。比如考虑泡咖啡中，可能有些顾客喝咖啡是需要加调料的，但是也有部分顾客不需要加调料，那怎么去定制这个需求，不让子类完全受父类的模板方法约束，**钩子方法**就是用来解决这个问题的。钩子是隔离变化的一种常用手段，我们一般在父类中容易变化的地方放置钩子，钩子一般会提供一个默认实现，究竟要不要完全跟父类的算法框架一样，子类可以自行决定。下面实现一个带customerWantCondiments钩子的饮料类：
```javascript
class Beverage {
  boilWater () {
    console.log('把水煮沸')
  }

  // 空方法，由子类重写
  brew () {
    throw new Error('子类必须重写brew方法')
  }

  // 空方法，由子类重写
  pourInCup () {
    throw new Error('子类必须重写pourInCup方法')
  }

  // 空方法，由子类重写
  addCondiments () {
    throw new Error('子类必须重写addCondiments方法')
  }

  // 默认需要调料
  customerWantCondiments () {
    return true  
  }


  init () {
    this.boilWater()
    this.brew()
    this.pourInCup()
    if (this.customerWantCondiments()) {
      this.addCondiments()
    }
  } 
}
```
那么泡咖啡的子类可以这样实现：
```javascript
class CoffeeWithHook extends Beverage {
  brew () {
    console.log('用沸水煮咖啡')
  }

  pourInCup () {
    console.log('把咖啡倒进杯子里')
  }

  addCondiments () {
    console.log('加糖和牛奶')
  }

  customerWantCondiments () {
    return window.confirm('请问需要调料吗？')
  }
}

const coffeeWithHook = new CoffeeWithHook()
coffeeWithHook.init()
```

### 好莱坞原则
在模板方法模式中，我们还学到了一个新的设计原则----著名的**好莱坞原则**。
<br>
<br>
在好莱坞中，许多新人演员也找不到工作，他们一般把简历递给演艺公司后就只有回家等电话，有时候等得不耐烦的演员就会打电话给演艺公司询问情况怎么样，但得到的回答是：“不要来找我，我会打电话给你”。
<br>
<br>
在设计中，这种规则就称为**好莱坞原则**。这种原则的思路是，我们允许底层组件将自己挂钩到高层组件中，而高层组件决定什么时候，以何种方式去使用这些底层组件，高层组件对待底层组件的方式就跟演艺公司对待新人演员一样，都是“别调用我们，我们会调用你”。
<br>
<br>
模板方法模式就是好莱坞原则的一个典型使用场景，当我们用模板方法编写一个程序时，就意味着子类放弃了对自己的控制权，而是改为父类去主动调用子类的方法，子类只是提供一些具体的方法的实现。除了模板方法，以下两种场景也体现了好莱坞原则：
- 发布-订阅模式 
<br>
在发布订阅模式中，发布者会把消息推送给订阅者，而不需要订阅者主动去fetch。
- 回调函数
<br>
在ajax异步请求中，我们一般是不知道请求具体的返回时间，通过注册一个回调函数，当数据返回后，会主动执行回调函数，这也是好莱坞原则的一种体现。  

### 总结
模板方法模式是一种典型的通过封装变化提高系统扩展性的设计模式。在一个使用了模板方法的模式中，子类的方法和执行顺序都是不变的，所以我们把这部分逻辑抽象到父类的模板方法里，可变的逻辑部分通过不同的子类来实现，通过增加新的子类，给系统添加新的功能，不需要改动抽象父类以及其它子类，符合开放-封闭原则。