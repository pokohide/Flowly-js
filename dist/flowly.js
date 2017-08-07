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

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
//import FlowlyText from 'flowly/text'


var _elementResizeEvent = require('element-resize-event');

var _elementResizeEvent2 = _interopRequireDefault(_elementResizeEvent);

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

      var t = this._createText(text);
      this.app.appendChild(t);

      var effect = this._effect(t, this.opts.direction);

      var timing = {};
      timing.iterations = 1;
      timing.duration = (text.duration || this.opts.duration) * (this.app.clientWidth + t.offsetWidth) / this.app.clientWidth;
      timing.easing = text.easing || this.opts.easing;

      var token = (0, _utils.randomStr)();
      this.elems.set(token, t);

      t.animate(effect, timing).onfinish = function () {
        _this2.app.removeChild(t);
        _this2.elems.delete(token);
      };
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

          elem.style.display = 'none';
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

          elem.style.display = 'block';
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

},{"./utils":3,"element-resize-event":1}],3:[function(require,module,exports){
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

},{}]},{},[2])(2)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvZWxlbWVudC1yZXNpemUtZXZlbnQvaW5kZXguanMiLCJzcmMvaW5kZXguanMiLCJzcmMvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUM5R0E7OztBQURBOzs7O0FBRUE7Ozs7OztJQUVNLE07QUFDSixrQkFBWSxJQUFaLEVBQWdDO0FBQUE7O0FBQUEsUUFBZCxPQUFjLHVFQUFKLEVBQUk7O0FBQUE7O0FBQzlCO0FBQ0EsU0FBSyxJQUFMLEdBQVksSUFBWjtBQUNBLFNBQUssR0FBTCxHQUFXLFNBQVMsYUFBVCxDQUF1QixJQUF2QixD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LE1BQUksSUFBSSxFQUFSO0FBQ0EsT0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLE1BQXBCLEVBQTRCLEdBQTVCLEVBQWlDO0FBQy9CLFFBQU0sU0FBUyxLQUFLLE1BQUwsS0FBZ0IsRUFBaEIsR0FBcUIsQ0FBcEM7QUFDQSxTQUFLLENBQUMsS0FBSyxFQUFMLEdBQVUsQ0FBVixHQUFlLEtBQUssRUFBTCxHQUFXLFNBQVMsQ0FBVCxHQUFhLENBQXhCLEdBQTZCLE1BQTdDLEVBQXNELFFBQXRELENBQStELEVBQS9ELENBQUw7QUFDRDtBQUNELFNBQU8sQ0FBUDtBQUNELENBUEQ7O0FBU0EsT0FBTyxPQUFQLEdBQWlCO0FBQ2YsWUFEZTtBQUVmO0FBRmUsQ0FBakIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIHJlcXVlc3RGcmFtZSA9IChmdW5jdGlvbiAoKSB7XG4gIHZhciB3aW5kb3cgPSB0aGlzXG4gIHZhciByYWYgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgd2luZG93Lm1velJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuICAgIHdpbmRvdy53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICBmdW5jdGlvbiBmYWxsYmFja1JBRihmdW5jKSB7XG4gICAgICByZXR1cm4gd2luZG93LnNldFRpbWVvdXQoZnVuYywgMjApXG4gICAgfVxuICByZXR1cm4gZnVuY3Rpb24gcmVxdWVzdEZyYW1lRnVuY3Rpb24oZnVuYykge1xuICAgIHJldHVybiByYWYoZnVuYylcbiAgfVxufSkoKVxuXG52YXIgY2FuY2VsRnJhbWUgPSAoZnVuY3Rpb24gKCkge1xuICB2YXIgd2luZG93ID0gdGhpc1xuICB2YXIgY2FuY2VsID0gd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgd2luZG93Lm1vekNhbmNlbEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgd2luZG93LndlYmtpdENhbmNlbEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgd2luZG93LmNsZWFyVGltZW91dFxuICByZXR1cm4gZnVuY3Rpb24gY2FuY2VsRnJhbWVGdW5jdGlvbihpZCkge1xuICAgIHJldHVybiBjYW5jZWwoaWQpXG4gIH1cbn0pKClcblxuZnVuY3Rpb24gcmVzaXplTGlzdGVuZXIoZSkge1xuICB2YXIgd2luID0gZS50YXJnZXQgfHwgZS5zcmNFbGVtZW50XG4gIGlmICh3aW4uX19yZXNpemVSQUZfXykge1xuICAgIGNhbmNlbEZyYW1lKHdpbi5fX3Jlc2l6ZVJBRl9fKVxuICB9XG4gIHdpbi5fX3Jlc2l6ZVJBRl9fID0gcmVxdWVzdEZyYW1lKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdHJpZ2dlciA9IHdpbi5fX3Jlc2l6ZVRyaWdnZXJfX1xuICAgIHRyaWdnZXIuX19yZXNpemVMaXN0ZW5lcnNfXy5mb3JFYWNoKGZ1bmN0aW9uIChmbikge1xuICAgICAgZm4uY2FsbCh0cmlnZ2VyLCBlKVxuICAgIH0pXG4gIH0pXG59XG5cbnZhciBleHBvcnRzID0gZnVuY3Rpb24gZXhwb3J0cyhlbGVtZW50LCBmbikge1xuICB2YXIgd2luZG93ID0gdGhpc1xuICB2YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnRcbiAgdmFyIGlzSUVcblxuICB2YXIgYXR0YWNoRXZlbnQgPSBkb2N1bWVudC5hdHRhY2hFdmVudFxuICBpZiAodHlwZW9mIG5hdmlnYXRvciAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBpc0lFID0gbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvVHJpZGVudC8pIHx8XG4gICAgICBuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9FZGdlLylcbiAgfVxuXG4gIGZ1bmN0aW9uIG9iamVjdExvYWQoKSB7XG4gICAgdGhpcy5jb250ZW50RG9jdW1lbnQuZGVmYXVsdFZpZXcuX19yZXNpemVUcmlnZ2VyX18gPSB0aGlzLl9fcmVzaXplRWxlbWVudF9fXG4gICAgdGhpcy5jb250ZW50RG9jdW1lbnQuZGVmYXVsdFZpZXcuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgcmVzaXplTGlzdGVuZXIpXG4gIH1cblxuICBpZiAoIWVsZW1lbnQuX19yZXNpemVMaXN0ZW5lcnNfXykge1xuICAgIGVsZW1lbnQuX19yZXNpemVMaXN0ZW5lcnNfXyA9IFtdXG4gICAgaWYgKGF0dGFjaEV2ZW50KSB7XG4gICAgICBlbGVtZW50Ll9fcmVzaXplVHJpZ2dlcl9fID0gZWxlbWVudFxuICAgICAgZWxlbWVudC5hdHRhY2hFdmVudCgnb25yZXNpemUnLCByZXNpemVMaXN0ZW5lcilcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGdldENvbXB1dGVkU3R5bGUoZWxlbWVudCkucG9zaXRpb24gPT09ICdzdGF0aWMnKSB7XG4gICAgICAgIGVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSAncmVsYXRpdmUnXG4gICAgICB9XG4gICAgICB2YXIgb2JqID0gKGVsZW1lbnQuX19yZXNpemVUcmlnZ2VyX18gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvYmplY3QnKSlcbiAgICAgIG9iai5zZXRBdHRyaWJ1dGUoXG4gICAgICAgICdzdHlsZScsXG4gICAgICAgICdkaXNwbGF5OiBibG9jazsgcG9zaXRpb246IGFic29sdXRlOyB0b3A6IDA7IGxlZnQ6IDA7IGhlaWdodDogMTAwJTsgd2lkdGg6IDEwMCU7IG92ZXJmbG93OiBoaWRkZW47IHBvaW50ZXItZXZlbnRzOiBub25lOyB6LWluZGV4OiAtMTsgb3BhY2l0eTogMDsnXG4gICAgICApXG4gICAgICBvYmouc2V0QXR0cmlidXRlKCdjbGFzcycsICdyZXNpemUtc2Vuc29yJylcbiAgICAgIG9iai5fX3Jlc2l6ZUVsZW1lbnRfXyA9IGVsZW1lbnRcbiAgICAgIG9iai5vbmxvYWQgPSBvYmplY3RMb2FkXG4gICAgICBvYmoudHlwZSA9ICd0ZXh0L2h0bWwnXG4gICAgICBpZiAoaXNJRSkge1xuICAgICAgICBlbGVtZW50LmFwcGVuZENoaWxkKG9iailcbiAgICAgIH1cbiAgICAgIG9iai5kYXRhID0gJ2Fib3V0OmJsYW5rJ1xuICAgICAgaWYgKCFpc0lFKSB7XG4gICAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQob2JqKVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBlbGVtZW50Ll9fcmVzaXplTGlzdGVuZXJzX18ucHVzaChmbilcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJyA/IGV4cG9ydHMgOiBleHBvcnRzLmJpbmQod2luZG93KVxuXG5tb2R1bGUuZXhwb3J0cy51bmJpbmQgPSBmdW5jdGlvbiAoZWxlbWVudCwgZm4pIHtcbiAgdmFyIGF0dGFjaEV2ZW50ID0gZG9jdW1lbnQuYXR0YWNoRXZlbnRcbiAgaWYgKGZuKSB7XG4gICAgZWxlbWVudC5fX3Jlc2l6ZUxpc3RlbmVyc19fLnNwbGljZShcbiAgICAgIGVsZW1lbnQuX19yZXNpemVMaXN0ZW5lcnNfXy5pbmRleE9mKGZuKSxcbiAgICAgIDFcbiAgICApXG4gIH0gZWxzZSB7XG4gICAgZWxlbWVudC5fX3Jlc2l6ZUxpc3RlbmVyc19fID0gW11cbiAgfVxuICBpZiAoIWVsZW1lbnQuX19yZXNpemVMaXN0ZW5lcnNfXy5sZW5ndGgpIHtcbiAgICBpZiAoYXR0YWNoRXZlbnQpIHtcbiAgICAgIGVsZW1lbnQuZGV0YWNoRXZlbnQoJ29ucmVzaXplJywgcmVzaXplTGlzdGVuZXIpXG4gICAgfSBlbHNlIHtcbiAgICAgIGVsZW1lbnQuX19yZXNpemVUcmlnZ2VyX18uY29udGVudERvY3VtZW50LmRlZmF1bHRWaWV3LnJlbW92ZUV2ZW50TGlzdGVuZXIoXG4gICAgICAgICdyZXNpemUnLFxuICAgICAgICByZXNpemVMaXN0ZW5lclxuICAgICAgKVxuICAgICAgZGVsZXRlIGVsZW1lbnQuX19yZXNpemVUcmlnZ2VyX18uY29udGVudERvY3VtZW50LmRlZmF1bHRWaWV3Ll9fcmVzaXplVHJpZ2dlcl9fXG4gICAgICBlbGVtZW50Ll9fcmVzaXplVHJpZ2dlcl9fID0gIWVsZW1lbnQucmVtb3ZlQ2hpbGQoXG4gICAgICAgIGVsZW1lbnQuX19yZXNpemVUcmlnZ2VyX19cbiAgICAgIClcbiAgICB9XG4gICAgZGVsZXRlIGVsZW1lbnQuX19yZXNpemVMaXN0ZW5lcnNfX1xuICB9XG59XG4iLCJpbXBvcnQgZWxlbWVudFJlc2l6ZUV2ZW50IGZyb20gJ2VsZW1lbnQtcmVzaXplLWV2ZW50J1xuLy9pbXBvcnQgRmxvd2x5VGV4dCBmcm9tICdmbG93bHkvdGV4dCdcbmltcG9ydCB7IHJhbmQsIHJhbmRvbVN0ciB9IGZyb20gJy4vdXRpbHMnXG5cbmNsYXNzIEZsb3dseSB7XG4gIGNvbnN0cnVjdG9yKGVsZW0sIG9wdGlvbnMgPSB7fSkge1xuICAgIC8qIEFQUCAqL1xuICAgIHRoaXMuZWxlbSA9IGVsZW1cbiAgICB0aGlzLmFwcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZWxlbSlcbiAgICB0aGlzLmFwcC5zdHlsZS5wb3NpdGlvbiA9ICdyZWxhdGl2ZSdcbiAgICB0aGlzLmFwcC5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nXG5cbiAgICB0aGlzLnJlY3QgPSB0aGlzLmFwcC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgIHRoaXMub3B0cyA9IE9iamVjdC5hc3NpZ24odGhpcy5fZGVmYXVsdE9wdGlvbnMoKSwgb3B0aW9ucylcblxuICAgIHRoaXMuZWxlbXMgPSBuZXcgTWFwKClcbiAgICBlbGVtZW50UmVzaXplRXZlbnQodGhpcy5hcHAsICgpID0+IHsgdGhpcy5yZXNpemUoKSB9KVxuICB9XG5cbiAgYWRkSW1hZ2UoaW1hZ2UpIHtcbiAgICBpZiAodGhpcy5vcHRzLmRpc2FibGUpIHJldHVyblxuXG4gICAgY29uc3QgdCA9IHRoaXMuX2NyZWF0ZUltYWdlKGltYWdlKVxuICB9XG5cbiAgYWRkVGV4dCh0ZXh0KSB7XG4gICAgaWYgKHRoaXMub3B0cy5kaXNhYmxlKSByZXR1cm5cblxuICAgIGNvbnN0IHQgPSB0aGlzLl9jcmVhdGVUZXh0KHRleHQpXG4gICAgdGhpcy5hcHAuYXBwZW5kQ2hpbGQodClcblxuICAgIGNvbnN0IGVmZmVjdCA9IHRoaXMuX2VmZmVjdCh0LCB0aGlzLm9wdHMuZGlyZWN0aW9uKVxuXG4gICAgbGV0IHRpbWluZyA9IHt9XG4gICAgdGltaW5nLml0ZXJhdGlvbnMgPSAxXG4gICAgdGltaW5nLmR1cmF0aW9uID0gKHRleHQuZHVyYXRpb24gfHwgdGhpcy5vcHRzLmR1cmF0aW9uKSAqICh0aGlzLmFwcC5jbGllbnRXaWR0aCArIHQub2Zmc2V0V2lkdGgpIC8gdGhpcy5hcHAuY2xpZW50V2lkdGhcbiAgICB0aW1pbmcuZWFzaW5nID0gdGV4dC5lYXNpbmcgfHwgdGhpcy5vcHRzLmVhc2luZ1xuXG4gICAgY29uc3QgdG9rZW4gPSByYW5kb21TdHIoKVxuICAgIHRoaXMuZWxlbXMuc2V0KHRva2VuLCB0KVxuXG4gICAgdC5hbmltYXRlKGVmZmVjdCwgdGltaW5nKS5vbmZpbmlzaCA9ICgpID0+IHtcbiAgICAgIHRoaXMuYXBwLnJlbW92ZUNoaWxkKHQpXG4gICAgICB0aGlzLmVsZW1zLmRlbGV0ZSh0b2tlbilcbiAgICB9XG4gIH1cblxuICAvLyBpZiB0cnVlIHNob3cgdGV4dCwgaWYgZmFsc2UgaGlkZSB0ZXh0XG4gIHRvZ2dsZShmbGFnKSB7XG4gICAgaWYgKGZsYWcpIHRoaXMuc2hvdygpXG4gICAgZWxzZSB0aGlzLmhpZGUoKVxuICB9XG5cbiAgaGlkZSgpIHtcbiAgICBmb3IgKGxldCBlbGVtIG9mIHRoaXMuZWxlbXMudmFsdWVzKCkpIHtcbiAgICAgIGVsZW0uc3R5bGUuZGlzcGxheSA9ICdub25lJ1xuICAgIH1cbiAgfVxuXG4gIHNob3coKSB7XG4gICAgZm9yIChsZXQgZWxlbSBvZiB0aGlzLmVsZW1zLnZhbHVlcygpKSB7XG4gICAgICBlbGVtLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXG4gICAgfVxuICB9XG5cbiAgcmVzaXplKCkge1xuICAgIHRoaXMuYXBwID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0aGlzLmVsZW0pXG4gICAgdGhpcy5hcHAuc3R5bGUucG9zaXRpb24gPSAncmVsYXRpdmUnXG4gICAgdGhpcy5hcHAuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJ1xuICAgIHRoaXMucmVjdCA9IHRoaXMuYXBwLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gIH1cblxuICB1cGRhdGUob3B0aW9ucyA9IHt9KSB7XG4gICAgdGhpcy5vcHRzID0gT2JqZWN0LmFzc2lnbih0aGlzLm9wdHMsIG9wdGlvbnMpXG4gIH1cblxuICB1bmJpbmQoKSB7XG4gICAgZWxlbWVudFJlc2l6ZUV2ZW50LnVuYmluZCh0aGlzLmFwcClcbiAgICB0aGlzLnVwZGF0ZSh7IGRpc2FibGU6IHRydWUgfSlcbiAgfVxuXG4gIF9jcmVhdGVUZXh0KHRleHQpIHtcbiAgICBjb25zdCBjb2xvciAgPSB0ZXh0LmNvbG9yICB8fCB0aGlzLm9wdHMudGV4dC5jb2xvclxuICAgIGNvbnN0IHNoYWRvdyA9IHRleHQuc2hhZG93IHx8IHRoaXMub3B0cy50ZXh0LnNoYWRvd1xuICAgIGNvbnN0IHNpemUgICA9IHRleHQuc2l6ZSAgIHx8IHRoaXMub3B0cy50ZXh0LnNpemVcbiAgICBjb25zdCB3ZWlnaHQgPSB0ZXh0LndlaWdodCB8fCB0aGlzLm9wdHMudGV4dC53ZWlnaHRcbiAgICBjb25zdCB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpXG5cbiAgICB0LmNsYXNzTmFtZSAgICAgICAgPSB0ZXh0LmNsYXNzTmFtZSB8fCB0aGlzLm9wdHMudGV4dC5jbGFzc05hbWVcbiAgICB0LnN0eWxlLnBvc2l0aW9uICAgPSAnYWJzb2x1dGUnXG4gICAgdC5zdHlsZS5mb250U2l6ZSAgID0gc2l6ZSArICdweCdcbiAgICB0LnN0eWxlLmZvbnRXZWlnaHQgPSB3ZWlnaHRcbiAgICB0LnN0eWxlLmNvbG9yICAgICAgPSBjb2xvclxuICAgIHQuc3R5bGUudGV4dFNoYWRvdyA9IGAtMnB4IC0ycHggMHB4ICR7c2hhZG93fSwgLTJweCAycHggMHB4ICR7c2hhZG93fSwgMnB4IC0ycHggMHB4ICR7c2hhZG93fSwgMnB4IDJweCAwcHggJHtzaGFkb3d9YFxuICAgIHQuc3R5bGUud2hpdGVTcGFjZSA9IHRoaXMub3B0cy50ZXh0LndoaXRlU3BhY2VcbiAgICB0LnN0eWxlLnpJbmRleCAgICAgPSB0aGlzLm9wdHMudGV4dC56SW5kZXhcblxuICAgIHQuaW5uZXJUZXh0ID0gdGV4dC5ib2R5XG5cbiAgICByZXR1cm4gdFxuICB9XG5cbiAgX2NyZWF0ZUltYWdlKGltYWdlKSB7XG4gICAgY29uc3QgdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpXG5cbiAgICB0LnN0eWxlLnBvc2l0aW9uID0gJ2ZpeGVkJ1xuICAgIHQuc3R5bGUud2lkdGggID0gaW1hZ2Uud2lkdGhcbiAgICB0LnN0eWxlLmhlaWdodCA9IGltYWdlLmhlaWdodFxuICAgIHQuc3R5bGUuekluZGV4ID0gMjE0NzQ4MzY0N1xuICAgIHQuc3R5bGUubGVmdCAgID0gdGhpcy5yZWN0LndpZHRoICsgdC5jbGllbnRXaWR0aCArICdweCdcbiAgICB0LnN0eWxlLnRvcCAgICA9IHJhbmQodGhpcy5yZWN0LnRvcCwgdGhpcy5yZWN0LmhlaWdodCAtIHQuY2xpZW50SGVpZ2h0KSArICdweCdcblxuICAgIHQuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIChlKSA9PiB7XG4gICAgICBjb25zdCBlZmZlY3QgPSB0aGlzLl9lZmZlY3QodCwgdGhpcy5vcHRzLmRpcmVjdGlvbilcblxuICAgICAgbGV0IHRpbWluZyA9IHt9XG4gICAgICB0aW1pbmcuaXRlcmF0aW9ucyA9IDFcbiAgICAgIHRpbWluZy5kdXJhdGlvbiA9IChpbWFnZS5kdXJhdGlvbiB8fCB0aGlzLm9wdHMuZHVyYXRpb24pICogKHRoaXMuYXBwLmNsaWVudFdpZHRoICsgdC5vZmZzZXRXaWR0aCkgLyB0aGlzLmFwcC5jbGllbnRXaWR0aFxuICAgICAgdGltaW5nLmVhc2luZyA9IGltYWdlLmVhc2luZyB8fCB0aGlzLm9wdHMuZWFzaW5nXG5cbiAgICAgIGNvbnN0IHRva2VuID0gcmFuZG9tU3RyKClcbiAgICAgIHRoaXMuZWxlbXMuc2V0KHRva2VuLCB0KVxuXG4gICAgICB0LmFuaW1hdGUoZWZmZWN0LCB0aW1pbmcpLm9uZmluaXNoID0gKCkgPT4ge1xuICAgICAgICB0aGlzLmFwcC5yZW1vdmVDaGlsZCh0KVxuICAgICAgICB0aGlzLmVsZW1zLmRlbGV0ZSh0b2tlbilcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgdC5zcmMgPSBpbWFnZS51cmxcbiAgICB0aGlzLmFwcC5hcHBlbmRDaGlsZCh0KVxuICAgIHJldHVybiB0XG4gIH1cblxuICBfZWZmZWN0KGVsZW0sIHR5cGUpIHtcbiAgICBpZiAodHlwZSA9PT0gJ2hvcml6b250YWwnKSB7XG4gICAgICBlbGVtLnN0eWxlLmxlZnQgPSAodGhpcy5yZWN0LmxlZnQgKyB0aGlzLnJlY3Qud2lkdGgpICsgJ3B4J1xuICAgICAgZWxlbS5zdHlsZS50b3AgID0gcmFuZCgwLCB0aGlzLnJlY3QuaGVpZ2h0IC0gZWxlbS5jbGllbnRIZWlnaHQpICsgJ3B4J1xuXG4gICAgICByZXR1cm4gW3tcbiAgICAgICAgbGVmdDogdGhpcy5yZWN0LndpZHRoICsgJ3B4J1xuICAgICAgfSwge1xuICAgICAgICBsZWZ0OiAoLWVsZW0uY2xpZW50V2lkdGgpICsgJ3B4J1xuICAgICAgfV1cbiAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICd2ZXJ0aWNhbCcpIHtcbiAgICAgIGVsZW0uc3R5bGUubGVmdCA9IHJhbmQoMCwgdGhpcy5yZWN0LndpZHRoIC0gZWxlbS5jbGllbnRXaWR0aCkgKyAncHgnXG4gICAgICBlbGVtLnN0eWxlLnRvcCAgPSAoLWVsZW0uY2xpZW50V2lkdGgpICsgJ3B4J1xuXG4gICAgICByZXR1cm4gW3tcbiAgICAgICAgdG9wOiAoLWVsZW0uY2xpZW50SGVpZ2h0KSArICdweCdcbiAgICAgIH0sIHtcbiAgICAgICAgdG9wOiB0aGlzLnJlY3QuaGVpZ2h0ICsgJ3B4J1xuICAgICAgfV1cbiAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdyYW5kb20nKSB7XG4gICAgICBlbGVtLnN0eWxlLm9wYWNpdHkgPSAwLjBcbiAgICAgIGVsZW0uc3R5bGUubGVmdCAgICA9IHJhbmQoMCwgdGhpcy5yZWN0LndpZHRoKSAtIGVsZW0uY2xpZW50V2lkdGggLyAyICsgJ3B4J1xuICAgICAgZWxlbS5zdHlsZS50b3AgICAgID0gcmFuZCgwLCB0aGlzLnJlY3QuaGVpZ2h0KSAtIGVsZW0uY2xpZW50SGVpZ2h0IC8gMiArICdweCdcblxuICAgICAgcmV0dXJuIFt7XG4gICAgICAgIG9wYWNpdHk6IDAuMCxcbiAgICAgICAgdHJhbnNmb3JtOiAnc2NhbGUoMC4yLCAwLjIpIHRyYW5zbGF0ZSgwLCAyMHB4KSdcbiAgICAgIH0sIHtcbiAgICAgICAgb3BhY2l0eTogMS4wLFxuICAgICAgICB0cmFuc2Zvcm06ICdzY2FsZSgwLjUsIDAuNSkgdHJhbnNsYXRlKDAsIDBweCknXG4gICAgICB9LCB7XG4gICAgICAgIG9wYWNpdHk6IDAuMCxcbiAgICAgICAgdHJhbnNmb3JtOiAnc2NhbGUoMS4wLCAxLjApIHRyYW5zbGF0ZSgwLCAtNTBweCknXG4gICAgICB9XVxuICAgIH1cbiAgfVxuXG4gIF9kZWZhdWx0T3B0aW9ucygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdGV4dDoge1xuICAgICAgICB3ZWlnaHQ6ICdib2xkJyxcbiAgICAgICAgc2l6ZSAgOiA1NixcbiAgICAgICAgY29sb3IgOiAnIzAwMCcsXG4gICAgICAgIHNoYWRvdzogJyNmZmYnLFxuICAgICAgICBjbGFzc05hbWU6ICdmbG93bHktdGV4dCcsXG4gICAgICAgIHdoaXRlU3BhY2U6ICdub3dyYXAnIHx8ICdwcmUnLFxuICAgICAgICB6SW5kZXg6IDIxNDc0ODM2NDcsXG4gICAgICB9LFxuICAgICAgZGlzYWJsZTogZmFsc2UsXG4gICAgICBkdXJhdGlvbjogMjAwMCxcbiAgICAgIGVhc2luZzogJ2xpbmVhcicsXG4gICAgICBkaXJlY3Rpb246ICdob3Jpem9udGFsJyxcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBGbG93bHlcbiIsImNvbnN0IHJhbmQgPSAobWluLCBtYXgpID0+IHtcbiAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4pICsgbWluKVxufVxuXG5jb25zdCByYW5kb21TdHIgPSAobGVuZ3RoID0gMzIpID0+IHtcbiAgbGV0IHMgPSAnJ1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgcmFuZG9tID0gTWF0aC5yYW5kb20oKSAqIDE2IHwgMFxuICAgIHMgKz0gKGkgPT0gMTIgPyA0IDogKGkgPT0gMTYgPyAocmFuZG9tICYgMyB8IDgpIDogcmFuZG9tKSkudG9TdHJpbmcoMTYpXG4gIH1cbiAgcmV0dXJuIHNcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHJhbmQsXG4gIHJhbmRvbVN0clxufVxuIl19
