(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Flowly = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('./utils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Flowly = function () {
  function Flowly(elem) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Flowly);

    this.app = document.querySelector(elem);
    this.rect = this.app.getBoundingClientRect();
    this.opts = Object.assign(this._defaultOptions(), options);

    this.app.style.position = 'relative';
    this.app.style.overflow = 'hidden';
  }

  _createClass(Flowly, [{
    key: 'addText',
    value: function addText(text) {
      var _this = this;

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

      t.animate(effect, timing).onfinish = function () {
        _this.app.removeChild(t);
      };
    }
  }, {
    key: 'hide',
    value: function hide() {}
  }, {
    key: 'show',
    value: function show() {}
  }, {
    key: 'update',
    value: function update() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      console.log(options);
      this.opts = Object.assign(this.opts, options);
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
        duration: 2000,
        easing: 'linear',
        direction: 'horizontal'
      };
    }
  }]);

  return Flowly;
}();

module.exports = Flowly;

},{"./utils":2}],2:[function(require,module,exports){
"use strict";

var rand = function rand(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
};

module.exports = {
  rand: rand
};

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvaW5kZXguanMiLCJzcmMvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0FDQUE7Ozs7SUFFTSxNO0FBQ0osa0JBQVksSUFBWixFQUFnQztBQUFBLFFBQWQsT0FBYyx1RUFBSixFQUFJOztBQUFBOztBQUM5QixTQUFLLEdBQUwsR0FBVyxTQUFTLGFBQVQsQ0FBdUIsSUFBdkIsQ0FBWDtBQUNBLFNBQUssSUFBTCxHQUFZLEtBQUssR0FBTCxDQUFTLHFCQUFULEVBQVo7QUFDQSxTQUFLLElBQUwsR0FBWSxPQUFPLE1BQVAsQ0FBYyxLQUFLLGVBQUwsRUFBZCxFQUFzQyxPQUF0QyxDQUFaOztBQUVBLFNBQUssR0FBTCxDQUFTLEtBQVQsQ0FBZSxRQUFmLEdBQTBCLFVBQTFCO0FBQ0EsU0FBSyxHQUFMLENBQVMsS0FBVCxDQUFlLFFBQWYsR0FBMEIsUUFBMUI7QUFDRDs7Ozs0QkFFTyxJLEVBQU07QUFBQTs7QUFDWixVQUFNLElBQUksS0FBSyxXQUFMLENBQWlCLElBQWpCLENBQVY7QUFDQSxXQUFLLEdBQUwsQ0FBUyxXQUFULENBQXFCLENBQXJCOztBQUVBLFVBQUksZUFBSjtBQUNBLFVBQUksS0FBSyxJQUFMLENBQVUsU0FBVixLQUF3QixZQUE1QixFQUEwQztBQUN4QyxVQUFFLEtBQUYsQ0FBUSxJQUFSLEdBQWtCLEtBQUssSUFBTCxDQUFVLElBQVYsR0FBaUIsS0FBSyxJQUFMLENBQVUsS0FBN0M7QUFDQSxVQUFFLEtBQUYsQ0FBUSxHQUFSLEdBQWUsaUJBQUssQ0FBTCxFQUFRLEtBQUssSUFBTCxDQUFVLE1BQVYsR0FBbUIsRUFBRSxZQUE3QixJQUE2QyxJQUE1RDtBQUNBLGlCQUFTLENBQUM7QUFDUixnQkFBUyxLQUFLLElBQUwsQ0FBVSxLQUFuQjtBQURRLFNBQUQsRUFFTjtBQUNELGdCQUFTLENBQUMsRUFBRSxXQUFaO0FBREMsU0FGTSxDQUFU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O0FBY0Q7Ozs7OztBQUdILE9BQU8sT0FBUCxHQUFpQixNQUFqQjs7Ozs7QUNqR0EsSUFBTSxPQUFPLFNBQVAsSUFBTyxDQUFDLEdBQUQsRUFBTSxHQUFOLEVBQWM7QUFDekIsU0FBTyxLQUFLLEtBQUwsQ0FBVyxLQUFLLE1BQUwsTUFBaUIsTUFBTSxHQUF2QixJQUE4QixHQUF6QyxDQUFQO0FBQ0QsQ0FGRDs7QUFJQSxPQUFPLE9BQVAsR0FBaUI7QUFDZjtBQURlLENBQWpCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCB7IHJhbmQgfSBmcm9tICcuL3V0aWxzJ1xuXG5jbGFzcyBGbG93bHkge1xuICBjb25zdHJ1Y3RvcihlbGVtLCBvcHRpb25zID0ge30pIHtcbiAgICB0aGlzLmFwcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZWxlbSlcbiAgICB0aGlzLnJlY3QgPSB0aGlzLmFwcC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgIHRoaXMub3B0cyA9IE9iamVjdC5hc3NpZ24odGhpcy5fZGVmYXVsdE9wdGlvbnMoKSwgb3B0aW9ucylcblxuICAgIHRoaXMuYXBwLnN0eWxlLnBvc2l0aW9uID0gJ3JlbGF0aXZlJ1xuICAgIHRoaXMuYXBwLnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbidcbiAgfVxuXG4gIGFkZFRleHQodGV4dCkge1xuICAgIGNvbnN0IHQgPSB0aGlzLl9jcmVhdGVUZXh0KHRleHQpXG4gICAgdGhpcy5hcHAuYXBwZW5kQ2hpbGQodClcblxuICAgIGxldCBlZmZlY3RcbiAgICBpZiAodGhpcy5vcHRzLmRpcmVjdGlvbiA9PT0gJ2hvcml6b250YWwnKSB7XG4gICAgICB0LnN0eWxlLmxlZnQgPSBgJHt0aGlzLnJlY3QubGVmdCArIHRoaXMucmVjdC53aWR0aH1weGBcbiAgICAgIHQuc3R5bGUudG9wICA9IHJhbmQoMCwgdGhpcy5yZWN0LmhlaWdodCAtIHQuY2xpZW50SGVpZ2h0KSArICdweCdcbiAgICAgIGVmZmVjdCA9IFt7XG4gICAgICAgIGxlZnQ6IGAke3RoaXMucmVjdC53aWR0aH1weGBcbiAgICAgIH0sIHtcbiAgICAgICAgbGVmdDogYCR7LXQuY2xpZW50V2lkdGh9cHhgXG4gICAgICB9XVxuICAgIH0gZWxzZSBpZiAodGhpcy5vcHRzLmRpcmVjdGlvbiA9PT0gJ3ZlcnRpY2FsJykge1xuICAgICAgdC5zdHlsZS5sZWZ0ID0gcmFuZCgwLCB0aGlzLnJlY3Qud2lkdGggLSB0LmNsaWVudFdpZHRoKSArICdweCdcbiAgICAgIHQuc3R5bGUudG9wICA9IGAkey10LmNsaWVudEhlaWdodH1weGBcbiAgICAgIGVmZmVjdCA9IFt7XG4gICAgICAgIHRvcDogYCR7LXQuY2xpZW50SGVpZ2h0fXB4YCxcbiAgICAgIH0sIHtcbiAgICAgICAgdG9wOiBgJHt0aGlzLnJlY3QuaGVpZ2h0fXB4YFxuICAgICAgfV1cbiAgICB9XG5cbiAgICBsZXQgdGltaW5nID0ge31cbiAgICB0aW1pbmcuaXRlcmF0aW9ucyA9IDFcbiAgICB0aW1pbmcuZHVyYXRpb24gPSAodGV4dC5kdXJhdGlvbiB8fCB0aGlzLm9wdHMuZHVyYXRpb24pICogKHRoaXMuYXBwLmNsaWVudFdpZHRoICsgdC5vZmZzZXRXaWR0aCkgLyB0aGlzLmFwcC5jbGllbnRXaWR0aFxuICAgIHRpbWluZy5lYXNpbmcgPSB0ZXh0LmVhc2luZyB8fCB0aGlzLm9wdHMuZWFzaW5nXG5cbiAgICB0LmFuaW1hdGUoZWZmZWN0LCB0aW1pbmcpLm9uZmluaXNoID0gKCkgPT4ge1xuICAgICAgdGhpcy5hcHAucmVtb3ZlQ2hpbGQodClcbiAgICB9XG4gIH1cblxuICBoaWRlKCkge1xuXG4gIH1cblxuICBzaG93KCkge1xuXG4gIH1cblxuICB1cGRhdGUob3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc29sZS5sb2cob3B0aW9ucylcbiAgICB0aGlzLm9wdHMgPSBPYmplY3QuYXNzaWduKHRoaXMub3B0cywgb3B0aW9ucylcbiAgfVxuXG4gIF9jcmVhdGVUZXh0KHRleHQpIHtcbiAgICBjb25zdCBjb2xvciAgPSB0ZXh0LmNvbG9yICB8fCB0aGlzLm9wdHMudGV4dC5jb2xvclxuICAgIGNvbnN0IHNoYWRvdyA9IHRleHQuc2hhZG93IHx8IHRoaXMub3B0cy50ZXh0LnNoYWRvd1xuICAgIGNvbnN0IHNpemUgICA9IHRleHQuc2l6ZSAgIHx8IHRoaXMub3B0cy50ZXh0LnNpemVcbiAgICBjb25zdCB3ZWlnaHQgPSB0ZXh0LndlaWdodCB8fCB0aGlzLm9wdHMudGV4dC53ZWlnaHRcbiAgICBjb25zdCB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpXG5cbiAgICB0LmNsYXNzTmFtZSAgICAgICAgPSB0ZXh0LmNsYXNzTmFtZSB8fCB0aGlzLm9wdHMudGV4dC5jbGFzc05hbWVcbiAgICB0LnN0eWxlLnBvc2l0aW9uICAgPSAnYWJzb2x1dGUnXG4gICAgdC5zdHlsZS5mb250U2l6ZSAgID0gc2l6ZSArICdweCdcbiAgICB0LnN0eWxlLmZvbnRXZWlnaHQgPSB3ZWlnaHRcbiAgICB0LnN0eWxlLmNvbG9yICAgICAgPSBjb2xvclxuICAgIHQuc3R5bGUudGV4dFNoYWRvdyA9IGAtMnB4IC0ycHggMHB4ICR7c2hhZG93fSwgLTJweCAycHggMHB4ICR7c2hhZG93fSwgMnB4IC0ycHggMHB4ICR7c2hhZG93fSwgMnB4IDJweCAwcHggJHtzaGFkb3d9YFxuICAgIHQuc3R5bGUud2hpdGVTcGFjZSA9IHRoaXMub3B0cy50ZXh0LndoaXRlU3BhY2VcbiAgICB0LnN0eWxlLnpJbmRleCAgICAgPSB0aGlzLm9wdHMudGV4dC56SW5kZXhcblxuICAgIHQuaW5uZXJUZXh0ID0gdGV4dC5ib2R5XG5cbiAgICByZXR1cm4gdFxuICB9XG5cbiAgX2RlZmF1bHRPcHRpb25zKCkge1xuICAgIHJldHVybiB7XG4gICAgICB0ZXh0OiB7XG4gICAgICAgIHdlaWdodDogJ2JvbGQnLFxuICAgICAgICBzaXplICA6IDU2LFxuICAgICAgICBjb2xvciA6ICcjMDAwJyxcbiAgICAgICAgc2hhZG93OiAnI2ZmZicsXG4gICAgICAgIGNsYXNzTmFtZTogJ2Zsb3dseS10ZXh0JyxcbiAgICAgICAgd2hpdGVTcGFjZTogJ25vd3JhcCcgfHwgJ3ByZScsXG4gICAgICAgIHpJbmRleDogMjE0NzQ4MzY0NyxcbiAgICAgIH0sXG4gICAgICBkdXJhdGlvbjogMjAwMCxcbiAgICAgIGVhc2luZzogJ2xpbmVhcicsXG4gICAgICBkaXJlY3Rpb246ICdob3Jpem9udGFsJyxcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBGbG93bHlcbiIsImNvbnN0IHJhbmQgPSAobWluLCBtYXgpID0+IHtcbiAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4pICsgbWluKVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgcmFuZFxufVxuIl19
