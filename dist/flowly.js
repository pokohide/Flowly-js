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
      var _this2 = this;

      if (this.opts.disable) return;
      var i = this._createImage(image);
      this.app.appendChild(i);

      var effect = void 0;
      if (this.opts.direction === 'horizontal') {
        i.style.left = this.rect.left + this.rect.width + 'px';
        i.style.top = (0, _utils.rand)(0, this.rect.height - i.clientHeight) + 'px';
        effect = [{
          left: this.rect.width + 'px'
        }, {
          left: -i.clientWidth + 'px'
        }];
      } else if (this.opts.direction === 'vertical') {
        i.style.left = (0, _utils.rand)(0, this.rect.width - i.clientWidth) + 'px';
        i.style.top = -i.clientHeight + 'px';
        effect = [{
          top: -i.clientHeight + 'px'
        }, {
          top: this.rect.height + 'px'
        }];
      }

      var timing = {};
      timing.iterations = 1;
      timing.duration = (image.duration || this.opts.duration) * (this.app.clientWidth + i.offsetWidth) / this.app.clientWidth;
      timing.easing = image.easing || this.opts.easing;

      var token = (0, _utils.randomStr)();
      this.texts.set(token, t);

      t.animate(effect, timing).onfinish = function () {
        _this2.app.removeChild(t);
        _this2.texts.delete(token);
      };
    }
  }, {
    key: 'addText',
    value: function addText(text) {
      var _this3 = this;

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
        _this3.app.removeChild(t);
        _this3.elems.delete(token);
      };
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
        for (var _iterator = this.elem.values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
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
        for (var _iterator2 = this.elem.values()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvZWxlbWVudC1yZXNpemUtZXZlbnQvaW5kZXguanMiLCJzcmMvaW5kZXguanMiLCJzcmMvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUM5R0E7OztBQURBOzs7O0FBRUE7Ozs7OztJQUVNLE07QUFDSixrQkFBWSxJQUFaLEVBQWdDO0FBQUE7O0FBQUEsUUFBZCxPQUFjLHVFQUFKLEVBQUk7O0FBQUE7O0FBQzlCO0FBQ0EsU0FBSyxJQUFMLEdBQVksSUFBWjtBQUNBLFNBQUssR0FBTCxHQUFXLFNBQVMsYUFBVCxDQUF1QixJQUF2QixD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QU0sWUFBWSxTQUFaLFNBQVksR0FBaUI7QUFBQSxNQUFoQixNQUFnQix1RUFBUCxFQUFPOztBQUNqQyxNQUFJLElBQUksRUFBUjtBQUNBLE9BQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxNQUFwQixFQUE0QixHQUE1QixFQUFpQztBQUMvQixRQUFNLFNBQVMsS0FBSyxNQUFMLEtBQWdCLEVBQWhCLEdBQXFCLENBQXBDO0FBQ0EsU0FBSyxDQUFDLEtBQUssRUFBTCxHQUFVLENBQVYsR0FBZSxLQUFLLEVBQUwsR0FBVyxTQUFTLENBQVQsR0FBYSxDQUF4QixHQUE2QixNQUE3QyxFQUFzRCxRQUF0RCxDQUErRCxFQUEvRCxDQUFMO0FBQ0Q7QUFDRCxTQUFPLENBQVA7QUFDRCxDQVBEOztBQVNBLE9BQU8sT0FBUCxHQUFpQjtBQUNmLFlBRGU7QUFFZjtBQUZlLENBQWpCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciByZXF1ZXN0RnJhbWUgPSAoZnVuY3Rpb24gKCkge1xuICB2YXIgd2luZG93ID0gdGhpc1xuICB2YXIgcmFmID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuICAgIHdpbmRvdy5tb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICB3aW5kb3cud2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgZnVuY3Rpb24gZmFsbGJhY2tSQUYoZnVuYykge1xuICAgICAgcmV0dXJuIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmMsIDIwKVxuICAgIH1cbiAgcmV0dXJuIGZ1bmN0aW9uIHJlcXVlc3RGcmFtZUZ1bmN0aW9uKGZ1bmMpIHtcbiAgICByZXR1cm4gcmFmKGZ1bmMpXG4gIH1cbn0pKClcblxudmFyIGNhbmNlbEZyYW1lID0gKGZ1bmN0aW9uICgpIHtcbiAgdmFyIHdpbmRvdyA9IHRoaXNcbiAgdmFyIGNhbmNlbCA9IHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSB8fFxuICAgIHdpbmRvdy5tb3pDYW5jZWxBbmltYXRpb25GcmFtZSB8fFxuICAgIHdpbmRvdy53ZWJraXRDYW5jZWxBbmltYXRpb25GcmFtZSB8fFxuICAgIHdpbmRvdy5jbGVhclRpbWVvdXRcbiAgcmV0dXJuIGZ1bmN0aW9uIGNhbmNlbEZyYW1lRnVuY3Rpb24oaWQpIHtcbiAgICByZXR1cm4gY2FuY2VsKGlkKVxuICB9XG59KSgpXG5cbmZ1bmN0aW9uIHJlc2l6ZUxpc3RlbmVyKGUpIHtcbiAgdmFyIHdpbiA9IGUudGFyZ2V0IHx8IGUuc3JjRWxlbWVudFxuICBpZiAod2luLl9fcmVzaXplUkFGX18pIHtcbiAgICBjYW5jZWxGcmFtZSh3aW4uX19yZXNpemVSQUZfXylcbiAgfVxuICB3aW4uX19yZXNpemVSQUZfXyA9IHJlcXVlc3RGcmFtZShmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHRyaWdnZXIgPSB3aW4uX19yZXNpemVUcmlnZ2VyX19cbiAgICB0cmlnZ2VyLl9fcmVzaXplTGlzdGVuZXJzX18uZm9yRWFjaChmdW5jdGlvbiAoZm4pIHtcbiAgICAgIGZuLmNhbGwodHJpZ2dlciwgZSlcbiAgICB9KVxuICB9KVxufVxuXG52YXIgZXhwb3J0cyA9IGZ1bmN0aW9uIGV4cG9ydHMoZWxlbWVudCwgZm4pIHtcbiAgdmFyIHdpbmRvdyA9IHRoaXNcbiAgdmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50XG4gIHZhciBpc0lFXG5cbiAgdmFyIGF0dGFjaEV2ZW50ID0gZG9jdW1lbnQuYXR0YWNoRXZlbnRcbiAgaWYgKHR5cGVvZiBuYXZpZ2F0b3IgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgaXNJRSA9IG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL1RyaWRlbnQvKSB8fFxuICAgICAgbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvRWRnZS8pXG4gIH1cblxuICBmdW5jdGlvbiBvYmplY3RMb2FkKCkge1xuICAgIHRoaXMuY29udGVudERvY3VtZW50LmRlZmF1bHRWaWV3Ll9fcmVzaXplVHJpZ2dlcl9fID0gdGhpcy5fX3Jlc2l6ZUVsZW1lbnRfX1xuICAgIHRoaXMuY29udGVudERvY3VtZW50LmRlZmF1bHRWaWV3LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHJlc2l6ZUxpc3RlbmVyKVxuICB9XG5cbiAgaWYgKCFlbGVtZW50Ll9fcmVzaXplTGlzdGVuZXJzX18pIHtcbiAgICBlbGVtZW50Ll9fcmVzaXplTGlzdGVuZXJzX18gPSBbXVxuICAgIGlmIChhdHRhY2hFdmVudCkge1xuICAgICAgZWxlbWVudC5fX3Jlc2l6ZVRyaWdnZXJfXyA9IGVsZW1lbnRcbiAgICAgIGVsZW1lbnQuYXR0YWNoRXZlbnQoJ29ucmVzaXplJywgcmVzaXplTGlzdGVuZXIpXG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChnZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpLnBvc2l0aW9uID09PSAnc3RhdGljJykge1xuICAgICAgICBlbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gJ3JlbGF0aXZlJ1xuICAgICAgfVxuICAgICAgdmFyIG9iaiA9IChlbGVtZW50Ll9fcmVzaXplVHJpZ2dlcl9fID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb2JqZWN0JykpXG4gICAgICBvYmouc2V0QXR0cmlidXRlKFxuICAgICAgICAnc3R5bGUnLFxuICAgICAgICAnZGlzcGxheTogYmxvY2s7IHBvc2l0aW9uOiBhYnNvbHV0ZTsgdG9wOiAwOyBsZWZ0OiAwOyBoZWlnaHQ6IDEwMCU7IHdpZHRoOiAxMDAlOyBvdmVyZmxvdzogaGlkZGVuOyBwb2ludGVyLWV2ZW50czogbm9uZTsgei1pbmRleDogLTE7IG9wYWNpdHk6IDA7J1xuICAgICAgKVxuICAgICAgb2JqLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAncmVzaXplLXNlbnNvcicpXG4gICAgICBvYmouX19yZXNpemVFbGVtZW50X18gPSBlbGVtZW50XG4gICAgICBvYmoub25sb2FkID0gb2JqZWN0TG9hZFxuICAgICAgb2JqLnR5cGUgPSAndGV4dC9odG1sJ1xuICAgICAgaWYgKGlzSUUpIHtcbiAgICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZChvYmopXG4gICAgICB9XG4gICAgICBvYmouZGF0YSA9ICdhYm91dDpibGFuaydcbiAgICAgIGlmICghaXNJRSkge1xuICAgICAgICBlbGVtZW50LmFwcGVuZENoaWxkKG9iailcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgZWxlbWVudC5fX3Jlc2l6ZUxpc3RlbmVyc19fLnB1c2goZm4pXG59XG5cbm1vZHVsZS5leHBvcnRzID0gdHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcgPyBleHBvcnRzIDogZXhwb3J0cy5iaW5kKHdpbmRvdylcblxubW9kdWxlLmV4cG9ydHMudW5iaW5kID0gZnVuY3Rpb24gKGVsZW1lbnQsIGZuKSB7XG4gIHZhciBhdHRhY2hFdmVudCA9IGRvY3VtZW50LmF0dGFjaEV2ZW50XG4gIGlmIChmbikge1xuICAgIGVsZW1lbnQuX19yZXNpemVMaXN0ZW5lcnNfXy5zcGxpY2UoXG4gICAgICBlbGVtZW50Ll9fcmVzaXplTGlzdGVuZXJzX18uaW5kZXhPZihmbiksXG4gICAgICAxXG4gICAgKVxuICB9IGVsc2Uge1xuICAgIGVsZW1lbnQuX19yZXNpemVMaXN0ZW5lcnNfXyA9IFtdXG4gIH1cbiAgaWYgKCFlbGVtZW50Ll9fcmVzaXplTGlzdGVuZXJzX18ubGVuZ3RoKSB7XG4gICAgaWYgKGF0dGFjaEV2ZW50KSB7XG4gICAgICBlbGVtZW50LmRldGFjaEV2ZW50KCdvbnJlc2l6ZScsIHJlc2l6ZUxpc3RlbmVyKVxuICAgIH0gZWxzZSB7XG4gICAgICBlbGVtZW50Ll9fcmVzaXplVHJpZ2dlcl9fLmNvbnRlbnREb2N1bWVudC5kZWZhdWx0Vmlldy5yZW1vdmVFdmVudExpc3RlbmVyKFxuICAgICAgICAncmVzaXplJyxcbiAgICAgICAgcmVzaXplTGlzdGVuZXJcbiAgICAgIClcbiAgICAgIGRlbGV0ZSBlbGVtZW50Ll9fcmVzaXplVHJpZ2dlcl9fLmNvbnRlbnREb2N1bWVudC5kZWZhdWx0Vmlldy5fX3Jlc2l6ZVRyaWdnZXJfX1xuICAgICAgZWxlbWVudC5fX3Jlc2l6ZVRyaWdnZXJfXyA9ICFlbGVtZW50LnJlbW92ZUNoaWxkKFxuICAgICAgICBlbGVtZW50Ll9fcmVzaXplVHJpZ2dlcl9fXG4gICAgICApXG4gICAgfVxuICAgIGRlbGV0ZSBlbGVtZW50Ll9fcmVzaXplTGlzdGVuZXJzX19cbiAgfVxufVxuIiwiaW1wb3J0IGVsZW1lbnRSZXNpemVFdmVudCBmcm9tICdlbGVtZW50LXJlc2l6ZS1ldmVudCdcbi8vaW1wb3J0IEZsb3dseVRleHQgZnJvbSAnZmxvd2x5L3RleHQnXG5pbXBvcnQgeyByYW5kLCByYW5kb21TdHIgfSBmcm9tICcuL3V0aWxzJ1xuXG5jbGFzcyBGbG93bHkge1xuICBjb25zdHJ1Y3RvcihlbGVtLCBvcHRpb25zID0ge30pIHtcbiAgICAvKiBBUFAgKi9cbiAgICB0aGlzLmVsZW0gPSBlbGVtXG4gICAgdGhpcy5hcHAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGVsZW0pXG4gICAgdGhpcy5hcHAuc3R5bGUucG9zaXRpb24gPSAncmVsYXRpdmUnXG4gICAgdGhpcy5hcHAuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJ1xuXG4gICAgdGhpcy5yZWN0ID0gdGhpcy5hcHAuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICB0aGlzLm9wdHMgPSBPYmplY3QuYXNzaWduKHRoaXMuX2RlZmF1bHRPcHRpb25zKCksIG9wdGlvbnMpXG5cbiAgICB0aGlzLmVsZW1zID0gbmV3IE1hcCgpXG4gICAgZWxlbWVudFJlc2l6ZUV2ZW50KHRoaXMuYXBwLCAoKSA9PiB7IHRoaXMucmVzaXplKCkgfSlcbiAgfVxuXG4gIGFkZEltYWdlKGltYWdlKSB7XG4gICAgaWYgKHRoaXMub3B0cy5kaXNhYmxlKSByZXR1cm5cbiAgICBjb25zdCBpID0gdGhpcy5fY3JlYXRlSW1hZ2UoaW1hZ2UpXG4gICAgdGhpcy5hcHAuYXBwZW5kQ2hpbGQoaSlcblxuICAgIGxldCBlZmZlY3RcbiAgICBpZiAodGhpcy5vcHRzLmRpcmVjdGlvbiA9PT0gJ2hvcml6b250YWwnKSB7XG4gICAgICBpLnN0eWxlLmxlZnQgPSBgJHt0aGlzLnJlY3QubGVmdCArIHRoaXMucmVjdC53aWR0aH1weGBcbiAgICAgIGkuc3R5bGUudG9wICA9IHJhbmQoMCwgdGhpcy5yZWN0LmhlaWdodCAtIGkuY2xpZW50SGVpZ2h0KSArICdweCdcbiAgICAgIGVmZmVjdCA9IFt7XG4gICAgICAgIGxlZnQ6IGAke3RoaXMucmVjdC53aWR0aH1weGBcbiAgICAgIH0sIHtcbiAgICAgICAgbGVmdDogYCR7LWkuY2xpZW50V2lkdGh9cHhgXG4gICAgICB9XVxuICAgIH0gZWxzZSBpZiAodGhpcy5vcHRzLmRpcmVjdGlvbiA9PT0gJ3ZlcnRpY2FsJykge1xuICAgICAgaS5zdHlsZS5sZWZ0ID0gcmFuZCgwLCB0aGlzLnJlY3Qud2lkdGggLSBpLmNsaWVudFdpZHRoKSArICdweCdcbiAgICAgIGkuc3R5bGUudG9wICA9IGAkey1pLmNsaWVudEhlaWdodH1weGBcbiAgICAgIGVmZmVjdCA9IFt7XG4gICAgICAgIHRvcDogYCR7LWkuY2xpZW50SGVpZ2h0fXB4YCxcbiAgICAgIH0sIHtcbiAgICAgICAgdG9wOiBgJHt0aGlzLnJlY3QuaGVpZ2h0fXB4YFxuICAgICAgfV1cbiAgICB9XG5cbiAgICBsZXQgdGltaW5nID0ge31cbiAgICB0aW1pbmcuaXRlcmF0aW9ucyA9IDFcbiAgICB0aW1pbmcuZHVyYXRpb24gPSAoaW1hZ2UuZHVyYXRpb24gfHwgdGhpcy5vcHRzLmR1cmF0aW9uKSAqICh0aGlzLmFwcC5jbGllbnRXaWR0aCArIGkub2Zmc2V0V2lkdGgpIC8gdGhpcy5hcHAuY2xpZW50V2lkdGhcbiAgICB0aW1pbmcuZWFzaW5nID0gaW1hZ2UuZWFzaW5nIHx8IHRoaXMub3B0cy5lYXNpbmdcblxuICAgIGNvbnN0IHRva2VuID0gcmFuZG9tU3RyKClcbiAgICB0aGlzLnRleHRzLnNldCh0b2tlbiwgdClcblxuICAgIHQuYW5pbWF0ZShlZmZlY3QsIHRpbWluZykub25maW5pc2ggPSAoKSA9PiB7XG4gICAgICB0aGlzLmFwcC5yZW1vdmVDaGlsZCh0KVxuICAgICAgdGhpcy50ZXh0cy5kZWxldGUodG9rZW4pXG4gICAgfVxuICB9XG5cbiAgYWRkVGV4dCh0ZXh0KSB7XG4gICAgaWYgKHRoaXMub3B0cy5kaXNhYmxlKSByZXR1cm5cblxuICAgIGNvbnN0IHQgPSB0aGlzLl9jcmVhdGVUZXh0KHRleHQpXG4gICAgdGhpcy5hcHAuYXBwZW5kQ2hpbGQodClcblxuICAgIGNvbnN0IGVmZmVjdCA9IHRoaXMuX2VmZmVjdCh0LCB0aGlzLm9wdHMuZGlyZWN0aW9uKVxuXG4gICAgbGV0IHRpbWluZyA9IHt9XG4gICAgdGltaW5nLml0ZXJhdGlvbnMgPSAxXG4gICAgdGltaW5nLmR1cmF0aW9uID0gKHRleHQuZHVyYXRpb24gfHwgdGhpcy5vcHRzLmR1cmF0aW9uKSAqICh0aGlzLmFwcC5jbGllbnRXaWR0aCArIHQub2Zmc2V0V2lkdGgpIC8gdGhpcy5hcHAuY2xpZW50V2lkdGhcbiAgICB0aW1pbmcuZWFzaW5nID0gdGV4dC5lYXNpbmcgfHwgdGhpcy5vcHRzLmVhc2luZ1xuXG4gICAgY29uc3QgdG9rZW4gPSByYW5kb21TdHIoKVxuICAgIHRoaXMuZWxlbXMuc2V0KHRva2VuLCB0KVxuXG4gICAgdC5hbmltYXRlKGVmZmVjdCwgdGltaW5nKS5vbmZpbmlzaCA9ICgpID0+IHtcbiAgICAgIHRoaXMuYXBwLnJlbW92ZUNoaWxkKHQpXG4gICAgICB0aGlzLmVsZW1zLmRlbGV0ZSh0b2tlbilcbiAgICB9XG4gIH1cblxuICBfZWZmZWN0KGVsZW0sIHR5cGUpIHtcbiAgICBpZiAodHlwZSA9PT0gJ2hvcml6b250YWwnKSB7XG4gICAgICBlbGVtLnN0eWxlLmxlZnQgPSAodGhpcy5yZWN0LmxlZnQgKyB0aGlzLnJlY3Qud2lkdGgpICsgJ3B4J1xuICAgICAgZWxlbS5zdHlsZS50b3AgID0gcmFuZCgwLCB0aGlzLnJlY3QuaGVpZ2h0IC0gZWxlbS5jbGllbnRIZWlnaHQpICsgJ3B4J1xuXG4gICAgICByZXR1cm4gW3tcbiAgICAgICAgbGVmdDogdGhpcy5yZWN0LndpZHRoICsgJ3B4J1xuICAgICAgfSwge1xuICAgICAgICBsZWZ0OiAoLWVsZW0uY2xpZW50V2lkdGgpICsgJ3B4J1xuICAgICAgfV1cbiAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICd2ZXJ0aWNhbCcpIHtcbiAgICAgIGVsZW0uc3R5bGUubGVmdCA9IHJhbmQoMCwgdGhpcy5yZWN0LndpZHRoIC0gZWxlbS5jbGllbnRXaWR0aCkgKyAncHgnXG4gICAgICBlbGVtLnN0eWxlLnRvcCAgPSAoLWVsZW0uY2xpZW50V2lkdGgpICsgJ3B4J1xuXG4gICAgICByZXR1cm4gW3tcbiAgICAgICAgdG9wOiAoLWVsZW0uY2xpZW50SGVpZ2h0KSArICdweCdcbiAgICAgIH0sIHtcbiAgICAgICAgdG9wOiB0aGlzLnJlY3QuaGVpZ2h0ICsgJ3B4J1xuICAgICAgfV1cbiAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdyYW5kb20nKSB7XG4gICAgICBlbGVtLnN0eWxlLm9wYWNpdHkgPSAwLjBcbiAgICAgIGVsZW0uc3R5bGUubGVmdCAgICA9IHJhbmQoMCwgdGhpcy5yZWN0LndpZHRoKSAtIGVsZW0uY2xpZW50V2lkdGggLyAyICsgJ3B4J1xuICAgICAgZWxlbS5zdHlsZS50b3AgICAgID0gcmFuZCgwLCB0aGlzLnJlY3QuaGVpZ2h0KSAtIGVsZW0uY2xpZW50SGVpZ2h0IC8gMiArICdweCdcblxuICAgICAgcmV0dXJuIFt7XG4gICAgICAgIG9wYWNpdHk6IDAuMCxcbiAgICAgICAgdHJhbnNmb3JtOiAnc2NhbGUoMC4yLCAwLjIpIHRyYW5zbGF0ZSgwLCAyMHB4KSdcbiAgICAgIH0sIHtcbiAgICAgICAgb3BhY2l0eTogMS4wLFxuICAgICAgICB0cmFuc2Zvcm06ICdzY2FsZSgwLjUsIDAuNSkgdHJhbnNsYXRlKDAsIDBweCknXG4gICAgICB9LCB7XG4gICAgICAgIG9wYWNpdHk6IDAuMCxcbiAgICAgICAgdHJhbnNmb3JtOiAnc2NhbGUoMS4wLCAxLjApIHRyYW5zbGF0ZSgwLCAtNTBweCknXG4gICAgICB9XVxuICAgIH1cbiAgfVxuXG4gIC8vIGlmIHRydWUgc2hvdyB0ZXh0LCBpZiBmYWxzZSBoaWRlIHRleHRcbiAgdG9nZ2xlKGZsYWcpIHtcbiAgICBpZiAoZmxhZykgdGhpcy5zaG93KClcbiAgICBlbHNlIHRoaXMuaGlkZSgpXG4gIH1cblxuICBoaWRlKCkge1xuICAgIGZvciAobGV0IGVsZW0gb2YgdGhpcy5lbGVtLnZhbHVlcygpKSB7XG4gICAgICBlbGVtLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcbiAgICB9XG4gIH1cblxuICBzaG93KCkge1xuICAgIGZvciAobGV0IGVsZW0gb2YgdGhpcy5lbGVtLnZhbHVlcygpKSB7XG4gICAgICBlbGVtLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXG4gICAgfVxuICB9XG5cbiAgcmVzaXplKCkge1xuICAgIHRoaXMuYXBwID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0aGlzLmVsZW0pXG4gICAgdGhpcy5hcHAuc3R5bGUucG9zaXRpb24gPSAncmVsYXRpdmUnXG4gICAgdGhpcy5hcHAuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJ1xuICAgIHRoaXMucmVjdCA9IHRoaXMuYXBwLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gIH1cblxuICB1cGRhdGUob3B0aW9ucyA9IHt9KSB7XG4gICAgdGhpcy5vcHRzID0gT2JqZWN0LmFzc2lnbih0aGlzLm9wdHMsIG9wdGlvbnMpXG4gIH1cblxuICB1bmJpbmQoKSB7XG4gICAgZWxlbWVudFJlc2l6ZUV2ZW50LnVuYmluZCh0aGlzLmFwcClcbiAgICB0aGlzLnVwZGF0ZSh7IGRpc2FibGU6IHRydWUgfSlcbiAgfVxuXG4gIF9jcmVhdGVUZXh0KHRleHQpIHtcbiAgICBjb25zdCBjb2xvciAgPSB0ZXh0LmNvbG9yICB8fCB0aGlzLm9wdHMudGV4dC5jb2xvclxuICAgIGNvbnN0IHNoYWRvdyA9IHRleHQuc2hhZG93IHx8IHRoaXMub3B0cy50ZXh0LnNoYWRvd1xuICAgIGNvbnN0IHNpemUgICA9IHRleHQuc2l6ZSAgIHx8IHRoaXMub3B0cy50ZXh0LnNpemVcbiAgICBjb25zdCB3ZWlnaHQgPSB0ZXh0LndlaWdodCB8fCB0aGlzLm9wdHMudGV4dC53ZWlnaHRcbiAgICBjb25zdCB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpXG5cbiAgICB0LmNsYXNzTmFtZSAgICAgICAgPSB0ZXh0LmNsYXNzTmFtZSB8fCB0aGlzLm9wdHMudGV4dC5jbGFzc05hbWVcbiAgICB0LnN0eWxlLnBvc2l0aW9uICAgPSAnYWJzb2x1dGUnXG4gICAgdC5zdHlsZS5mb250U2l6ZSAgID0gc2l6ZSArICdweCdcbiAgICB0LnN0eWxlLmZvbnRXZWlnaHQgPSB3ZWlnaHRcbiAgICB0LnN0eWxlLmNvbG9yICAgICAgPSBjb2xvclxuICAgIHQuc3R5bGUudGV4dFNoYWRvdyA9IGAtMnB4IC0ycHggMHB4ICR7c2hhZG93fSwgLTJweCAycHggMHB4ICR7c2hhZG93fSwgMnB4IC0ycHggMHB4ICR7c2hhZG93fSwgMnB4IDJweCAwcHggJHtzaGFkb3d9YFxuICAgIHQuc3R5bGUud2hpdGVTcGFjZSA9IHRoaXMub3B0cy50ZXh0LndoaXRlU3BhY2VcbiAgICB0LnN0eWxlLnpJbmRleCAgICAgPSB0aGlzLm9wdHMudGV4dC56SW5kZXhcblxuICAgIHQuaW5uZXJUZXh0ID0gdGV4dC5ib2R5XG5cbiAgICByZXR1cm4gdFxuICB9XG5cbiAgX2RlZmF1bHRPcHRpb25zKCkge1xuICAgIHJldHVybiB7XG4gICAgICB0ZXh0OiB7XG4gICAgICAgIHdlaWdodDogJ2JvbGQnLFxuICAgICAgICBzaXplICA6IDU2LFxuICAgICAgICBjb2xvciA6ICcjMDAwJyxcbiAgICAgICAgc2hhZG93OiAnI2ZmZicsXG4gICAgICAgIGNsYXNzTmFtZTogJ2Zsb3dseS10ZXh0JyxcbiAgICAgICAgd2hpdGVTcGFjZTogJ25vd3JhcCcgfHwgJ3ByZScsXG4gICAgICAgIHpJbmRleDogMjE0NzQ4MzY0NyxcbiAgICAgIH0sXG4gICAgICBkaXNhYmxlOiBmYWxzZSxcbiAgICAgIGR1cmF0aW9uOiAyMDAwLFxuICAgICAgZWFzaW5nOiAnbGluZWFyJyxcbiAgICAgIGRpcmVjdGlvbjogJ2hvcml6b250YWwnLFxuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEZsb3dseVxuIiwiY29uc3QgcmFuZCA9IChtaW4sIG1heCkgPT4ge1xuICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbikgKyBtaW4pXG59XG5cbmNvbnN0IHJhbmRvbVN0ciA9IChsZW5ndGggPSAzMikgPT4ge1xuICBsZXQgcyA9ICcnXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCByYW5kb20gPSBNYXRoLnJhbmRvbSgpICogMTYgfCAwXG4gICAgcyArPSAoaSA9PSAxMiA/IDQgOiAoaSA9PSAxNiA/IChyYW5kb20gJiAzIHwgOCkgOiByYW5kb20pKS50b1N0cmluZygxNilcbiAgfVxuICByZXR1cm4gc1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgcmFuZCxcbiAgcmFuZG9tU3RyXG59XG4iXX0=
