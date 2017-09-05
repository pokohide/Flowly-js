(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Flowly = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var requestFrame = (function () {
  var window = this
  var raf = window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    function fallbackRAF(func) {
      return window.setTimeout(func, 20)
    }
  return function requestFrameFunction(func) {
    return raf(func)
  }
})()

var cancelFrame = (function () {
  var window = this
  var cancel = window.cancelAnimationFrame ||
    window.mozCancelAnimationFrame ||
    window.webkitCancelAnimationFrame ||
    window.clearTimeout
  return function cancelFrameFunction(id) {
    return cancel(id)
  }
})()

function resizeListener(e) {
  var win = e.target || e.srcElement
  if (win.__resizeRAF__) {
    cancelFrame(win.__resizeRAF__)
  }
  win.__resizeRAF__ = requestFrame(function () {
    var trigger = win.__resizeTrigger__
    trigger.__resizeListeners__.forEach(function (fn) {
      fn.call(trigger, e)
    })
  })
}

var exports = function exports(element, fn) {
  var window = this
  var document = window.document
  var isIE

  var attachEvent = document.attachEvent
  if (typeof navigator !== 'undefined') {
    isIE = navigator.userAgent.match(/Trident/) ||
      navigator.userAgent.match(/Edge/)
  }

  function objectLoad() {
    this.contentDocument.defaultView.__resizeTrigger__ = this.__resizeElement__
    this.contentDocument.defaultView.addEventListener('resize', resizeListener)
  }

  if (!element.__resizeListeners__) {
    element.__resizeListeners__ = []
    if (attachEvent) {
      element.__resizeTrigger__ = element
      element.attachEvent('onresize', resizeListener)
    } else {
      if (getComputedStyle(element).position === 'static') {
        element.style.position = 'relative'
      }
      var obj = (element.__resizeTrigger__ = document.createElement('object'))
      obj.setAttribute(
        'style',
        'display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; pointer-events: none; z-index: -1; opacity: 0;'
      )
      obj.setAttribute('class', 'resize-sensor')
      obj.__resizeElement__ = element
      obj.onload = objectLoad
      obj.type = 'text/html'
      if (isIE) {
        element.appendChild(obj)
      }
      obj.data = 'about:blank'
      if (!isIE) {
        element.appendChild(obj)
      }
    }
  }
  element.__resizeListeners__.push(fn)
}

module.exports = typeof window === 'undefined' ? exports : exports.bind(window)

module.exports.unbind = function (element, fn) {
  var attachEvent = document.attachEvent
  if (fn) {
    element.__resizeListeners__.splice(
      element.__resizeListeners__.indexOf(fn),
      1
    )
  } else {
    element.__resizeListeners__ = []
  }
  if (!element.__resizeListeners__.length) {
    if (attachEvent) {
      element.detachEvent('onresize', resizeListener)
    } else {
      element.__resizeTrigger__.contentDocument.defaultView.removeEventListener(
        'resize',
        resizeListener
      )
      delete element.__resizeTrigger__.contentDocument.defaultView.__resizeTrigger__
      element.__resizeTrigger__ = !element.removeChild(
        element.__resizeTrigger__
      )
    }
    delete element.__resizeListeners__
  }
}

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('../utils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Base = function () {
  function Base(opts) {
    _classCallCheck(this, Base);

    this.token = (0, _utils.randomStr)();
    this.opts = opts;
  }

  _createClass(Base, [{
    key: '_createEffect',
    value: function _createEffect(elem, rect, type) {
      var padding = this.opts.padding;


      switch (type) {
        case 'right':

          elem.style.left = rect.left + rect.width + 'px';
          elem.style.top = (0, _utils.rand)(padding.top, rect.height - elem.clientHeight - padding.bottom) + 'px';

          return [{
            left: rect.width + 'px'
          }, {
            left: -elem.clientWidth + 'px'
          }];

        case 'left':

          elem.style.left = -elem.clientWidth + 'px';
          elem.style.top = (0, _utils.rand)(padding.top, rect.height - elem.clientHeight - padding.bottom) + 'px';

          return [{
            left: -elem.clientWidth + 'px'
          }, {
            left: rect.width + 'px'
          }];

        case 'top':

          elem.style.left = (0, _utils.rand)(0, rect.width - elem.clientWidth) + 'px';
          elem.style.top = -elem.clientWidth + 'px';

          return [{
            top: -elem.clientHeight + 'px'
          }, {
            top: rect.height + 'px'
          }];

        case 'bottom':

          elem.style.left = (0, _utils.rand)(0, rect.width - elem.clientWidth) + 'px';
          elem.style.top = rect.height + 'px';

          return [{
            top: rect.height + 'px'
          }, {
            top: -elem.clientHeight + 'px'
          }];
        case 'top-right':

          break;
        case 'top-left':

          break;
        case 'bottom-right':

          break;
        case 'bottom-left':

          break;
        case 'random':

          elem.style.opacity = 0.0;
          elem.style.left = (0, _utils.rand)(padding.left, rect.width - padding.right) - elem.clientWidth / 2 + 'px';
          elem.style.top = (0, _utils.rand)(padding.top, rect.height - padding.bottom) - elem.clientHeight / 2 + 'px';

          return [{
            opacity: 0.0,
            transform: 'scale(0.2, 0.2) translate(0, 20px)'
          }, {
            opacity: 1.0,
            transform: 'scale(0.5, 0.5) translate(0, 0px)'
          }, {
            opacity: 0.0,
            transform: 'scale(1.0, 1.0) translate(0, -50px)'
          }];
      }
    }
  }, {
    key: '_createTiming',
    value: function _createTiming(rect, _ref) {
      var duration = _ref.duration,
          easing = _ref.easing;

      var timing = {};
      timing.iterations = 1;
      timing.duration = parseInt(duration || this.opts.duration, 10) * (rect.width + this.elem.offsetWidth) / rect.width;
      timing.easing = easing || this.opts.easing;

      return timing;
    }
  }, {
    key: 'hide',
    value: function hide() {
      this.elem.style.display = 'none';
    }
  }, {
    key: 'show',
    value: function show() {
      this.elem.style.display = 'block';
    }
  }]);

  return Base;
}();

exports.default = Base;

},{"../utils":6}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FlowlyImage = function (_Base) {
  _inherits(FlowlyImage, _Base);

  function FlowlyImage(image, options) {
    _classCallCheck(this, FlowlyImage);

    var _this = _possibleConstructorReturn(this, (FlowlyImage.__proto__ || Object.getPrototypeOf(FlowlyImage)).call(this, options));

    _this.elem = _this._createImage(image);
    return _this;
  }

  _createClass(FlowlyImage, [{
    key: '_createImage',
    value: function _createImage(image) {
      var t = document.createElement('img');

      t.style.position = 'absolute';
      t.className = image.className || this.opts.image.className;
      t.style.width = image.width || this.opts.image.width;
      t.style.height = image.height || this.opts.image.height;
      t.style.zIndex = 2147483647;
      t.src = image.url;
      return t;
    }
  }, {
    key: 'onload',
    value: function onload(func) {
      this.elem.addEventListener('load', func);
    }
  }, {
    key: 'addAnimation',
    value: function addAnimation(image, rect, onfinish) {
      var effect = this._createEffect(this.elem, rect, image.direction || this.opts.direction);
      var timing = this._createTiming(rect, image);

      this.elem.animate(effect, timing).onfinish = onfinish;
    }
  }]);

  return FlowlyImage;
}(_base2.default);

