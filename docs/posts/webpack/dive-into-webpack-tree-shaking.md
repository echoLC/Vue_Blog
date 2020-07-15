---
title: 深入理解Webpack tree shaking
tags: [webpack]
categories: [webpack]
---

## tree shaking 是什么
首先我们先搞清楚，tree shaking是个什么东西，来看下 wiki 给的介绍：
> In computing, tree shaking is a dead code elimination technique that is applied when optimizing code written in ECMAScript dialects like Dart, JavaScript, or TypeScript into a single bundle that is loaded by a web browser

翻译过来，大概意思就是：在计算机中，摇树是一种死代码消除技术，用来优化由Dart、JavaScript或TypeScript等语言编写的由web浏览器加载的单个包的应用。

何谓“死代码”？那就是程序运行时执行不到或者说用不到的代码，如果是基于JS模块化开发，最经典的例子就是如果我们引用了 `lodash` 这样的库，但是我们在项目中其实只用到了比较少的 `utils`，但是构建工具一般会把整个包打包到最终生成的JS bundle。这时候，tree shaking就能发挥极大的作用了。

`treeshaker` 的概念起源于20世纪90年代的LISP，其表达的思想是：一个程序的所有可能的执行流都可以表示为函数调用树，这样那些从未被调用的函数就可以通过一定的技术手段被消除。那么为什么在 JavaScript 中最近几年才出现 ”tree shaking“ 这项技术？

