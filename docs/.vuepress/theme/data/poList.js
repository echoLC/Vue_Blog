export default [
  [
    "2019-05",
    {
      "excerpt": " 定义 装饰者模式可以动态地给某个对象添加一些额外的职责，而不会影响这个类中派生的其他对象。装饰模式能够在不改变对象自身的基础上，在程序远行期间给对象动态地添加职责，跟继承相比，装饰者更加轻便灵活。   使用面向对象实现装饰者模式 假设我们编写一个飞机大战的游戏，飞机会根据经验值的增加升级子弹的类型，一开始飞机只能发射普通子弹，升到二级可以发射导弹，升到三级可以发射原子弹。用代码实现如......",
      "tags": [
        "JavaScript",
        "设计模式"
      ],
      "id": 0,
      "title": "装饰者模式",
      "lastUpdated": "2019-05-29 22:37:15",
      "path": "/posts/design-pattern/decoraroe-pattern.html"
    },
    {
      "excerpt": " 定义 定义一系列算法，把它们一个个封装成策略类，具体的算法封装在策略类的内部方法里，并且使这些策略类可以互相替换。一个基于策略模式的设计至少由两部分组成，第一部分是一组策略类，每个策略类里封装了具体的算法。第二部分是环境类Context，Context主要接受客户的请求，然后把请求委托给某一个策略类。   应用 下面主要通过两个具体的案例来介绍策略类的使用。  使用策略模式计......",
      "tags": [
        "JavaScript",
        "设计模式"
      ],
      "id": 1,
      "title": "策略模式",
      "lastUpdated": "2019-05-29 14:28:29",
      "path": "/posts/design-pattern/strategy-pattern.html"
    },
    {
      "excerpt": " 定义 职责链模式的定义：使多个对象都有机会处理请求，从而避免了请求的发送者与多个接收者直接的耦合关系，将这些接收者连接成一条链，顺着这条链传递该请求，直到找到能处理该请求的对象。   应用 假设我们负责一个售卖手机的网站，需求的定义是：经过分别缴纳500元定金和200元定金的两轮预订，现在到了正式购买阶段。公司对于交了定金的用户有一定的优惠政策，规则如下：缴纳500元定金的用户可以收......",
      "tags": [
        "JavaScript",
        "设计模式"
      ],
      "id": 2,
      "title": "职责链模式",
      "lastUpdated": "2019-05-29 14:28:29",
      "path": "/posts/design-pattern/chain-of-responsibility.html"
    },
    {
      "excerpt": " 定义 享元模式是一种用于性能优化的模式，享元模式的核心是运用共享对象的技术来有效支持大量细粒度的对象。如果系统因为创建了大量对象而导致内存占用过高，享元模式就能发挥作用了。   一个简单的例子 假设有个制衣工厂，目前的产品有50种男款衣服和50种女款衣服，为了推销产品，工厂决定生产一些塑料模特来穿上他们的衣服拍成广告照片，正常情况下需要50个男模特和50个女模特，用程序表达： ```......",
      "tags": [
        "JavaScript",
        "设计模式"
      ],
      "id": 3,
      "title": "享元模式",
      "lastUpdated": "2019-05-29 14:28:29",
      "path": "/posts/design-pattern/fly-weight-pattern.html"
    },
    {
      "excerpt": " 定义 中介者模式的作用就是解除对象与对象之间的紧耦合关系，所有对象通过中介者来通信，而不是互相引用，所以当一个对象发生改变时，只需要通知中介者对象即可。 <br> <center> ![objects image](/objects.png) <br> 图一 </center> <br> <center> ![mediator image](/mediator.png) <br> 图二 <......",
      "tags": [
        "JavaScript",
        "设计模式"
      ],
      "id": 4,
      "title": "中介者模式",
      "lastUpdated": "2019-05-28 23:39:56",
      "path": "/posts/design-pattern/mediator-pattern.html"
    },
    {
      "excerpt": " 定义 代理模式是为对象提供一个代用品或者占位符，以便控制对它的直接访问。当一个对象不想被外界直接访问，就可以使用代理，提供一个替身对象来控制对它的访问，替身对象对请求进行处理之后，再把请求转交给本体对象。 <br> <center> ![proxy image1](/proxy2.png) <br> 不使用代理模式 </center> <br> <center> ![proxy image......",
      "tags": [
        "JavaScript",
        "设计模式"
      ],
      "id": 5,
      "title": "代理模式",
      "lastUpdated": "2019-05-28 22:59:54",
      "path": "/posts/design-pattern/proxy-pattern.html"
    },
    {
      "excerpt": " 定义 模板方法模式是一种只需要使用继承就可以实现的设计模式，它通常由两部分组成，第一部分是抽象父类，第二部分是具体的实现子类。在抽象父类中封装了子类的算法框架，包括一些公共的方法以及子类中所有方法的执行顺序。子类通过继承父类，也继承了整个算法结构，以及重写父类中一些具体的方法。   Coffee和Tea 下面通过咖啡与茶的经典例子来讲解模板方法模式的具体实现。 <br> **先泡一杯......",
      "tags": [
        "JavaScript",
        "设计模式"
      ],
      "id": 6,
      "title": "模板方法模式",
      "lastUpdated": "2019-05-27 16:23:51",
      "path": "/posts/design-pattern/template-way-pattern.html"
    },
    {
      "excerpt": " 定义 命令模式是最简单和优雅的设计模式之一，命令模式中的“命令”指的是执行某些特定操作的指令。命令模式最常用的场景是：有时候需要向某些对象发送请求，但是不知道请求的接收者是谁，也不知道被请求的操作是什么。这时候就可以通过命令模式使得请求发送者和请求接收者能够消除彼此之间的耦合关系。   一个例子--实现菜单 假设我们在实现一个菜单的功能，菜单上有很多按钮，点击不同的按钮将会执行不同的......",
      "tags": [
        "JavaScript",
        "设计模式"
      ],
      "id": 7,
      "title": "命令模式",
      "lastUpdated": "2019-05-24 21:10:23",
      "path": "/posts/design-pattern/command-pattern.html"
    },
    {
      "excerpt": " 定义 发布-订阅模式是观察者模式的一种，它定义一个对象和多个对象之间的依赖关系，当对象的状态发生改变时，所有依赖它的对象都会收到通知。在JavaScript中，我们一般使用事件模型来代替传统的发布-订阅模式。  DOM事件 在DOM编程中，我们经常会监听一些DOM事件，相当于订阅这个事件，然后用户触发这个事件，我们就能在回调中做一些操作。例如： ```javascript docum......",
      "tags": [
        "JavaScript",
        "设计模式"
      ],
      "id": 8,
      "title": "发布-订阅模式",
      "lastUpdated": "2019-05-23 17:55:46",
      "path": "/posts/design-pattern/publisher-subscriber-pattern.html"
    },
    {
      "excerpt": " 定义 迭代器模式就是提供一种方法顺序访问一个聚合对象中的各个元素，而又不需要暴露该对象的内部表示。在JavaScript中，例如forEach的实现就是一种迭代器模式，它可以遍历数组。jQuery中的each方法既可以遍历数组也可以遍历对象，它也是迭代器模式的一种实现。   内部迭代器和外部迭代器  内部迭代器 内部迭代器的内部已经定义好了迭代规则，它完全接手整个迭代过程，外......",
      "tags": [
        "JavaScript",
        "设计模式"
      ],
      "id": 9,
      "title": "迭代器模式",
      "lastUpdated": "2019-05-22 22:37:28",
      "path": "/posts/design-pattern/iterator-pattern.html"
    },
    {
      "excerpt": " 概念 浏览器缓存是在前端开发中经常遇到的问题，它是提升页面性能同时减少服务器压力的有效手段之一。  类型  强缓存    请求资源时不会向服务器发送请求，直接从缓存中读取资源，在chrome控制台的network中看到请求返回200的状态码，并且status code后面显示from disk cache 或者from memory cache；  协商缓存    向......",
      "tags": [
        "http",
        "缓存"
      ],
      "id": 10,
      "title": "浅谈http缓存",
      "lastUpdated": "2019-05-19 10:40:26",
      "path": "/posts/http/http-stragies.html"
    }
  ]
];