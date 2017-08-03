# Flowly-JS

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

## Behaviours



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
