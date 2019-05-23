export default [
  [
    "2019-05",
    {
      "excerpt": " 定义 发布-订阅模式是观察者模式的一种，它定义一个对象和多个对象之间的依赖关系，当对象的状态发生改变时，所有依赖它的对象都会收到通知。在JavaScript中，我们一般使用事件模型来代替传统的发布-订阅模式。  DOM事件 在DOM编程中，我们经常会监听一些DOM事件，相当于订阅这个事件，然后用户触发这个事件，我们就能在回调中做一些操作。例如： ```javascript docum......",
      "tags": [
        "JavaScript",
        "设计模式"
      ],
      "id": 0,
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
      "id": 1,
      "title": "迭代器模式",
      "lastUpdated": "2019-05-22 22:37:28",
      "path": "/posts/design-pattern/iterator-pattern.html"
    },
    {
      "excerpt": " 定义 代理模式是为对象提供一个代用品或者占位符，以便控制对它的直接访问。当一个对象不想被外界直接访问，就可以使用代理，提供一个替身对象来控制对它的访问，替身对象对请求进行处理之后，再把请求转交给本体对象。 <br> <center> ![proxy image1](/proxy2.png) <br> 不使用代理模式 </center> <br> <center> ![proxy image......",
      "tags": [
        "JavaScript",
        "设计模式"
      ],
      "id": 2,
      "title": "代理模式",
      "lastUpdated": "2019-05-21 22:42:38",
      "path": "/posts/design-pattern/proxy-patten.html"
    },
    {
      "excerpt": " 定义 定义一系列算法，把它们一个个封装成策略类，具体的算法封装在策略类的内部方法里，并且使这些策略类可以互相替换。一个基于策略模式的设计至少由两部分组成，第一部分是一组策略类，每个策略类里封装了具体的算法。第二部分是环境类Context，Context主要接受客户的请求，然后把请求委托给某一个策略类。   应用 下面主要通过两个具体的案例来介绍策略类的使用。  使用策略模式计......",
      "tags": [
        "JavaScript",
        "设计模式"
      ],
      "id": 3,
      "title": "策略模式",
      "lastUpdated": "2019-05-19 14:15:12",
      "path": "/posts/design-pattern/strategy-pattern.html"
    },
    {
      "excerpt": " 概念 浏览器缓存是在前端开发中经常遇到的问题，它是提升页面性能同时减少服务器压力的有效手段之一。  类型  强缓存    请求资源时不会向服务器发送请求，直接从缓存中读取资源，在chrome控制台的network中看到请求返回200的状态码，并且status code后面显示from disk cache 或者from memory cache；  协商缓存    向......",
      "tags": [
        "http",
        "缓存"
      ],
      "id": 4,
      "title": "浅谈http缓存",
      "lastUpdated": "2019-05-19 10:40:26",
      "path": "/posts/http/http-stragies.html"
    }
  ]
];