exports.default = FlowlyImage;

},{"./base":2}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FlowlyText = function (_Base) {
  _inherits(FlowlyText, _Base);

  function FlowlyText(text, options) {
    _classCallCheck(this, FlowlyText);

    var _this = _possibleConstructorReturn(this, (FlowlyText.__proto__ || Object.getPrototypeOf(FlowlyText)).call(this, options));

    _this.elem = _this._createText(text);
    return _this;
  }

  _createClass(FlowlyText, [{
    key: '_createText',
    value: function _createText(text) {
      var color = text.color || this.opts.text.color;
      var shadow = text.shadow || this.opts.text.shadow;
      var size = text.size || this.opts.text.size;
      var weight = text.weight || this.opts.text.weight;
      var fontFamily = text.fontFamily || this.opts.text.fontFamily;
      var t = document.createElement('span');

      t.className = text.className || this.opts.text.className;
      t.style.position = 'absolute';
      t.style.fontSize = size + 'px';
      t.style.fontWeight = weight;
      t.style.color = color;
      t.style.fontFamily = fontFamily;
      t.style.textShadow = '-2px -2px 0px ' + shadow + ', -2px 2px 0px ' + shadow + ', 2px -2px 0px ' + shadow + ', 2px 2px 0px ' + shadow;
      t.style.whiteSpace = this.opts.text.whiteSpace;
      t.style.zIndex = this.opts.text.zIndex;

      t.innerText = text.body;

      return t;
    }
  }, {
    key: 'addAnimation',
    value: function addAnimation(text, rect, onfinish) {
      var effect = this._createEffect(this.elem, rect, text.direction || this.opts.direction);
      var timing = this._createTiming(rect, text);

      this.elem.animate(effect, timing).onfinish = onfinish;
    }
  }]);

  return FlowlyText;
}(_base2.default);

exports.default = FlowlyText;

},{"./base":2}],5:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _elementResizeEvent = require('element-resize-event');

var _elementResizeEvent2 = _interopRequireDefault(_elementResizeEvent);

var _text = require('./flowly/text');

var _text2 = _interopRequireDefault(_text);

var _image = require('./flowly/image');

var _image2 = _interopRequireDefault(_image);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Flowly = function () {
  function Flowly(elem) {
    var _this = this;

    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Flowly);

    /* APP */
    this.elem = elem;
    this.app = document.querySelector(elem);
    this.app.style.position = 'relative';
    this.app.style.overflow = 'hidden';

    this.rect = this.app.getBoundingClientRect();
    this.opts = Object.assign(this._defaultOptions(), options);

    this.elems = new Map();
    (0, _elementResizeEvent2.default)(this.app, function () {
      _this.resize();
    });
  }

  _createClass(Flowly, [{
    key: 'addImage',
    value: function addImage(image) {
      var _this2 = this;

      if (this.opts.disable) return;

      var t = new _image2.default(image, this.opts);
      this.app.appendChild(t.elem);
      t.onload(function (e) {
        _this2.elems.set(t.token, t);

        t.addAnimation(image, _this2.rect, function () {
          _this2.app.removeChild(t.elem);
          _this2.elems.delete(t.token);
        });
      });
    }
  }, {
    key: 'addText',
    value: function addText(text) {
      var _this3 = this;

      if (this.opts.disable) return;

      var t = new _text2.default(text, this.opts);
      this.app.appendChild(t.elem);
      this.elems.set(t.token, t);

      t.addAnimation(text, this.rect, function () {
        _this3.app.removeChild(t.elem);
        _this3.elems.delete(t.token);
      });
    }

    // if true show text, if false hide text

  }, {
    key: 'toggle',
    value: function toggle(flag) {
      if (flag) this.show();else this.hide();
    }
  }, {
    key: 'hide',
    value: function hide() {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.elems.values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var elem = _step.value;
          elem.hide();
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }, {
    key: 'show',
    value: function show() {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.elems.values()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var elem = _step2.value;
          elem.show();
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  }, {
    key: 'resize',
    value: function resize() {
      this.app = document.querySelector(this.elem);
      this.app.style.position = 'relative';
      this.app.style.overflow = 'hidden';
      this.rect = this.app.getBoundingClientRect();
    }
  }, {
    key: 'update',
    value: function update() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      this.opts = Object.assign(this.opts, options);
    }
  }, {
    key: 'unbind',
    value: function unbind() {
      _elementResizeEvent2.default.unbind(this.app);
      this.update({ disable: true });
    }
  }, {
    key: '_defaultOptions',
    value: function _defaultOptions() {
      return {
        text: {
          weight: 'bold',
          size: 56,
          color: '#000',
          shadow: '#fff',
          className: 'flowly-text',
          whiteSpace: 'nowrap' || 'pre',
          zIndex: 2147483647,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Helvetica Neue", "Yu Gothic", YuGothic, "ヒラギノ角ゴ ProN W3", Hiragino Kaku Gothic ProN, Arial, "メイリオ", Meiryo, sans-serif'
        },
        image: {
          height: '200px',
          width: 'auto',
          className: 'flowly-image'
        },
        padding: {
          left: 0,
          right: 0,
          top: 0,
          bottom: 0
        },
        disable: false,
        duration: 2000,
        easing: 'linear',
        direction: 'right'
      };
    }
  }]);

  return Flowly;
}();

