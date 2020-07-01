---
title: Webpack概述
tags: [webpack]
categories: [webpack]
---
如果2020年作为一个前端开发你还不知道 `Webpack` 是什么，真的就要考虑回炉重造了。很多人可能会得意洋洋，嘴角上扬回答：这谁不知道，不就是一个项目构建工具吗，我们的项目现在都用着了。这我当然信，但是如果让你认真介绍 `Webpack` 核心的概念有哪些，底层的原理是怎么样的，那么你还能淡定地娓娓道来吗？之前的我可能也跟大部分人一样，只停留在简单会用，知道的水平，而且几乎每个经历过的项目也都在使用，也知道 `create-react-app` 和 `vue-cli` 底层都是依赖 `webpack`，但是我觉得作为一个想要更进阶的前端工程师，你需要掌握的更多。这也是为什么我想写这篇文章的原因之一，这是也是我重新学习 `Webpack` 系列的第一篇：Webpack概述。

### 一句话介绍
先看官网的介绍：
> **webpack** is a static module bundler for modern JavaScript applications.

翻译过来大概的意思就是 `Webpack` 是一个现代的 `JavaScript` **应用** **模块** 打包器。首先我们要清楚它的定位是为 `JavaScript 应用` 服务的，有时候我们开发一些组件库、工具库，开发完后也需要有一个打包构建、上线这样一个过程，这种类型的项目我们一般不用 `Webpack`，而是用 `Rollup` 这样的工具。第二，我们要注意的是，上面我特意加粗的另一个关键词：**模块**。那么在 `Webpack` 眼里到底哪些是模块？

### 一切皆模块
随着 `Commonjs` 的出现，`CMD` 和 `AMD` 模块思想的诞生，`ES Module` 逐渐成为标准， `JavaScript` 终于进入了模块化编程的时代。模块化编程使得我们更好的组织JS代码，合理的划分也使得代码更容易调试、测试。NodeJS诞生的时候就有自己的模块化，而Web的模块进展一直比较缓慢。与Node.js模块相比，webpack模块可以用多种方式表达模块之间的依赖关系。下面是一些例子:

- ES2015 `import` ；
- CommonJS `require()`；
- AMD的 `define` 和 `require`；
- css/sass/less 文件中的 `@import`；
- 样式文件中的图片 `url(...)` 和 HTML 中的`<img src="...">`。
  
`Webpack` 也支持各种各样的模块，下面是一些常用的例子：

- TypeScript
- ESNext
- Sass
- Less
- Stylus
- Vue
- ...

我们知道 `Webpack` 主要是一个 `JavaScript` 的打包器，那么它怎么识别和处理其它的非JS模块呢？这就牵涉到 `Webpack` 最重要的概念： `Loader`，下面我们开始介绍 `Webpack` 的核心概念。

### 核心概念
<br />

#### Entry
入口表明了 `Webpack` 从哪个模块开始构建内部的依赖图，`Webpack` 将找出入口所依赖的其它模块和库。它的默认值是 `src/index.js`，你也可以通过配置指定不同的路径：

```javascript
module.exports = {
  entry: './path/to/my/entry/file.js'
};
```
你也可以配置多个入口，在开发多页面应用的时候就可能需要配置多个入口：

```js
module.exports = {
  entry: {
    app: './src/app.js',
    adminApp: './src/adminApp.js'
  }
};
```

#### Output
既然有入口，那就有出口，出口选项告诉 `Webpack` 构建好的 `bundles` 放在哪个目录下以及怎么命名输出的文件。默认值是：`./dist/main.js`，输出的文件默认都放在 `dist` 目录下。当然你也可以自定义自己的 `output` 选项：
```javascript
const path = require('path');

module.exports = {
  entry: './path/to/my/entry/file.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'my-first-webpack.bundle.js'
  }
};
```
在上面的例子中，`output.path` 告诉 `Webpack` 输出的文件放在什么目录下，`output.filename` 指明生成的文件命名规则。

