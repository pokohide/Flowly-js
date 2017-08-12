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
  function Base() {
    _classCallCheck(this, Base);

    this.token = (0, _utils.randomStr)();
  }

  _createClass(Base, [{
    key: '_createEffect',
    value: function _createEffect(elem, type) {
      if (type === 'horizontal') {
        elem.style.left = this.rect.left + this.rect.width + 'px';
        elem.style.top = rand(0, this.rect.height - elem.clientHeight) + 'px';

        return [{
          left: this.rect.width + 'px'
        }, {
          left: -elem.clientWidth + 'px'
        }];
      } else if (type === 'vertical') {
        elem.style.left = rand(0, this.rect.width - elem.clientWidth) + 'px';
        elem.style.top = -elem.clientWidth + 'px';

        return [{
          top: -elem.clientHeight + 'px'
        }, {
          top: this.rect.height + 'px'
        }];
      } else if (type === 'random') {
        elem.style.opacity = 0.0;
        elem.style.left = rand(0, this.rect.width) - elem.clientWidth / 2 + 'px';
        elem.style.top = rand(0, this.rect.height) - elem.clientHeight / 2 + 'px';

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
    value: function _createTiming() {
      var timing = {};
      timing.iterations = 1;
      timing.duration = 3000; // (text.duration || this.opts.duration) * (this.app.clientWidth + t.offsetWidth) / this.app.clientWidth
      timing.easing = text.easing || this.opts.easing;
    }
  }]);

  return Base;
}();

exports.default = Base;

},{"../utils":5}],3:[function(require,module,exports){
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

    var _this = _possibleConstructorReturn(this, (FlowlyText.__proto__ || Object.getPrototypeOf(FlowlyText)).call(this));

    _this.opts = options;
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
    value: function addAnimation(effect, timing, onfinish) {
      this.elem.animate(effect, timing).onfinish = onfinish;
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

  return FlowlyText;
}(_base2.default);

exports.default = FlowlyText;

},{"./base":2}],4:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _elementResizeEvent = require('element-resize-event');

var _elementResizeEvent2 = _interopRequireDefault(_elementResizeEvent);

var _text = require('./flowly/text');

var _text2 = _interopRequireDefault(_text);

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
      if (this.opts.disable) return;

      var t = this._createImage(image);
    }
  }, {
    key: 'addText',
    value: function addText(text) {
      var _this2 = this;

      if (this.opts.disable) return;

      var t = new _text2.default(text, this.opts);
      this.app.appendChild(t.elem);
      this.elems.set(t.token, t);

      // const t = this._createText(text)
      // this.app.appendChild(t)
      var timing = {};
      timing.iterations = 1;
      timing.duration = 3000; //(text.duration || this.opts.duration) * (this.app.clientWidth + t.offsetWidth) / this.app.clientWidth
      timing.easing = text.easing || this.opts.easing;

      var effect = this._effect(t.elem, this.opts.direction);
      t.addAnimation(effect, timing, function () {
        _this2.app.removeChild(t.elem);
        _this2.elems.delete(t.token);
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
          //elem.style.display = 'none'
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
          //elem.style.display = 'block'
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
    key: '_createImage',
    value: function _createImage(image) {
      var _this3 = this;

      var t = document.createElement('img');

      t.style.position = 'fixed';
      t.style.width = image.width;
      t.style.height = image.height;
      t.style.zIndex = 2147483647;
      t.style.left = this.rect.width + t.clientWidth + 'px';
      t.style.top = (0, _utils.rand)(this.rect.top, this.rect.height - t.clientHeight) + 'px';

      t.addEventListener('load', function (e) {
        var effect = _this3._effect(t, _this3.opts.direction);

        var timing = {};
        timing.iterations = 1;
        timing.duration = (image.duration || _this3.opts.duration) * (_this3.app.clientWidth + t.offsetWidth) / _this3.app.clientWidth;
        timing.easing = image.easing || _this3.opts.easing;

        var token = (0, _utils.randomStr)();
        _this3.elems.set(token, t);

        t.animate(effect, timing).onfinish = function () {
          _this3.app.removeChild(t);
          _this3.elems.delete(token);
        };
      });

      t.src = image.url;
      this.app.appendChild(t);
      return t;
    }
  }, {
    key: '_effect',
    value: function _effect(elem, type) {
      if (type === 'horizontal') {
        elem.style.left = this.rect.left + this.rect.width + 'px';
        elem.style.top = (0, _utils.rand)(0, this.rect.height - elem.clientHeight) + 'px';

        return [{
          left: this.rect.width + 'px'
        }, {
          left: -elem.clientWidth + 'px'
        }];
      } else if (type === 'vertical') {
        elem.style.left = (0, _utils.rand)(0, this.rect.width - elem.clientWidth) + 'px';
        elem.style.top = -elem.clientWidth + 'px';

        return [{
          top: -elem.clientHeight + 'px'
        }, {
          top: this.rect.height + 'px'
        }];
      } else if (type === 'random') {
        elem.style.opacity = 0.0;
        elem.style.left = (0, _utils.rand)(0, this.rect.width) - elem.clientWidth / 2 + 'px';
        elem.style.top = (0, _utils.rand)(0, this.rect.height) - elem.clientHeight / 2 + 'px';

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
        disable: false,
        duration: 2000,
        easing: 'linear',
        direction: 'horizontal'
      };
    }
  }]);

  return Flowly;
}();