module.exports = Flowly;

},{"./flowly/image":3,"./flowly/text":4,"./utils":6,"element-resize-event":1}],6:[function(require,module,exports){
'use strict';

var rand = function rand(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
};

var randomStr = function randomStr() {
  var length = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 32;

  var s = '';
  for (var i = 0; i < length; i++) {
    var random = Math.random() * 16 | 0;
    s += (i == 12 ? 4 : i == 16 ? random & 3 | 8 : random).toString(16);
  }
  return s;
};

module.exports = {
  rand: rand,
  randomStr: randomStr
};

},{}]},{},[5])(5)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvZWxlbWVudC1yZXNpemUtZXZlbnQvaW5kZXguanMiLCJzcmMvZmxvd2x5L2Jhc2UuanMiLCJzcmMvZmxvd2x5L2ltYWdlLmpzIiwic3JjL2Zsb3dseS90ZXh0LmpzIiwic3JjL2luZGV4LmpzIiwic3JjL3V0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7QUMvR0E7Ozs7SUFFcUIsSTtBQUNuQixnQkFBWSxJQUFaLEVBQWtCO0FBQUE7O0FBQ2hCLFNBQUssS0FBTCxHQUFhLHVCQUFiO0FBQ0EsU0FBSyxJQUFMLEdBQVksSUFBWjtB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QixFQUE0QixHQUE1QixFQUFpQztBQUMvQixRQUFNLFNBQVMsS0FBSyxNQUFMLEtBQWdCLEVBQWhCLEdBQXFCLENBQXBDO0FBQ0EsU0FBSyxDQUFDLEtBQUssRUFBTCxHQUFVLENBQVYsR0FBZSxLQUFLLEVBQUwsR0FBVyxTQUFTLENBQVQsR0FBYSxDQUF4QixHQUE2QixNQUE3QyxFQUFzRCxRQUF0RCxDQUErRCxFQUEvRCxDQUFMO0FBQ0Q7QUFDRCxTQUFPLENBQVA7QUFDRCxDQVBEOztBQVNBLE9BQU8sT0FBUCxHQUFpQjtBQUNmLFlBRGU7QUFFZjtBQUZlLENBQWpCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciByZXF1ZXN0RnJhbWUgPSAoZnVuY3Rpb24gKCkge1xuICB2YXIgd2luZG93ID0gdGhpc1xuICB2YXIgcmFmID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuICAgIHdpbmRvdy5tb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICB3aW5kb3cud2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgZnVuY3Rpb24gZmFsbGJhY2tSQUYoZnVuYykge1xuICAgICAgcmV0dXJuIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmMsIDIwKVxuICAgIH1cbiAgcmV0dXJuIGZ1bmN0aW9uIHJlcXVlc3RGcmFtZUZ1bmN0aW9uKGZ1bmMpIHtcbiAgICByZXR1cm4gcmFmKGZ1bmMpXG4gIH1cbn0pKClcblxudmFyIGNhbmNlbEZyYW1lID0gKGZ1bmN0aW9uICgpIHtcbiAgdmFyIHdpbmRvdyA9IHRoaXNcbiAgdmFyIGNhbmNlbCA9IHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSB8fFxuICAgIHdpbmRvdy5tb3pDYW5jZWxBbmltYXRpb25GcmFtZSB8fFxuICAgIHdpbmRvdy53ZWJraXRDYW5jZWxBbmltYXRpb25GcmFtZSB8fFxuICAgIHdpbmRvdy5jbGVhclRpbWVvdXRcbiAgcmV0dXJuIGZ1bmN0aW9uIGNhbmNlbEZyYW1lRnVuY3Rpb24oaWQpIHtcbiAgICByZXR1cm4gY2FuY2VsKGlkKVxuICB9XG59KSgpXG5cbmZ1bmN0aW9uIHJlc2l6ZUxpc3RlbmVyKGUpIHtcbiAgdmFyIHdpbiA9IGUudGFyZ2V0IHx8IGUuc3JjRWxlbWVudFxuICBpZiAod2luLl9fcmVzaXplUkFGX18pIHtcbiAgICBjYW5jZWxGcmFtZSh3aW4uX19yZXNpemVSQUZfXylcbiAgfVxuICB3aW4uX19yZXNpemVSQUZfXyA9IHJlcXVlc3RGcmFtZShmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHRyaWdnZXIgPSB3aW4uX19yZXNpemVUcmlnZ2VyX19cbiAgICB0cmlnZ2VyLl9fcmVzaXplTGlzdGVuZXJzX18uZm9yRWFjaChmdW5jdGlvbiAoZm4pIHtcbiAgICAgIGZuLmNhbGwodHJpZ2dlciwgZSlcbiAgICB9KVxuICB9KVxufVxuXG52YXIgZXhwb3J0cyA9IGZ1bmN0aW9uIGV4cG9ydHMoZWxlbWVudCwgZm4pIHtcbiAgdmFyIHdpbmRvdyA9IHRoaXNcbiAgdmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50XG4gIHZhciBpc0lFXG5cbiAgdmFyIGF0dGFjaEV2ZW50ID0gZG9jdW1lbnQuYXR0YWNoRXZlbnRcbiAgaWYgKHR5cGVvZiBuYXZpZ2F0b3IgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgaXNJRSA9IG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL1RyaWRlbnQvKSB8fFxuICAgICAgbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvRWRnZS8pXG4gIH1cblxuICBmdW5jdGlvbiBvYmplY3RMb2FkKCkge1xuICAgIHRoaXMuY29udGVudERvY3VtZW50LmRlZmF1bHRWaWV3Ll9fcmVzaXplVHJpZ2dlcl9fID0gdGhpcy5fX3Jlc2l6ZUVsZW1lbnRfX1xuICAgIHRoaXMuY29udGVudERvY3VtZW50LmRlZmF1bHRWaWV3LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHJlc2l6ZUxpc3RlbmVyKVxuICB9XG5cbiAgaWYgKCFlbGVtZW50Ll9fcmVzaXplTGlzdGVuZXJzX18pIHtcbiAgICBlbGVtZW50Ll9fcmVzaXplTGlzdGVuZXJzX18gPSBbXVxuICAgIGlmIChhdHRhY2hFdmVudCkge1xuICAgICAgZWxlbWVudC5fX3Jlc2l6ZVRyaWdnZXJfXyA9IGVsZW1lbnRcbiAgICAgIGVsZW1lbnQuYXR0YWNoRXZlbnQoJ29ucmVzaXplJywgcmVzaXplTGlzdGVuZXIpXG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChnZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpLnBvc2l0aW9uID09PSAnc3RhdGljJykge1xuICAgICAgICBlbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gJ3JlbGF0aXZlJ1xuICAgICAgfVxuICAgICAgdmFyIG9iaiA9IChlbGVtZW50Ll9fcmVzaXplVHJpZ2dlcl9fID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb2JqZWN0JykpXG4gICAgICBvYmouc2V0QXR0cmlidXRlKFxuICAgICAgICAnc3R5bGUnLFxuICAgICAgICAnZGlzcGxheTogYmxvY2s7IHBvc2l0aW9uOiBhYnNvbHV0ZTsgdG9wOiAwOyBsZWZ0OiAwOyBoZWlnaHQ6IDEwMCU7IHdpZHRoOiAxMDAlOyBvdmVyZmxvdzogaGlkZGVuOyBwb2ludGVyLWV2ZW50czogbm9uZTsgei1pbmRleDogLTE7IG9wYWNpdHk6IDA7J1xuICAgICAgKVxuICAgICAgb2JqLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAncmVzaXplLXNlbnNvcicpXG4gICAgICBvYmouX19yZXNpemVFbGVtZW50X18gPSBlbGVtZW50XG4gICAgICBvYmoub25sb2FkID0gb2JqZWN0TG9hZFxuICAgICAgb2JqLnR5cGUgPSAndGV4dC9odG1sJ1xuICAgICAgaWYgKGlzSUUpIHtcbiAgICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZChvYmopXG4gICAgICB9XG4gICAgICBvYmouZGF0YSA9ICdhYm91dDpibGFuaydcbiAgICAgIGlmICghaXNJRSkge1xuICAgICAgICBlbGVtZW50LmFwcGVuZENoaWxkKG9iailcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgZWxlbWVudC5fX3Jlc2l6ZUxpc3RlbmVyc19fLnB1c2goZm4pXG59XG5cbm1vZHVsZS5leHBvcnRzID0gdHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcgPyBleHBvcnRzIDogZXhwb3J0cy5iaW5kKHdpbmRvdylcblxubW9kdWxlLmV4cG9ydHMudW5iaW5kID0gZnVuY3Rpb24gKGVsZW1lbnQsIGZuKSB7XG4gIHZhciBhdHRhY2hFdmVudCA9IGRvY3VtZW50LmF0dGFjaEV2ZW50XG4gIGlmIChmbikge1xuICAgIGVsZW1lbnQuX19yZXNpemVMaXN0ZW5lcnNfXy5zcGxpY2UoXG4gICAgICBlbGVtZW50Ll9fcmVzaXplTGlzdGVuZXJzX18uaW5kZXhPZihmbiksXG4gICAgICAxXG4gICAgKVxuICB9IGVsc2Uge1xuICAgIGVsZW1lbnQuX19yZXNpemVMaXN0ZW5lcnNfXyA9IFtdXG4gIH1cbiAgaWYgKCFlbGVtZW50Ll9fcmVzaXplTGlzdGVuZXJzX18ubGVuZ3RoKSB7XG4gICAgaWYgKGF0dGFjaEV2ZW50KSB7XG4gICAgICBlbGVtZW50LmRldGFjaEV2ZW50KCdvbnJlc2l6ZScsIHJlc2l6ZUxpc3RlbmVyKVxuICAgIH0gZWxzZSB7XG4gICAgICBlbGVtZW50Ll9fcmVzaXplVHJpZ2dlcl9fLmNvbnRlbnREb2N1bWVudC5kZWZhdWx0Vmlldy5yZW1vdmVFdmVudExpc3RlbmVyKFxuICAgICAgICAncmVzaXplJyxcbiAgICAgICAgcmVzaXplTGlzdGVuZXJcbiAgICAgIClcbiAgICAgIGRlbGV0ZSBlbGVtZW50Ll9fcmVzaXplVHJpZ2dlcl9fLmNvbnRlbnREb2N1bWVudC5kZWZhdWx0Vmlldy5fX3Jlc2l6ZVRyaWdnZXJfX1xuICAgICAgZWxlbWVudC5fX3Jlc2l6ZVRyaWdnZXJfXyA9ICFlbGVtZW50LnJlbW92ZUNoaWxkKFxuICAgICAgICBlbGVtZW50Ll9fcmVzaXplVHJpZ2dlcl9fXG4gICAgICApXG4gICAgfVxuICAgIGRlbGV0ZSBlbGVtZW50Ll9fcmVzaXplTGlzdGVuZXJzX19cbiAgfVxufVxuIiwiaW1wb3J0IHsgcmFuZCwgcmFuZG9tU3RyIH0gZnJvbSAnLi4vdXRpbHMnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhc2Uge1xuICBjb25zdHJ1Y3RvcihvcHRzKSB7XG4gICAgdGhpcy50b2tlbiA9IHJhbmRvbVN0cigpXG4gICAgdGhpcy5vcHRzID0gb3B0c1xuICB9XG5cbiAgX2NyZWF0ZUVmZmVjdChlbGVtLCByZWN0LCB0eXBlKSB7XG4gICAgY29uc3QgeyBwYWRkaW5nIH0gPSB0aGlzLm9wdHNcblxuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgY2FzZSAncmlnaHQnOlxuXG4gICAgICAgIGVsZW0uc3R5bGUubGVmdCA9IChyZWN0LmxlZnQgKyByZWN0LndpZHRoKSArICdweCdcbiAgICAgICAgZWxlbS5zdHlsZS50b3AgPSByYW5kKHBhZGRpbmcudG9wLCByZWN0LmhlaWdodCAtIGVsZW0uY2xpZW50SGVpZ2h0IC0gcGFkZGluZy5ib3R0b20pICsgJ3B4J1xuXG4gICAgICAgIHJldHVybiBbe1xuICAgICAgICAgIGxlZnQ6IHJlY3Qud2lkdGggKyAncHgnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBsZWZ0OiAoLWVsZW0uY2xpZW50V2lkdGgpICsgJ3B4J1xuICAgICAgICB9XVxuXG4gICAgICBjYXNlICdsZWZ0JzpcblxuICAgICAgICBlbGVtLnN0eWxlLmxlZnQgPSAoLWVsZW0uY2xpZW50V2lkdGgpICsgJ3B4J1xuICAgICAgICBlbGVtLnN0eWxlLnRvcCAgPSByYW5kKHBhZGRpbmcudG9wLCByZWN0LmhlaWdodCAtIGVsZW0uY2xpZW50SGVpZ2h0IC0gcGFkZGluZy5ib3R0b20pICsgJ3B4J1xuXG4gICAgICAgIHJldHVybiBbe1xuICAgICAgICAgIGxlZnQ6ICgtZWxlbS5jbGllbnRXaWR0aCkgKyAncHgnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBsZWZ0OiByZWN0LndpZHRoICsgJ3B4J1xuICAgICAgICB9XVxuXG4gICAgICBjYXNlICd0b3AnOlxuXG4gICAgICAgIGVsZW0uc3R5bGUubGVmdCA9IHJhbmQoMCwgcmVjdC53aWR0aCAtIGVsZW0uY2xpZW50V2lkdGgpICsgJ3B4J1xuICAgICAgICBlbGVtLnN0eWxlLnRvcCAgPSAoLWVsZW0uY2xpZW50V2lkdGgpICsgJ3B4J1xuXG4gICAgICAgIHJldHVybiBbe1xuICAgICAgICAgIHRvcDogKC1lbGVtLmNsaWVudEhlaWdodCkgKyAncHgnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICB0b3A6IHJlY3QuaGVpZ2h0ICsgJ3B4J1xuICAgICAgICB9XVxuXG4gICAgICBjYXNlICdib3R0b20nOlxuXG4gICAgICAgIGVsZW0uc3R5bGUubGVmdCA9IHJhbmQoMCwgcmVjdC53aWR0aCAtIGVsZW0uY2xpZW50V2lkdGgpICsgJ3B4J1xuICAgICAgICBlbGVtLnN0eWxlLnRvcCAgPSByZWN0LmhlaWdodCArICdweCdcblxuICAgICAgICByZXR1cm4gW3tcbiAgICAgICAgICB0b3A6IHJlY3QuaGVpZ2h0ICsgJ3B4J1xuICAgICAgICB9LCB7XG4gICAgICAgICAgdG9wOiAoLWVsZW0uY2xpZW50SGVpZ2h0KSArICdweCdcbiAgICAgICAgfV1cbiAgICAgIGNhc2UgJ3RvcC1yaWdodCc6XG5cbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgJ3RvcC1sZWZ0JzpcblxuICAgICAgICBicmVha1xuICAgICAgY2FzZSAnYm90dG9tLXJpZ2h0JzpcblxuICAgICAgICBicmVha1xuICAgICAgY2FzZSAnYm90dG9tLWxlZnQnOlxuXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlICdyYW5kb20nOlxuXG4gICAgICAgIGVsZW0uc3R5bGUub3BhY2l0eSA9IDAuMFxuICAgICAgICBlbGVtLnN0eWxlLmxlZnQgICAgPSByYW5kKHBhZGRpbmcubGVmdCwgcmVjdC53aWR0aCAtIHBhZGRpbmcucmlnaHQpIC0gZWxlbS5jbGllbnRXaWR0aCAvIDIgKyAncHgnXG4gICAgICAgIGVsZW0uc3R5bGUudG9wICAgICA9IHJhbmQocGFkZGluZy50b3AsIHJlY3QuaGVpZ2h0IC0gcGFkZGluZy5ib3R0b20pIC0gZWxlbS5jbGllbnRIZWlnaHQgLyAyICsgJ3B4J1xuXG4gICAgICAgIHJldHVybiBbe1xuICAgICAgICAgIG9wYWNpdHk6IDAuMCxcbiAgICAgICAgICB0cmFuc2Zvcm06ICdzY2FsZSgwLjIsIDAuMikgdHJhbnNsYXRlKDAsIDIwcHgpJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgb3BhY2l0eTogMS4wLFxuICAgICAgICAgIHRyYW5zZm9ybTogJ3NjYWxlKDAuNSwgMC41KSB0cmFuc2xhdGUoMCwgMHB4KSdcbiAgICAgICAgfSwge1xuICAgICAgICAgIG9wYWNpdHk6IDAuMCxcbiAgICAgICAgICB0cmFuc2Zvcm06ICdzY2FsZSgxLjAsIDEuMCkgdHJhbnNsYXRlKDAsIC01MHB4KSdcbiAgICAgICAgfV1cbiAgICB9XG4gIH1cblxuICBfY3JlYXRlVGltaW5nKHJlY3QsIHsgZHVyYXRpb24sIGVhc2luZyB9KSB7XG4gICAgbGV0IHRpbWluZyA9IHt9XG4gICAgdGltaW5nLml0ZXJhdGlvbnMgPSAxXG4gICAgdGltaW5nLmR1cmF0aW9uICAgPSBwYXJzZUludChkdXJhdGlvbiB8fCB0aGlzLm9wdHMuZHVyYXRpb24sIDEwKSAqIChyZWN0LndpZHRoICsgdGhpcy5lbGVtLm9mZnNldFdpZHRoKSAvIHJlY3Qud2lkdGhcbiAgICB0aW1pbmcuZWFzaW5nICAgICA9IGVhc2luZyB8fCB0aGlzLm9wdHMuZWFzaW5nXG5cbiAgICByZXR1cm4gdGltaW5nXG4gIH1cblxuICBoaWRlKCkge1xuICAgIHRoaXMuZWxlbS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXG4gIH1cblxuICBzaG93KCkge1xuICAgIHRoaXMuZWxlbS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJ1xuICB9XG59XG4iLCJpbXBvcnQgQmFzZSBmcm9tICcuL2Jhc2UnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZsb3dseUltYWdlIGV4dGVuZHMgQmFzZSB7XG4gIGNvbnN0cnVjdG9yKGltYWdlLCBvcHRpb25zKSB7XG4gICAgc3VwZXIob3B0aW9ucylcbiAgICB0aGlzLmVsZW0gPSB0aGlzLl9jcmVhdGVJbWFnZShpbWFnZSlcbiAgfVxuXG4gIF9jcmVhdGVJbWFnZShpbWFnZSkge1xuICAgIGNvbnN0IHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKVxuXG4gICAgdC5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSdcbiAgICB0LmNsYXNzTmFtZSAgICAgID0gaW1hZ2UuY2xhc3NOYW1lIHx8IHRoaXMub3B0cy5pbWFnZS5jbGFzc05hbWVcbiAgICB0LnN0eWxlLndpZHRoICAgID0gaW1hZ2Uud2lkdGggIHx8IHRoaXMub3B0cy5pbWFnZS53aWR0aFxuICAgIHQuc3R5bGUuaGVpZ2h0ICAgPSBpbWFnZS5oZWlnaHQgfHwgdGhpcy5vcHRzLmltYWdlLmhlaWdodFxuICAgIHQuc3R5bGUuekluZGV4ICAgPSAyMTQ3NDgzNjQ3XG4gICAgdC5zcmMgPSBpbWFnZS51cmxcbiAgICByZXR1cm4gdFxuICB9XG5cbiAgb25sb2FkKGZ1bmMpIHtcbiAgICB0aGlzLmVsZW0uYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGZ1bmMpXG4gIH1cblxuICBhZGRBbmltYXRpb24oaW1hZ2UsIHJlY3QsIG9uZmluaXNoKSB7XG4gICAgY29uc3QgZWZmZWN0ID0gdGhpcy5fY3JlYXRlRWZmZWN0KHRoaXMuZWxlbSwgcmVjdCwgaW1hZ2UuZGlyZWN0aW9uIHx8IHRoaXMub3B0cy5kaXJlY3Rpb24pXG4gICAgY29uc3QgdGltaW5nID0gdGhpcy5fY3JlYXRlVGltaW5nKHJlY3QsIGltYWdlKVxuXG4gICAgdGhpcy5lbGVtLmFuaW1hdGUoZWZmZWN0LCB0aW1pbmcpLm9uZmluaXNoID0gb25maW5pc2hcbiAgfVxufVxuIiwiaW1wb3J0IEJhc2UgZnJvbSAnLi9iYXNlJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGbG93bHlUZXh0IGV4dGVuZHMgQmFzZSB7XG4gIGNvbnN0cnVjdG9yKHRleHQsIG9wdGlvbnMpIHtcbiAgICBzdXBlcihvcHRpb25zKVxuICAgIHRoaXMuZWxlbSA9IHRoaXMuX2NyZWF0ZVRleHQodGV4dClcbiAgfVxuXG4gIF9jcmVhdGVUZXh0KHRleHQpIHtcbiAgICBjb25zdCBjb2xvciAgPSB0ZXh0LmNvbG9yICB8fCB0aGlzLm9wdHMudGV4dC5jb2xvclxuICAgIGNvbnN0IHNoYWRvdyA9IHRleHQuc2hhZG93IHx8IHRoaXMub3B0cy50ZXh0LnNoYWRvd1xuICAgIGNvbnN0IHNpemUgICA9IHRleHQuc2l6ZSAgIHx8IHRoaXMub3B0cy50ZXh0LnNpemVcbiAgICBjb25zdCB3ZWlnaHQgPSB0ZXh0LndlaWdodCB8fCB0aGlzLm9wdHMudGV4dC53ZWlnaHRcbiAgICBjb25zdCBmb250RmFtaWx5ID0gdGV4dC5mb250RmFtaWx5IHx8IHRoaXMub3B0cy50ZXh0LmZvbnRGYW1pbHlcbiAgICBjb25zdCB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpXG5cbiAgICB0LmNsYXNzTmFtZSAgICAgICAgPSB0ZXh0LmNsYXNzTmFtZSB8fCB0aGlzLm9wdHMudGV4dC5jbGFzc05hbWVcbiAgICB0LnN0eWxlLnBvc2l0aW9uICAgPSAnYWJzb2x1dGUnXG4gICAgdC5zdHlsZS5mb250U2l6ZSAgID0gc2l6ZSArICdweCdcbiAgICB0LnN0eWxlLmZvbnRXZWlnaHQgPSB3ZWlnaHRcbiAgICB0LnN0eWxlLmNvbG9yICAgICAgPSBjb2xvclxuICAgIHQuc3R5bGUuZm9udEZhbWlseSA9IGZvbnRGYW1pbHlcbiAgICB0LnN0eWxlLnRleHRTaGFkb3cgPSBgLTJweCAtMnB4IDBweCAke3NoYWRvd30sIC0ycHggMnB4IDBweCAke3NoYWRvd30sIDJweCAtMnB4IDBweCAke3NoYWRvd30sIDJweCAycHggMHB4ICR7c2hhZG93fWBcbiAgICB0LnN0eWxlLndoaXRlU3BhY2UgPSB0aGlzLm9wdHMudGV4dC53aGl0ZVNwYWNlXG4gICAgdC5zdHlsZS56SW5kZXggICAgID0gdGhpcy5vcHRzLnRleHQuekluZGV4XG5cbiAgICB0LmlubmVyVGV4dCA9IHRleHQuYm9keVxuXG4gICAgcmV0dXJuIHRcbiAgfVxuXG4gIGFkZEFuaW1hdGlvbih0ZXh0LCByZWN0LCBvbmZpbmlzaCkge1xuICAgIGNvbnN0IGVmZmVjdCA9IHRoaXMuX2NyZWF0ZUVmZmVjdCh0aGlzLmVsZW0sIHJlY3QsIHRleHQuZGlyZWN0aW9uIHx8IHRoaXMub3B0cy5kaXJlY3Rpb24pXG4gICAgY29uc3QgdGltaW5nID0gdGhpcy5fY3JlYXRlVGltaW5nKHJlY3QsIHRleHQpXG5cbiAgICB0aGlzLmVsZW0uYW5pbWF0ZShlZmZlY3QsIHRpbWluZykub25maW5pc2ggPSBvbmZpbmlzaFxuICB9XG59XG4iLCJpbXBvcnQgZWxlbWVudFJlc2l6ZUV2ZW50IGZyb20gJ2VsZW1lbnQtcmVzaXplLWV2ZW50J1xuaW1wb3J0IEZsb3dseVRleHQgZnJvbSAnLi9mbG93bHkvdGV4dCdcbmltcG9ydCBGbG93bHlJbWFnZSBmcm9tICcuL2Zsb3dseS9pbWFnZSdcbmltcG9ydCB7IHJhbmQsIHJhbmRvbVN0ciB9IGZyb20gJy4vdXRpbHMnXG5cbmNsYXNzIEZsb3dseSB7XG4gIGNvbnN0cnVjdG9yKGVsZW0sIG9wdGlvbnMgPSB7fSkge1xuICAgIC8qIEFQUCAqL1xuICAgIHRoaXMuZWxlbSA9IGVsZW1cbiAgICB0aGlzLmFwcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZWxlbSlcbiAgICB0aGlzLmFwcC5zdHlsZS5wb3NpdGlvbiA9ICdyZWxhdGl2ZSdcbiAgICB0aGlzLmFwcC5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nXG5cbiAgICB0aGlzLnJlY3QgPSB0aGlzLmFwcC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgIHRoaXMub3B0cyA9IE9iamVjdC5hc3NpZ24odGhpcy5fZGVmYXVsdE9wdGlvbnMoKSwgb3B0aW9ucylcblxuICAgIHRoaXMuZWxlbXMgPSBuZXcgTWFwKClcbiAgICBlbGVtZW50UmVzaXplRXZlbnQodGhpcy5hcHAsICgpID0+IHsgdGhpcy5yZXNpemUoKSB9KVxuICB9XG5cbiAgYWRkSW1hZ2UoaW1hZ2UpIHtcbiAgICBpZiAodGhpcy5vcHRzLmRpc2FibGUpIHJldHVyblxuXG4gICAgY29uc3QgdCA9IG5ldyBGbG93bHlJbWFnZShpbWFnZSwgdGhpcy5vcHRzKVxuICAgIHRoaXMuYXBwLmFwcGVuZENoaWxkKHQuZWxlbSlcbiAgICB0Lm9ubG9hZCgoZSkgPT4ge1xuICAgICAgdGhpcy5lbGVtcy5zZXQodC50b2tlbiwgdClcblxuICAgICAgdC5hZGRBbmltYXRpb24oaW1hZ2UsIHRoaXMucmVjdCwgKCkgPT4ge1xuICAgICAgICB0aGlzLmFwcC5yZW1vdmVDaGlsZCh0LmVsZW0pXG4gICAgICAgIHRoaXMuZWxlbXMuZGVsZXRlKHQudG9rZW4pXG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICBhZGRUZXh0KHRleHQpIHtcbiAgICBpZiAodGhpcy5vcHRzLmRpc2FibGUpIHJldHVyblxuXG4gICAgY29uc3QgdCA9IG5ldyBGbG93bHlUZXh0KHRleHQsIHRoaXMub3B0cylcbiAgICB0aGlzLmFwcC5hcHBlbmRDaGlsZCh0LmVsZW0pXG4gICAgdGhpcy5lbGVtcy5zZXQodC50b2tlbiwgdClcblxuICAgIHQuYWRkQW5pbWF0aW9uKHRleHQsIHRoaXMucmVjdCwgKCkgPT4ge1xuICAgICAgdGhpcy5hcHAucmVtb3ZlQ2hpbGQodC5lbGVtKVxuICAgICAgdGhpcy5lbGVtcy5kZWxldGUodC50b2tlbilcbiAgICB9KVxuICB9XG5cbiAgLy8gaWYgdHJ1ZSBzaG93IHRleHQsIGlmIGZhbHNlIGhpZGUgdGV4dFxuICB0b2dnbGUoZmxhZykge1xuICAgIGlmIChmbGFnKSB0aGlzLnNob3coKVxuICAgIGVsc2UgdGhpcy5oaWRlKClcbiAgfVxuXG4gIGhpZGUoKSB7XG4gICAgZm9yIChsZXQgZWxlbSBvZiB0aGlzLmVsZW1zLnZhbHVlcygpKSBlbGVtLmhpZGUoKVxuICB9XG5cbiAgc2hvdygpIHtcbiAgICBmb3IgKGxldCBlbGVtIG9mIHRoaXMuZWxlbXMudmFsdWVzKCkpIGVsZW0uc2hvdygpXG4gIH1cblxuICByZXNpemUoKSB7XG4gICAgdGhpcy5hcHAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRoaXMuZWxlbSlcbiAgICB0aGlzLmFwcC5zdHlsZS5wb3NpdGlvbiA9ICdyZWxhdGl2ZSdcbiAgICB0aGlzLmFwcC5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nXG4gICAgdGhpcy5yZWN0ID0gdGhpcy5hcHAuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgfVxuXG4gIHVwZGF0ZShvcHRpb25zID0ge30pIHtcbiAgICB0aGlzLm9wdHMgPSBPYmplY3QuYXNzaWduKHRoaXMub3B0cywgb3B0aW9ucylcbiAgfVxuXG4gIHVuYmluZCgpIHtcbiAgICBlbGVtZW50UmVzaXplRXZlbnQudW5iaW5kKHRoaXMuYXBwKVxuICAgIHRoaXMudXBkYXRlKHsgZGlzYWJsZTogdHJ1ZSB9KVxuICB9XG5cbiAgX2RlZmF1bHRPcHRpb25zKCkge1xuICAgIHJldHVybiB7XG4gICAgICB0ZXh0OiB7XG4gICAgICAgIHdlaWdodDogJ2JvbGQnLFxuICAgICAgICBzaXplICA6IDU2LFxuICAgICAgICBjb2xvciA6ICcjMDAwJyxcbiAgICAgICAgc2hhZG93OiAnI2ZmZicsXG4gICAgICAgIGNsYXNzTmFtZTogJ2Zsb3dseS10ZXh0JyxcbiAgICAgICAgd2hpdGVTcGFjZTogJ25vd3JhcCcgfHwgJ3ByZScsXG4gICAgICAgIHpJbmRleDogMjE0NzQ4MzY0NyxcbiAgICAgICAgZm9udEZhbWlseTogJy1hcHBsZS1zeXN0ZW0sIEJsaW5rTWFjU3lzdGVtRm9udCwgXCJIZWx2ZXRpY2EgTmV1ZVwiLCBcIll1IEdvdGhpY1wiLCBZdUdvdGhpYywgXCLjg5Ljg6njgq7jg47op5LjgrQgUHJvTiBXM1wiLCBIaXJhZ2lubyBLYWt1IEdvdGhpYyBQcm9OLCBBcmlhbCwgXCLjg6HjgqTjg6rjgqpcIiwgTWVpcnlvLCBzYW5zLXNlcmlmJ1xuICAgICAgfSxcbiAgICAgIGltYWdlOiB7XG4gICAgICAgIGhlaWdodDogJzIwMHB4JyxcbiAgICAgICAgd2lkdGggOiAnYXV0bycsXG4gICAgICAgIGNsYXNzTmFtZTogJ2Zsb3dseS1pbWFnZScsXG4gICAgICB9LFxuICAgICAgcGFkZGluZzoge1xuICAgICAgICBsZWZ0OiAwLFxuICAgICAgICByaWdodDogMCxcbiAgICAgICAgdG9wOiAwLFxuICAgICAgICBib3R0b206IDAsXG4gICAgICB9LFxuICAgICAgZGlzYWJsZTogZmFsc2UsXG4gICAgICBkdXJhdGlvbjogMjAwMCxcbiAgICAgIGVhc2luZzogJ2xpbmVhcicsXG4gICAgICBkaXJlY3Rpb246ICdyaWdodCcsXG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gRmxvd2x5XG4iLCJjb25zdCByYW5kID0gKG1pbiwgbWF4KSA9PiB7XG4gIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluKSArIG1pbilcbn1cblxuY29uc3QgcmFuZG9tU3RyID0gKGxlbmd0aCA9IDMyKSA9PiB7XG4gIGxldCBzID0gJydcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IHJhbmRvbSA9IE1hdGgucmFuZG9tKCkgKiAxNiB8IDBcbiAgICBzICs9IChpID09IDEyID8gNCA6IChpID09IDE2ID8gKHJhbmRvbSAmIDMgfCA4KSA6IHJhbmRvbSkpLnRvU3RyaW5nKDE2KVxuICB9XG4gIHJldHVybiBzXG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICByYW5kLFxuICByYW5kb21TdHJcbn1cbiJdfQ==
