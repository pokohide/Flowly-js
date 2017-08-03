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
    key: 'hide',
    value: function hide() {}
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
      t.style.top = (0, _utils.rand)(0, this.rect.height - size) + 'px';
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvaW5kZXguanMiLCJzcmMvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0FDQUE7Ozs7SUFFTSxNO0FBQ0osa0JBQVksSUFBWixFQUFnQztBQUFBLFFBQWQsT0FBYyx1RUFBSixFQUFJOztBQUFBOztBQUM5QixTQUFLLEdBQUwsR0FBVyxTQUFTLGFBQVQsQ0FBdUIsSUFBdkIsQ0FBWDtBQUNBLFNBQUssSUFBTCxHQUFZLEtBQUssR0FBTCxDQUFTLHFCQUFULEVBQVo7QUFDQSxTQUFLLElBQUwsR0FBWSxPQUFPLE1BQVAsQ0FBYyxLQUFLLGVBQUwsRUFBZCxFQUFzQyxPQUF0QyxDQUFaOztBQUVBLFNBQUssR0FBTCxDQUFTLEtBQVQsQ0FBZSxRQUFmLEdBQTBCLFVBQTFCO0FBQ0EsU0FBSyxHQUFMLENBQVMsS0FBVCxDQUFlLFFBQWYsR0FBMEIsUUFBMUI7QUFDRDs7Ozs0QkFFTyxJLEVBQU07QUFBQTs7QUFDWixVQUFNLElBQUksS0FBSyxXQUFMLENBQWlCLElBQWpCLENBQVY7QUFDQSxXQUFLLEdBQUwsQ0FBUyxXQUFULENBQXFCLENBQXJCOztBQUVBLFVBQUksZUFBSjtBQUNBLFVBQUksS0FBSyxJQUFMLENBQVUsU0FBVixLQUF3QixZQUE1QixFQUEwQztBQUN4QyxpQkFBUyxDQUFDO0FBQ1IsZ0JBQVMsS0FBSyxJQUFMLENBQVUsS0FBbkI7QUFEUSxTQUFELEVBRU47QUFDRCxnQkFBUyxDQUFDLEVBQUUsV0FBWjtBQURDLFNBRk0sQ0FBVDtBQUtELE9BTkQsTUFNTyxJQUFJLEtBQUssSUFBTCxDQUFVLFNBQVYsS0FBd0IsVUFBNUIsRUFBd0M7QUFDN0MsaUJBQVMsRUFBVDtBQUNEOztBQUVELFVBQUksU0FBUyxFQUFiO0FBQ0EsYUFBTyxVQUFQLEdBQW9CLENBQXBCO0FBQ0EsYUFBTyxRQUFQLEdBQWtCLENBQUMsS0FBSyxRQUFMLElBQWlCLEtB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ZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCB7IHJhbmQgfSBmcm9tICcuL3V0aWxzJ1xuXG5jbGFzcyBGbG93bHkge1xuICBjb25zdHJ1Y3RvcihlbGVtLCBvcHRpb25zID0ge30pIHtcbiAgICB0aGlzLmFwcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZWxlbSlcbiAgICB0aGlzLnJlY3QgPSB0aGlzLmFwcC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgIHRoaXMub3B0cyA9IE9iamVjdC5hc3NpZ24odGhpcy5fZGVmYXVsdE9wdGlvbnMoKSwgb3B0aW9ucylcblxuICAgIHRoaXMuYXBwLnN0eWxlLnBvc2l0aW9uID0gJ3JlbGF0aXZlJ1xuICAgIHRoaXMuYXBwLnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbidcbiAgfVxuXG4gIGFkZFRleHQodGV4dCkge1xuICAgIGNvbnN0IHQgPSB0aGlzLl9jcmVhdGVUZXh0KHRleHQpXG4gICAgdGhpcy5hcHAuYXBwZW5kQ2hpbGQodClcblxuICAgIGxldCBlZmZlY3RcbiAgICBpZiAodGhpcy5vcHRzLmRpcmVjdGlvbiA9PT0gJ2hvcml6b250YWwnKSB7XG4gICAgICBlZmZlY3QgPSBbe1xuICAgICAgICBsZWZ0OiBgJHt0aGlzLnJlY3Qud2lkdGh9cHhgXG4gICAgICB9LCB7XG4gICAgICAgIGxlZnQ6IGAkey10LmNsaWVudFdpZHRofXB4YFxuICAgICAgfV1cbiAgICB9IGVsc2UgaWYgKHRoaXMub3B0cy5kaXJlY3Rpb24gPT09ICd2ZXJ0aWNhbCcpIHtcbiAgICAgIGVmZmVjdCA9IFtdXG4gICAgfVxuXG4gICAgbGV0IHRpbWluZyA9IHt9XG4gICAgdGltaW5nLml0ZXJhdGlvbnMgPSAxXG4gICAgdGltaW5nLmR1cmF0aW9uID0gKHRleHQuZHVyYXRpb24gfHwgdGhpcy5vcHRzLmR1cmF0aW9uKSAqICh0aGlzLmFwcC5jbGllbnRXaWR0aCArIHQub2Zmc2V0V2lkdGgpIC8gdGhpcy5hcHAuY2xpZW50V2lkdGhcbiAgICB0aW1pbmcuZWFzaW5nID0gdGV4dC5lYXNpbmcgfHwgdGhpcy5vcHRzLmVhc2luZ1xuXG4gICAgdC5hbmltYXRlKGVmZmVjdCwgdGltaW5nKS5vbmZpbmlzaCA9ICgpID0+IHtcbiAgICAgIHRoaXMuYXBwLnJlbW92ZUNoaWxkKHQpXG4gICAgfVxuICB9XG5cbiAgaGlkZSgpIHtcblxuICB9XG5cbiAgdXBkYXRlKG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMub3B0cyA9IE9iamVjdC5hc3NpZ24odGhpcy5vcHRzLCBvcHRpb25zKVxuICB9XG5cbiAgX2NyZWF0ZVRleHQodGV4dCkge1xuICAgIGNvbnN0IGNvbG9yICA9IHRleHQuY29sb3IgIHx8IHRoaXMub3B0cy50ZXh0LmNvbG9yXG4gICAgY29uc3Qgc2hhZG93ID0gdGV4dC5zaGFkb3cgfHwgdGhpcy5vcHRzLnRleHQuc2hhZG93XG4gICAgY29uc3Qgc2l6ZSAgID0gdGV4dC5zaXplICAgfHwgdGhpcy5vcHRzLnRleHQuc2l6ZVxuICAgIGNvbnN0IHdlaWdodCA9IHRleHQud2VpZ2h0IHx8IHRoaXMub3B0cy50ZXh0LndlaWdodFxuICAgIGNvbnN0IHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcblxuICAgIHQuY2xhc3NOYW1lICAgICAgICA9IHRleHQuY2xhc3NOYW1lIHx8IHRoaXMub3B0cy50ZXh0LmNsYXNzTmFtZVxuICAgIHQuc3R5bGUucG9zaXRpb24gICA9ICdhYnNvbHV0ZSdcbiAgICB0LnN0eWxlLmxlZnQgICAgICAgPSBgJHt0aGlzLnJlY3QubGVmdCArIHRoaXMucmVjdC53aWR0aH1weGBcbiAgICB0LnN0eWxlLnRvcCAgICAgICAgPSByYW5kKDAsIHRoaXMucmVjdC5oZWlnaHQgLSBzaXplKSArICdweCdcbiAgICB0LnN0eWxlLmZvbnRTaXplICAgPSBzaXplICsgJ3B4J1xuICAgIHQuc3R5bGUuZm9udFdlaWdodCA9IHdlaWdodFxuICAgIHQuc3R5bGUuY29sb3IgICAgICA9IGNvbG9yXG4gICAgdC5zdHlsZS50ZXh0U2hhZG93ID0gYC0ycHggLTJweCAwcHggJHtzaGFkb3d9LCAtMnB4IDJweCAwcHggJHtzaGFkb3d9LCAycHggLTJweCAwcHggJHtzaGFkb3d9LCAycHggMnB4IDBweCAke3NoYWRvd31gXG4gICAgdC5zdHlsZS53aGl0ZVNwYWNlID0gdGhpcy5vcHRzLnRleHQud2hpdGVTcGFjZVxuICAgIHQuc3R5bGUuekluZGV4ICAgICA9IHRoaXMub3B0cy50ZXh0LnpJbmRleFxuXG4gICAgdC5pbm5lclRleHQgPSB0ZXh0LmJvZHlcblxuICAgIHJldHVybiB0XG4gIH1cblxuICBfZGVmYXVsdE9wdGlvbnMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHRleHQ6IHtcbiAgICAgICAgd2VpZ2h0OiAnYm9sZCcsXG4gICAgICAgIHNpemUgIDogNTYsXG4gICAgICAgIGNvbG9yIDogJyMwMDAnLFxuICAgICAgICBzaGFkb3c6ICcjZmZmJyxcbiAgICAgICAgY2xhc3NOYW1lOiAnZmxvd2x5LXRleHQnLFxuICAgICAgICB3aGl0ZVNwYWNlOiAnbm93cmFwJyB8fCAncHJlJyxcbiAgICAgICAgekluZGV4OiAyMTQ3NDgzNjQ3LFxuICAgICAgfSxcbiAgICAgIGR1cmF0aW9uOiAyMDAwLFxuICAgICAgZWFzaW5nOiAnbGluZWFyJyxcbiAgICAgIGRpcmVjdGlvbjogJ2hvcml6b250YWwnLFxuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEZsb3dseVxuIiwiY29uc3QgcmFuZCA9IChtaW4sIG1heCkgPT4ge1xuICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbikgKyBtaW4pXG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICByYW5kXG59XG4iXX0=
