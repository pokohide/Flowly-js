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

    this.texts = new Map();
    (0, _elementResizeEvent2.default)(this.app, function () {
      _this.resize();
    });
  }

  _createClass(Flowly, [{
    key: 'addText',
    value: function addText(text) {
      var _this2 = this;

      if (this.opts.disable) return;
      var t = this._createText(text);
      this.app.appendChild(t);

      var effect = void 0;
      if (this.opts.direction === 'horizontal') {
        t.style.left = this.rect.left + this.rect.width + 'px';
        t.style.top = (0, _utils.rand)(0, this.rect.height - t.clientHeight) + 'px';
        effect = [{
          left: this.rect.width + 'px'
        }, {
          left: -t.clientWidth + 'px'
        }];
      } else if (this.opts.direction === 'vertical') {
        t.style.left = (0, _utils.rand)(0, this.rect.width - t.clientWidth) + 'px';
        t.style.top = -t.clientHeight + 'px';
        effect = [{
          top: -t.clientHeight + 'px'
        }, {
          top: this.rect.height + 'px'
        }];
      }

      var timing = {};
      timing.iterations = 1;
      timing.duration = (text.duration || this.opts.duration) * (this.app.clientWidth + t.offsetWidth) / this.app.clientWidth;
      timing.easing = text.easing || this.opts.easing;

      var token = (0, _utils.randomStr)();
      this.texts.set(token, t);

      t.animate(effect, timing).onfinish = function () {
        _this2.app.removeChild(t);
        _this2.texts.delete(token);
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
        for (var _iterator = this.texts.values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var text = _step.value;

          text.style.display = 'none';
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
        for (var _iterator2 = this.texts.values()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var text = _step2.value;

          text.style.display = 'block';
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvZWxlbWVudC1yZXNpemUtZXZlbnQvaW5kZXguanMiLCJzcmMvaW5kZXguanMiLCJzcmMvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7O0FDL0dBOzs7O0FBQ0E7Ozs7OztJQUVNLE07QUFDSixrQkFBWSxJQUFaLEVBQWdDO0FBQUE7O0FBQUEsUUFBZCxPQUFjLHVFQUFKLEVBQUk7O0FBQUE7O0FBQzlCO0FBQ0EsU0FBSyxJQUFMLEdBQVksSUFBWjtBQUNBLFNBQUssR0FBTCxHQUFXLFNBQVMsYUFBVCxDQUF1QixJQUF2QixDQUFYO0FB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QUF6QyxDQUFQO0FBQ0QsQ0FGRDs7QUFJQSxJQUFNLFlBQVksU0FBWixTQUFZLEdBQWlCO0FBQUEsTUFBaEIsTUFBZ0IsdUVBQVAsRUFBTzs7QUFDakMsTUFBSSxJQUFJLEVBQVI7QUFDQSxPQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksTUFBcEIsRUFBNEIsR0FBNUIsRUFBaUM7QUFDL0IsUUFBTSxTQUFTLEtBQUssTUFBTCxLQUFnQixFQUFoQixHQUFxQixDQUFwQztBQUNBLFNBQUssQ0FBQyxLQUFLLEVBQUwsR0FBVSxDQUFWLEdBQWUsS0FBSyxFQUFMLEdBQVcsU0FBUyxDQUFULEdBQWEsQ0FBeEIsR0FBNkIsTUFBN0MsRUFBc0QsUUFBdEQsQ0FBK0QsRUFBL0QsQ0FBTDtBQUNEO0FBQ0QsU0FBTyxDQUFQO0FBQ0QsQ0FQRDs7QUFTQSxPQUFPLE9BQVAsR0FBaUI7QUFDZixZQURlO0FBRWY7QUFGZSxDQUFqQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgcmVxdWVzdEZyYW1lID0gKGZ1bmN0aW9uICgpIHtcbiAgdmFyIHdpbmRvdyA9IHRoaXNcbiAgdmFyIHJhZiA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICB3aW5kb3cubW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgd2luZG93LndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuICAgIGZ1bmN0aW9uIGZhbGxiYWNrUkFGKGZ1bmMpIHtcbiAgICAgIHJldHVybiB3aW5kb3cuc2V0VGltZW91dChmdW5jLCAyMClcbiAgICB9XG4gIHJldHVybiBmdW5jdGlvbiByZXF1ZXN0RnJhbWVGdW5jdGlvbihmdW5jKSB7XG4gICAgcmV0dXJuIHJhZihmdW5jKVxuICB9XG59KSgpXG5cbnZhciBjYW5jZWxGcmFtZSA9IChmdW5jdGlvbiAoKSB7XG4gIHZhciB3aW5kb3cgPSB0aGlzXG4gIHZhciBjYW5jZWwgPSB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUgfHxcbiAgICB3aW5kb3cubW96Q2FuY2VsQW5pbWF0aW9uRnJhbWUgfHxcbiAgICB3aW5kb3cud2Via2l0Q2FuY2VsQW5pbWF0aW9uRnJhbWUgfHxcbiAgICB3aW5kb3cuY2xlYXJUaW1lb3V0XG4gIHJldHVybiBmdW5jdGlvbiBjYW5jZWxGcmFtZUZ1bmN0aW9uKGlkKSB7XG4gICAgcmV0dXJuIGNhbmNlbChpZClcbiAgfVxufSkoKVxuXG5mdW5jdGlvbiByZXNpemVMaXN0ZW5lcihlKSB7XG4gIHZhciB3aW4gPSBlLnRhcmdldCB8fCBlLnNyY0VsZW1lbnRcbiAgaWYgKHdpbi5fX3Jlc2l6ZVJBRl9fKSB7XG4gICAgY2FuY2VsRnJhbWUod2luLl9fcmVzaXplUkFGX18pXG4gIH1cbiAgd2luLl9fcmVzaXplUkFGX18gPSByZXF1ZXN0RnJhbWUoZnVuY3Rpb24gKCkge1xuICAgIHZhciB0cmlnZ2VyID0gd2luLl9fcmVzaXplVHJpZ2dlcl9fXG4gICAgdHJpZ2dlci5fX3Jlc2l6ZUxpc3RlbmVyc19fLmZvckVhY2goZnVuY3Rpb24gKGZuKSB7XG4gICAgICBmbi5jYWxsKHRyaWdnZXIsIGUpXG4gICAgfSlcbiAgfSlcbn1cblxudmFyIGV4cG9ydHMgPSBmdW5jdGlvbiBleHBvcnRzKGVsZW1lbnQsIGZuKSB7XG4gIHZhciB3aW5kb3cgPSB0aGlzXG4gIHZhciBkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudFxuICB2YXIgaXNJRVxuXG4gIHZhciBhdHRhY2hFdmVudCA9IGRvY3VtZW50LmF0dGFjaEV2ZW50XG4gIGlmICh0eXBlb2YgbmF2aWdhdG9yICE9PSAndW5kZWZpbmVkJykge1xuICAgIGlzSUUgPSBuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9UcmlkZW50LykgfHxcbiAgICAgIG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL0VkZ2UvKVxuICB9XG5cbiAgZnVuY3Rpb24gb2JqZWN0TG9hZCgpIHtcbiAgICB0aGlzLmNvbnRlbnREb2N1bWVudC5kZWZhdWx0Vmlldy5fX3Jlc2l6ZVRyaWdnZXJfXyA9IHRoaXMuX19yZXNpemVFbGVtZW50X19cbiAgICB0aGlzLmNvbnRlbnREb2N1bWVudC5kZWZhdWx0Vmlldy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCByZXNpemVMaXN0ZW5lcilcbiAgfVxuXG4gIGlmICghZWxlbWVudC5fX3Jlc2l6ZUxpc3RlbmVyc19fKSB7XG4gICAgZWxlbWVudC5fX3Jlc2l6ZUxpc3RlbmVyc19fID0gW11cbiAgICBpZiAoYXR0YWNoRXZlbnQpIHtcbiAgICAgIGVsZW1lbnQuX19yZXNpemVUcmlnZ2VyX18gPSBlbGVtZW50XG4gICAgICBlbGVtZW50LmF0dGFjaEV2ZW50KCdvbnJlc2l6ZScsIHJlc2l6ZUxpc3RlbmVyKVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KS5wb3NpdGlvbiA9PT0gJ3N0YXRpYycpIHtcbiAgICAgICAgZWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9ICdyZWxhdGl2ZSdcbiAgICAgIH1cbiAgICAgIHZhciBvYmogPSAoZWxlbWVudC5fX3Jlc2l6ZVRyaWdnZXJfXyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29iamVjdCcpKVxuICAgICAgb2JqLnNldEF0dHJpYnV0ZShcbiAgICAgICAgJ3N0eWxlJyxcbiAgICAgICAgJ2Rpc3BsYXk6IGJsb2NrOyBwb3NpdGlvbjogYWJzb2x1dGU7IHRvcDogMDsgbGVmdDogMDsgaGVpZ2h0OiAxMDAlOyB3aWR0aDogMTAwJTsgb3ZlcmZsb3c6IGhpZGRlbjsgcG9pbnRlci1ldmVudHM6IG5vbmU7IHotaW5kZXg6IC0xOyBvcGFjaXR5OiAwOydcbiAgICAgIClcbiAgICAgIG9iai5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3Jlc2l6ZS1zZW5zb3InKVxuICAgICAgb2JqLl9fcmVzaXplRWxlbWVudF9fID0gZWxlbWVudFxuICAgICAgb2JqLm9ubG9hZCA9IG9iamVjdExvYWRcbiAgICAgIG9iai50eXBlID0gJ3RleHQvaHRtbCdcbiAgICAgIGlmIChpc0lFKSB7XG4gICAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQob2JqKVxuICAgICAgfVxuICAgICAgb2JqLmRhdGEgPSAnYWJvdXQ6YmxhbmsnXG4gICAgICBpZiAoIWlzSUUpIHtcbiAgICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZChvYmopXG4gICAgICB9XG4gICAgfVxuICB9XG4gIGVsZW1lbnQuX19yZXNpemVMaXN0ZW5lcnNfXy5wdXNoKGZuKVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnID8gZXhwb3J0cyA6IGV4cG9ydHMuYmluZCh3aW5kb3cpXG5cbm1vZHVsZS5leHBvcnRzLnVuYmluZCA9IGZ1bmN0aW9uIChlbGVtZW50LCBmbikge1xuICB2YXIgYXR0YWNoRXZlbnQgPSBkb2N1bWVudC5hdHRhY2hFdmVudFxuICBpZiAoZm4pIHtcbiAgICBlbGVtZW50Ll9fcmVzaXplTGlzdGVuZXJzX18uc3BsaWNlKFxuICAgICAgZWxlbWVudC5fX3Jlc2l6ZUxpc3RlbmVyc19fLmluZGV4T2YoZm4pLFxuICAgICAgMVxuICAgIClcbiAgfSBlbHNlIHtcbiAgICBlbGVtZW50Ll9fcmVzaXplTGlzdGVuZXJzX18gPSBbXVxuICB9XG4gIGlmICghZWxlbWVudC5fX3Jlc2l6ZUxpc3RlbmVyc19fLmxlbmd0aCkge1xuICAgIGlmIChhdHRhY2hFdmVudCkge1xuICAgICAgZWxlbWVudC5kZXRhY2hFdmVudCgnb25yZXNpemUnLCByZXNpemVMaXN0ZW5lcilcbiAgICB9IGVsc2Uge1xuICAgICAgZWxlbWVudC5fX3Jlc2l6ZVRyaWdnZXJfXy5jb250ZW50RG9jdW1lbnQuZGVmYXVsdFZpZXcucmVtb3ZlRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgJ3Jlc2l6ZScsXG4gICAgICAgIHJlc2l6ZUxpc3RlbmVyXG4gICAgICApXG4gICAgICBkZWxldGUgZWxlbWVudC5fX3Jlc2l6ZVRyaWdnZXJfXy5jb250ZW50RG9jdW1lbnQuZGVmYXVsdFZpZXcuX19yZXNpemVUcmlnZ2VyX19cbiAgICAgIGVsZW1lbnQuX19yZXNpemVUcmlnZ2VyX18gPSAhZWxlbWVudC5yZW1vdmVDaGlsZChcbiAgICAgICAgZWxlbWVudC5fX3Jlc2l6ZVRyaWdnZXJfX1xuICAgICAgKVxuICAgIH1cbiAgICBkZWxldGUgZWxlbWVudC5fX3Jlc2l6ZUxpc3RlbmVyc19fXG4gIH1cbn1cbiIsImltcG9ydCBlbGVtZW50UmVzaXplRXZlbnQgZnJvbSAnZWxlbWVudC1yZXNpemUtZXZlbnQnXG5pbXBvcnQgeyByYW5kLCByYW5kb21TdHIgfSBmcm9tICcuL3V0aWxzJ1xuXG5jbGFzcyBGbG93bHkge1xuICBjb25zdHJ1Y3RvcihlbGVtLCBvcHRpb25zID0ge30pIHtcbiAgICAvKiBBUFAgKi9cbiAgICB0aGlzLmVsZW0gPSBlbGVtXG4gICAgdGhpcy5hcHAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGVsZW0pXG4gICAgdGhpcy5hcHAuc3R5bGUucG9zaXRpb24gPSAncmVsYXRpdmUnXG4gICAgdGhpcy5hcHAuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJ1xuXG4gICAgdGhpcy5yZWN0ID0gdGhpcy5hcHAuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICB0aGlzLm9wdHMgPSBPYmplY3QuYXNzaWduKHRoaXMuX2RlZmF1bHRPcHRpb25zKCksIG9wdGlvbnMpXG5cbiAgICB0aGlzLnRleHRzID0gbmV3IE1hcCgpXG4gICAgZWxlbWVudFJlc2l6ZUV2ZW50KHRoaXMuYXBwLCAoKSA9PiB7IHRoaXMucmVzaXplKCkgfSlcbiAgfVxuXG4gIGFkZFRleHQodGV4dCkge1xuICAgIGlmICh0aGlzLm9wdHMuZGlzYWJsZSkgcmV0dXJuXG4gICAgY29uc3QgdCA9IHRoaXMuX2NyZWF0ZVRleHQodGV4dClcbiAgICB0aGlzLmFwcC5hcHBlbmRDaGlsZCh0KVxuXG4gICAgbGV0IGVmZmVjdFxuICAgIGlmICh0aGlzLm9wdHMuZGlyZWN0aW9uID09PSAnaG9yaXpvbnRhbCcpIHtcbiAgICAgIHQuc3R5bGUubGVmdCA9IGAke3RoaXMucmVjdC5sZWZ0ICsgdGhpcy5yZWN0LndpZHRofXB4YFxuICAgICAgdC5zdHlsZS50b3AgID0gcmFuZCgwLCB0aGlzLnJlY3QuaGVpZ2h0IC0gdC5jbGllbnRIZWlnaHQpICsgJ3B4J1xuICAgICAgZWZmZWN0ID0gW3tcbiAgICAgICAgbGVmdDogYCR7dGhpcy5yZWN0LndpZHRofXB4YFxuICAgICAgfSwge1xuICAgICAgICBsZWZ0OiBgJHstdC5jbGllbnRXaWR0aH1weGBcbiAgICAgIH1dXG4gICAgfSBlbHNlIGlmICh0aGlzLm9wdHMuZGlyZWN0aW9uID09PSAndmVydGljYWwnKSB7XG4gICAgICB0LnN0eWxlLmxlZnQgPSByYW5kKDAsIHRoaXMucmVjdC53aWR0aCAtIHQuY2xpZW50V2lkdGgpICsgJ3B4J1xuICAgICAgdC5zdHlsZS50b3AgID0gYCR7LXQuY2xpZW50SGVpZ2h0fXB4YFxuICAgICAgZWZmZWN0ID0gW3tcbiAgICAgICAgdG9wOiBgJHstdC5jbGllbnRIZWlnaHR9cHhgLFxuICAgICAgfSwge1xuICAgICAgICB0b3A6IGAke3RoaXMucmVjdC5oZWlnaHR9cHhgXG4gICAgICB9XVxuICAgIH1cblxuICAgIGxldCB0aW1pbmcgPSB7fVxuICAgIHRpbWluZy5pdGVyYXRpb25zID0gMVxuICAgIHRpbWluZy5kdXJhdGlvbiA9ICh0ZXh0LmR1cmF0aW9uIHx8IHRoaXMub3B0cy5kdXJhdGlvbikgKiAodGhpcy5hcHAuY2xpZW50V2lkdGggKyB0Lm9mZnNldFdpZHRoKSAvIHRoaXMuYXBwLmNsaWVudFdpZHRoXG4gICAgdGltaW5nLmVhc2luZyA9IHRleHQuZWFzaW5nIHx8IHRoaXMub3B0cy5lYXNpbmdcblxuICAgIGNvbnN0IHRva2VuID0gcmFuZG9tU3RyKClcbiAgICB0aGlzLnRleHRzLnNldCh0b2tlbiwgdClcblxuICAgIHQuYW5pbWF0ZShlZmZlY3QsIHRpbWluZykub25maW5pc2ggPSAoKSA9PiB7XG4gICAgICB0aGlzLmFwcC5yZW1vdmVDaGlsZCh0KVxuICAgICAgdGhpcy50ZXh0cy5kZWxldGUodG9rZW4pXG4gICAgfVxuICB9XG5cbiAgLy8gaWYgdHJ1ZSBzaG93IHRleHQsIGlmIGZhbHNlIGhpZGUgdGV4dFxuICB0b2dnbGUoZmxhZykge1xuICAgIGlmIChmbGFnKSB0aGlzLnNob3coKVxuICAgIGVsc2UgdGhpcy5oaWRlKClcbiAgfVxuXG4gIGhpZGUoKSB7XG4gICAgZm9yIChsZXQgdGV4dCBvZiB0aGlzLnRleHRzLnZhbHVlcygpKSB7XG4gICAgICB0ZXh0LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcbiAgICB9XG4gIH1cblxuICBzaG93KCkge1xuICAgIGZvciAobGV0IHRleHQgb2YgdGhpcy50ZXh0cy52YWx1ZXMoKSkge1xuICAgICAgdGV4dC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJ1xuICAgIH1cbiAgfVxuXG4gIHJlc2l6ZSgpIHtcbiAgICB0aGlzLmFwcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGhpcy5lbGVtKVxuICAgIHRoaXMuYXBwLnN0eWxlLnBvc2l0aW9uID0gJ3JlbGF0aXZlJ1xuICAgIHRoaXMuYXBwLnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbidcbiAgICB0aGlzLnJlY3QgPSB0aGlzLmFwcC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICB9XG5cbiAgdXBkYXRlKG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMub3B0cyA9IE9iamVjdC5hc3NpZ24odGhpcy5vcHRzLCBvcHRpb25zKVxuICB9XG5cbiAgdW5iaW5kKCkge1xuICAgIGVsZW1lbnRSZXNpemVFdmVudC51bmJpbmQodGhpcy5hcHApXG4gICAgdGhpcy51cGRhdGUoeyBkaXNhYmxlOiB0cnVlIH0pXG4gIH1cblxuICBfY3JlYXRlVGV4dCh0ZXh0KSB7XG4gICAgY29uc3QgY29sb3IgID0gdGV4dC5jb2xvciAgfHwgdGhpcy5vcHRzLnRleHQuY29sb3JcbiAgICBjb25zdCBzaGFkb3cgPSB0ZXh0LnNoYWRvdyB8fCB0aGlzLm9wdHMudGV4dC5zaGFkb3dcbiAgICBjb25zdCBzaXplICAgPSB0ZXh0LnNpemUgICB8fCB0aGlzLm9wdHMudGV4dC5zaXplXG4gICAgY29uc3Qgd2VpZ2h0ID0gdGV4dC53ZWlnaHQgfHwgdGhpcy5vcHRzLnRleHQud2VpZ2h0XG4gICAgY29uc3QgdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxuXG4gICAgdC5jbGFzc05hbWUgICAgICAgID0gdGV4dC5jbGFzc05hbWUgfHwgdGhpcy5vcHRzLnRleHQuY2xhc3NOYW1lXG4gICAgdC5zdHlsZS5wb3NpdGlvbiAgID0gJ2Fic29sdXRlJ1xuICAgIHQuc3R5bGUuZm9udFNpemUgICA9IHNpemUgKyAncHgnXG4gICAgdC5zdHlsZS5mb250V2VpZ2h0ID0gd2VpZ2h0XG4gICAgdC5zdHlsZS5jb2xvciAgICAgID0gY29sb3JcbiAgICB0LnN0eWxlLnRleHRTaGFkb3cgPSBgLTJweCAtMnB4IDBweCAke3NoYWRvd30sIC0ycHggMnB4IDBweCAke3NoYWRvd30sIDJweCAtMnB4IDBweCAke3NoYWRvd30sIDJweCAycHggMHB4ICR7c2hhZG93fWBcbiAgICB0LnN0eWxlLndoaXRlU3BhY2UgPSB0aGlzLm9wdHMudGV4dC53aGl0ZVNwYWNlXG4gICAgdC5zdHlsZS56SW5kZXggICAgID0gdGhpcy5vcHRzLnRleHQuekluZGV4XG5cbiAgICB0LmlubmVyVGV4dCA9IHRleHQuYm9keVxuXG4gICAgcmV0dXJuIHRcbiAgfVxuXG4gIF9kZWZhdWx0T3B0aW9ucygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdGV4dDoge1xuICAgICAgICB3ZWlnaHQ6ICdib2xkJyxcbiAgICAgICAgc2l6ZSAgOiA1NixcbiAgICAgICAgY29sb3IgOiAnIzAwMCcsXG4gICAgICAgIHNoYWRvdzogJyNmZmYnLFxuICAgICAgICBjbGFzc05hbWU6ICdmbG93bHktdGV4dCcsXG4gICAgICAgIHdoaXRlU3BhY2U6ICdub3dyYXAnIHx8ICdwcmUnLFxuICAgICAgICB6SW5kZXg6IDIxNDc0ODM2NDcsXG4gICAgICB9LFxuICAgICAgZGlzYWJsZTogZmFsc2UsXG4gICAgICBkdXJhdGlvbjogMjAwMCxcbiAgICAgIGVhc2luZzogJ2xpbmVhcicsXG4gICAgICBkaXJlY3Rpb246ICdob3Jpem9udGFsJyxcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBGbG93bHlcbiIsImNvbnN0IHJhbmQgPSAobWluLCBtYXgpID0+IHtcbiAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4pICsgbWluKVxufVxuXG5jb25zdCByYW5kb21TdHIgPSAobGVuZ3RoID0gMzIpID0+IHtcbiAgbGV0IHMgPSAnJ1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgcmFuZG9tID0gTWF0aC5yYW5kb20oKSAqIDE2IHwgMFxuICAgIHMgKz0gKGkgPT0gMTIgPyA0IDogKGkgPT0gMTYgPyAocmFuZG9tICYgMyB8IDgpIDogcmFuZG9tKSkudG9TdHJpbmcoMTYpXG4gIH1cbiAgcmV0dXJuIHNcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHJhbmQsXG4gIHJhbmRvbVN0clxufVxuIl19
