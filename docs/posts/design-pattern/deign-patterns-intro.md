---
title: 设计模式概述
tags: [设计模式]
categories: [design-pattern]
---
### 历史
跟设计模式有关的第一本书籍是由[克里斯托佛·亚历山大](https://zh.wikipedia.org/wiki/%E5%85%8B%E9%87%8C%E6%96%AF%E6%89%98%E4%BD%9B%C2%B7%E4%BA%9A%E5%8E%86%E5%B1%B1%E5%A4%A7)--**哈佛大学建筑学博士、美国加州大学伯克利分校建筑学教授、加州大学伯克利分校环境结构研究所所长、美国艺术和科学院院士**编写完成的，然后[肯特·贝克](https://zh.wikipedia.org/wiki/%E8%82%AF%E7%89%B9%C2%B7%E8%B2%9D%E5%85%8B)和[沃德·坎宁安](https://zh.wikipedia.org/wiki/%E6%B2%83%E5%BE%B7%C2%B7%E5%9D%8E%E5%AE%81%E5%AE%89)借鉴了克里斯托佛·亚历山大在建筑设计领域里的思想开发了设计模式，然后并使用在[Smalltalk](https://zh.wikipedia.org/wiki/Smalltalk)中的图形用户接口（GUI）的生成中。后来[埃里希·伽玛](https://zh.wikipedia.org/wiki/%E5%9F%83%E9%87%8C%E5%B8%8C%C2%B7%E4%BC%BD%E7%91%AA)在他的博士论文中把设计模式的思想改写为适用于软件开发，埃里希·伽玛得到了博士学位，然后去了美国，在那与Richard Helm, Ralph Johnson ,John Vlissides 合作出版了《设计模式：可复用面向对象软件的基础》（Design Patterns - Elements of Reusable Object-Oriented Software）一书，在此书中共收录了 23 种设计模式。这四位作者在软件开发领域里以“四人帮”（英语，Gang of Four，简称GoF）而闻名，并且他们在此书中的协作导致了软件设计模式的突破。有时，GoF也会用于代指《设计模式》这本书。
<br>
<br>
### 什么是设计模式
如果把程序员所学到的语言、框架、工具等知识比作武功招数，那设计模式就是可以将你的招数发挥到极致的内功。
<br>
<br>
设计模式是对软件设计中普遍存在、重复出现的问题，所提出的解决方案。通俗地来说，在软件设计中，设计模式就是大家普遍认同的代码设计的经验总结，针对某些问题的有效解决方案。
<br>
<br>
并非所有的软件模式都是设计模式，设计模式特指软件“设计”层次上的问题。还有其他非设计模式的模式，如**架构模式**。同时，**算法**不能算是一种设计模式，因为算法主要是用来解决计算上的问题，而非设计上的问题。
<br>
<br>
### 怎么描述一个设计模式
在GoF的书中，描述一个设计模式需要有如下内容，其中加粗的几项是必不可少的内容：

- **模式名**：每一个模式都有自己的名字，模式的名字使得我们可以讨论我们的设计。
- **问题**：在面向对象的系统设计过程中反复出现的问题，它导致我们采用某个模式。
- **解决方案**：上述问题的解决方案，其内容给出了设计的各个组成部分，它们之间的关系、职责划分和协作方式。
- 别名：一个模式可以有超过一个以上的名称。这些名称应该要在这一节注明。
- 动机：在哪种情况使用该模式，是本节提供的方案（包括问题与来龙去脉）的责任。
- 适用性：模式适用于哪些情况、模式的背景等等。
- 结构：这部分常用类图与交互图阐述此模式。
- 参与者：这部分提供一份本模式用到的类与对象清单，与它们在设计下扮演的角色。
- 合作：描述在此模式下，类与对象间的交互。
- **影响**：采用该模式对软件系统其他部分的影响，比如对系统的扩充性、可移植性的影响。影响也包括负面的影响。这部分应描述使用本模式后的结果、副作用、与权衡(trade-off)
- 实现：这部分应描述实现该模式、该模式的部分方案、实现该模式的可能技术、或者建议实现模式的方法。
- 示例：简略描绘出如何以编程语言来使用模式。
- 已知应用：业界已知的实现示例。
- 相关模式：这部分包括其他相关模式，以及与其他类似模式的不同。
<br>
<br>
### 有哪些设计模式：设计模式的分类
GoF将设计模式分为三类：
- **创建型设计模式**：创建型设计模式主要专注于处理对象创建机制，根据给定的情况以合适的方式创建对象。
- **结构型设计模式**：结构型设计模式与对象组合有关，通常可以用于找出不同对象之间建立关系的简单方法。
- **行为型设计模式**：行为设计模式专注于改善或者简化系统不同对象之间的通信。

具体的分类可以看如下表格：
<br>
<br>
<table style="width:673px;" border="1px" cellspacing="0" cellpadding="0" align="center">
<tbody>
  <tr>
  <td style="background:rgb(242,242,242);" valign="top"><p align="center"><strong><span style="font-size:16px;"><span style="font-size:18px;">类型</span></span></strong></p></td>
  <td style="background:rgb(242,242,242);" valign="top"><p align="center"><strong><span style="font-size:16px;"><span style="font-size:18px;">模式名称</span></span></strong></p></td><td style="background:rgb(242,242,242);" valign="top"><p align="center"><strong><span style="font-size:16px;"><span style="font-size:18px;">学习难度</span></span></strong></p></td><td style="background:rgb(242,242,242);" valign="top"><p align="center"><strong><span style="font-size:16px;"><span style="font-size:18px;">使用频率</span></span></strong></p></td>
  </tr>
  <tr><td rowspan="6"><p align="center"><span style="font-size:16px;"><span style="font-size:18px;">创建型模式</span></span></p><p align="center"><span style="font-family:'Times New Roman';font-size:18px;">Creational Pattern</span></p></td><td valign="top"><p align="center"><span style="font-size:16px;"><span style="font-size:18px;">单例模式</span></span></p><p align="center"><span style="font-family:'Times New Roman';font-size:18px;">Singleton Pattern</span></p></td><td valign="top"><p align="center"><span style="font-size:16px;"><span style="font-size:18px;color:#ff0000;">★☆☆☆☆</span></span></p></td><td valign="top"><p align="center"><span style="font-size:16px;"><span style="font-size:18px;color:#ff0000;">★★★★☆</span></span></p></td></tr><tr><td valign="top"><p align="center"><span style="font-size:16px;"><span style="font-size:18px;">简单工厂模式</span></span></p><p align="center"><span style="font-family:'Times New Roman';font-size:18px;">Simple Factory Pattern</span></p></td><td valign="top"><p align="center"><span style="font-size:16px;"><span style="font-size:18px;color:#ff0000;">★★☆☆☆</span></span></p></td><td valign="top"><p align="center"><span style="font-size:16px;"><span style="font-size:18px;color:#ff0000;">★★★☆☆</span></span></p></td></tr><tr><td valign="top"><p align="center"><span style="font-size:16px;"><span style="font-size:18px;">工厂方法模式</span></span></p><p align="center"><span style="font-family:'Times New Roman';font-size:18px;">Factory Method Pattern</span></p></td><td valign="top"><p align="center"><span style="font-size:16px;"><span style="font-size:18px;color:#ff0000;">★★☆☆☆</span></span></p></td><td valign="top"><p align="center"><span style="font-size:16px;"><span style="font-size:18px;color:#ff0000;">★★★★★</span></span></p></td></tr><tr><td valign="top"><p align="center"><span style="font-size:16px;"><span style="font-size:18px;">抽象工厂模式</span></span></p><p align="center"><span style="font-family:'Times New Roman';font-size:18px;">Abstract&nbsp; Factory Pattern</span></p></td><td valign="top"><p align="center"><span style="font-size:16px;"><span style="font-size:18px;color:#ff0000;">★★★★☆</span></span></p></td><td valign="top"><p align="center"><span style="font-size:16px;"><span style="font-size:18px;color:#ff0000;">★★★★★</span></span></p></td></tr><tr><td valign="top"><p align="center"><span style="font-size:16px;"><span style="font-size:18px;">原型模式</span></span></p><p align="center"><span style="font-family:'Times New Roman';font-size:18px;">Prototype Pattern</span></p></td><td valign="top"><p align="center"><span style="font-size:16px;"><span style="font-size:18px;color:#ff0000;">★★★☆☆</span></span></p></td><td valign="top"><p align="center"><span style="font-size:16px;"><span style="font-size:18px;color:#ff0000;">★★★☆☆</span></span></p></td></tr><tr><td valign="top"><p align="center"><span style="font-size:16px;"><span style="font-size:18px;">建造者模式</span></span></p><p align="center"><span style="font-family:'Times New Roman';font-size:18px;">Builder Pattern</span></p></td><td valign="top"><p align="center"><span style="font-size:16px;"><span style="font-size:18px;color:#ff0000;">★★★★☆</span></span></p></td><td valign="top"><p align="center"><span style="font-size:16px;"><span style="font-size:18px;color:#ff0000;">★★☆☆☆</span></span></p></td></tr><tr><td rowspan="7"><p align="center"><span style="font-size:16px;"><span style="font-size:18px;">结构型模式</span></span></p><p align="center"><span style="font-family:'Times New Roman';font-size:18px;">Structural Pattern</span></p></td><td valign="top"><p align="center"><span style="font-size:16px;"><span style="font-size:18px;">适配器模式</span></span></p><p align="center"><span style="font-family:'Times New Roman';font-size:18px;">Adapter Pattern</span></p></td><td valign="top"><p align="center"><span style="font-size:16px;"><span style="font-size:18px;color:#ff0000;">★★☆☆☆</span></span></p></td><td valign="top"><p align="center"><span style="font-size:16px;"><span style="font-size:18px;color:#ff0000;">★★★★☆</span></span></p></td></tr><tr><td valign="top"><p align="center"><span style="font-size:16px;"><span style="font-size:18px;">桥接模式</span></span></p><p align="center"><span style="font-family:'Times New Roman';font-size:18px;">Bridge&nbsp; Pattern</span></p></td><td valign="top"><p align="center"><span style="font-size:16px;"><span style="font-size:18px;color:#ff0000;">★★★☆☆</span></span></p></td><td valign="top"><p align="center"><span style="font-size:16px;"><span style="font-size:18px;color:#ff0000;">★★★☆☆</span></span></p></td></tr><tr><td valign="top"><p align="center"><span style="font-size:16px;"><span style="font-size:18px;">组合模式</span></span></p><p align="center"><span style="font-family:'Times New Roman';font-size:18px;">Composite&nbsp; Pattern</span></p></td><td valign="top"><p align="center"><span style="font-size:16px;"><span style="font-size:18px;color:#ff0000;">★★★☆☆</span></span></p></td><td valign="top"><p align="center"><span style="font-size:16px;"><span style="font-size:18px;color:#ff0000;">★★★★☆</span></span></p></td></tr><tr><td valign="top"><p align="center"><span style="font-size:16px;"><span style="font-size:18px;">装饰模式</span></span></p><p align="center"><span style="font-family:'Times New Roman';font-size:18px;">Decorator&nbsp; Pattern</span></p></td><td valign="top"><p align="center"><span style="font-size:16px;"><span style="font-size:18px;color:#ff0000;">★★★☆☆</span></span></p></td><td valign="top"><p align="center"><span style="font-size:16px;"><span style="font-size:18px;color:#ff0000;">★★★☆☆</span></span></p></td></tr><tr><td valign="top"><p align="center"><span style="font-size:16px;"><span style="font-size:18px;">外观模式</span></span></p><p align="center"><span style="font-family:'Times New Roman';font-size:18px;">Façade&nbsp; Pattern</span></p></td><td valign="top"><p align="center"><span style="font-size:16px;"><span style="font-size:18px;color:#ff0000;">★☆☆☆☆</span></span></p></td><td valign="top"><p align="center"><span style="font-size:16px;"><span style="font-size:18px;color:#ff0000;">★★★★★</span></span></p></td></tr><tr><td valign="top"><p align="center"><span style="font-size:16px;"><span style="font-size:18px;">享元模式</span></span></p><p align="center"><span style="font-family:'Times New Roman';font-size:18px;">Flyweight&nbsp; Pattern</span></p></td><td valign="top"><p align="center"><span style="font-size:16px;"><span style="font-size:18px;color:#ff0000;">★★★★☆</span></span></p></td><td valign="top"><p align="center"><span style="font-size:16px;"><span style="font-size:18px;color:#ff0000;">★☆☆☆☆</span></span></p></td></tr><tr><td valign="top"><p align="center"><span style="font-size:16px;"><span style="font-size:18px;">代理模式</span></span></p><p align="center"><span style="font-family:'Times New Roman';font-size:18px;">Proxy&nbsp; Pattern</span></p></td><td valign="top"><p align="center"><span style="font-size:16px;"><span style="font-size:18px;color:#ff0000;">★★★☆☆</span></span></p></td><td valign="top"><p align="center"><span style="font-size:16px;"><span style="font-size:18px;color:#ff0000;">★★★★☆</span></span></p></td></tr><tr><td rowspan="11"><p align="center"><span style="font-size:16px;"><span style="font-size:18px;">行为型模式</span></span></p><p align="center"><span style="font-family:'Times New Roman';font-size:18px;">Behavioral Pattern</span></p></td><td valign="top"><p align="center"><span style="font-size:16px;"><span style="font-size:18px;">职责链模式</span></span></p><p align="center"><span style="font-family:'Times New Roman';font-size:18px;">Chain&nbsp; of Responsibility Pattern</span></p></td><td valign="top"><p align="center"><span style="font-size:16px;"><span style="font-size:18px;color:#ff0000;">★★★☆☆</span></span></p></td><td valign="top"><p align="center"><span style="font-size:16px;"><span style="font-size:18px;color:#ff0000;">★★☆☆☆</span></span></p></td></tr><tr><td valign="top"><p align="center"><span style="font-size:16px;"><span style="font-size:18px;">命令模式</span></span></p><p align="center"><span style="font-family:'Times New Roman';font-size:18px;">Command&nbsp; Pattern</span></p></td><td valign="top"><p align="center"><span style="font-size:16px;"><span style="font-size:18px;color:#ff0000;">★★★☆☆</span></span></p></td><td valign="top"><p align="center"><span style="font-size:16px;"><span style="font-size:18px;color:#ff0000;">★★★★☆</span></span></p></td></tr><tr><td valign="top"><p align="center"><span style="font-size:16px;"><span style="font-size:18px;">解释器模式</span></span></p><p align="center"><span style="font-family:'Times New Roman';font-size:18px;">Interpreter&nbsp; Pattern</span></p></td><td valign="top"><p align="center"><span style="font-size:16px;"><span style="font-size:18px;color:#ff0000;">★★★★★</span></span></p></td><td valign="top"><p align="center"><span style="font-size:16px;"><span style="font-size:18px;color:#ff0000;">★☆☆☆☆</span></span></p></td></tr><tr><td valign="top"><p align="center"><span style="font-size:16px;"><span style="font-size:18px;">迭代器模式</span></span></p><p align="center"><span style="font-family:'Times New Roman';font-size:18px;">Iterator&nbsp; Pattern</span></p></td><td valign="top"><p align="center"><span style="font-size:16px;"><span style="font-size:18px;color:#ff0000;">★★★☆☆</span></span></p></td><td valign="top"><p align="center"><span style="font-size:16px;"><span style="font-size:18px;color:#ff0000;">★★★★★</span></span></p></td></tr><tr><td valign="top"><p align="center"><span style="font-size:16px;"><span style="font-size:18px;">中介者模式</span></span></p><p align="center"><span style="font-family:'Times New Roman';font-size:18px;">Mediator&nbsp; Pattern</span></p></td><td valign="top"><p align="center"><span style="font-size:16px;"><span style="font-size:18px;color:#ff0000;">★★★☆☆</span></span></p></td><td valign="top"><p align="center"><span style="font-size:16px;"><span style="font-size:18px;color:#ff0000;">★★☆☆☆</span></span></p></td></tr><tr><td valign="top"><p align="center"><span style="font-size:16px;"><span style="font-size:18px;">备忘录模式</span></span></p><p align="center"><span style="font-family:'Times New Roman';font-size:18px;">Memento&nbsp; Pattern</span></p></td><td valign="top"><p align="center"><span style="font-size:16px;"><span style="font-size:18px;color:#ff0000;">★★☆☆☆</span></span></p></td><td valign="top"><p align="center"><span style="font-size:16px;"><span style="font-size:18px;color:#ff0000;">★★☆☆☆</span></span></p></td></tr><tr><td valign="top"><p align="center"><span style="font-size:16px;"><span style="font-size:18px;">观察者模式</span></span></p><p align="center"><span style="font-family:'Times New Roman';font-size:18px;">Observer&nbsp; Pattern</span></p></td><td valign="top"><p align="center"><span style="font-size:16px;"><span style="font-size:18px;color:#ff0000;">★★★☆☆</span></span></p></td><td valign="top"><p align="center"><span style="font-size:16px;"><span style="font-size:18px;color:#ff0000;">★★★★★</span></span></p></td></tr><tr><td valign="top"><p align="center"><span style="font-size:16px;"><span style="font-size:18px;">状态模式</span></span></p><p align="center"><span style="font-family:'Times New Roman';font-size:18px;">State&nbsp; Pattern</span></p></td><td valign="top"><p align="center"><span style="font-size:16px;"><span style="font-size:18px;color:#ff0000;">★★★☆☆</span></span></p></td><td valign="top"><p align="center"><span style="font-size:16px;"><span style="font-size:18px;color:#ff0000;">★★★☆☆</span></span></p></td></tr><tr><td valign="top"><p align="center"><span style="font-size:16px;"><span style="font-size:18px;">策略模式</span></span></p><p align="center"><span style="font-family:'Times New Roman';font-size:18px;">Strategy&nbsp; Pattern</span></p></td><td valign="top"><p align="center"><span style="font-size:16px;"><span style="font-size:18px;color:#ff0000;">★☆☆☆☆</span></span></p></td><td valign="top"><p align="center"><span style="font-size:16px;"><span style="font-size:18px;color:#ff0000;">★★★★☆</span></span></p></td></tr><tr><td valign="top"><p align="center"><span style="font-size:16px;"><span style="font-size:18px;">模板方法模式</span></span></p><p align="center"><span style="font-family:'Times New Roman';font-size:18px;">Template&nbsp; Method Pattern</span></p></td><td valign="top"><p align="center"><span style="font-size:16px;"><span style="font-size:18px;color:#ff0000;">★★☆☆☆</span></span></p></td><td valign="top"><p align="center"><span style="font-size:16px;"><span style="font-size:18px;color:#ff0000;">★★★☆☆</span></span></p></td></tr><tr><td valign="top"><p align="center"><span style="font-size:16px;"><span style="font-size:18px;">访问者模式</span></span></p><p align="center"><span style="font-family:'Times New Roman';font-size:18px;">Visitor&nbsp; Pattern</span></p></td><td valign="top"><p align="center"><span style="font-size:16px;"><span style="font-size:18px;color:#ff0000;">★★★★☆</span></span></p></td><td valign="top"><p align="center"><span style="font-size:16px;"><span style="font-size:18px;color:#ff0000;">★☆☆☆☆</span></span></p></td></tr></tbody></table>

<br>
<br>

### 设计模式解决什么问题
我们为什么需要设计模式？从事前端开发这么久，好像不用设计模式，我们也能完成日常开发工作，也能通过算法解决复杂的问题。那么我们为什么还需要设计模式？使用设计模式对于软件设计有如下优点：
- 避免我们做一些重复性的工作，使得软件设计的方案更容易被复用。
- 开闭原则是大多数设计模式考虑的原则，它可以使得我们的设计方案更容易被扩展。
- 无论你是web端，还是服务端，还是客户端，设计模式都是通用的，它可以使得开发人员之间的沟通和交流更顺畅，使得设计方案也更加通俗易懂。
- 设计模式的强大的重用性和可扩展性，使得你的方案设计更加可靠。

除了上面提到的一系列好处，学习设计模式，可以让初学者更加深入理解面向对象编程的思想。学完了设计模式，你可以知道：如何将代码分散在几个不同的类中？为什么要有“接口”？何谓针对抽象编程？何时不应该使用继承？如果不修改源代码增加新功能？同时还让你能够更好地阅读和理解现有类库与其他系统中的源代码。
<br>
<br>
设计模式使代码编写真正工程化，设计模式是软件工程的基石脉络，如同大厦的结构一样。
<br>
<br>
### 反模式
一种设计模式代表一种设计代码的最佳实践，一种反模式就代表我们从编码中学到的教训。反模式具体是指：
- 描述一种针对某个特定问题的不良解决方案，该方案会导致糟糕的情况发生
- 描述如何摆脱前述的糟糕情况以及如何创建良好的解决方案
  
JavaScript中的一些反模式：
- 在全局上下文中定义大量的变量污染全局命名空间
- 向setTimeout和setInterval传递字符串，而不是函数，会触发eval()的内部使用
- 修改Object类的原型
- 滥用document.write()

其它一些软件设计和管理中的反模式例如：过度设计（花费资源完成比实际需要的还要复杂的工程）、软件膨胀（随着软件的增大，系统越来越消耗资源和难以维护）、九九定律（当项目“几近完成”时，低估完成项目所需时间的倾向）等。想了解更多的反模式，可以查看如下链接[反模式](https://zh.wikipedia.org/wiki/%E5%8F%8D%E9%9D%A2%E6%A8%A1%E5%BC%8F)。
<br>
<br>
### 使用设计模式中的一些指南
<br>
#### 保持简单
当你在设计代码的时候，应该尽可能用最简单的方式解决问题，你的目标应该是简单，而不是“如何在这个问题中应用模式”，不能认为不使用某个模式解决某个问题，就不是经验丰富的开发人员。为了让你的设计简单而有弹性，有时候使用设计模式就是做好的方法。

#### 要知道何时需要使用设计模式
这是个很重要的问题：何时使用设计模式？当你在设计的时候，如果确定你的设计可以利用某个模式解决某个问题，那么你就可以使用这个模式。如果有更加简单的方案，那么使用模式之前应该先尝试简单的方案。
<br>
<br>
要知道何时使用某个模式，需要你的经验和知识，你需要对大部分设计模式有准确的认知，知道它们能解决的问题，适用的场景。
<br>
<br>
除了设计的时候可以考虑设计模式，重构的时候也是它大显身手的时候。

#### 重构的时间就是设计模式的时间
重构就是通过改变你的代码来改进它的组织方式的过程。目标是改善其结构，而不是改善它的行为和产生的效果。这个时候，你就可以检查你的设计，能否可以使用设计模式来让它变得更好。比如，如果你的代码内充满了条件语句，这可能就意味着需要使用[状态模式](/posts/design-pattern/state-pattern.html)或者利用工厂模式将这些具体的依赖消除掉。

#### 删除你不需要的设计模式
当你的系统变得很复杂，而且不需要预留任何弹性的时候，就不要使用设计模式了，应该使用更简单的方案来达到目的，换句话来说，就是当一个简单的方案比使用设计模式更恰当的时候，你就可以删除这个设计模式了。

#### 如果你现在不要，就先别做
设计模式很强大，所以让人很容易在当前设计中看到模式的各种应用，开发人员天生喜欢创建漂亮的架构以应对任何方向的改变。我们应该避免这种诱惑，如果在当下的设计当中需要去支持改变，那应该就放手去使用设计模式来处理这种改变。然而，如果理由只是假想的，就不要添加这个模式，因为这会将系统越设计越复杂，而且可能你永远都不会需要它。

### 推荐书籍
#### Head First设计模式
<center>

![heade first](/headFirst.jpg)

</center>
经典的经典，Head First通过故事结合解决一个个问题的形式来讲述设计模式，使得设计模式不再枯燥，书中的例子都是Java代码，让你对面向对象的概念和编程有更深的理解。
<br>
<br>

#### JavaScript设计模式开发与实践
<center>

![javascript design patterns](/JavaScript-Design-Patterns.jpg)

</center>
腾讯的高级前端开发工程师曾探所著，此书介绍了JS中常用的设计模式，并详细介绍了每种模式利用JS语言的动态性来实现会更加简单，让我在们日常开发中使用更加方便。