module.exports = Flowly;

},{"./flowly/text":3,"./utils":5,"element-resize-event":1}],5:[function(require,module,exports){
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

},{}]},{},[4])(4)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvZWxlbWVudC1yZXNpemUtZXZlbnQvaW5kZXguanMiLCJzcmMvZmxvd2x5L2Jhc2UuanMiLCJzcmMvZmxvd2x5L3RleHQuanMiLCJzcmMvaW5kZXguanMiLCJzcmMvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztBQy9HQTs7OztJQUVxQixJO0FBQ25CLGtCQUFjO0FBQUE7O0FBQ1osU0FBSyxLQUFMLEdBQWEsdUJBQWI7QUFDRDs7OztrQ0FFYSxJLEVBQU0sSSxFQUFNO0FBQ3hCLFVBQUksU0FBUyxZQUFiLEVBQTJCO0FBQ3pC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QUFMO0FBQ0Q7QUFDRCxTQUFPLENBQVA7QUFDRCxDQVBEOztBQVNBLE9BQU8sT0FBUCxHQUFpQjtBQUNmLFlBRGU7QUFFZjtBQUZlLENBQWpCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciByZXF1ZXN0RnJhbWUgPSAoZnVuY3Rpb24gKCkge1xuICB2YXIgd2luZG93ID0gdGhpc1xuICB2YXIgcmFmID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuICAgIHdpbmRvdy5tb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICB3aW5kb3cud2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgZnVuY3Rpb24gZmFsbGJhY2tSQUYoZnVuYykge1xuICAgICAgcmV0dXJuIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmMsIDIwKVxuICAgIH1cbiAgcmV0dXJuIGZ1bmN0aW9uIHJlcXVlc3RGcmFtZUZ1bmN0aW9uKGZ1bmMpIHtcbiAgICByZXR1cm4gcmFmKGZ1bmMpXG4gIH1cbn0pKClcblxudmFyIGNhbmNlbEZyYW1lID0gKGZ1bmN0aW9uICgpIHtcbiAgdmFyIHdpbmRvdyA9IHRoaXNcbiAgdmFyIGNhbmNlbCA9IHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSB8fFxuICAgIHdpbmRvdy5tb3pDYW5jZWxBbmltYXRpb25GcmFtZSB8fFxuICAgIHdpbmRvdy53ZWJraXRDYW5jZWxBbmltYXRpb25GcmFtZSB8fFxuICAgIHdpbmRvdy5jbGVhclRpbWVvdXRcbiAgcmV0dXJuIGZ1bmN0aW9uIGNhbmNlbEZyYW1lRnVuY3Rpb24oaWQpIHtcbiAgICByZXR1cm4gY2FuY2VsKGlkKVxuICB9XG59KSgpXG5cbmZ1bmN0aW9uIHJlc2l6ZUxpc3RlbmVyKGUpIHtcbiAgdmFyIHdpbiA9IGUudGFyZ2V0IHx8IGUuc3JjRWxlbWVudFxuICBpZiAod2luLl9fcmVzaXplUkFGX18pIHtcbiAgICBjYW5jZWxGcmFtZSh3aW4uX19yZXNpemVSQUZfXylcbiAgfVxuICB3aW4uX19yZXNpemVSQUZfXyA9IHJlcXVlc3RGcmFtZShmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHRyaWdnZXIgPSB3aW4uX19yZXNpemVUcmlnZ2VyX19cbiAgICB0cmlnZ2VyLl9fcmVzaXplTGlzdGVuZXJzX18uZm9yRWFjaChmdW5jdGlvbiAoZm4pIHtcbiAgICAgIGZuLmNhbGwodHJpZ2dlciwgZSlcbiAgICB9KVxuICB9KVxufVxuXG52YXIgZXhwb3J0cyA9IGZ1bmN0aW9uIGV4cG9ydHMoZWxlbWVudCwgZm4pIHtcbiAgdmFyIHdpbmRvdyA9IHRoaXNcbiAgdmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50XG4gIHZhciBpc0lFXG5cbiAgdmFyIGF0dGFjaEV2ZW50ID0gZG9jdW1lbnQuYXR0YWNoRXZlbnRcbiAgaWYgKHR5cGVvZiBuYXZpZ2F0b3IgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgaXNJRSA9IG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL1RyaWRlbnQvKSB8fFxuICAgICAgbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvRWRnZS8pXG4gIH1cblxuICBmdW5jdGlvbiBvYmplY3RMb2FkKCkge1xuICAgIHRoaXMuY29udGVudERvY3VtZW50LmRlZmF1bHRWaWV3Ll9fcmVzaXplVHJpZ2dlcl9fID0gdGhpcy5fX3Jlc2l6ZUVsZW1lbnRfX1xuICAgIHRoaXMuY29udGVudERvY3VtZW50LmRlZmF1bHRWaWV3LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHJlc2l6ZUxpc3RlbmVyKVxuICB9XG5cbiAgaWYgKCFlbGVtZW50Ll9fcmVzaXplTGlzdGVuZXJzX18pIHtcbiAgICBlbGVtZW50Ll9fcmVzaXplTGlzdGVuZXJzX18gPSBbXVxuICAgIGlmIChhdHRhY2hFdmVudCkge1xuICAgICAgZWxlbWVudC5fX3Jlc2l6ZVRyaWdnZXJfXyA9IGVsZW1lbnRcbiAgICAgIGVsZW1lbnQuYXR0YWNoRXZlbnQoJ29ucmVzaXplJywgcmVzaXplTGlzdGVuZXIpXG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChnZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpLnBvc2l0aW9uID09PSAnc3RhdGljJykge1xuICAgICAgICBlbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gJ3JlbGF0aXZlJ1xuICAgICAgfVxuICAgICAgdmFyIG9iaiA9IChlbGVtZW50Ll9fcmVzaXplVHJpZ2dlcl9fID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb2JqZWN0JykpXG4gICAgICBvYmouc2V0QXR0cmlidXRlKFxuICAgICAgICAnc3R5bGUnLFxuICAgICAgICAnZGlzcGxheTogYmxvY2s7IHBvc2l0aW9uOiBhYnNvbHV0ZTsgdG9wOiAwOyBsZWZ0OiAwOyBoZWlnaHQ6IDEwMCU7IHdpZHRoOiAxMDAlOyBvdmVyZmxvdzogaGlkZGVuOyBwb2ludGVyLWV2ZW50czogbm9uZTsgei1pbmRleDogLTE7IG9wYWNpdHk6IDA7J1xuICAgICAgKVxuICAgICAgb2JqLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAncmVzaXplLXNlbnNvcicpXG4gICAgICBvYmouX19yZXNpemVFbGVtZW50X18gPSBlbGVtZW50XG4gICAgICBvYmoub25sb2FkID0gb2JqZWN0TG9hZFxuICAgICAgb2JqLnR5cGUgPSAndGV4dC9odG1sJ1xuICAgICAgaWYgKGlzSUUpIHtcbiAgICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZChvYmopXG4gICAgICB9XG4gICAgICBvYmouZGF0YSA9ICdhYm91dDpibGFuaydcbiAgICAgIGlmICghaXNJRSkge1xuICAgICAgICBlbGVtZW50LmFwcGVuZENoaWxkKG9iailcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgZWxlbWVudC5fX3Jlc2l6ZUxpc3RlbmVyc19fLnB1c2goZm4pXG59XG5cbm1vZHVsZS5leHBvcnRzID0gdHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcgPyBleHBvcnRzIDogZXhwb3J0cy5iaW5kKHdpbmRvdylcblxubW9kdWxlLmV4cG9ydHMudW5iaW5kID0gZnVuY3Rpb24gKGVsZW1lbnQsIGZuKSB7XG4gIHZhciBhdHRhY2hFdmVudCA9IGRvY3VtZW50LmF0dGFjaEV2ZW50XG4gIGlmIChmbikge1xuICAgIGVsZW1lbnQuX19yZXNpemVMaXN0ZW5lcnNfXy5zcGxpY2UoXG4gICAgICBlbGVtZW50Ll9fcmVzaXplTGlzdGVuZXJzX18uaW5kZXhPZihmbiksXG4gICAgICAxXG4gICAgKVxuICB9IGVsc2Uge1xuICAgIGVsZW1lbnQuX19yZXNpemVMaXN0ZW5lcnNfXyA9IFtdXG4gIH1cbiAgaWYgKCFlbGVtZW50Ll9fcmVzaXplTGlzdGVuZXJzX18ubGVuZ3RoKSB7XG4gICAgaWYgKGF0dGFjaEV2ZW50KSB7XG4gICAgICBlbGVtZW50LmRldGFjaEV2ZW50KCdvbnJlc2l6ZScsIHJlc2l6ZUxpc3RlbmVyKVxuICAgIH0gZWxzZSB7XG4gICAgICBlbGVtZW50Ll9fcmVzaXplVHJpZ2dlcl9fLmNvbnRlbnREb2N1bWVudC5kZWZhdWx0Vmlldy5yZW1vdmVFdmVudExpc3RlbmVyKFxuICAgICAgICAncmVzaXplJyxcbiAgICAgICAgcmVzaXplTGlzdGVuZXJcbiAgICAgIClcbiAgICAgIGRlbGV0ZSBlbGVtZW50Ll9fcmVzaXplVHJpZ2dlcl9fLmNvbnRlbnREb2N1bWVudC5kZWZhdWx0Vmlldy5fX3Jlc2l6ZVRyaWdnZXJfX1xuICAgICAgZWxlbWVudC5fX3Jlc2l6ZVRyaWdnZXJfXyA9ICFlbGVtZW50LnJlbW92ZUNoaWxkKFxuICAgICAgICBlbGVtZW50Ll9fcmVzaXplVHJpZ2dlcl9fXG4gICAgICApXG4gICAgfVxuICAgIGRlbGV0ZSBlbGVtZW50Ll9fcmVzaXplTGlzdGVuZXJzX19cbiAgfVxufVxuIiwiaW1wb3J0IHsgcmFuZG9tU3RyIH0gZnJvbSAnLi4vdXRpbHMnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhc2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnRva2VuID0gcmFuZG9tU3RyKClcbiAgfVxuXG4gIF9jcmVhdGVFZmZlY3QoZWxlbSwgdHlwZSkge1xuICAgIGlmICh0eXBlID09PSAnaG9yaXpvbnRhbCcpIHtcbiAgICAgIGVsZW0uc3R5bGUubGVmdCA9ICh0aGlzLnJlY3QubGVmdCArIHRoaXMucmVjdC53aWR0aCkgKyAncHgnXG4gICAgICBlbGVtLnN0eWxlLnRvcCAgPSByYW5kKDAsIHRoaXMucmVjdC5oZWlnaHQgLSBlbGVtLmNsaWVudEhlaWdodCkgKyAncHgnXG5cbiAgICAgIHJldHVybiBbe1xuICAgICAgICBsZWZ0OiB0aGlzLnJlY3Qud2lkdGggKyAncHgnXG4gICAgICB9LCB7XG4gICAgICAgIGxlZnQ6ICgtZWxlbS5jbGllbnRXaWR0aCkgKyAncHgnXG4gICAgICB9XVxuICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ3ZlcnRpY2FsJykge1xuICAgICAgZWxlbS5zdHlsZS5sZWZ0ID0gcmFuZCgwLCB0aGlzLnJlY3Qud2lkdGggLSBlbGVtLmNsaWVudFdpZHRoKSArICdweCdcbiAgICAgIGVsZW0uc3R5bGUudG9wICA9ICgtZWxlbS5jbGllbnRXaWR0aCkgKyAncHgnXG5cbiAgICAgIHJldHVybiBbe1xuICAgICAgICB0b3A6ICgtZWxlbS5jbGllbnRIZWlnaHQpICsgJ3B4J1xuICAgICAgfSwge1xuICAgICAgICB0b3A6IHRoaXMucmVjdC5oZWlnaHQgKyAncHgnXG4gICAgICB9XVxuICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ3JhbmRvbScpIHtcbiAgICAgIGVsZW0uc3R5bGUub3BhY2l0eSA9IDAuMFxuICAgICAgZWxlbS5zdHlsZS5sZWZ0ICAgID0gcmFuZCgwLCB0aGlzLnJlY3Qud2lkdGgpIC0gZWxlbS5jbGllbnRXaWR0aCAvIDIgKyAncHgnXG4gICAgICBlbGVtLnN0eWxlLnRvcCAgICAgPSByYW5kKDAsIHRoaXMucmVjdC5oZWlnaHQpIC0gZWxlbS5jbGllbnRIZWlnaHQgLyAyICsgJ3B4J1xuXG4gICAgICByZXR1cm4gW3tcbiAgICAgICAgb3BhY2l0eTogMC4wLFxuICAgICAgICB0cmFuc2Zvcm06ICdzY2FsZSgwLjIsIDAuMikgdHJhbnNsYXRlKDAsIDIwcHgpJ1xuICAgICAgfSwge1xuICAgICAgICBvcGFjaXR5OiAxLjAsXG4gICAgICAgIHRyYW5zZm9ybTogJ3NjYWxlKDAuNSwgMC41KSB0cmFuc2xhdGUoMCwgMHB4KSdcbiAgICAgIH0sIHtcbiAgICAgICAgb3BhY2l0eTogMC4wLFxuICAgICAgICB0cmFuc2Zvcm06ICdzY2FsZSgxLjAsIDEuMCkgdHJhbnNsYXRlKDAsIC01MHB4KSdcbiAgICAgIH1dXG4gICAgfVxuICB9XG5cbiAgX2NyZWF0ZVRpbWluZygpIHtcbiAgICBsZXQgdGltaW5nID0ge31cbiAgICB0aW1pbmcuaXRlcmF0aW9ucyA9IDFcbiAgICB0aW1pbmcuZHVyYXRpb24gPSAzMDAwIC8vICh0ZXh0LmR1cmF0aW9uIHx8IHRoaXMub3B0cy5kdXJhdGlvbikgKiAodGhpcy5hcHAuY2xpZW50V2lkdGggKyB0Lm9mZnNldFdpZHRoKSAvIHRoaXMuYXBwLmNsaWVudFdpZHRoXG4gICAgdGltaW5nLmVhc2luZyA9IHRleHQuZWFzaW5nIHx8IHRoaXMub3B0cy5lYXNpbmdcbiAgfVxufVxuIiwiaW1wb3J0IEJhc2UgZnJvbSAnLi9iYXNlJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGbG93bHlUZXh0IGV4dGVuZHMgQmFzZSB7XG4gIGNvbnN0cnVjdG9yKHRleHQsIG9wdGlvbnMpIHtcbiAgICBzdXBlcigpXG4gICAgdGhpcy5vcHRzID0gb3B0aW9uc1xuICAgIHRoaXMuZWxlbSA9IHRoaXMuX2NyZWF0ZVRleHQodGV4dClcbiAgfVxuXG4gIF9jcmVhdGVUZXh0KHRleHQpIHtcbiAgICBjb25zdCBjb2xvciAgPSB0ZXh0LmNvbG9yICB8fCB0aGlzLm9wdHMudGV4dC5jb2xvclxuICAgIGNvbnN0IHNoYWRvdyA9IHRleHQuc2hhZG93IHx8IHRoaXMub3B0cy50ZXh0LnNoYWRvd1xuICAgIGNvbnN0IHNpemUgICA9IHRleHQuc2l6ZSAgIHx8IHRoaXMub3B0cy50ZXh0LnNpemVcbiAgICBjb25zdCB3ZWlnaHQgPSB0ZXh0LndlaWdodCB8fCB0aGlzLm9wdHMudGV4dC53ZWlnaHRcbiAgICBjb25zdCB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpXG5cbiAgICB0LmNsYXNzTmFtZSAgICAgICAgPSB0ZXh0LmNsYXNzTmFtZSB8fCB0aGlzLm9wdHMudGV4dC5jbGFzc05hbWVcbiAgICB0LnN0eWxlLnBvc2l0aW9uICAgPSAnYWJzb2x1dGUnXG4gICAgdC5zdHlsZS5mb250U2l6ZSAgID0gc2l6ZSArICdweCdcbiAgICB0LnN0eWxlLmZvbnRXZWlnaHQgPSB3ZWlnaHRcbiAgICB0LnN0eWxlLmNvbG9yICAgICAgPSBjb2xvclxuICAgIHQuc3R5bGUudGV4dFNoYWRvdyA9IGAtMnB4IC0ycHggMHB4ICR7c2hhZG93fSwgLTJweCAycHggMHB4ICR7c2hhZG93fSwgMnB4IC0ycHggMHB4ICR7c2hhZG93fSwgMnB4IDJweCAwcHggJHtzaGFkb3d9YFxuICAgIHQuc3R5bGUud2hpdGVTcGFjZSA9IHRoaXMub3B0cy50ZXh0LndoaXRlU3BhY2VcbiAgICB0LnN0eWxlLnpJbmRleCAgICAgPSB0aGlzLm9wdHMudGV4dC56SW5kZXhcblxuICAgIHQuaW5uZXJUZXh0ID0gdGV4dC5ib2R5XG5cbiAgICByZXR1cm4gdFxuICB9XG5cbiAgYWRkQW5pbWF0aW9uKGVmZmVjdCwgdGltaW5nLCBvbmZpbmlzaCkge1xuICAgIHRoaXMuZWxlbS5hbmltYXRlKGVmZmVjdCwgdGltaW5nKS5vbmZpbmlzaCA9IG9uZmluaXNoXG4gIH1cblxuICBoaWRlKCkge1xuICAgIHRoaXMuZWxlbS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXG4gIH1cblxuICBzaG93KCkge1xuICAgIHRoaXMuZWxlbS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJ1xuICB9XG59XG4iLCJpbXBvcnQgZWxlbWVudFJlc2l6ZUV2ZW50IGZyb20gJ2VsZW1lbnQtcmVzaXplLWV2ZW50J1xuaW1wb3J0IEZsb3dseVRleHQgZnJvbSAnLi9mbG93bHkvdGV4dCdcbmltcG9ydCB7IHJhbmQsIHJhbmRvbVN0ciB9IGZyb20gJy4vdXRpbHMnXG5cbmNsYXNzIEZsb3dseSB7XG4gIGNvbnN0cnVjdG9yKGVsZW0sIG9wdGlvbnMgPSB7fSkge1xuICAgIC8qIEFQUCAqL1xuICAgIHRoaXMuZWxlbSA9IGVsZW1cbiAgICB0aGlzLmFwcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZWxlbSlcbiAgICB0aGlzLmFwcC5zdHlsZS5wb3NpdGlvbiA9ICdyZWxhdGl2ZSdcbiAgICB0aGlzLmFwcC5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nXG5cbiAgICB0aGlzLnJlY3QgPSB0aGlzLmFwcC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgIHRoaXMub3B0cyA9IE9iamVjdC5hc3NpZ24odGhpcy5fZGVmYXVsdE9wdGlvbnMoKSwgb3B0aW9ucylcblxuICAgIHRoaXMuZWxlbXMgPSBuZXcgTWFwKClcbiAgICBlbGVtZW50UmVzaXplRXZlbnQodGhpcy5hcHAsICgpID0+IHsgdGhpcy5yZXNpemUoKSB9KVxuICB9XG5cbiAgYWRkSW1hZ2UoaW1hZ2UpIHtcbiAgICBpZiAodGhpcy5vcHRzLmRpc2FibGUpIHJldHVyblxuXG4gICAgY29uc3QgdCA9IHRoaXMuX2NyZWF0ZUltYWdlKGltYWdlKVxuICB9XG5cbiAgYWRkVGV4dCh0ZXh0KSB7XG4gICAgaWYgKHRoaXMub3B0cy5kaXNhYmxlKSByZXR1cm5cblxuICAgIGNvbnN0IHQgPSBuZXcgRmxvd2x5VGV4dCh0ZXh0LCB0aGlzLm9wdHMpXG4gICAgdGhpcy5hcHAuYXBwZW5kQ2hpbGQodC5lbGVtKVxuICAgIHRoaXMuZWxlbXMuc2V0KHQudG9rZW4sIHQpXG5cbiAgICAvLyBjb25zdCB0ID0gdGhpcy5fY3JlYXRlVGV4dCh0ZXh0KVxuICAgIC8vIHRoaXMuYXBwLmFwcGVuZENoaWxkKHQpXG4gICAgbGV0IHRpbWluZyA9IHt9XG4gICAgdGltaW5nLml0ZXJhdGlvbnMgPSAxXG4gICAgdGltaW5nLmR1cmF0aW9uID0gMzAwMCAvLyh0ZXh0LmR1cmF0aW9uIHx8IHRoaXMub3B0cy5kdXJhdGlvbikgKiAodGhpcy5hcHAuY2xpZW50V2lkdGggKyB0Lm9mZnNldFdpZHRoKSAvIHRoaXMuYXBwLmNsaWVudFdpZHRoXG4gICAgdGltaW5nLmVhc2luZyA9IHRleHQuZWFzaW5nIHx8IHRoaXMub3B0cy5lYXNpbmdcblxuICAgIGNvbnN0IGVmZmVjdCA9IHRoaXMuX2VmZmVjdCh0LmVsZW0sIHRoaXMub3B0cy5kaXJlY3Rpb24pXG4gICAgdC5hZGRBbmltYXRpb24oZWZmZWN0LCB0aW1pbmcsICgpID0+IHtcbiAgICAgIHRoaXMuYXBwLnJlbW92ZUNoaWxkKHQuZWxlbSlcbiAgICAgIHRoaXMuZWxlbXMuZGVsZXRlKHQudG9rZW4pXG4gICAgfSlcbiAgfVxuXG4gIC8vIGlmIHRydWUgc2hvdyB0ZXh0LCBpZiBmYWxzZSBoaWRlIHRleHRcbiAgdG9nZ2xlKGZsYWcpIHtcbiAgICBpZiAoZmxhZykgdGhpcy5zaG93KClcbiAgICBlbHNlIHRoaXMuaGlkZSgpXG4gIH1cblxuICBoaWRlKCkge1xuICAgIGZvciAobGV0IGVsZW0gb2YgdGhpcy5lbGVtcy52YWx1ZXMoKSkge1xuICAgICAgZWxlbS5oaWRlKClcbiAgICAgIC8vZWxlbS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXG4gICAgfVxuICB9XG5cbiAgc2hvdygpIHtcbiAgICBmb3IgKGxldCBlbGVtIG9mIHRoaXMuZWxlbXMudmFsdWVzKCkpIHtcbiAgICAgIGVsZW0uc2hvdygpXG4gICAgICAvL2VsZW0uc3R5bGUuZGlzcGxheSA9ICdibG9jaydcbiAgICB9XG4gIH1cblxuICByZXNpemUoKSB7XG4gICAgdGhpcy5hcHAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRoaXMuZWxlbSlcbiAgICB0aGlzLmFwcC5zdHlsZS5wb3NpdGlvbiA9ICdyZWxhdGl2ZSdcbiAgICB0aGlzLmFwcC5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nXG4gICAgdGhpcy5yZWN0ID0gdGhpcy5hcHAuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgfVxuXG4gIHVwZGF0ZShvcHRpb25zID0ge30pIHtcbiAgICB0aGlzLm9wdHMgPSBPYmplY3QuYXNzaWduKHRoaXMub3B0cywgb3B0aW9ucylcbiAgfVxuXG4gIHVuYmluZCgpIHtcbiAgICBlbGVtZW50UmVzaXplRXZlbnQudW5iaW5kKHRoaXMuYXBwKVxuICAgIHRoaXMudXBkYXRlKHsgZGlzYWJsZTogdHJ1ZSB9KVxuICB9XG5cbiAgX2NyZWF0ZVRleHQodGV4dCkge1xuICAgIGNvbnN0IGNvbG9yICA9IHRleHQuY29sb3IgIHx8IHRoaXMub3B0cy50ZXh0LmNvbG9yXG4gICAgY29uc3Qgc2hhZG93ID0gdGV4dC5zaGFkb3cgfHwgdGhpcy5vcHRzLnRleHQuc2hhZG93XG4gICAgY29uc3Qgc2l6ZSAgID0gdGV4dC5zaXplICAgfHwgdGhpcy5vcHRzLnRleHQuc2l6ZVxuICAgIGNvbnN0IHdlaWdodCA9IHRleHQud2VpZ2h0IHx8IHRoaXMub3B0cy50ZXh0LndlaWdodFxuICAgIGNvbnN0IHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcblxuICAgIHQuY2xhc3NOYW1lICAgICAgICA9IHRleHQuY2xhc3NOYW1lIHx8IHRoaXMub3B0cy50ZXh0LmNsYXNzTmFtZVxuICAgIHQuc3R5bGUucG9zaXRpb24gICA9ICdhYnNvbHV0ZSdcbiAgICB0LnN0eWxlLmZvbnRTaXplICAgPSBzaXplICsgJ3B4J1xuICAgIHQuc3R5bGUuZm9udFdlaWdodCA9IHdlaWdodFxuICAgIHQuc3R5bGUuY29sb3IgICAgICA9IGNvbG9yXG4gICAgdC5zdHlsZS50ZXh0U2hhZG93ID0gYC0ycHggLTJweCAwcHggJHtzaGFkb3d9LCAtMnB4IDJweCAwcHggJHtzaGFkb3d9LCAycHggLTJweCAwcHggJHtzaGFkb3d9LCAycHggMnB4IDBweCAke3NoYWRvd31gXG4gICAgdC5zdHlsZS53aGl0ZVNwYWNlID0gdGhpcy5vcHRzLnRleHQud2hpdGVTcGFjZVxuICAgIHQuc3R5bGUuekluZGV4ICAgICA9IHRoaXMub3B0cy50ZXh0LnpJbmRleFxuXG4gICAgdC5pbm5lclRleHQgPSB0ZXh0LmJvZHlcblxuICAgIHJldHVybiB0XG4gIH1cblxuICBfY3JlYXRlSW1hZ2UoaW1hZ2UpIHtcbiAgICBjb25zdCB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJylcblxuICAgIHQuc3R5bGUucG9zaXRpb24gPSAnZml4ZWQnXG4gICAgdC5zdHlsZS53aWR0aCAgPSBpbWFnZS53aWR0aFxuICAgIHQuc3R5bGUuaGVpZ2h0ID0gaW1hZ2UuaGVpZ2h0XG4gICAgdC5zdHlsZS56SW5kZXggPSAyMTQ3NDgzNjQ3XG4gICAgdC5zdHlsZS5sZWZ0ICAgPSB0aGlzLnJlY3Qud2lkdGggKyB0LmNsaWVudFdpZHRoICsgJ3B4J1xuICAgIHQuc3R5bGUudG9wICAgID0gcmFuZCh0aGlzLnJlY3QudG9wLCB0aGlzLnJlY3QuaGVpZ2h0IC0gdC5jbGllbnRIZWlnaHQpICsgJ3B4J1xuXG4gICAgdC5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKGUpID0+IHtcbiAgICAgIGNvbnN0IGVmZmVjdCA9IHRoaXMuX2VmZmVjdCh0LCB0aGlzLm9wdHMuZGlyZWN0aW9uKVxuXG4gICAgICBsZXQgdGltaW5nID0ge31cbiAgICAgIHRpbWluZy5pdGVyYXRpb25zID0gMVxuICAgICAgdGltaW5nLmR1cmF0aW9uID0gKGltYWdlLmR1cmF0aW9uIHx8IHRoaXMub3B0cy5kdXJhdGlvbikgKiAodGhpcy5hcHAuY2xpZW50V2lkdGggKyB0Lm9mZnNldFdpZHRoKSAvIHRoaXMuYXBwLmNsaWVudFdpZHRoXG4gICAgICB0aW1pbmcuZWFzaW5nID0gaW1hZ2UuZWFzaW5nIHx8IHRoaXMub3B0cy5lYXNpbmdcblxuICAgICAgY29uc3QgdG9rZW4gPSByYW5kb21TdHIoKVxuICAgICAgdGhpcy5lbGVtcy5zZXQodG9rZW4sIHQpXG5cbiAgICAgIHQuYW5pbWF0ZShlZmZlY3QsIHRpbWluZykub25maW5pc2ggPSAoKSA9PiB7XG4gICAgICAgIHRoaXMuYXBwLnJlbW92ZUNoaWxkKHQpXG4gICAgICAgIHRoaXMuZWxlbXMuZGVsZXRlKHRva2VuKVxuICAgICAgfVxuICAgIH0pXG5cbiAgICB0LnNyYyA9IGltYWdlLnVybFxuICAgIHRoaXMuYXBwLmFwcGVuZENoaWxkKHQpXG4gICAgcmV0dXJuIHRcbiAgfVxuXG4gIF9lZmZlY3QoZWxlbSwgdHlwZSkge1xuICAgIGlmICh0eXBlID09PSAnaG9yaXpvbnRhbCcpIHtcbiAgICAgIGVsZW0uc3R5bGUubGVmdCA9ICh0aGlzLnJlY3QubGVmdCArIHRoaXMucmVjdC53aWR0aCkgKyAncHgnXG4gICAgICBlbGVtLnN0eWxlLnRvcCAgPSByYW5kKDAsIHRoaXMucmVjdC5oZWlnaHQgLSBlbGVtLmNsaWVudEhlaWdodCkgKyAncHgnXG5cbiAgICAgIHJldHVybiBbe1xuICAgICAgICBsZWZ0OiB0aGlzLnJlY3Qud2lkdGggKyAncHgnXG4gICAgICB9LCB7XG4gICAgICAgIGxlZnQ6ICgtZWxlbS5jbGllbnRXaWR0aCkgKyAncHgnXG4gICAgICB9XVxuICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ3ZlcnRpY2FsJykge1xuICAgICAgZWxlbS5zdHlsZS5sZWZ0ID0gcmFuZCgwLCB0aGlzLnJlY3Qud2lkdGggLSBlbGVtLmNsaWVudFdpZHRoKSArICdweCdcbiAgICAgIGVsZW0uc3R5bGUudG9wICA9ICgtZWxlbS5jbGllbnRXaWR0aCkgKyAncHgnXG5cbiAgICAgIHJldHVybiBbe1xuICAgICAgICB0b3A6ICgtZWxlbS5jbGllbnRIZWlnaHQpICsgJ3B4J1xuICAgICAgfSwge1xuICAgICAgICB0b3A6IHRoaXMucmVjdC5oZWlnaHQgKyAncHgnXG4gICAgICB9XVxuICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ3JhbmRvbScpIHtcbiAgICAgIGVsZW0uc3R5bGUub3BhY2l0eSA9IDAuMFxuICAgICAgZWxlbS5zdHlsZS5sZWZ0ICAgID0gcmFuZCgwLCB0aGlzLnJlY3Qud2lkdGgpIC0gZWxlbS5jbGllbnRXaWR0aCAvIDIgKyAncHgnXG4gICAgICBlbGVtLnN0eWxlLnRvcCAgICAgPSByYW5kKDAsIHRoaXMucmVjdC5oZWlnaHQpIC0gZWxlbS5jbGllbnRIZWlnaHQgLyAyICsgJ3B4J1xuXG4gICAgICByZXR1cm4gW3tcbiAgICAgICAgb3BhY2l0eTogMC4wLFxuICAgICAgICB0cmFuc2Zvcm06ICdzY2FsZSgwLjIsIDAuMikgdHJhbnNsYXRlKDAsIDIwcHgpJ1xuICAgICAgfSwge1xuICAgICAgICBvcGFjaXR5OiAxLjAsXG4gICAgICAgIHRyYW5zZm9ybTogJ3NjYWxlKDAuNSwgMC41KSB0cmFuc2xhdGUoMCwgMHB4KSdcbiAgICAgIH0sIHtcbiAgICAgICAgb3BhY2l0eTogMC4wLFxuICAgICAgICB0cmFuc2Zvcm06ICdzY2FsZSgxLjAsIDEuMCkgdHJhbnNsYXRlKDAsIC01MHB4KSdcbiAgICAgIH1dXG4gICAgfVxuICB9XG5cbiAgX2RlZmF1bHRPcHRpb25zKCkge1xuICAgIHJldHVybiB7XG4gICAgICB0ZXh0OiB7XG4gICAgICAgIHdlaWdodDogJ2JvbGQnLFxuICAgICAgICBzaXplICA6IDU2LFxuICAgICAgICBjb2xvciA6ICcjMDAwJyxcbiAgICAgICAgc2hhZG93OiAnI2ZmZicsXG4gICAgICAgIGNsYXNzTmFtZTogJ2Zsb3dseS10ZXh0JyxcbiAgICAgICAgd2hpdGVTcGFjZTogJ25vd3JhcCcgfHwgJ3ByZScsXG4gICAgICAgIHpJbmRleDogMjE0NzQ4MzY0NyxcbiAgICAgIH0sXG4gICAgICBkaXNhYmxlOiBmYWxzZSxcbiAgICAgIGR1cmF0aW9uOiAyMDAwLFxuICAgICAgZWFzaW5nOiAnbGluZWFyJyxcbiAgICAgIGRpcmVjdGlvbjogJ2hvcml6b250YWwnLFxuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEZsb3dseVxuIiwiY29uc3QgcmFuZCA9IChtaW4sIG1heCkgPT4ge1xuICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbikgKyBtaW4pXG59XG5cbmNvbnN0IHJhbmRvbVN0ciA9IChsZW5ndGggPSAzMikgPT4ge1xuICBsZXQgcyA9ICcnXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCByYW5kb20gPSBNYXRoLnJhbmRvbSgpICogMTYgfCAwXG4gICAgcyArPSAoaSA9PSAxMiA/IDQgOiAoaSA9PSAxNiA/IChyYW5kb20gJiAzIHwgOCkgOiByYW5kb20pKS50b1N0cmluZygxNilcbiAgfVxuICByZXR1cm4gc1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgcmFuZCxcbiAgcmFuZG9tU3RyXG59XG4iXX0=
