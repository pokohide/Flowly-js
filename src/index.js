import { rand } from './utils'

class Flowly {
  constructor(elem, options = {}) {
    this.app = document.querySelector(elem)
    this.rect = this.app.getBoundingClientRect()
    this.opts = Object.assign(this._defaultOptions(), options)

    this.app.style.position = 'relative'
    this.app.style.overflow = 'hidden'
  }

  addText(text) {
    const t = this._createText(text)
    this.app.appendChild(t)

    let effect
    if (this.opts.direction === 'horizontal') {
      effect = [{
        left: `${this.rect.width}px`
      }, {
        left: `${-t.clientWidth}px`
      }]
    } else if (this.opts.direction === 'vertical') {
      effect = []
    }

    let timing = {}
    timing.iterations = 1
    timing.duration = (text.duration || this.opts.duration) * (this.app.clientWidth + t.offsetWidth) / this.app.clientWidth
    timing.easing = text.easing || this.opts.easing

    t.animate(effect, timing).onfinish = () => {
      this.app.removeChild(t)
    }
  }

  hide() {

  }

  update(options = {}) {
    this.opts = Object.assign(this.opts, options)
  }

  _createText(text) {
    const color  = text.color  || this.opts.text.color
    const shadow = text.shadow || this.opts.text.shadow
    const size   = text.size   || this.opts.text.size
    const weight = text.weight || this.opts.text.weight
    const t = document.createElement('span')

    t.className        = text.className || this.opts.text.className
    t.style.position   = 'absolute'
    t.style.left       = `${this.rect.left + this.rect.width}px`
    t.style.top        = rand(0, this.rect.height - size) + 'px'
    t.style.fontSize   = size + 'px'
    t.style.fontWeight = weight
    t.style.color      = color
    t.style.textShadow = `-2px -2px 0px ${shadow}, -2px 2px 0px ${shadow}, 2px -2px 0px ${shadow}, 2px 2px 0px ${shadow}`
    t.style.whiteSpace = this.opts.text.whiteSpace
    t.style.zIndex     = this.opts.text.zIndex

    t.innerText = text.body

    return t
  }

  _defaultOptions() {
    return {
      text: {
        weight: 'bold',
        size  : 56,
        color : '#000',
        shadow: '#fff',
        className: 'flowly-text',
        whiteSpace: 'nowrap' || 'pre',
        zIndex: 2147483647,
      },
      duration: 2000,
      easing: 'linear',
      direction: 'horizontal',
    }
  }
}

module.exports = Flowly