#### Loaders
前面我们提到了一切资源（字体文件、图片、CSS、预编译器Sass等）甚至 `Vue` 组件在 `Webpack` 中都被当成模块来处理，但是 `Webpack` 自身其实只是一个 `JavaScript Bundler` ，它只认识JS模块和JSON文件。由于在一个复杂的Web应用中，我们不只有JS模块，也有HTML、CSS、图片等资源，如果使用框架，还需要 `Vue SFC` ，`React jsx`等，所以这时候就需要 `Loaders` 出马了。`Loaders` 可以使得 `Webpack` 能够处理各种类型的模块，处理完后再把它们加入到依赖图中。

每个 `loader` 配置主要有两个选项：
- `test` 选项，确认哪些些文件将被 `loader` 转换，一般是一个正则表达式；
- `use` 选项，表明哪些 loaders 将被用来转换文件。

下面看一个例子：
```javascript
module.exports = {
  output: {
    filename: 'my-first-webpack.bundle.js'
  },
  module: {
    rules: [
      { test: /\.js$/, use: 'babel-loader' }
    ]
  }
};
```
上面的例子，定义了一个 `loader` 转换规则，它告诉 `Webpack` 编译器，当发现`js` 文件的时候，使用 `babel-loader` 进行转换。

我们还可以配置多个 `loader`，比如下面这个例子：
```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          // style-loader
          { loader: 'style-loader' },
          // css-loader
          {
            loader: 'css-loader',
            options: {
              modules: true
            }
          },
          // sass-loader
          { loader: 'sass-loader' }
        ]
      }
    ]
  }
};
```
上面这个例子告诉 `Webpack` 编译器，当遇到以 `.scss` 结尾的文件，先用 `sass-loader` 处理，接着再用 `css-loader` 转化，最后使用 `style-loader` 完成此类文件的处理，它的处理顺序是从后往前。

#### Plugins
`Loaders` 帮助 `Webpack` 处理不同类型的文件和模块，而插件被用来扩展 `Webpack` 的功能，使得`Webpack` 更加强大，插件可以用来优化 `bundle`（压缩文件、tree shaking、code split等）、管理静态资源和注入环境变量。

使用一个插件之前，首先通过 `require` 引入插件，然后将它添加到 `plugins` 选项数组中，大部分插件支持一些选项配置。由于可以在配置中为不同的需求多次使用插件，所以你需要通过使用new操作符调用插件来创建它的实例：
```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin'); //installed via npm

module.exports = {
  module: {
    rules: [
      { test: /\.txt$/, use: 'raw-loader' }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({template: './public/index.html'})
  ]
};
```
在上面的例子中，`html-webpack-plugin` 将会为你的应用生成一个 `html` 文件，并且这个文件会被自动注入 `Webpack` 处理生成的所有 `bundle`。

在 `Webpack` 中配置插件还是比较简单的，关键是你要了解生态中有哪些优秀的插件可以直接拿来使用，挑选出适合你自己项目的插件组合，在没有合适的插件支撑你的业务需求时，你也选择可以开发自己的 `Webpack` 插件。

以上是我觉得在 `Webapck` 中比较核心的概念，这些是你学习 `Webpack` 必须掌握的概念，`Entry` 和 `Output` 可能相对简单，`Loaders` 和 `Plugins` 机制是核心中的核心，其底层的原理也值得仔细探究，后续的文章中我会对其进行分析。

### 补充
在官方文档中，还提到两个点可以注意一下。一个是 `mode`，通过设置不同的值，告诉 `Webpack` 当前是开发环境还是生产环境。其主要的值有 `development` 、`production` 和 `none`，对于每个选项， `Wepack` 都会在底层做相应环境的一些优化，它的默认值是：`production`。

第二个点是 `Browser Compatibility`，也就是浏览器兼容性。webpack支持所有兼容es5的浏览器(不支持IE8及以下版本)。`Webpack` 中的 `import()` 和 `require.ensure()` 需要支持`Promise`，如果你想支持较老的浏览器，需要
引入 `Polyfill` ，想要了解更多，可以查看：[load polyfill](https://webpack.js.org/guides/shimming/)。




