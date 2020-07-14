export default [
  [
    "2020-07",
    {
      "excerpt": "  tree shaking 是什么 首先我们先搞清楚，tree shaking是个什么东东，来看下 MDN 给的介绍： > **Tree shaking** is a term commonly......",
      "tags": [
        "webpack"
      ],
      "id": 0,
      "title": "深入理解Webpack tree shaking",
      "lastUpdated": "2020-07-14 09:05:36",
      "path": "/posts/webpack/dive-into-webpack-tree-shaking.html"
    },
    {
      "excerpt": "如果2020年作为一个前端开发你还不知道 `Webpack` 是什么，真的就要考虑回炉重造了。很多人可能会得意洋洋，嘴角上扬回答：这谁不知道，不就是一个项目构建工具吗，我们的项目现在都用着了。这我当然......",
      "tags": [
        "webpack"
      ],
      "id": 1,
      "title": "Webpack概述",
      "lastUpdated": "2020-07-01 17:56:22",
      "path": "/posts/webpack/basic-introduce.html"
    }
  ],
  [
    "2020-04",
    {
      "excerpt": "  背景  我们都知道JS模块化的演变经历了一个漫长的过程，从最初的**CommonJS** ，到后来的**AMD**和**CMD**，再到今天的**ES6模块**化方案。优胜劣汰，对于JS这门......",
      "tags": [
        "javascript",
        "module"
      ],
      "id": 2,
      "title": "CommonJS和ES6模块的区别",
      "lastUpdated": "2020-04-20 15:23:38",
      "path": "/posts/javascript/commonjs-and-esm.html"
    }
  ],
  [
    "2019-07",
    {
      "excerpt": " 历史 跟设计模式有关的第一本书籍是由[克里斯托佛·亚历山大](https://zh.wikipedia.org/wiki/%E5%85%8B%E9%87%8C%E6%96%AF%E6%89%9......",
      "tags": [
        "设计模式"
      ],
      "id": 3,
      "title": "设计模式概述",
      "lastUpdated": "2019-07-12 14:47:11",
      "path": "/posts/design-pattern/deign-patterns-intro.html"
    },
    {
      "excerpt": " 定义 装饰者模式可以动态地给某个对象添加一些额外的职责，而不会影响这个类中派生的其他对象。装饰模式能够在不改变对象自身的基础上，在程序运行期间给对象动态地添加职责，跟继承相比，装饰者更加轻便灵......",
      "tags": [
        "JavaScript",
        "设计模式"
      ],
      "id": 4,
      "title": "装饰者模式",
      "lastUpdated": "2019-07-03 16:35:53",
      "path": "/posts/design-pattern/decorator-pattern.html"
    }
  ],
  [
    "2019-06",
    {
      "excerpt": " 背景 到目前，JavaScript常见的设计模式系列我已经写得差不多了。在设计模式的一系列文章中，总是先写一段反例代码，然后再通过设计模式重构之前的代码，这种强烈的对比会加深我们对该设计模式的......",
      "tags": [
        "JavaScript",
        "重构代码"
      ],
      "id": 5,
      "title": "代码重构",
      "lastUpdated": "2019-06-16 00:31:10",
      "path": "/posts/design-pattern/refactor-code.html"
    },
    {
      "excerpt": " 单一职责原则  定义 对于一个类而言，应该只有一个引起它变化的原因。在JavaScript中，单一职责原则更多地是被运用在对象或者方法级别上。单一职责原则（SRP）的职责定义为“引起变......",
      "tags": [
        "JavaScript",
        "设计模式"
      ],
      "id": 6,
      "title": "设计模式中的一些原则",
      "lastUpdated": "2019-06-15 14:32:58",
      "path": "/posts/design-pattern/design-principle.html"
    },
    {
      "excerpt": " 定义 **允许一个对象在其内部状态改变时来改变它的行为**，对象看起来似乎修改了它的类。在状态模式中，我们把状态封装成独立的类，并将请求委托给当前的状态对象，所以当对象内部的状态改变时，对象会......",
      "tags": [
        "JavaScript",
        "设计模式"
      ],
      "id": 7,
      "title": "状态模式",
      "lastUpdated": "2019-06-09 17:47:53",
      "path": "/posts/design-pattern/state-pattern.html"
    }
  ],
  [
    "2019-05",
    {
      "excerpt": " 定义 职责链模式的定义：使多个对象都有机会处理请求，从而避免了请求的发送者与多个接收者直接的耦合关系，将这些接收者连接成一条链，顺着这条链传递该请求，直到找到能处理该请求的对象。   应......",
      "tags": [
        "JavaScript",
        "设计模式"
      ],
      "id": 8,
      "title": "职责链模式",
      "lastUpdated": "2019-05-29 14:28:29",
      "path": "/posts/design-pattern/chain-of-responsibility.html"
    },
    {
      "excerpt": " 定义 享元模式是一种用于性能优化的模式，享元模式的核心是运用共享对象的技术来有效支持大量细粒度的对象。如果系统因为创建了大量对象而导致内存占用过高，享元模式就能发挥作用了。   一个简单......",
      "tags": [
        "JavaScript",
        "设计模式"
      ],
      "id": 9,
      "title": "享元模式",
      "lastUpdated": "2019-05-29 14:28:29",
      "path": "/posts/design-pattern/fly-weight-pattern.html"
    },
    {
      "excerpt": " 定义 定义一系列算法，把它们一个个封装成策略类，具体的算法封装在策略类的内部方法里，并且使这些策略类可以互相替换。一个基于策略模式的设计至少由两部分组成，第一部分是一组策略类，每个策略类里封装......",
      "tags": [
        "JavaScript",
        "设计模式"
      ],
      "id": 10,
      "title": "策略模式",
      "lastUpdated": "2019-05-29 14:28:29",
      "path": "/posts/design-pattern/strategy-pattern.html"
    },
    {
      "excerpt": " 定义 中介者模式的作用就是解除对象与对象之间的紧耦合关系，所有对象通过中介者来通信，而不是互相引用，所以当一个对象发生改变时，只需要通知中介者对象即可。 <br> <center> ![obj......",
      "tags": [
        "JavaScript",
        "设计模式"
      ],
      "id": 11,
      "title": "中介者模式",
      "lastUpdated": "2019-05-28 23:39:56",
      "path": "/posts/design-pattern/mediator-pattern.html"
    },
    {
      "excerpt": " 定义 代理模式是为对象提供一个代用品或者占位符，以便控制对它的直接访问。当一个对象不想被外界直接访问，就可以使用代理，提供一个替身对象来控制对它的访问，替身对象对请求进行处理之后，再把请求转交......",
      "tags": [
        "JavaScript",
        "设计模式"
      ],
      "id": 12,
      "title": "代理模式",
      "lastUpdated": "2019-05-28 22:59:54",
      "path": "/posts/design-pattern/proxy-pattern.html"
    },
    {
      "excerpt": " 定义 模板方法模式是一种只需要使用继承就可以实现的设计模式，它通常由两部分组成，第一部分是抽象父类，第二部分是具体的实现子类。在抽象父类中封装了子类的算法框架，包括一些公共的方法以及子类中所有......",
      "tags": [
        "JavaScript",
        "设计模式"
      ],
      "id": 13,
      "title": "模板方法模式",
      "lastUpdated": "2019-05-27 16:23:51",
      "path": "/posts/design-pattern/template-way-pattern.html"
    },
    {
      "excerpt": " 定义 命令模式是最简单和优雅的设计模式之一，命令模式中的“命令”指的是执行某些特定操作的指令。命令模式最常用的场景是：有时候需要向某些对象发送请求，但是不知道请求的接收者是谁，也不知道被请求的......",
      "tags": [
        "JavaScript",
        "设计模式"
      ],
      "id": 14,
      "title": "命令模式",
      "lastUpdated": "2019-05-24 21:10:23",
      "path": "/posts/design-pattern/command-pattern.html"
    },
    {
      "excerpt": " 定义 发布-订阅模式是观察者模式的一种，它定义一个对象和多个对象之间的依赖关系，当对象的状态发生改变时，所有依赖它的对象都会收到通知。在JavaScript中，我们一般使用事件模型来代替传统的......",
      "tags": [
        "JavaScript",
        "设计模式"
      ],
      "id": 15,
      "title": "发布-订阅模式",
      "lastUpdated": "2019-05-23 17:55:46",
      "path": "/posts/design-pattern/publisher-subscriber-pattern.html"
    },
    {
      "excerpt": " 定义 迭代器模式就是提供一种方法顺序访问一个聚合对象中的各个元素，而又不需要暴露该对象的内部表示。在JavaScript中，例如forEach的实现就是一种迭代器模式，它可以遍历数组。jQue......",
      "tags": [
        "JavaScript",
        "设计模式"
      ],
      "id": 16,
      "title": "迭代器模式",
      "lastUpdated": "2019-05-22 22:37:28",
      "path": "/posts/design-pattern/iterator-pattern.html"
    },
    {
      "excerpt": " 概念 浏览器缓存是在前端开发中经常遇到的问题，它是提升页面性能同时减少服务器压力的有效手段之一。  类型  强缓存    请求资源时不会向服务器发送请求，直接从缓存中读取资源，在......",
      "tags": [
        "http",
        "缓存"
      ],
      "id": 17,
      "title": "浅谈http缓存",
      "lastUpdated": "2019-05-19 10:40:26",
      "path": "/posts/http/http-stragies.html"
    }
  ]
];