## tree shaking的发展和ES6 Module带来的契机
我们知道 JavaScript 是一门动态的语言，而动态语言中的死代码消除是一个比静态语言更难的问题。但是其实在早期也有牛逼的团队开始做这方面的尝试，在2012年的时候，该算法应用于[Google Closure Tools ](https://en.wikipedia.org/wiki/Google_Closure_Tools)中的JavaScript，然后也应用于同样由谷歌编写的dart2js编译器中的 Dart 语言。2013年，作者Chris Buckett在《Dart in Action》一书中描述：

**当代码从Dart转换为JavaScript时，编译器会执行“摇树”操作。在JavaScript中，即使只需要一个函数，也必须添加整个库，但是由于树抖动，Dart 派生的JavaScript只包含库中需要的单个函数。**

tree shaking下一波流行要归功于 [Rich Harris](https://github.com/Rich-Harris) 在2015年开发的 Rollup 项目，Rich Harris 是著名的开源大神，`Rollup` 和 `svelte` 作者。

随着ES6的出现，ES6 中的模块化方案成为了未来 JS 的标准，也标志着 JS 正式迈入模块化编程的时代。
ES6 Module 是一种可以做静态分析的模块机制，这使得 `tree shaking` 的技术成为了打包工具不可缺少的技术。事实上，当前主流的tree shaking 技术依赖于 `ES6` 中的 `import` 和 `export` 模块机制， 打包器会检测代码中的模块是否被导出、导入，且被 JavaScript 文件使用。

## Webpack 中的tree shaking
Weback2的正式版已经开始支持 ES6 模块语法（也叫做 harmony modules），其中也包含了 `dead code` 检测能力，webpack4正式版本扩展和加强了 tree shaking 技术。

#### sideEffects

怎么能够让 Webpack 知道你项目的模块或者指定的模块都是 ES6 Module ，可以让 Webpack 在构建的时候放心消除 `dead code`？其中一种方式是通过往 `package.json` 中添加 `sideEffects` 属性，将其值设置为 `false`，来告知 webpack，项目中都是 ”pure“(纯正 ES6 模块)，可以安全地删除未用到的 export。

如果我们想要告诉 `webpack` 有些文件有副作用，不能 `shaking` 掉的，我们可以指定一个数组，例如：
```json
{
  "name": "your-project",
  "sideEffects": [
    "./src/some-side-effectful-file.js"
  ]
}
```
来告诉 `webpack` 这些文件不能优化。数组方式支持相对路径、绝对路径和 glob 模式匹配相关文件。b包含在数组中的文件将不会受到 tree shaking 的影响，因为默认情况下，所有导入文件都会受到 tree shaking 的影响。这意味着，如果在项目中使用类似 css-loader 并 import 一个 CSS 文件，则需要将其添加到 side effect 列表中，以免在生产模式中无意中将它删除：
```json
{
  "name": "your-project",
  "sideEffects": [
    "./src/some-side-effectful-file.js",
    "*.css"
  ]
}
```
你也可以通过 `module.rules` 配置选项设置 `sideEffects`，具体查看文档[module.rules](https://webpack.docschina.org/configuration/module/#rulesideeffects)。

#### usedExports
除了 `sideEffects` ，我们也可以通过配置 `usedExports` 属性提示 `webpack` 做 tree shaking 优化。例如：
```js
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'development',
  optimization: {
    usedExports: true,
  },
};
```
`sideEffects` 和 `usedExports` 是两种不同的优化方式，但是 `sideEffects` 更有效，是因为它允许跳过整个模块/文件和整个文件子树，使得优化更有效率。`usedExports` 依赖于 [terser](https://github.com/terser/terser)(一个适用于ES6+的JavaScript解析器、压缩和优化工具包) 去检测语句中的副作用。它是一个 JavaScript 任务而且没有像 `sideEffects` 一样简单直接。

### 看一个官网的例子
虽然 `usedExports` 在分析 `export` 函数一般没有问题，但 React 框架的高阶函数（HOC）在这种情况下是会出问题的。

我们看个例子：
```js
import { Button } from '@shopify/polaris';
```

打包前的文件版本看起来是这样的：
```
import hoistStatics from 'hoist-non-react-statics';

function Button(_ref) {
  // ...
}

function merge() {
  var _final = {};

  for (var _len = arguments.length, objs = new Array(_len), _key = 0; _key < _len; _key++) {
    objs[_key] = arguments[_key];
  }

  for (var _i = 0, _objs = objs; _i < _objs.length; _i++) {
    var obj = _objs[_i];
    mergeRecursively(_final, obj);
  }

  return _final;
}

function withAppProvider() {
  return function addProvider(WrappedComponent) {
    var WithProvider =
    /*#__PURE__*/
    function (_React$Component) {
      // ...
      return WithProvider;
    }(Component);

    WithProvider.contextTypes = WrappedComponent.contextTypes ? merge(WrappedComponent.contextTypes, polarisAppProviderContextTypes) : polarisAppProviderContextTypes;
    var FinalComponent = hoistStatics(WithProvider, WrappedComponent);
    return FinalComponent;
  };
}

var Button$1 = withAppProvider()(Button);

export {
  // ...,
  Button$1
};
```
如果 `Button` 没有被使用，工具可以有效地清除掉 export { Button$1 }，且保留所有剩下的代码。
但是问题来了，剩下的代码能被清理掉吗或者它们有副作用吗？这不太好说。尤其是 withAppProvider()(Button) 这段代码。withAppProvider 被调用，而且返回的值也被调用。当调用 merge 或 hoistStatics 会有任何副作用吗？当给 WithProvider.contextTypes (Setter?) 赋值或当读取 WrappedComponent.contextTypes (Getter) 的时候，会有任何副作用吗？

尽管 `Terser` 尝试去解决上面的问题，但是大多数情况，它不确定。这不是说 terser 由于无法解决这些问题而应用得不好，而是由于在 JavaScript 这种动态语言中实在很难去确定。

我们可以通过添加 `/*#__PURE__*/` 注释来帮助 `Terser`，前面这个注释告诉 `Terser`，这个调用是没有副作用的，可以使用 `tree shaking` 优化。
```js
var Button$1 = /*#__PURE__*/ withAppProvider()(Button);
```
这样的标记，会允许 `Terser` 移除这段代码，但是可能还会有一些导入的问题需要评估，因为它们包含了副作用。

为了更好解决上面这样的问题，可以直接使用 `sideEffects` 属性。虽然它的功能类似于 `/*#__PURE__*/`，但是它是作用于模块层面，而不是代码语句的层面。这个属性告诉 `webpack`：被标记为无副作用的模块如果没有被直接导出使用，那就跳过对该模块的副作用的分析评估。

在一个 Shopify Polaris 的例子，原有的模块如下：

**index.js**
```js
import './configure';
export * from './types';
export * from './components';
```

**components/index.js**
```js
export { default as Breadcrumbs } from './Breadcrumbs';
export { default as Button, buttonFrom, buttonsFrom, } from './Button';
export { default as ButtonGroup } from './ButtonGroup';
```

**package.json**
```js
// ...
"sideEffects": [
  "**/*.css",
  "**/*.scss",
  "./esnext/index.js",
  "./esnext/configure.js"
],
// ...
```
上述的优化，其它的项目都可以应用。例如：从 Button.js 导出 的buttonFrom 和 buttonsFrom 也没有被使用。`usedExports` 优化会保留这些代码而且 terser 能够从 bundle 中把这些语句挑选出来。模块合并也会被应用，所以这4个模块，加上入口的模块（也可能有更多的依赖）会被合并。

#### 将函数调用标记为无副作用
我们同样可以通过 `/*#__PURE__*/` 告诉 `webpack` 某个函数调用是无副作用的，注释一般放在函数调用之前。例如：
```
/*#__PURE__*/ add(55, 45);
```
当然传入到函数中的参数是无法被刚才的注释所标记，需要单独每一个标记才可以。如果想要清理一些未被使用的变量，其实这也算是一种 `dead code`，webpack 有其它的配置来完成这项优化，具体可以查看[optimization.innerGraph](https://webpack.docschina.org/configuration/optimization/#optimizationinnergraph)，这里就不再展开。

### 总结
文章从 tree shaking的发展历史到 `webpack` 中的 `tree shaking` 的具体使用以及一些需要注意的坑全面讲解了 `webpack tree shaking` 技术的强大。最后我们得出结论，如果想要你的项目利用好这项技术，你需要注意：
- 使用 ES2015 模块语法（即 import 和 export）。
- 确保没有编译器将你项目中的 ES2015 模块语法转换为 CommonJS 的（这是现在常用的 @babel/preset-env 的默认行为，详细信息请参阅文档）。
- 在项目的 package.json 文件中，添加 "sideEffects" 属性。
- 使用 mode 为 "production" 的配置项以启用更多优化项，包括压缩代码与 tree shaking。

如果把应用程序的源码看成一棵树，那么绿色的树叶代表的是实际使用到的源码，也就是树上还活着的树叶。而棕色的树叶代表 `dead code`，是秋天树上枯萎的树叶。为了把枯萎的树叶从树上除去，就需要摇动这棵树，此即 `tree shaking` 的类比。

### Reference
- [Webpack Tree Shaking](https://webpack.js.org/guides/tree-shaking/)
- [Wiki Tree Shaking](https://en.wikipedia.org/wiki/Tree_shaking)
- [Tree-shaking versus dead code elimination](https://medium.com/@Rich_Harris/tree-shaking-versus-dead-code-elimination-d3765df85c80)
  