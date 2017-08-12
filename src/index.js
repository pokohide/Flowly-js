import elementResizeEvent from 'element-resize-event'
import FlowlyText from './flowly/text'
import FlowlyImage from './flowly/image'
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

    const t = new FlowlyImage(image, this.opts)
    this.app.appendChild(t.elem)
    t.onload((e) => {
      this.elems.set(t.token, t)

      t.addAnimation(image, this.rect, () => {
        this.app.removeChild(t.elem)
        this.elems.delete(t.token)
      })
    })
  }

  addText(text) {
    if (this.opts.disable) return

    const t = new FlowlyText(text, this.opts)
    this.app.appendChild(t.elem)
    this.elems.set(t.token, t)

    t.addAnimation(text, this.rect, () => {
      this.app.removeChild(t.elem)
      this.elems.delete(t.token)
    })
  }

  // if true show text, if false hide text
  toggle(flag) {
    if (flag) this.show()
    else this.hide()
  }

  hide() {
    for (let elem of this.elems.values()) elem.hide()
  }

  show() {
    for (let elem of this.elems.values()) elem.show()
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
      image: {
        height: '200px',
        width : 'auto',
        className: 'flowly-image',
      },
      disable: false,
      duration: 2000,
      easing: 'linear',
      direction: 'horizontal',
    }
  }
}

module.exports = Flowly
