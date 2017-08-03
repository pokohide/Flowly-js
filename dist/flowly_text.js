(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Flowly = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var rand = function rand(value) {
  return Math.floor(value * Math.random());
};

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

      console.log(this.rect);

      var effect = void 0;
      if (this.opts.direction === 'horizontal') {
        effect = [{
          left: this.rect.width + 'px'
        }, {
          left: -t.clientWidth + 'px'
        }];
      } else if (this.opts.direction === 'vertical') {
        effect = [];
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
    key: 'update',
    value: function update() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

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
      t.style.left = this.rect.left + this.rect.width + 'px';
      t.style.top = this.rect.top + rand(this.rect.height - 40) + 'px';
      t.style.fontSize = size + 'px';
      t.style.fontWeight = weight;
      t.style.color = color;
      t.style.textShadow = '-2px -2px 0px ' + shadow + ', -2px 2px 0px ' + shadow + ', 2px -2px 0px ' + shadow + ', 2px 2px 0px ' + shadow;
      t.style.whiteSpace = this.opts.text.whiteSpace;
      t.style.zIndex = this.opts.text.zIndex;
      t.style.top = rand(this.app.clientHeight - t.offsetHeight) + 'px';

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

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7QUNBQSxJQUFNLE9BQU8sU0FBUCxJQUFPLENBQUMsS0FBRCxFQUFXO0FBQ3RCLFNBQU8sS0FBSyxLQUFMLENBQVcsUUFBUSxLQUFLLE1BQUwsRUFBbkIsQ0FBUDtBQUNELENBRkQ7O0lBSU0sTTtBQUNKLGtCQUFZLElBQVosRUFBZ0M7QUFBQSxRQUFkLE9BQWMsdUVBQUosRUFBSTs7QUFBQTs7QUFDOUIsU0FBSyxHQUFMLEdBQVcsU0FBUyxhQUFULENBQXVCLElBQXZCLENBQVg7QUFDQSxTQUFLLElBQUwsR0FBWSxLQUFLLEdBQUwsQ0FBUyxxQkFBVCxFQUFaO0FBQ0EsU0FBSyxJQUFMLEdBQVksT0FBTyxNQUFQLENBQWMsS0FBSyxlQUFMLEVBQWQsRUFBc0MsT0FBdEMsQ0FBWjs7QUFFQSxTQUFLLEdBQUwsQ0FBUyxLQUFULENBQWUsUUFBZixHQUEwQixVQUExQjtBQUNBLFNBQUssR0FBTCxDQUFTLEtBQVQsQ0FBZSxRQUFmLEdBQTBCLFFBQTFCO0FBQ0Q7Ozs7NEJBRU8sSSxFQUFNO0FBQUE7O0FBQ1osVUFBTSxJQUFJLEtBQUssV0FBTCxDQUFpQixJQUFqQixDQUFWO0FBQ0EsV0FBSyxHQUFMLENBQVMsV0FBVCxDQUFxQixDQUFyQjs7QUFFQSxjQUFRLEdBQVIsQ0FBWSxLQUFLLElBQWpCOztBQUVBLFVBQUksZUFBSjtBQUNBLFVBQUksS0FBSyxJQUFMLENBQVUsU0FBVixLQUF3QixZQUE1QixFQUEwQztBQUN4QyxpQkFBUyxDQUFDO0FBQ1IsZ0JBQVMsS0FBSyxJQUFMLENBQVUsS0FBbkI7QUFEUSxTQUFELEVBRU47QUFDRCxnQkFBUyxDQUFDLEVBQUUsV0FBWjtBQURDLFNBRk0sQ0FBVDtBQUtELE9BTkQsTUFNTyxJQUFJLEtBQUssSUFBTCxDQUFVLFNBQVYsS0FBd0IsVUFBNUIsRUFBd0M7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b3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJjb25zdCByYW5kID0gKHZhbHVlKSA9PiB7XG4gIHJldHVybiBNYXRoLmZsb29yKHZhbHVlICogTWF0aC5yYW5kb20oKSlcbn1cblxuY2xhc3MgRmxvd2x5IHtcbiAgY29uc3RydWN0b3IoZWxlbSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgdGhpcy5hcHAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGVsZW0pXG4gICAgdGhpcy5yZWN0ID0gdGhpcy5hcHAuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICB0aGlzLm9wdHMgPSBPYmplY3QuYXNzaWduKHRoaXMuX2RlZmF1bHRPcHRpb25zKCksIG9wdGlvbnMpXG5cbiAgICB0aGlzLmFwcC5zdHlsZS5wb3NpdGlvbiA9ICdyZWxhdGl2ZSdcbiAgICB0aGlzLmFwcC5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nXG4gIH1cblxuICBhZGRUZXh0KHRleHQpIHtcbiAgICBjb25zdCB0ID0gdGhpcy5fY3JlYXRlVGV4dCh0ZXh0KVxuICAgIHRoaXMuYXBwLmFwcGVuZENoaWxkKHQpXG5cbiAgICBjb25zb2xlLmxvZyh0aGlzLnJlY3QpXG5cbiAgICBsZXQgZWZmZWN0XG4gICAgaWYgKHRoaXMub3B0cy5kaXJlY3Rpb24gPT09ICdob3Jpem9udGFsJykge1xuICAgICAgZWZmZWN0ID0gW3tcbiAgICAgICAgbGVmdDogYCR7dGhpcy5yZWN0LndpZHRofXB4YFxuICAgICAgfSwge1xuICAgICAgICBsZWZ0OiBgJHstdC5jbGllbnRXaWR0aH1weGBcbiAgICAgIH1dXG4gICAgfSBlbHNlIGlmICh0aGlzLm9wdHMuZGlyZWN0aW9uID09PSAndmVydGljYWwnKSB7XG4gICAgICBlZmZlY3QgPSBbXVxuICAgIH1cblxuICAgIGxldCB0aW1pbmcgPSB7fVxuICAgIHRpbWluZy5pdGVyYXRpb25zID0gMVxuICAgIHRpbWluZy5kdXJhdGlvbiA9ICh0ZXh0LmR1cmF0aW9uIHx8IHRoaXMub3B0cy5kdXJhdGlvbikgKiAodGhpcy5hcHAuY2xpZW50V2lkdGggKyB0Lm9mZnNldFdpZHRoKSAvIHRoaXMuYXBwLmNsaWVudFdpZHRoXG4gICAgdGltaW5nLmVhc2luZyA9IHRleHQuZWFzaW5nIHx8IHRoaXMub3B0cy5lYXNpbmdcblxuICAgIHQuYW5pbWF0ZShlZmZlY3QsIHRpbWluZykub25maW5pc2ggPSAoKSA9PiB7XG4gICAgICB0aGlzLmFwcC5yZW1vdmVDaGlsZCh0KVxuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZShvcHRpb25zID0ge30pIHtcbiAgICB0aGlzLm9wdHMgPSBPYmplY3QuYXNzaWduKHRoaXMub3B0cywgb3B0aW9ucylcbiAgfVxuXG4gIF9jcmVhdGVUZXh0KHRleHQpIHtcbiAgICBjb25zdCBjb2xvciAgPSB0ZXh0LmNvbG9yICB8fCB0aGlzLm9wdHMudGV4dC5jb2xvclxuICAgIGNvbnN0IHNoYWRvdyA9IHRleHQuc2hhZG93IHx8IHRoaXMub3B0cy50ZXh0LnNoYWRvd1xuICAgIGNvbnN0IHNpemUgICA9IHRleHQuc2l6ZSAgIHx8IHRoaXMub3B0cy50ZXh0LnNpemVcbiAgICBjb25zdCB3ZWlnaHQgPSB0ZXh0LndlaWdodCB8fCB0aGlzLm9wdHMudGV4dC53ZWlnaHRcbiAgICBjb25zdCB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpXG5cbiAgICB0LmNsYXNzTmFtZSAgICAgICAgPSB0ZXh0LmNsYXNzTmFtZSB8fCB0aGlzLm9wdHMudGV4dC5jbGFzc05hbWVcbiAgICB0LnN0eWxlLnBvc2l0aW9uICAgPSAnYWJzb2x1dGUnXG4gICAgdC5zdHlsZS5sZWZ0ICAgICAgID0gYCR7dGhpcy5yZWN0LmxlZnQgKyB0aGlzLnJlY3Qud2lkdGh9cHhgXG4gICAgdC5zdHlsZS50b3AgICAgICAgID0gKHRoaXMucmVjdC50b3AgKyByYW5kKHRoaXMucmVjdC5oZWlnaHQgLSA0MCkpICsgJ3B4J1xuICAgIHQuc3R5bGUuZm9udFNpemUgICA9IHNpemUgKyAncHgnXG4gICAgdC5zdHlsZS5mb250V2VpZ2h0ID0gd2VpZ2h0XG4gICAgdC5zdHlsZS5jb2xvciAgICAgID0gY29sb3JcbiAgICB0LnN0eWxlLnRleHRTaGFkb3cgPSBgLTJweCAtMnB4IDBweCAke3NoYWRvd30sIC0ycHggMnB4IDBweCAke3NoYWRvd30sIDJweCAtMnB4IDBweCAke3NoYWRvd30sIDJweCAycHggMHB4ICR7c2hhZG93fWBcbiAgICB0LnN0eWxlLndoaXRlU3BhY2UgPSB0aGlzLm9wdHMudGV4dC53aGl0ZVNwYWNlXG4gICAgdC5zdHlsZS56SW5kZXggICAgID0gdGhpcy5vcHRzLnRleHQuekluZGV4XG4gICAgdC5zdHlsZS50b3Ag44CA44CA44CA44CAPSByYW5kKHRoaXMuYXBwLmNsaWVudEhlaWdodCAtIHQub2Zmc2V0SGVpZ2h0KSArICdweCdcblxuICAgIHQuaW5uZXJUZXh0ID0gdGV4dC5ib2R5XG5cbiAgICByZXR1cm4gdFxuICB9XG5cbiAgX2RlZmF1bHRPcHRpb25zKCkge1xuICAgIHJldHVybiB7XG4gICAgICB0ZXh0OiB7XG4gICAgICAgIHdlaWdodDogJ2JvbGQnLFxuICAgICAgICBzaXplICA6IDU2LFxuICAgICAgICBjb2xvciA6ICcjMDAwJyxcbiAgICAgICAgc2hhZG93OiAnI2ZmZicsXG4gICAgICAgIGNsYXNzTmFtZTogJ2Zsb3dseS10ZXh0JyxcbiAgICAgICAgd2hpdGVTcGFjZTogJ25vd3JhcCcgfHwgJ3ByZScsXG4gICAgICAgIHpJbmRleDogMjE0NzQ4MzY0NyxcbiAgICAgIH0sXG4gICAgICBkdXJhdGlvbjogMjAwMCxcbiAgICAgIGVhc2luZzogJ2xpbmVhcicsXG4gICAgICBkaXJlY3Rpb246ICdob3Jpem9udGFsJyxcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBGbG93bHlcbiJdfQ==
