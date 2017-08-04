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
    this.texts = new Map();
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

      var token = (0, _utils.randomStr)();
      this.texts.set(token, t);

      t.animate(effect, timing).onfinish = function () {
        _this.app.removeChild(t);
        _this.texts.delete(token);
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

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvaW5kZXguanMiLCJzcmMvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0FDQUE7Ozs7SUFFTSxNO0FBQ0osa0JBQVksSUFBWixFQUFnQztBQUFBLFFBQWQsT0FBYyx1RUFBSixFQUFJOztBQUFBOztBQUM5QixTQUFLLEdBQUwsR0FBVyxTQUFTLGFBQVQsQ0FBdUIsSUFBdkIsQ0FBWDtBQUNBLFNBQUssSUFBTCxHQUFZLEtBQUssR0FBTCxDQUFTLHFCQUFULEVBQVo7QUFDQSxTQUFLLElBQUwsR0FBWSxPQUFPLE1BQVAsQ0FBYyxLQUFLLGVBQUwsRUFBZCxFQUFzQyxPQUF0QyxDQUFaOztBQUVBLFNBQUssR0FBTCxDQUFTLEtBQVQsQ0FBZSxRQUFmLEdBQTBCLFVBQTFCO0FBQ0EsU0FBSyxHQUFMLENBQVMsS0FBVCxDQUFlLFFBQWYsR0FBMEIsUUFBMUI7QUFDQSxTQUFLLEtBQUwsR0FBYSxJQUFJLEdBQUosRUFBYjtBQUNEOzs7OzRCQUVPLEksRUFBTTtBQUFBOztBQUNaLFVBQU0sSUFBSSxLQUFLLFdBQUwsQ0FBaUIsSUFBakIsQ0FBVjtBQUNBLFdBQUssR0FBTCxDQUFTLFdBQVQsQ0FBcUIsQ0FBckI7O0FBRUEsVUFBSSxlQUFKO0FBQ0EsVUFBSSxLQUFLLElBQUwsQ0FBVSxTQUFWLEtBQXdCLFlBQTVCLEVBQTBDO0FBQ3hDLFVBQUUsS0FBRixDQUFRLElBQVIsR0FBa0IsS0FBSyxJQUFMLENBQVUsSUFBVixHQUFpQixLQUFLLElBQUwsQ0FBVSxLQUE3QztBQUNBLFVBQUUsS0FBRixDQUFRLEdBQVIsR0FBZSxpQkFBSyxDQUFMLEVBQVEsS0FBSyxJQUFMLENBQVUsTUFBVixHQUFtQixFQUFFLFlBQTdCLElBQTZDLElBQTVEO0FBQ0EsaUJBQVMsQ0FBQztBQUNSLGdCQUFTLEtBQUssSUFBTCxDQUFVLEtBQW5CO0FBRFEsU0FBRCxFQUVOO0FBQ0Qs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QUksTUFBcEIsRUFBNEIsR0FBNUIsRUFBaUM7QUFDL0IsUUFBTSxTQUFTLEtBQUssTUFBTCxLQUFnQixFQUFoQixHQUFxQixDQUFwQztBQUNBLFNBQUssQ0FBQyxLQUFLLEVBQUwsR0FBVSxDQUFWLEdBQWUsS0FBSyxFQUFMLEdBQVcsU0FBUyxDQUFULEdBQWEsQ0FBeEIsR0FBNkIsTUFBN0MsRUFBc0QsUUFBdEQsQ0FBK0QsRUFBL0QsQ0FBTDtBQUNEO0FBQ0QsU0FBTyxDQUFQO0FBQ0QsQ0FQRDs7QUFTQSxPQUFPLE9BQVAsR0FBaUI7QUFDZixZQURlO0FBRWY7QUFGZSxDQUFqQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgeyByYW5kLCByYW5kb21TdHIgfSBmcm9tICcuL3V0aWxzJ1xuXG5jbGFzcyBGbG93bHkge1xuICBjb25zdHJ1Y3RvcihlbGVtLCBvcHRpb25zID0ge30pIHtcbiAgICB0aGlzLmFwcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZWxlbSlcbiAgICB0aGlzLnJlY3QgPSB0aGlzLmFwcC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgIHRoaXMub3B0cyA9IE9iamVjdC5hc3NpZ24odGhpcy5fZGVmYXVsdE9wdGlvbnMoKSwgb3B0aW9ucylcblxuICAgIHRoaXMuYXBwLnN0eWxlLnBvc2l0aW9uID0gJ3JlbGF0aXZlJ1xuICAgIHRoaXMuYXBwLnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbidcbiAgICB0aGlzLnRleHRzID0gbmV3IE1hcCgpXG4gIH1cblxuICBhZGRUZXh0KHRleHQpIHtcbiAgICBjb25zdCB0ID0gdGhpcy5fY3JlYXRlVGV4dCh0ZXh0KVxuICAgIHRoaXMuYXBwLmFwcGVuZENoaWxkKHQpXG5cbiAgICBsZXQgZWZmZWN0XG4gICAgaWYgKHRoaXMub3B0cy5kaXJlY3Rpb24gPT09ICdob3Jpem9udGFsJykge1xuICAgICAgdC5zdHlsZS5sZWZ0ID0gYCR7dGhpcy5yZWN0LmxlZnQgKyB0aGlzLnJlY3Qud2lkdGh9cHhgXG4gICAgICB0LnN0eWxlLnRvcCAgPSByYW5kKDAsIHRoaXMucmVjdC5oZWlnaHQgLSB0LmNsaWVudEhlaWdodCkgKyAncHgnXG4gICAgICBlZmZlY3QgPSBbe1xuICAgICAgICBsZWZ0OiBgJHt0aGlzLnJlY3Qud2lkdGh9cHhgXG4gICAgICB9LCB7XG4gICAgICAgIGxlZnQ6IGAkey10LmNsaWVudFdpZHRofXB4YFxuICAgICAgfV1cbiAgICB9IGVsc2UgaWYgKHRoaXMub3B0cy5kaXJlY3Rpb24gPT09ICd2ZXJ0aWNhbCcpIHtcbiAgICAgIHQuc3R5bGUubGVmdCA9IHJhbmQoMCwgdGhpcy5yZWN0LndpZHRoIC0gdC5jbGllbnRXaWR0aCkgKyAncHgnXG4gICAgICB0LnN0eWxlLnRvcCAgPSBgJHstdC5jbGllbnRIZWlnaHR9cHhgXG4gICAgICBlZmZlY3QgPSBbe1xuICAgICAgICB0b3A6IGAkey10LmNsaWVudEhlaWdodH1weGAsXG4gICAgICB9LCB7XG4gICAgICAgIHRvcDogYCR7dGhpcy5yZWN0LmhlaWdodH1weGBcbiAgICAgIH1dXG4gICAgfVxuXG4gICAgbGV0IHRpbWluZyA9IHt9XG4gICAgdGltaW5nLml0ZXJhdGlvbnMgPSAxXG4gICAgdGltaW5nLmR1cmF0aW9uID0gKHRleHQuZHVyYXRpb24gfHwgdGhpcy5vcHRzLmR1cmF0aW9uKSAqICh0aGlzLmFwcC5jbGllbnRXaWR0aCArIHQub2Zmc2V0V2lkdGgpIC8gdGhpcy5hcHAuY2xpZW50V2lkdGhcbiAgICB0aW1pbmcuZWFzaW5nID0gdGV4dC5lYXNpbmcgfHwgdGhpcy5vcHRzLmVhc2luZ1xuXG4gICAgY29uc3QgdG9rZW4gPSByYW5kb21TdHIoKVxuICAgIHRoaXMudGV4dHMuc2V0KHRva2VuLCB0KVxuXG4gICAgdC5hbmltYXRlKGVmZmVjdCwgdGltaW5nKS5vbmZpbmlzaCA9ICgpID0+IHtcbiAgICAgIHRoaXMuYXBwLnJlbW92ZUNoaWxkKHQpXG4gICAgICB0aGlzLnRleHRzLmRlbGV0ZSh0b2tlbilcbiAgICB9XG4gIH1cblxuICAvLyBpZiB0cnVlIHNob3cgdGV4dCwgaWYgZmFsc2UgaGlkZSB0ZXh0XG4gIHRvZ2dsZShmbGFnKSB7XG4gICAgaWYgKGZsYWcpIHRoaXMuc2hvdygpXG4gICAgZWxzZSB0aGlzLmhpZGUoKVxuICB9XG5cbiAgaGlkZSgpIHtcbiAgICBmb3IgKGxldCB0ZXh0IG9mIHRoaXMudGV4dHMudmFsdWVzKCkpIHtcbiAgICAgIHRleHQuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xuICAgIH1cbiAgfVxuXG4gIHNob3coKSB7XG4gICAgZm9yIChsZXQgdGV4dCBvZiB0aGlzLnRleHRzLnZhbHVlcygpKSB7XG4gICAgICB0ZXh0LnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXG4gICAgfVxuICB9XG5cbiAgdXBkYXRlKG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnNvbGUubG9nKG9wdGlvbnMpXG4gICAgdGhpcy5vcHRzID0gT2JqZWN0LmFzc2lnbih0aGlzLm9wdHMsIG9wdGlvbnMpXG4gIH1cblxuICBfY3JlYXRlVGV4dCh0ZXh0KSB7XG4gICAgY29uc3QgY29sb3IgID0gdGV4dC5jb2xvciAgfHwgdGhpcy5vcHRzLnRleHQuY29sb3JcbiAgICBjb25zdCBzaGFkb3cgPSB0ZXh0LnNoYWRvdyB8fCB0aGlzLm9wdHMudGV4dC5zaGFkb3dcbiAgICBjb25zdCBzaXplICAgPSB0ZXh0LnNpemUgICB8fCB0aGlzLm9wdHMudGV4dC5zaXplXG4gICAgY29uc3Qgd2VpZ2h0ID0gdGV4dC53ZWlnaHQgfHwgdGhpcy5vcHRzLnRleHQud2VpZ2h0XG4gICAgY29uc3QgdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxuXG4gICAgdC5jbGFzc05hbWUgICAgICAgID0gdGV4dC5jbGFzc05hbWUgfHwgdGhpcy5vcHRzLnRleHQuY2xhc3NOYW1lXG4gICAgdC5zdHlsZS5wb3NpdGlvbiAgID0gJ2Fic29sdXRlJ1xuICAgIHQuc3R5bGUuZm9udFNpemUgICA9IHNpemUgKyAncHgnXG4gICAgdC5zdHlsZS5mb250V2VpZ2h0ID0gd2VpZ2h0XG4gICAgdC5zdHlsZS5jb2xvciAgICAgID0gY29sb3JcbiAgICB0LnN0eWxlLnRleHRTaGFkb3cgPSBgLTJweCAtMnB4IDBweCAke3NoYWRvd30sIC0ycHggMnB4IDBweCAke3NoYWRvd30sIDJweCAtMnB4IDBweCAke3NoYWRvd30sIDJweCAycHggMHB4ICR7c2hhZG93fWBcbiAgICB0LnN0eWxlLndoaXRlU3BhY2UgPSB0aGlzLm9wdHMudGV4dC53aGl0ZVNwYWNlXG4gICAgdC5zdHlsZS56SW5kZXggICAgID0gdGhpcy5vcHRzLnRleHQuekluZGV4XG5cbiAgICB0LmlubmVyVGV4dCA9IHRleHQuYm9keVxuXG4gICAgcmV0dXJuIHRcbiAgfVxuXG4gIF9kZWZhdWx0T3B0aW9ucygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdGV4dDoge1xuICAgICAgICB3ZWlnaHQ6ICdib2xkJyxcbiAgICAgICAgc2l6ZSAgOiA1NixcbiAgICAgICAgY29sb3IgOiAnIzAwMCcsXG4gICAgICAgIHNoYWRvdzogJyNmZmYnLFxuICAgICAgICBjbGFzc05hbWU6ICdmbG93bHktdGV4dCcsXG4gICAgICAgIHdoaXRlU3BhY2U6ICdub3dyYXAnIHx8ICdwcmUnLFxuICAgICAgICB6SW5kZXg6IDIxNDc0ODM2NDcsXG4gICAgICB9LFxuICAgICAgZHVyYXRpb246IDIwMDAsXG4gICAgICBlYXNpbmc6ICdsaW5lYXInLFxuICAgICAgZGlyZWN0aW9uOiAnaG9yaXpvbnRhbCcsXG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gRmxvd2x5XG4iLCJjb25zdCByYW5kID0gKG1pbiwgbWF4KSA9PiB7XG4gIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluKSArIG1pbilcbn1cblxuY29uc3QgcmFuZG9tU3RyID0gKGxlbmd0aCA9IDMyKSA9PiB7XG4gIGxldCBzID0gJydcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IHJhbmRvbSA9IE1hdGgucmFuZG9tKCkgKiAxNiB8IDBcbiAgICBzICs9IChpID09IDEyID8gNCA6IChpID09IDE2ID8gKHJhbmRvbSAmIDMgfCA4KSA6IHJhbmRvbSkpLnRvU3RyaW5nKDE2KVxuICB9XG4gIHJldHVybiBzXG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICByYW5kLFxuICByYW5kb21TdHJcbn1cbiJdfQ==
