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
      if (type === 'horizontal') {
        elem.style.left = rect.left + rect.width + 'px';
        elem.style.top = (0, _utils.rand)(0, rect.height - elem.clientHeight) + 'px';

        return [{
          left: rect.width + 'px'
        }, {
          left: -elem.clientWidth + 'px'
        }];
      } else if (type === 'vertical') {
        elem.style.left = (0, _utils.rand)(0, rect.width - elem.clientWidth) + 'px';
        elem.style.top = -elem.clientWidth + 'px';

        return [{
          top: -elem.clientHeight + 'px'
        }, {
          top: rect.height + 'px'
        }];
      } else if (type === 'random') {
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
    value: function _createTiming(_ref) {
      var duration = _ref.duration,
          easing = _ref.easing;

      var timing = {};
      timing.iterations = 1;
      timing.duration = parseInt(duration || this.opts.duration, 10);
      timing.easing = easing || this.opts.easing;

      console.log(timing);
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

      t.style.position = 'fixed';
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
      var effect = this._createEffect(this.elem, rect, this.opts.direction);
      var timing = this._createTiming(image);

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
      var effect = this._createEffect(this.elem, rect, this.opts.direction);
      var timing = this._createTiming(text);

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
    key: '_createImage',
    value: function _createImage(image) {
      var _this4 = this;

      var t = document.createElement('img');

      t.style.position = 'fixed';
      t.style.width = image.width;
      t.style.height = image.height;
      t.style.zIndex = 2147483647;
      t.style.left = this.rect.width + t.clientWidth + 'px';
      t.style.top = (0, _utils.rand)(this.rect.top, this.rect.height - t.clientHeight) + 'px';

      t.addEventListener('load', function (e) {
        var effect = _this4._effect(t, _this4.opts.direction);

        var timing = {};
        timing.iterations = 1;
        timing.duration = (image.duration || _this4.opts.duration) * (_this4.app.clientWidth + t.offsetWidth) / _this4.app.clientWidth;
        timing.easing = image.easing || _this4.opts.easing;

        var token = (0, _utils.randomStr)();
        _this4.elems.set(token, t);

        t.animate(effect, timing).onfinish = function () {
          _this4.app.removeChild(t);
          _this4.elems.delete(token);
        };
      });

      t.src = image.url;
      this.app.appendChild(t);
      return t;
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
        direction: 'horizontal'
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvZWxlbWVudC1yZXNpemUtZXZlbnQvaW5kZXguanMiLCJzcmMvZmxvd2x5L2Jhc2UuanMiLCJzcmMvZmxvd2x5L2ltYWdlLmpzIiwic3JjL2Zsb3dseS90ZXh0LmpzIiwic3JjL2luZGV4LmpzIiwic3JjL3V0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7QUMvR0E7Ozs7SUFFcUIsSTtBQUNuQixnQkFBWSxJQUFaLEVBQWtCO0FBQUE7O0FBQ2hCLFNBQUssS0FBTCxHQUFhLHVCQUFiO0FBQ0EsU0FBSyxJQUFMLEdBQVksSUFBWjtB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aEIsTUFBZ0IsdUVBQVAsRUFBTzs7QUFDakMsTUFBSSxJQUFJLEVBQVI7QUFDQSxPQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksTUFBcEIsRUFBNEIsR0FBNUIsRUFBaUM7QUFDL0IsUUFBTSxTQUFTLEtBQUssTUFBTCxLQUFnQixFQUFoQixHQUFxQixDQUFwQztBQUNBLFNBQUssQ0FBQyxLQUFLLEVBQUwsR0FBVSxDQUFWLEdBQWUsS0FBSyxFQUFMLEdBQVcsU0FBUyxDQUFULEdBQWEsQ0FBeEIsR0FBNkIsTUFBN0MsRUFBc0QsUUFBdEQsQ0FBK0QsRUFBL0QsQ0FBTDtBQUNEO0FBQ0QsU0FBTyxDQUFQO0FBQ0QsQ0FQRDs7QUFTQSxPQUFPLE9BQVAsR0FBaUI7QUFDZixZQURlO0FBRWY7QUFGZSxDQUFqQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgcmVxdWVzdEZyYW1lID0gKGZ1bmN0aW9uICgpIHtcbiAgdmFyIHdpbmRvdyA9IHRoaXNcbiAgdmFyIHJhZiA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICB3aW5kb3cubW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgd2luZG93LndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuICAgIGZ1bmN0aW9uIGZhbGxiYWNrUkFGKGZ1bmMpIHtcbiAgICAgIHJldHVybiB3aW5kb3cuc2V0VGltZW91dChmdW5jLCAyMClcbiAgICB9XG4gIHJldHVybiBmdW5jdGlvbiByZXF1ZXN0RnJhbWVGdW5jdGlvbihmdW5jKSB7XG4gICAgcmV0dXJuIHJhZihmdW5jKVxuICB9XG59KSgpXG5cbnZhciBjYW5jZWxGcmFtZSA9IChmdW5jdGlvbiAoKSB7XG4gIHZhciB3aW5kb3cgPSB0aGlzXG4gIHZhciBjYW5jZWwgPSB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUgfHxcbiAgICB3aW5kb3cubW96Q2FuY2VsQW5pbWF0aW9uRnJhbWUgfHxcbiAgICB3aW5kb3cud2Via2l0Q2FuY2VsQW5pbWF0aW9uRnJhbWUgfHxcbiAgICB3aW5kb3cuY2xlYXJUaW1lb3V0XG4gIHJldHVybiBmdW5jdGlvbiBjYW5jZWxGcmFtZUZ1bmN0aW9uKGlkKSB7XG4gICAgcmV0dXJuIGNhbmNlbChpZClcbiAgfVxufSkoKVxuXG5mdW5jdGlvbiByZXNpemVMaXN0ZW5lcihlKSB7XG4gIHZhciB3aW4gPSBlLnRhcmdldCB8fCBlLnNyY0VsZW1lbnRcbiAgaWYgKHdpbi5fX3Jlc2l6ZVJBRl9fKSB7XG4gICAgY2FuY2VsRnJhbWUod2luLl9fcmVzaXplUkFGX18pXG4gIH1cbiAgd2luLl9fcmVzaXplUkFGX18gPSByZXF1ZXN0RnJhbWUoZnVuY3Rpb24gKCkge1xuICAgIHZhciB0cmlnZ2VyID0gd2luLl9fcmVzaXplVHJpZ2dlcl9fXG4gICAgdHJpZ2dlci5fX3Jlc2l6ZUxpc3RlbmVyc19fLmZvckVhY2goZnVuY3Rpb24gKGZuKSB7XG4gICAgICBmbi5jYWxsKHRyaWdnZXIsIGUpXG4gICAgfSlcbiAgfSlcbn1cblxudmFyIGV4cG9ydHMgPSBmdW5jdGlvbiBleHBvcnRzKGVsZW1lbnQsIGZuKSB7XG4gIHZhciB3aW5kb3cgPSB0aGlzXG4gIHZhciBkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudFxuICB2YXIgaXNJRVxuXG4gIHZhciBhdHRhY2hFdmVudCA9IGRvY3VtZW50LmF0dGFjaEV2ZW50XG4gIGlmICh0eXBlb2YgbmF2aWdhdG9yICE9PSAndW5kZWZpbmVkJykge1xuICAgIGlzSUUgPSBuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9UcmlkZW50LykgfHxcbiAgICAgIG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL0VkZ2UvKVxuICB9XG5cbiAgZnVuY3Rpb24gb2JqZWN0TG9hZCgpIHtcbiAgICB0aGlzLmNvbnRlbnREb2N1bWVudC5kZWZhdWx0Vmlldy5fX3Jlc2l6ZVRyaWdnZXJfXyA9IHRoaXMuX19yZXNpemVFbGVtZW50X19cbiAgICB0aGlzLmNvbnRlbnREb2N1bWVudC5kZWZhdWx0Vmlldy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCByZXNpemVMaXN0ZW5lcilcbiAgfVxuXG4gIGlmICghZWxlbWVudC5fX3Jlc2l6ZUxpc3RlbmVyc19fKSB7XG4gICAgZWxlbWVudC5fX3Jlc2l6ZUxpc3RlbmVyc19fID0gW11cbiAgICBpZiAoYXR0YWNoRXZlbnQpIHtcbiAgICAgIGVsZW1lbnQuX19yZXNpemVUcmlnZ2VyX18gPSBlbGVtZW50XG4gICAgICBlbGVtZW50LmF0dGFjaEV2ZW50KCdvbnJlc2l6ZScsIHJlc2l6ZUxpc3RlbmVyKVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KS5wb3NpdGlvbiA9PT0gJ3N0YXRpYycpIHtcbiAgICAgICAgZWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9ICdyZWxhdGl2ZSdcbiAgICAgIH1cbiAgICAgIHZhciBvYmogPSAoZWxlbWVudC5fX3Jlc2l6ZVRyaWdnZXJfXyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29iamVjdCcpKVxuICAgICAgb2JqLnNldEF0dHJpYnV0ZShcbiAgICAgICAgJ3N0eWxlJyxcbiAgICAgICAgJ2Rpc3BsYXk6IGJsb2NrOyBwb3NpdGlvbjogYWJzb2x1dGU7IHRvcDogMDsgbGVmdDogMDsgaGVpZ2h0OiAxMDAlOyB3aWR0aDogMTAwJTsgb3ZlcmZsb3c6IGhpZGRlbjsgcG9pbnRlci1ldmVudHM6IG5vbmU7IHotaW5kZXg6IC0xOyBvcGFjaXR5OiAwOydcbiAgICAgIClcbiAgICAgIG9iai5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3Jlc2l6ZS1zZW5zb3InKVxuICAgICAgb2JqLl9fcmVzaXplRWxlbWVudF9fID0gZWxlbWVudFxuICAgICAgb2JqLm9ubG9hZCA9IG9iamVjdExvYWRcbiAgICAgIG9iai50eXBlID0gJ3RleHQvaHRtbCdcbiAgICAgIGlmIChpc0lFKSB7XG4gICAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQob2JqKVxuICAgICAgfVxuICAgICAgb2JqLmRhdGEgPSAnYWJvdXQ6YmxhbmsnXG4gICAgICBpZiAoIWlzSUUpIHtcbiAgICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZChvYmopXG4gICAgICB9XG4gICAgfVxuICB9XG4gIGVsZW1lbnQuX19yZXNpemVMaXN0ZW5lcnNfXy5wdXNoKGZuKVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnID8gZXhwb3J0cyA6IGV4cG9ydHMuYmluZCh3aW5kb3cpXG5cbm1vZHVsZS5leHBvcnRzLnVuYmluZCA9IGZ1bmN0aW9uIChlbGVtZW50LCBmbikge1xuICB2YXIgYXR0YWNoRXZlbnQgPSBkb2N1bWVudC5hdHRhY2hFdmVudFxuICBpZiAoZm4pIHtcbiAgICBlbGVtZW50Ll9fcmVzaXplTGlzdGVuZXJzX18uc3BsaWNlKFxuICAgICAgZWxlbWVudC5fX3Jlc2l6ZUxpc3RlbmVyc19fLmluZGV4T2YoZm4pLFxuICAgICAgMVxuICAgIClcbiAgfSBlbHNlIHtcbiAgICBlbGVtZW50Ll9fcmVzaXplTGlzdGVuZXJzX18gPSBbXVxuICB9XG4gIGlmICghZWxlbWVudC5fX3Jlc2l6ZUxpc3RlbmVyc19fLmxlbmd0aCkge1xuICAgIGlmIChhdHRhY2hFdmVudCkge1xuICAgICAgZWxlbWVudC5kZXRhY2hFdmVudCgnb25yZXNpemUnLCByZXNpemVMaXN0ZW5lcilcbiAgICB9IGVsc2Uge1xuICAgICAgZWxlbWVudC5fX3Jlc2l6ZVRyaWdnZXJfXy5jb250ZW50RG9jdW1lbnQuZGVmYXVsdFZpZXcucmVtb3ZlRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgJ3Jlc2l6ZScsXG4gICAgICAgIHJlc2l6ZUxpc3RlbmVyXG4gICAgICApXG4gICAgICBkZWxldGUgZWxlbWVudC5fX3Jlc2l6ZVRyaWdnZXJfXy5jb250ZW50RG9jdW1lbnQuZGVmYXVsdFZpZXcuX19yZXNpemVUcmlnZ2VyX19cbiAgICAgIGVsZW1lbnQuX19yZXNpemVUcmlnZ2VyX18gPSAhZWxlbWVudC5yZW1vdmVDaGlsZChcbiAgICAgICAgZWxlbWVudC5fX3Jlc2l6ZVRyaWdnZXJfX1xuICAgICAgKVxuICAgIH1cbiAgICBkZWxldGUgZWxlbWVudC5fX3Jlc2l6ZUxpc3RlbmVyc19fXG4gIH1cbn1cbiIsImltcG9ydCB7IHJhbmQsIHJhbmRvbVN0ciB9IGZyb20gJy4uL3V0aWxzJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYXNlIHtcbiAgY29uc3RydWN0b3Iob3B0cykge1xuICAgIHRoaXMudG9rZW4gPSByYW5kb21TdHIoKVxuICAgIHRoaXMub3B0cyA9IG9wdHNcbiAgfVxuXG4gIF9jcmVhdGVFZmZlY3QoZWxlbSwgcmVjdCwgdHlwZSkge1xuICAgIGlmICh0eXBlID09PSAnaG9yaXpvbnRhbCcpIHtcbiAgICAgIGVsZW0uc3R5bGUubGVmdCA9IChyZWN0LmxlZnQgKyByZWN0LndpZHRoKSArICdweCdcbiAgICAgIGVsZW0uc3R5bGUudG9wICA9IHJhbmQoMCwgcmVjdC5oZWlnaHQgLSBlbGVtLmNsaWVudEhlaWdodCkgKyAncHgnXG5cbiAgICAgIHJldHVybiBbe1xuICAgICAgICBsZWZ0OiByZWN0LndpZHRoICsgJ3B4J1xuICAgICAgfSwge1xuICAgICAgICBsZWZ0OiAoLWVsZW0uY2xpZW50V2lkdGgpICsgJ3B4J1xuICAgICAgfV1cbiAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICd2ZXJ0aWNhbCcpIHtcbiAgICAgIGVsZW0uc3R5bGUubGVmdCA9IHJhbmQoMCwgcmVjdC53aWR0aCAtIGVsZW0uY2xpZW50V2lkdGgpICsgJ3B4J1xuICAgICAgZWxlbS5zdHlsZS50b3AgID0gKC1lbGVtLmNsaWVudFdpZHRoKSArICdweCdcblxuICAgICAgcmV0dXJuIFt7XG4gICAgICAgIHRvcDogKC1lbGVtLmNsaWVudEhlaWdodCkgKyAncHgnXG4gICAgICB9LCB7XG4gICAgICAgIHRvcDogcmVjdC5oZWlnaHQgKyAncHgnXG4gICAgICB9XVxuICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ3JhbmRvbScpIHtcbiAgICAgIGVsZW0uc3R5bGUub3BhY2l0eSA9IDAuMFxuICAgICAgZWxlbS5zdHlsZS5sZWZ0ICAgID0gcmFuZCgwLCByZWN0LndpZHRoKSAtIGVsZW0uY2xpZW50V2lkdGggLyAyICsgJ3B4J1xuICAgICAgZWxlbS5zdHlsZS50b3AgICAgID0gcmFuZCgwLCByZWN0LmhlaWdodCkgLSBlbGVtLmNsaWVudEhlaWdodCAvIDIgKyAncHgnXG5cbiAgICAgIHJldHVybiBbe1xuICAgICAgICBvcGFjaXR5OiAwLjAsXG4gICAgICAgIHRyYW5zZm9ybTogJ3NjYWxlKDAuMiwgMC4yKSB0cmFuc2xhdGUoMCwgMjBweCknXG4gICAgICB9LCB7XG4gICAgICAgIG9wYWNpdHk6IDEuMCxcbiAgICAgICAgdHJhbnNmb3JtOiAnc2NhbGUoMC41LCAwLjUpIHRyYW5zbGF0ZSgwLCAwcHgpJ1xuICAgICAgfSwge1xuICAgICAgICBvcGFjaXR5OiAwLjAsXG4gICAgICAgIHRyYW5zZm9ybTogJ3NjYWxlKDEuMCwgMS4wKSB0cmFuc2xhdGUoMCwgLTUwcHgpJ1xuICAgICAgfV1cbiAgICB9XG4gIH1cblxuICBfY3JlYXRlVGltaW5nKHsgZHVyYXRpb24sIGVhc2luZyB9KSB7XG4gICAgbGV0IHRpbWluZyA9IHt9XG4gICAgdGltaW5nLml0ZXJhdGlvbnMgPSAxXG4gICAgdGltaW5nLmR1cmF0aW9uICAgPSBwYXJzZUludChkdXJhdGlvbiB8fCB0aGlzLm9wdHMuZHVyYXRpb24sIDEwKVxuICAgIHRpbWluZy5lYXNpbmcgICAgID0gZWFzaW5nIHx8IHRoaXMub3B0cy5lYXNpbmdcblxuICAgIGNvbnNvbGUubG9nKHRpbWluZylcbiAgICByZXR1cm4gdGltaW5nXG4gIH1cblxuICBoaWRlKCkge1xuICAgIHRoaXMuZWxlbS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXG4gIH1cblxuICBzaG93KCkge1xuICAgIHRoaXMuZWxlbS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJ1xuICB9XG59XG4iLCJpbXBvcnQgQmFzZSBmcm9tICcuL2Jhc2UnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZsb3dseUltYWdlIGV4dGVuZHMgQmFzZSB7XG4gIGNvbnN0cnVjdG9yKGltYWdlLCBvcHRpb25zKSB7XG4gICAgc3VwZXIob3B0aW9ucylcbiAgICB0aGlzLmVsZW0gPSB0aGlzLl9jcmVhdGVJbWFnZShpbWFnZSlcbiAgfVxuXG4gIF9jcmVhdGVJbWFnZShpbWFnZSkge1xuICAgIGNvbnN0IHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKVxuXG4gICAgdC5zdHlsZS5wb3NpdGlvbiA9ICdmaXhlZCdcbiAgICB0LmNsYXNzTmFtZSAgICAgID0gaW1hZ2UuY2xhc3NOYW1lIHx8IHRoaXMub3B0cy5pbWFnZS5jbGFzc05hbWVcbiAgICB0LnN0eWxlLndpZHRoICAgID0gaW1hZ2Uud2lkdGggIHx8IHRoaXMub3B0cy5pbWFnZS53aWR0aFxuICAgIHQuc3R5bGUuaGVpZ2h0ICAgPSBpbWFnZS5oZWlnaHQgfHwgdGhpcy5vcHRzLmltYWdlLmhlaWdodFxuICAgIHQuc3R5bGUuekluZGV4ICAgPSAyMTQ3NDgzNjQ3XG4gICAgdC5zcmMgPSBpbWFnZS51cmxcbiAgICByZXR1cm4gdFxuICB9XG5cbiAgb25sb2FkKGZ1bmMpIHtcbiAgICB0aGlzLmVsZW0uYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGZ1bmMpXG4gIH1cblxuICBhZGRBbmltYXRpb24oaW1hZ2UsIHJlY3QsIG9uZmluaXNoKSB7XG4gICAgY29uc3QgZWZmZWN0ID0gdGhpcy5fY3JlYXRlRWZmZWN0KHRoaXMuZWxlbSwgcmVjdCwgdGhpcy5vcHRzLmRpcmVjdGlvbilcbiAgICBjb25zdCB0aW1pbmcgPSB0aGlzLl9jcmVhdGVUaW1pbmcoaW1hZ2UpXG5cbiAgICB0aGlzLmVsZW0uYW5pbWF0ZShlZmZlY3QsIHRpbWluZykub25maW5pc2ggPSBvbmZpbmlzaFxuICB9XG59XG4iLCJpbXBvcnQgQmFzZSBmcm9tICcuL2Jhc2UnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZsb3dseVRleHQgZXh0ZW5kcyBCYXNlIHtcbiAgY29uc3RydWN0b3IodGV4dCwgb3B0aW9ucykge1xuICAgIHN1cGVyKG9wdGlvbnMpXG4gICAgdGhpcy5lbGVtID0gdGhpcy5fY3JlYXRlVGV4dCh0ZXh0KVxuICB9XG5cbiAgX2NyZWF0ZVRleHQodGV4dCkge1xuICAgIGNvbnN0IGNvbG9yICA9IHRleHQuY29sb3IgIHx8IHRoaXMub3B0cy50ZXh0LmNvbG9yXG4gICAgY29uc3Qgc2hhZG93ID0gdGV4dC5zaGFkb3cgfHwgdGhpcy5vcHRzLnRleHQuc2hhZG93XG4gICAgY29uc3Qgc2l6ZSAgID0gdGV4dC5zaXplICAgfHwgdGhpcy5vcHRzLnRleHQuc2l6ZVxuICAgIGNvbnN0IHdlaWdodCA9IHRleHQud2VpZ2h0IHx8IHRoaXMub3B0cy50ZXh0LndlaWdodFxuICAgIGNvbnN0IHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcblxuICAgIHQuY2xhc3NOYW1lICAgICAgICA9IHRleHQuY2xhc3NOYW1lIHx8IHRoaXMub3B0cy50ZXh0LmNsYXNzTmFtZVxuICAgIHQuc3R5bGUucG9zaXRpb24gICA9ICdhYnNvbHV0ZSdcbiAgICB0LnN0eWxlLmZvbnRTaXplICAgPSBzaXplICsgJ3B4J1xuICAgIHQuc3R5bGUuZm9udFdlaWdodCA9IHdlaWdodFxuICAgIHQuc3R5bGUuY29sb3IgICAgICA9IGNvbG9yXG4gICAgdC5zdHlsZS50ZXh0U2hhZG93ID0gYC0ycHggLTJweCAwcHggJHtzaGFkb3d9LCAtMnB4IDJweCAwcHggJHtzaGFkb3d9LCAycHggLTJweCAwcHggJHtzaGFkb3d9LCAycHggMnB4IDBweCAke3NoYWRvd31gXG4gICAgdC5zdHlsZS53aGl0ZVNwYWNlID0gdGhpcy5vcHRzLnRleHQud2hpdGVTcGFjZVxuICAgIHQuc3R5bGUuekluZGV4ICAgICA9IHRoaXMub3B0cy50ZXh0LnpJbmRleFxuXG4gICAgdC5pbm5lclRleHQgPSB0ZXh0LmJvZHlcblxuICAgIHJldHVybiB0XG4gIH1cblxuICBhZGRBbmltYXRpb24odGV4dCwgcmVjdCwgb25maW5pc2gpIHtcbiAgICBjb25zdCBlZmZlY3QgPSB0aGlzLl9jcmVhdGVFZmZlY3QodGhpcy5lbGVtLCByZWN0LCB0aGlzLm9wdHMuZGlyZWN0aW9uKVxuICAgIGNvbnN0IHRpbWluZyA9IHRoaXMuX2NyZWF0ZVRpbWluZyh0ZXh0KVxuXG4gICAgdGhpcy5lbGVtLmFuaW1hdGUoZWZmZWN0LCB0aW1pbmcpLm9uZmluaXNoID0gb25maW5pc2hcbiAgfVxufVxuIiwiaW1wb3J0IGVsZW1lbnRSZXNpemVFdmVudCBmcm9tICdlbGVtZW50LXJlc2l6ZS1ldmVudCdcbmltcG9ydCBGbG93bHlUZXh0IGZyb20gJy4vZmxvd2x5L3RleHQnXG5pbXBvcnQgRmxvd2x5SW1hZ2UgZnJvbSAnLi9mbG93bHkvaW1hZ2UnXG5pbXBvcnQgeyByYW5kLCByYW5kb21TdHIgfSBmcm9tICcuL3V0aWxzJ1xuXG5jbGFzcyBGbG93bHkge1xuICBjb25zdHJ1Y3RvcihlbGVtLCBvcHRpb25zID0ge30pIHtcbiAgICAvKiBBUFAgKi9cbiAgICB0aGlzLmVsZW0gPSBlbGVtXG4gICAgdGhpcy5hcHAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGVsZW0pXG4gICAgdGhpcy5hcHAuc3R5bGUucG9zaXRpb24gPSAncmVsYXRpdmUnXG4gICAgdGhpcy5hcHAuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJ1xuXG4gICAgdGhpcy5yZWN0ID0gdGhpcy5hcHAuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICB0aGlzLm9wdHMgPSBPYmplY3QuYXNzaWduKHRoaXMuX2RlZmF1bHRPcHRpb25zKCksIG9wdGlvbnMpXG5cbiAgICB0aGlzLmVsZW1zID0gbmV3IE1hcCgpXG4gICAgZWxlbWVudFJlc2l6ZUV2ZW50KHRoaXMuYXBwLCAoKSA9PiB7IHRoaXMucmVzaXplKCkgfSlcbiAgfVxuXG4gIGFkZEltYWdlKGltYWdlKSB7XG4gICAgaWYgKHRoaXMub3B0cy5kaXNhYmxlKSByZXR1cm5cblxuICAgIGNvbnN0IHQgPSBuZXcgRmxvd2x5SW1hZ2UoaW1hZ2UsIHRoaXMub3B0cylcbiAgICB0aGlzLmFwcC5hcHBlbmRDaGlsZCh0LmVsZW0pXG4gICAgdC5vbmxvYWQoKGUpID0+IHtcbiAgICAgIHRoaXMuZWxlbXMuc2V0KHQudG9rZW4sIHQpXG5cbiAgICAgIHQuYWRkQW5pbWF0aW9uKGltYWdlLCB0aGlzLnJlY3QsICgpID0+IHtcbiAgICAgICAgdGhpcy5hcHAucmVtb3ZlQ2hpbGQodC5lbGVtKVxuICAgICAgICB0aGlzLmVsZW1zLmRlbGV0ZSh0LnRva2VuKVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgYWRkVGV4dCh0ZXh0KSB7XG4gICAgaWYgKHRoaXMub3B0cy5kaXNhYmxlKSByZXR1cm5cblxuICAgIGNvbnN0IHQgPSBuZXcgRmxvd2x5VGV4dCh0ZXh0LCB0aGlzLm9wdHMpXG4gICAgdGhpcy5hcHAuYXBwZW5kQ2hpbGQodC5lbGVtKVxuICAgIHRoaXMuZWxlbXMuc2V0KHQudG9rZW4sIHQpXG5cbiAgICB0LmFkZEFuaW1hdGlvbih0ZXh0LCB0aGlzLnJlY3QsICgpID0+IHtcbiAgICAgIHRoaXMuYXBwLnJlbW92ZUNoaWxkKHQuZWxlbSlcbiAgICAgIHRoaXMuZWxlbXMuZGVsZXRlKHQudG9rZW4pXG4gICAgfSlcbiAgfVxuXG4gIC8vIGlmIHRydWUgc2hvdyB0ZXh0LCBpZiBmYWxzZSBoaWRlIHRleHRcbiAgdG9nZ2xlKGZsYWcpIHtcbiAgICBpZiAoZmxhZykgdGhpcy5zaG93KClcbiAgICBlbHNlIHRoaXMuaGlkZSgpXG4gIH1cblxuICBoaWRlKCkge1xuICAgIGZvciAobGV0IGVsZW0gb2YgdGhpcy5lbGVtcy52YWx1ZXMoKSkgZWxlbS5oaWRlKClcbiAgfVxuXG4gIHNob3coKSB7XG4gICAgZm9yIChsZXQgZWxlbSBvZiB0aGlzLmVsZW1zLnZhbHVlcygpKSBlbGVtLnNob3coKVxuICB9XG5cbiAgcmVzaXplKCkge1xuICAgIHRoaXMuYXBwID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0aGlzLmVsZW0pXG4gICAgdGhpcy5hcHAuc3R5bGUucG9zaXRpb24gPSAncmVsYXRpdmUnXG4gICAgdGhpcy5hcHAuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJ1xuICAgIHRoaXMucmVjdCA9IHRoaXMuYXBwLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gIH1cblxuICB1cGRhdGUob3B0aW9ucyA9IHt9KSB7XG4gICAgdGhpcy5vcHRzID0gT2JqZWN0LmFzc2lnbih0aGlzLm9wdHMsIG9wdGlvbnMpXG4gIH1cblxuICB1bmJpbmQoKSB7XG4gICAgZWxlbWVudFJlc2l6ZUV2ZW50LnVuYmluZCh0aGlzLmFwcClcbiAgICB0aGlzLnVwZGF0ZSh7IGRpc2FibGU6IHRydWUgfSlcbiAgfVxuXG4gIF9jcmVhdGVJbWFnZShpbWFnZSkge1xuICAgIGNvbnN0IHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKVxuXG4gICAgdC5zdHlsZS5wb3NpdGlvbiA9ICdmaXhlZCdcbiAgICB0LnN0eWxlLndpZHRoICA9IGltYWdlLndpZHRoXG4gICAgdC5zdHlsZS5oZWlnaHQgPSBpbWFnZS5oZWlnaHRcbiAgICB0LnN0eWxlLnpJbmRleCA9IDIxNDc0ODM2NDdcbiAgICB0LnN0eWxlLmxlZnQgICA9IHRoaXMucmVjdC53aWR0aCArIHQuY2xpZW50V2lkdGggKyAncHgnXG4gICAgdC5zdHlsZS50b3AgICAgPSByYW5kKHRoaXMucmVjdC50b3AsIHRoaXMucmVjdC5oZWlnaHQgLSB0LmNsaWVudEhlaWdodCkgKyAncHgnXG5cbiAgICB0LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoZSkgPT4ge1xuICAgICAgY29uc3QgZWZmZWN0ID0gdGhpcy5fZWZmZWN0KHQsIHRoaXMub3B0cy5kaXJlY3Rpb24pXG5cbiAgICAgIGxldCB0aW1pbmcgPSB7fVxuICAgICAgdGltaW5nLml0ZXJhdGlvbnMgPSAxXG4gICAgICB0aW1pbmcuZHVyYXRpb24gPSAoaW1hZ2UuZHVyYXRpb24gfHwgdGhpcy5vcHRzLmR1cmF0aW9uKSAqICh0aGlzLmFwcC5jbGllbnRXaWR0aCArIHQub2Zmc2V0V2lkdGgpIC8gdGhpcy5hcHAuY2xpZW50V2lkdGhcbiAgICAgIHRpbWluZy5lYXNpbmcgPSBpbWFnZS5lYXNpbmcgfHwgdGhpcy5vcHRzLmVhc2luZ1xuXG4gICAgICBjb25zdCB0b2tlbiA9IHJhbmRvbVN0cigpXG4gICAgICB0aGlzLmVsZW1zLnNldCh0b2tlbiwgdClcblxuICAgICAgdC5hbmltYXRlKGVmZmVjdCwgdGltaW5nKS5vbmZpbmlzaCA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5hcHAucmVtb3ZlQ2hpbGQodClcbiAgICAgICAgdGhpcy5lbGVtcy5kZWxldGUodG9rZW4pXG4gICAgICB9XG4gICAgfSlcblxuICAgIHQuc3JjID0gaW1hZ2UudXJsXG4gICAgdGhpcy5hcHAuYXBwZW5kQ2hpbGQodClcbiAgICByZXR1cm4gdFxuICB9XG5cbiAgX2RlZmF1bHRPcHRpb25zKCkge1xuICAgIHJldHVybiB7XG4gICAgICB0ZXh0OiB7XG4gICAgICAgIHdlaWdodDogJ2JvbGQnLFxuICAgICAgICBzaXplICA6IDU2LFxuICAgICAgICBjb2xvciA6ICcjMDAwJyxcbiAgICAgICAgc2hhZG93OiAnI2ZmZicsXG4gICAgICAgIGNsYXNzTmFtZTogJ2Zsb3dseS10ZXh0JyxcbiAgICAgICAgd2hpdGVTcGFjZTogJ25vd3JhcCcgfHwgJ3ByZScsXG4gICAgICAgIHpJbmRleDogMjE0NzQ4MzY0NyxcbiAgICAgIH0sXG4gICAgICBpbWFnZToge1xuICAgICAgICBoZWlnaHQ6ICcyMDBweCcsXG4gICAgICAgIHdpZHRoIDogJ2F1dG8nLFxuICAgICAgICBjbGFzc05hbWU6ICdmbG93bHktaW1hZ2UnLFxuICAgICAgfSxcbiAgICAgIGRpc2FibGU6IGZhbHNlLFxuICAgICAgZHVyYXRpb246IDIwMDAsXG4gICAgICBlYXNpbmc6ICdsaW5lYXInLFxuICAgICAgZGlyZWN0aW9uOiAnaG9yaXpvbnRhbCcsXG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gRmxvd2x5XG4iLCJjb25zdCByYW5kID0gKG1pbiwgbWF4KSA9PiB7XG4gIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluKSArIG1pbilcbn1cblxuY29uc3QgcmFuZG9tU3RyID0gKGxlbmd0aCA9IDMyKSA9PiB7XG4gIGxldCBzID0gJydcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IHJhbmRvbSA9IE1hdGgucmFuZG9tKCkgKiAxNiB8IDBcbiAgICBzICs9IChpID09IDEyID8gNCA6IChpID09IDE2ID8gKHJhbmRvbSAmIDMgfCA4KSA6IHJhbmRvbSkpLnRvU3RyaW5nKDE2KVxuICB9XG4gIHJldHVybiBzXG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICByYW5kLFxuICByYW5kb21TdHJcbn1cbiJdfQ==
