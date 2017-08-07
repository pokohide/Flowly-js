import elementResizeEvent from 'element-resize-event'
//import FlowlyText from 'flowly/text'
import { rand, randomStr } from './utils'

class Flowly {
  constructor(elem, options = {}) {
    /* APP */
    this.elem = elem
    this.app = document.querySelector(elem)
    this.app.style.position = 'relative'
    this.app.style.overflow = 'hidden'

    this.rect = this.app.getBoundingClientRect()
    this.opts = Object.assign(this._defaultOptions(), options)

    this.elems = new Map()
    elementResizeEvent(this.app, () => { this.resize() })
  }

  addImage(image) {
    if (this.opts.disable) return

    const t = this._createImage(image)
  }

  addText(text) {
    if (this.opts.disable) return

    const t = this._createText(text)
    this.app.appendChild(t)

    const effect = this._effect(t, this.opts.direction)

    let timing = {}
    timing.iterations = 1
    timing.duration = (text.duration || this.opts.duration) * (this.app.clientWidth + t.offsetWidth) / this.app.clientWidth
    timing.easing = text.easing || this.opts.easing

    const token = randomStr()
    this.elems.set(token, t)

    t.animate(effect, timing).onfinish = () => {
      this.app.removeChild(t)
      this.elems.delete(token)
    }
  }

  // if true show text, if false hide text
  toggle(flag) {
    if (flag) this.show()
    else this.hide()
  }

  hide() {
    for (let elem of this.elems.values()) {
      elem.style.display = 'none'
    }
  }

  show() {
    for (let elem of this.elems.values()) {
      elem.style.display = 'block'
    }
  }

  resize() {
    this.app = document.querySelector(this.elem)
    this.app.style.position = 'relative'
    this.app.style.overflow = 'hidden'
    this.rect = this.app.getBoundingClientRect()
  }

  update(options = {}) {
    this.opts = Object.assign(this.opts, options)
  }

  unbind() {
    elementResizeEvent.unbind(this.app)
    this.update({ disable: true })
  }

  _createText(text) {
    const color  = text.color  || this.opts.text.color
    const shadow = text.shadow || this.opts.text.shadow
    const size   = text.size   || this.opts.text.size
    const weight = text.weight || this.opts.text.weight
    const t = document.createElement('span')

    t.className        = text.className || this.opts.text.className
    t.style.position   = 'absolute'
    t.style.fontSize   = size + 'px'
    t.style.fontWeight = weight
    t.style.color      = color
    t.style.textShadow = `-2px -2px 0px ${shadow}, -2px 2px 0px ${shadow}, 2px -2px 0px ${shadow}, 2px 2px 0px ${shadow}`
    t.style.whiteSpace = this.opts.text.whiteSpace
    t.style.zIndex     = this.opts.text.zIndex

    t.innerText = text.body

    return t
  }

  _createImage(image) {
    const t = document.createElement('img')

    t.style.position = 'fixed'
    t.style.width  = image.width
    t.style.height = image.height
    t.style.zIndex = 2147483647
    t.style.left   = this.rect.width + t.clientWidth + 'px'
    t.style.top    = rand(this.rect.top, this.rect.height - t.clientHeight) + 'px'

    t.addEventListener('load', (e) => {
      const effect = this._effect(t, this.opts.direction)

      let timing = {}
      timing.iterations = 1
      timing.duration = (image.duration || this.opts.duration) * (this.app.clientWidth + t.offsetWidth) / this.app.clientWidth
      timing.easing = image.easing || this.opts.easing

      const token = randomStr()
      this.elems.set(token, t)

      t.animate(effect, timing).onfinish = () => {
        this.app.removeChild(t)
        this.elems.delete(token)
      }
    })

    t.src = image.url
    this.app.appendChild(t)
    return t
  }

  _effect(elem, type) {
    if (type === 'horizontal') {
      elem.style.left = (this.rect.left + this.rect.width) + 'px'
      elem.style.top  = rand(0, this.rect.height - elem.clientHeight) + 'px'

      return [{
        left: this.rect.width + 'px'
      }, {
        left: (-elem.clientWidth) + 'px'
      }]
    } else if (type === 'vertical') {
      elem.style.left = rand(0, this.rect.width - elem.clientWidth) + 'px'
      elem.style.top  = (-elem.clientWidth) + 'px'

      return [{
        top: (-elem.clientHeight) + 'px'
      }, {
        top: this.rect.height + 'px'
      }]
    } else if (type === 'random') {
      elem.style.opacity = 0.0
      elem.style.left    = rand(0, this.rect.width) - elem.clientWidth / 2 + 'px'
      elem.style.top     = rand(0, this.rect.height) - elem.clientHeight / 2 + 'px'

      return [{
        opacity: 0.0,
        transform: 'scale(0.2, 0.2) translate(0, 20px)'
      }, {
        opacity: 1.0,
        transform: 'scale(0.5, 0.5) translate(0, 0px)'
      }, {
        opacity: 0.0,
        transform: 'scale(1.0, 1.0) translate(0, -50px)'
      }]
    }
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
      disable: false,
      duration: 2000,
      easing: 'linear',
      direction: 'horizontal',
    }
  }
}

module.exports = Flowly
