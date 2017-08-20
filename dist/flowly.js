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
      switch (type) {
        case 'right':

          elem.style.left = rect.left + rect.width + 'px';
          elem.style.top = (0, _utils.rand)(0, rect.height - elem.clientHeight) + 'px';

          return [{
            left: rect.width + 'px'
          }, {
            left: -elem.clientWidth + 'px'
          }];

        case 'left':

          elem.style.left = -elem.clientWidth + 'px';
          elem.style.top = (0, _utils.rand)(0, rect.height - elem.clientHeight) + 'px';

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
          elem.style.left = (0, _utils.rand)(0, rect.width) - elem.clientWidth / 2 + 'px';
          elem.style.top = (0, _utils.rand)(0, rect.height) - elem.clientHeight / 2 + 'px';

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
      var t = document.createElement('span');

      t.className = text.className || this.opts.text.className;
      t.style.position = 'absolute';
      t.style.fontSize = size + 'px';
      t.style.fontWeight = weight;
      t.style.color = color;
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
          zIndex: 2147483647
        },
        image: {
          height: '200px',
          width: 'auto',
          className: 'flowly-image'
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvZWxlbWVudC1yZXNpemUtZXZlbnQvaW5kZXguanMiLCJzcmMvZmxvd2x5L2Jhc2UuanMiLCJzcmMvZmxvd2x5L2ltYWdlLmpzIiwic3JjL2Zsb3dseS90ZXh0LmpzIiwic3JjL2luZGV4LmpzIiwic3JjL3V0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7QUMvR0E7Ozs7SUFFcUIsSTtBQUNuQixnQkFBWSxJQUFaLEVBQWtCO0FBQUE7O0FBQ2hCLFNBQUssS0FBTCxHQUFhLHVCQUFiO0FBQ0EsU0FBSyxJQUFMLEdBQVksSUFBWjtB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KHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIHJlcXVlc3RGcmFtZSA9IChmdW5jdGlvbiAoKSB7XG4gIHZhciB3aW5kb3cgPSB0aGlzXG4gIHZhciByYWYgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgd2luZG93Lm1velJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuICAgIHdpbmRvdy53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICBmdW5jdGlvbiBmYWxsYmFja1JBRihmdW5jKSB7XG4gICAgICByZXR1cm4gd2luZG93LnNldFRpbWVvdXQoZnVuYywgMjApXG4gICAgfVxuICByZXR1cm4gZnVuY3Rpb24gcmVxdWVzdEZyYW1lRnVuY3Rpb24oZnVuYykge1xuICAgIHJldHVybiByYWYoZnVuYylcbiAgfVxufSkoKVxuXG52YXIgY2FuY2VsRnJhbWUgPSAoZnVuY3Rpb24gKCkge1xuICB2YXIgd2luZG93ID0gdGhpc1xuICB2YXIgY2FuY2VsID0gd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgd2luZG93Lm1vekNhbmNlbEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgd2luZG93LndlYmtpdENhbmNlbEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgd2luZG93LmNsZWFyVGltZW91dFxuICByZXR1cm4gZnVuY3Rpb24gY2FuY2VsRnJhbWVGdW5jdGlvbihpZCkge1xuICAgIHJldHVybiBjYW5jZWwoaWQpXG4gIH1cbn0pKClcblxuZnVuY3Rpb24gcmVzaXplTGlzdGVuZXIoZSkge1xuICB2YXIgd2luID0gZS50YXJnZXQgfHwgZS5zcmNFbGVtZW50XG4gIGlmICh3aW4uX19yZXNpemVSQUZfXykge1xuICAgIGNhbmNlbEZyYW1lKHdpbi5fX3Jlc2l6ZVJBRl9fKVxuICB9XG4gIHdpbi5fX3Jlc2l6ZVJBRl9fID0gcmVxdWVzdEZyYW1lKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdHJpZ2dlciA9IHdpbi5fX3Jlc2l6ZVRyaWdnZXJfX1xuICAgIHRyaWdnZXIuX19yZXNpemVMaXN0ZW5lcnNfXy5mb3JFYWNoKGZ1bmN0aW9uIChmbikge1xuICAgICAgZm4uY2FsbCh0cmlnZ2VyLCBlKVxuICAgIH0pXG4gIH0pXG59XG5cbnZhciBleHBvcnRzID0gZnVuY3Rpb24gZXhwb3J0cyhlbGVtZW50LCBmbikge1xuICB2YXIgd2luZG93ID0gdGhpc1xuICB2YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnRcbiAgdmFyIGlzSUVcblxuICB2YXIgYXR0YWNoRXZlbnQgPSBkb2N1bWVudC5hdHRhY2hFdmVudFxuICBpZiAodHlwZW9mIG5hdmlnYXRvciAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBpc0lFID0gbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvVHJpZGVudC8pIHx8XG4gICAgICBuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9FZGdlLylcbiAgfVxuXG4gIGZ1bmN0aW9uIG9iamVjdExvYWQoKSB7XG4gICAgdGhpcy5jb250ZW50RG9jdW1lbnQuZGVmYXVsdFZpZXcuX19yZXNpemVUcmlnZ2VyX18gPSB0aGlzLl9fcmVzaXplRWxlbWVudF9fXG4gICAgdGhpcy5jb250ZW50RG9jdW1lbnQuZGVmYXVsdFZpZXcuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgcmVzaXplTGlzdGVuZXIpXG4gIH1cblxuICBpZiAoIWVsZW1lbnQuX19yZXNpemVMaXN0ZW5lcnNfXykge1xuICAgIGVsZW1lbnQuX19yZXNpemVMaXN0ZW5lcnNfXyA9IFtdXG4gICAgaWYgKGF0dGFjaEV2ZW50KSB7XG4gICAgICBlbGVtZW50Ll9fcmVzaXplVHJpZ2dlcl9fID0gZWxlbWVudFxuICAgICAgZWxlbWVudC5hdHRhY2hFdmVudCgnb25yZXNpemUnLCByZXNpemVMaXN0ZW5lcilcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGdldENvbXB1dGVkU3R5bGUoZWxlbWVudCkucG9zaXRpb24gPT09ICdzdGF0aWMnKSB7XG4gICAgICAgIGVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSAncmVsYXRpdmUnXG4gICAgICB9XG4gICAgICB2YXIgb2JqID0gKGVsZW1lbnQuX19yZXNpemVUcmlnZ2VyX18gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvYmplY3QnKSlcbiAgICAgIG9iai5zZXRBdHRyaWJ1dGUoXG4gICAgICAgICdzdHlsZScsXG4gICAgICAgICdkaXNwbGF5OiBibG9jazsgcG9zaXRpb246IGFic29sdXRlOyB0b3A6IDA7IGxlZnQ6IDA7IGhlaWdodDogMTAwJTsgd2lkdGg6IDEwMCU7IG92ZXJmbG93OiBoaWRkZW47IHBvaW50ZXItZXZlbnRzOiBub25lOyB6LWluZGV4OiAtMTsgb3BhY2l0eTogMDsnXG4gICAgICApXG4gICAgICBvYmouc2V0QXR0cmlidXRlKCdjbGFzcycsICdyZXNpemUtc2Vuc29yJylcbiAgICAgIG9iai5fX3Jlc2l6ZUVsZW1lbnRfXyA9IGVsZW1lbnRcbiAgICAgIG9iai5vbmxvYWQgPSBvYmplY3RMb2FkXG4gICAgICBvYmoudHlwZSA9ICd0ZXh0L2h0bWwnXG4gICAgICBpZiAoaXNJRSkge1xuICAgICAgICBlbGVtZW50LmFwcGVuZENoaWxkKG9iailcbiAgICAgIH1cbiAgICAgIG9iai5kYXRhID0gJ2Fib3V0OmJsYW5rJ1xuICAgICAgaWYgKCFpc0lFKSB7XG4gICAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQob2JqKVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBlbGVtZW50Ll9fcmVzaXplTGlzdGVuZXJzX18ucHVzaChmbilcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJyA/IGV4cG9ydHMgOiBleHBvcnRzLmJpbmQod2luZG93KVxuXG5tb2R1bGUuZXhwb3J0cy51bmJpbmQgPSBmdW5jdGlvbiAoZWxlbWVudCwgZm4pIHtcbiAgdmFyIGF0dGFjaEV2ZW50ID0gZG9jdW1lbnQuYXR0YWNoRXZlbnRcbiAgaWYgKGZuKSB7XG4gICAgZWxlbWVudC5fX3Jlc2l6ZUxpc3RlbmVyc19fLnNwbGljZShcbiAgICAgIGVsZW1lbnQuX19yZXNpemVMaXN0ZW5lcnNfXy5pbmRleE9mKGZuKSxcbiAgICAgIDFcbiAgICApXG4gIH0gZWxzZSB7XG4gICAgZWxlbWVudC5fX3Jlc2l6ZUxpc3RlbmVyc19fID0gW11cbiAgfVxuICBpZiAoIWVsZW1lbnQuX19yZXNpemVMaXN0ZW5lcnNfXy5sZW5ndGgpIHtcbiAgICBpZiAoYXR0YWNoRXZlbnQpIHtcbiAgICAgIGVsZW1lbnQuZGV0YWNoRXZlbnQoJ29ucmVzaXplJywgcmVzaXplTGlzdGVuZXIpXG4gICAgfSBlbHNlIHtcbiAgICAgIGVsZW1lbnQuX19yZXNpemVUcmlnZ2VyX18uY29udGVudERvY3VtZW50LmRlZmF1bHRWaWV3LnJlbW92ZUV2ZW50TGlzdGVuZXIoXG4gICAgICAgICdyZXNpemUnLFxuICAgICAgICByZXNpemVMaXN0ZW5lclxuICAgICAgKVxuICAgICAgZGVsZXRlIGVsZW1lbnQuX19yZXNpemVUcmlnZ2VyX18uY29udGVudERvY3VtZW50LmRlZmF1bHRWaWV3Ll9fcmVzaXplVHJpZ2dlcl9fXG4gICAgICBlbGVtZW50Ll9fcmVzaXplVHJpZ2dlcl9fID0gIWVsZW1lbnQucmVtb3ZlQ2hpbGQoXG4gICAgICAgIGVsZW1lbnQuX19yZXNpemVUcmlnZ2VyX19cbiAgICAgIClcbiAgICB9XG4gICAgZGVsZXRlIGVsZW1lbnQuX19yZXNpemVMaXN0ZW5lcnNfX1xuICB9XG59XG4iLCJpbXBvcnQgeyByYW5kLCByYW5kb21TdHIgfSBmcm9tICcuLi91dGlscydcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFzZSB7XG4gIGNvbnN0cnVjdG9yKG9wdHMpIHtcbiAgICB0aGlzLnRva2VuID0gcmFuZG9tU3RyKClcbiAgICB0aGlzLm9wdHMgPSBvcHRzXG4gIH1cblxuICBfY3JlYXRlRWZmZWN0KGVsZW0sIHJlY3QsIHR5cGUpIHtcbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgIGNhc2UgJ3JpZ2h0JzpcblxuICAgICAgICBlbGVtLnN0eWxlLmxlZnQgPSAocmVjdC5sZWZ0ICsgcmVjdC53aWR0aCkgKyAncHgnXG4gICAgICAgIGVsZW0uc3R5bGUudG9wICA9IHJhbmQoMCwgcmVjdC5oZWlnaHQgLSBlbGVtLmNsaWVudEhlaWdodCkgKyAncHgnXG5cbiAgICAgICAgcmV0dXJuIFt7XG4gICAgICAgICAgbGVmdDogcmVjdC53aWR0aCArICdweCdcbiAgICAgICAgfSwge1xuICAgICAgICAgIGxlZnQ6ICgtZWxlbS5jbGllbnRXaWR0aCkgKyAncHgnXG4gICAgICAgIH1dXG5cbiAgICAgIGNhc2UgJ2xlZnQnOlxuXG4gICAgICAgIGVsZW0uc3R5bGUubGVmdCA9ICgtZWxlbS5jbGllbnRXaWR0aCkgKyAncHgnXG4gICAgICAgIGVsZW0uc3R5bGUudG9wICA9IHJhbmQoMCwgcmVjdC5oZWlnaHQgLSBlbGVtLmNsaWVudEhlaWdodCkgKyAncHgnXG5cbiAgICAgICAgcmV0dXJuIFt7XG4gICAgICAgICAgbGVmdDogKC1lbGVtLmNsaWVudFdpZHRoKSArICdweCdcbiAgICAgICAgfSwge1xuICAgICAgICAgIGxlZnQ6IHJlY3Qud2lkdGggKyAncHgnXG4gICAgICAgIH1dXG5cbiAgICAgIGNhc2UgJ3RvcCc6XG5cbiAgICAgICAgZWxlbS5zdHlsZS5sZWZ0ID0gcmFuZCgwLCByZWN0LndpZHRoIC0gZWxlbS5jbGllbnRXaWR0aCkgKyAncHgnXG4gICAgICAgIGVsZW0uc3R5bGUudG9wICA9ICgtZWxlbS5jbGllbnRXaWR0aCkgKyAncHgnXG5cbiAgICAgICAgcmV0dXJuIFt7XG4gICAgICAgICAgdG9wOiAoLWVsZW0uY2xpZW50SGVpZ2h0KSArICdweCdcbiAgICAgICAgfSwge1xuICAgICAgICAgIHRvcDogcmVjdC5oZWlnaHQgKyAncHgnXG4gICAgICAgIH1dXG5cbiAgICAgIGNhc2UgJ2JvdHRvbSc6XG5cbiAgICAgICAgZWxlbS5zdHlsZS5sZWZ0ID0gcmFuZCgwLCByZWN0LndpZHRoIC0gZWxlbS5jbGllbnRXaWR0aCkgKyAncHgnXG4gICAgICAgIGVsZW0uc3R5bGUudG9wICA9IHJlY3QuaGVpZ2h0ICsgJ3B4J1xuXG4gICAgICAgIHJldHVybiBbe1xuICAgICAgICAgIHRvcDogcmVjdC5oZWlnaHQgKyAncHgnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICB0b3A6ICgtZWxlbS5jbGllbnRIZWlnaHQpICsgJ3B4J1xuICAgICAgICB9XVxuICAgICAgY2FzZSAndG9wLXJpZ2h0JzpcblxuICAgICAgICBicmVha1xuICAgICAgY2FzZSAndG9wLWxlZnQnOlxuXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlICdib3R0b20tcmlnaHQnOlxuXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlICdib3R0b20tbGVmdCc6XG5cbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgJ3JhbmRvbSc6XG5cbiAgICAgICAgZWxlbS5zdHlsZS5vcGFjaXR5ID0gMC4wXG4gICAgICAgIGVsZW0uc3R5bGUubGVmdCAgICA9IHJhbmQoMCwgcmVjdC53aWR0aCkgLSBlbGVtLmNsaWVudFdpZHRoIC8gMiArICdweCdcbiAgICAgICAgZWxlbS5zdHlsZS50b3AgICAgID0gcmFuZCgwLCByZWN0LmhlaWdodCkgLSBlbGVtLmNsaWVudEhlaWdodCAvIDIgKyAncHgnXG5cbiAgICAgICAgcmV0dXJuIFt7XG4gICAgICAgICAgb3BhY2l0eTogMC4wLFxuICAgICAgICAgIHRyYW5zZm9ybTogJ3NjYWxlKDAuMiwgMC4yKSB0cmFuc2xhdGUoMCwgMjBweCknXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBvcGFjaXR5OiAxLjAsXG4gICAgICAgICAgdHJhbnNmb3JtOiAnc2NhbGUoMC41LCAwLjUpIHRyYW5zbGF0ZSgwLCAwcHgpJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgb3BhY2l0eTogMC4wLFxuICAgICAgICAgIHRyYW5zZm9ybTogJ3NjYWxlKDEuMCwgMS4wKSB0cmFuc2xhdGUoMCwgLTUwcHgpJ1xuICAgICAgICB9XVxuICAgIH1cbiAgfVxuXG4gIF9jcmVhdGVUaW1pbmcocmVjdCwgeyBkdXJhdGlvbiwgZWFzaW5nIH0pIHtcbiAgICBsZXQgdGltaW5nID0ge31cbiAgICB0aW1pbmcuaXRlcmF0aW9ucyA9IDFcbiAgICB0aW1pbmcuZHVyYXRpb24gICA9IHBhcnNlSW50KGR1cmF0aW9uIHx8IHRoaXMub3B0cy5kdXJhdGlvbiwgMTApICogKHJlY3Qud2lkdGggKyB0aGlzLmVsZW0ub2Zmc2V0V2lkdGgpIC8gcmVjdC53aWR0aFxuICAgIHRpbWluZy5lYXNpbmcgICAgID0gZWFzaW5nIHx8IHRoaXMub3B0cy5lYXNpbmdcblxuICAgIHJldHVybiB0aW1pbmdcbiAgfVxuXG4gIGhpZGUoKSB7XG4gICAgdGhpcy5lbGVtLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcbiAgfVxuXG4gIHNob3coKSB7XG4gICAgdGhpcy5lbGVtLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXG4gIH1cbn1cbiIsImltcG9ydCBCYXNlIGZyb20gJy4vYmFzZSdcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRmxvd2x5SW1hZ2UgZXh0ZW5kcyBCYXNlIHtcbiAgY29uc3RydWN0b3IoaW1hZ2UsIG9wdGlvbnMpIHtcbiAgICBzdXBlcihvcHRpb25zKVxuICAgIHRoaXMuZWxlbSA9IHRoaXMuX2NyZWF0ZUltYWdlKGltYWdlKVxuICB9XG5cbiAgX2NyZWF0ZUltYWdlKGltYWdlKSB7XG4gICAgY29uc3QgdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpXG5cbiAgICB0LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJ1xuICAgIHQuY2xhc3NOYW1lICAgICAgPSBpbWFnZS5jbGFzc05hbWUgfHwgdGhpcy5vcHRzLmltYWdlLmNsYXNzTmFtZVxuICAgIHQuc3R5bGUud2lkdGggICAgPSBpbWFnZS53aWR0aCAgfHwgdGhpcy5vcHRzLmltYWdlLndpZHRoXG4gICAgdC5zdHlsZS5oZWlnaHQgICA9IGltYWdlLmhlaWdodCB8fCB0aGlzLm9wdHMuaW1hZ2UuaGVpZ2h0XG4gICAgdC5zdHlsZS56SW5kZXggICA9IDIxNDc0ODM2NDdcbiAgICB0LnNyYyA9IGltYWdlLnVybFxuICAgIHJldHVybiB0XG4gIH1cblxuICBvbmxvYWQoZnVuYykge1xuICAgIHRoaXMuZWxlbS5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgZnVuYylcbiAgfVxuXG4gIGFkZEFuaW1hdGlvbihpbWFnZSwgcmVjdCwgb25maW5pc2gpIHtcbiAgICBjb25zdCBlZmZlY3QgPSB0aGlzLl9jcmVhdGVFZmZlY3QodGhpcy5lbGVtLCByZWN0LCBpbWFnZS5kaXJlY3Rpb24gfHwgdGhpcy5vcHRzLmRpcmVjdGlvbilcbiAgICBjb25zdCB0aW1pbmcgPSB0aGlzLl9jcmVhdGVUaW1pbmcocmVjdCwgaW1hZ2UpXG5cbiAgICB0aGlzLmVsZW0uYW5pbWF0ZShlZmZlY3QsIHRpbWluZykub25maW5pc2ggPSBvbmZpbmlzaFxuICB9XG59XG4iLCJpbXBvcnQgQmFzZSBmcm9tICcuL2Jhc2UnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZsb3dseVRleHQgZXh0ZW5kcyBCYXNlIHtcbiAgY29uc3RydWN0b3IodGV4dCwgb3B0aW9ucykge1xuICAgIHN1cGVyKG9wdGlvbnMpXG4gICAgdGhpcy5lbGVtID0gdGhpcy5fY3JlYXRlVGV4dCh0ZXh0KVxuICB9XG5cbiAgX2NyZWF0ZVRleHQodGV4dCkge1xuICAgIGNvbnN0IGNvbG9yICA9IHRleHQuY29sb3IgIHx8IHRoaXMub3B0cy50ZXh0LmNvbG9yXG4gICAgY29uc3Qgc2hhZG93ID0gdGV4dC5zaGFkb3cgfHwgdGhpcy5vcHRzLnRleHQuc2hhZG93XG4gICAgY29uc3Qgc2l6ZSAgID0gdGV4dC5zaXplICAgfHwgdGhpcy5vcHRzLnRleHQuc2l6ZVxuICAgIGNvbnN0IHdlaWdodCA9IHRleHQud2VpZ2h0IHx8IHRoaXMub3B0cy50ZXh0LndlaWdodFxuICAgIGNvbnN0IHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcblxuICAgIHQuY2xhc3NOYW1lICAgICAgICA9IHRleHQuY2xhc3NOYW1lIHx8IHRoaXMub3B0cy50ZXh0LmNsYXNzTmFtZVxuICAgIHQuc3R5bGUucG9zaXRpb24gICA9ICdhYnNvbHV0ZSdcbiAgICB0LnN0eWxlLmZvbnRTaXplICAgPSBzaXplICsgJ3B4J1xuICAgIHQuc3R5bGUuZm9udFdlaWdodCA9IHdlaWdodFxuICAgIHQuc3R5bGUuY29sb3IgICAgICA9IGNvbG9yXG4gICAgdC5zdHlsZS50ZXh0U2hhZG93ID0gYC0ycHggLTJweCAwcHggJHtzaGFkb3d9LCAtMnB4IDJweCAwcHggJHtzaGFkb3d9LCAycHggLTJweCAwcHggJHtzaGFkb3d9LCAycHggMnB4IDBweCAke3NoYWRvd31gXG4gICAgdC5zdHlsZS53aGl0ZVNwYWNlID0gdGhpcy5vcHRzLnRleHQud2hpdGVTcGFjZVxuICAgIHQuc3R5bGUuekluZGV4ICAgICA9IHRoaXMub3B0cy50ZXh0LnpJbmRleFxuXG4gICAgdC5pbm5lclRleHQgPSB0ZXh0LmJvZHlcblxuICAgIHJldHVybiB0XG4gIH1cblxuICBhZGRBbmltYXRpb24odGV4dCwgcmVjdCwgb25maW5pc2gpIHtcbiAgICBjb25zdCBlZmZlY3QgPSB0aGlzLl9jcmVhdGVFZmZlY3QodGhpcy5lbGVtLCByZWN0LCB0ZXh0LmRpcmVjdGlvbiB8fCB0aGlzLm9wdHMuZGlyZWN0aW9uKVxuICAgIGNvbnN0IHRpbWluZyA9IHRoaXMuX2NyZWF0ZVRpbWluZyhyZWN0LCB0ZXh0KVxuXG4gICAgdGhpcy5lbGVtLmFuaW1hdGUoZWZmZWN0LCB0aW1pbmcpLm9uZmluaXNoID0gb25maW5pc2hcbiAgfVxufVxuIiwiaW1wb3J0IGVsZW1lbnRSZXNpemVFdmVudCBmcm9tICdlbGVtZW50LXJlc2l6ZS1ldmVudCdcbmltcG9ydCBGbG93bHlUZXh0IGZyb20gJy4vZmxvd2x5L3RleHQnXG5pbXBvcnQgRmxvd2x5SW1hZ2UgZnJvbSAnLi9mbG93bHkvaW1hZ2UnXG5pbXBvcnQgeyByYW5kLCByYW5kb21TdHIgfSBmcm9tICcuL3V0aWxzJ1xuXG5jbGFzcyBGbG93bHkge1xuICBjb25zdHJ1Y3RvcihlbGVtLCBvcHRpb25zID0ge30pIHtcbiAgICAvKiBBUFAgKi9cbiAgICB0aGlzLmVsZW0gPSBlbGVtXG4gICAgdGhpcy5hcHAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGVsZW0pXG4gICAgdGhpcy5hcHAuc3R5bGUucG9zaXRpb24gPSAncmVsYXRpdmUnXG4gICAgdGhpcy5hcHAuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJ1xuXG4gICAgdGhpcy5yZWN0ID0gdGhpcy5hcHAuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICB0aGlzLm9wdHMgPSBPYmplY3QuYXNzaWduKHRoaXMuX2RlZmF1bHRPcHRpb25zKCksIG9wdGlvbnMpXG5cbiAgICB0aGlzLmVsZW1zID0gbmV3IE1hcCgpXG4gICAgZWxlbWVudFJlc2l6ZUV2ZW50KHRoaXMuYXBwLCAoKSA9PiB7IHRoaXMucmVzaXplKCkgfSlcbiAgfVxuXG4gIGFkZEltYWdlKGltYWdlKSB7XG4gICAgaWYgKHRoaXMub3B0cy5kaXNhYmxlKSByZXR1cm5cblxuICAgIGNvbnN0IHQgPSBuZXcgRmxvd2x5SW1hZ2UoaW1hZ2UsIHRoaXMub3B0cylcbiAgICB0aGlzLmFwcC5hcHBlbmRDaGlsZCh0LmVsZW0pXG4gICAgdC5vbmxvYWQoKGUpID0+IHtcbiAgICAgIHRoaXMuZWxlbXMuc2V0KHQudG9rZW4sIHQpXG5cbiAgICAgIHQuYWRkQW5pbWF0aW9uKGltYWdlLCB0aGlzLnJlY3QsICgpID0+IHtcbiAgICAgICAgdGhpcy5hcHAucmVtb3ZlQ2hpbGQodC5lbGVtKVxuICAgICAgICB0aGlzLmVsZW1zLmRlbGV0ZSh0LnRva2VuKVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgYWRkVGV4dCh0ZXh0KSB7XG4gICAgaWYgKHRoaXMub3B0cy5kaXNhYmxlKSByZXR1cm5cblxuICAgIGNvbnN0IHQgPSBuZXcgRmxvd2x5VGV4dCh0ZXh0LCB0aGlzLm9wdHMpXG4gICAgdGhpcy5hcHAuYXBwZW5kQ2hpbGQodC5lbGVtKVxuICAgIHRoaXMuZWxlbXMuc2V0KHQudG9rZW4sIHQpXG5cbiAgICB0LmFkZEFuaW1hdGlvbih0ZXh0LCB0aGlzLnJlY3QsICgpID0+IHtcbiAgICAgIHRoaXMuYXBwLnJlbW92ZUNoaWxkKHQuZWxlbSlcbiAgICAgIHRoaXMuZWxlbXMuZGVsZXRlKHQudG9rZW4pXG4gICAgfSlcbiAgfVxuXG4gIC8vIGlmIHRydWUgc2hvdyB0ZXh0LCBpZiBmYWxzZSBoaWRlIHRleHRcbiAgdG9nZ2xlKGZsYWcpIHtcbiAgICBpZiAoZmxhZykgdGhpcy5zaG93KClcbiAgICBlbHNlIHRoaXMuaGlkZSgpXG4gIH1cblxuICBoaWRlKCkge1xuICAgIGZvciAobGV0IGVsZW0gb2YgdGhpcy5lbGVtcy52YWx1ZXMoKSkgZWxlbS5oaWRlKClcbiAgfVxuXG4gIHNob3coKSB7XG4gICAgZm9yIChsZXQgZWxlbSBvZiB0aGlzLmVsZW1zLnZhbHVlcygpKSBlbGVtLnNob3coKVxuICB9XG5cbiAgcmVzaXplKCkge1xuICAgIHRoaXMuYXBwID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0aGlzLmVsZW0pXG4gICAgdGhpcy5hcHAuc3R5bGUucG9zaXRpb24gPSAncmVsYXRpdmUnXG4gICAgdGhpcy5hcHAuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJ1xuICAgIHRoaXMucmVjdCA9IHRoaXMuYXBwLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gIH1cblxuICB1cGRhdGUob3B0aW9ucyA9IHt9KSB7XG4gICAgdGhpcy5vcHRzID0gT2JqZWN0LmFzc2lnbih0aGlzLm9wdHMsIG9wdGlvbnMpXG4gIH1cblxuICB1bmJpbmQoKSB7XG4gICAgZWxlbWVudFJlc2l6ZUV2ZW50LnVuYmluZCh0aGlzLmFwcClcbiAgICB0aGlzLnVwZGF0ZSh7IGRpc2FibGU6IHRydWUgfSlcbiAgfVxuXG4gIF9kZWZhdWx0T3B0aW9ucygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdGV4dDoge1xuICAgICAgICB3ZWlnaHQ6ICdib2xkJyxcbiAgICAgICAgc2l6ZSAgOiA1NixcbiAgICAgICAgY29sb3IgOiAnIzAwMCcsXG4gICAgICAgIHNoYWRvdzogJyNmZmYnLFxuICAgICAgICBjbGFzc05hbWU6ICdmbG93bHktdGV4dCcsXG4gICAgICAgIHdoaXRlU3BhY2U6ICdub3dyYXAnIHx8ICdwcmUnLFxuICAgICAgICB6SW5kZXg6IDIxNDc0ODM2NDcsXG4gICAgICB9LFxuICAgICAgaW1hZ2U6IHtcbiAgICAgICAgaGVpZ2h0OiAnMjAwcHgnLFxuICAgICAgICB3aWR0aCA6ICdhdXRvJyxcbiAgICAgICAgY2xhc3NOYW1lOiAnZmxvd2x5LWltYWdlJyxcbiAgICAgIH0sXG4gICAgICBkaXNhYmxlOiBmYWxzZSxcbiAgICAgIGR1cmF0aW9uOiAyMDAwLFxuICAgICAgZWFzaW5nOiAnbGluZWFyJyxcbiAgICAgIGRpcmVjdGlvbjogJ3JpZ2h0JyxcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBGbG93bHlcbiIsImNvbnN0IHJhbmQgPSAobWluLCBtYXgpID0+IHtcbiAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4pICsgbWluKVxufVxuXG5jb25zdCByYW5kb21TdHIgPSAobGVuZ3RoID0gMzIpID0+IHtcbiAgbGV0IHMgPSAnJ1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgcmFuZG9tID0gTWF0aC5yYW5kb20oKSAqIDE2IHwgMFxuICAgIHMgKz0gKGkgPT0gMTIgPyA0IDogKGkgPT0gMTYgPyAocmFuZG9tICYgMyB8IDgpIDogcmFuZG9tKSkudG9TdHJpbmcoMTYpXG4gIH1cbiAgcmV0dXJuIHNcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHJhbmQsXG4gIHJhbmRvbVN0clxufVxuIl19
