# Flowly-JS

Demo is [here](https://hyde2able.github.io/Flowly-js/)

## Setup

Add Flowly.js to your project with `npm install --save https://github.com/hyde2able/Flowly-js` or `yarn add https://github.com/hyde2able/Flowly-js`.

Now, you can require or import the library, depending on your favorite workflow.

```
const Flowly = require('flowly-js')
// or
import Flowly from 'flowly-js'
```

Of course you can also simply copy over the compiled file from the dist folder and include it like any other 3rd party script.
Make sure to run npm install in the Flowly folder to compile the project.
Or download the precompiled files from the release section.

```
<script src="dist/flowly.js"></script>
<!-- or if you prefer minified -->
<script src="dist/flowly.min.js"></script>
```

## Usage

```
var flowly = new Flowly('#container', {
  padding: { top: 10, bottom: 10 },
  duration: 3000
});

// Add Text
flowly.addText({
  body: 'message',
  size: 50,
  duration: 1500,
  color: '#333333',
  shadow: '#000000'
})

// Add Image
flowly.addImage({
  url: './images/fish.png',
  width: size + 'px',
  height: (size * 100 / 205 ) + 'px',
  duration: duration
})
```

## Behaviours

### Options

```
var options = {
  text: {
    weight: 'bold',
    size  : 56,
    color : '#000',
    shadow: '#fff',
    className: 'flowly-text',
    whiteSpace: 'nowrap' || 'pre',
    zIndex: 2147483647,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Helvetica Neue", "Yu Gothic", YuGothic, "ヒラギノ角ゴ ProN W3", Hiragino Kaku Gothic ProN, Arial, "メイリオ", Meiryo, sans-serif'
  },
  image: {
    height: '200px',
    width : 'auto',
    className: 'flowly-image',
  },
  padding: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  disable: false,
  duration: 2000,
  easing: 'linear',
  direction: 'right',
}

var flowly = new Flowly('#container', options)
```

| Property           | Values              | Default       | Description        |
| ------------------ | ------------------- | ------------- | ------------------ |
| `text.weight`      | `bold` or `normal`  | `bold`        | text font weight   |
| `text.size`        | `integer`           | 56            | text font size     |
| `text.color`       | `rgb`               | `#000`        | text font color    |
| `text.shadow`      | `rgb`               | `#fff`        | text shadow color  |
| `text.className`   | `string`            | `flowly-text` | text className     |
| `text.whiteSpace`  | `nowrap` or `pre`   | `nowrap`      | font whiteSpace    |
| `text.zIndex`      | `integer`           | `2147483647`  | text zIndex        |
| `text.fontFamily`  | `string`            | `...`         | text fontFamily    |
| `image.height`     | `string`            | `200px`       | image width        |
| `image.height`     | `string`            | `auto`        | image height       |
| `image.className`  | `string`            | `flowly-image`| image className    |
| `padding.top`      | `integer`           | `0`           | padding top        |
| `padding.bottom`   | `integer`           | `0`           | padding bottom     |
| `padding.left`     | `integer`           | `0`           | padding left       |
| `padding.right`    | `integer`           | `0`           | padding right      |
| `disable`          | `true` or `false`   | `false`       | disable flag       |
| `duration`         | `integer`           | `2000`        | animation duration |
| `easing`           | `string`            | `linear`      | animation easing   |
| `duration`         | `right` or `left` or `top` or `bottom` | `right`       | animation direction|


### Add Text Options

```
var options = {
  body: 'text message',
  color: '#000000'
  shadow: '#ffffff',
  size: 50,
  weight: 'bold',
  fontFamily: 'monospace',
  className: 'classname',
};

flowly.addText(options)
```

| Property           | Values              | Default       | Description        |
| ------------------ | ------------------- | ------------- | ------------------ |
| `body`             | `string`            | `[required]`  | text body          |
| `size`             | `integer`           | `56`          | text font size     |
| `color`            | `rgb`               | `#000`        | text font color    |
| `shadow`           | `rgb`               | `#fff`        | text shadow color  |
| `weight`           | `bold` or `normal`  | `bold`        | text font weight   |
| `className`        | `string`            | `flowly-text` | text className     |
| `fontFamily`       | `string`            | `...`         | text fontFamily    |

### Add Image Options

```
var options = {
  src: './images/hoge.png',
  width: '200px',
  height: '300px',
  className: 'classname',
};

flowly.addImage(options)
```

| Property           | Values              | Default        | Description        |
| ------------------ | ------------------- | -------------- | ------------------ |
| `src`              | `string`            | `[required]`   | image src          |
| `width`            | `string`            | `200px`        | image width        |
| `height`           | `string`            | `auto`         | image height       |
| `className`        | `string`            | `flowly-image` | image className    |

## Build

> As a prerequisite, you will need gulp installed: npm install -g gulp

```
npm install
npm run build
```

gulp will watch the source directory for changes and automatically build the dist files, serving some demo files with live reload.

## Authors

[@pokohide](https://github.com/hyde2able)

## License

Licensed under MIT. Enjoy.
