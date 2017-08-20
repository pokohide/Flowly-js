import { rand, randomStr } from '../utils'

export default class Base {
  constructor(opts) {
    this.token = randomStr()
    this.opts = opts
  }

  _createEffect(elem, rect, type) {
    const { padding } = this.opts

    switch (type) {
      case 'right':

        elem.style.left = (rect.left + rect.width) + 'px'
        elem.style.top = rand(padding.top, rect.height - elem.clientHeight - padding.bottom) + 'px'

        return [{
          left: rect.width + 'px'
        }, {
          left: (-elem.clientWidth) + 'px'
        }]

      case 'left':

        elem.style.left = (-elem.clientWidth) + 'px'
        elem.style.top  = rand(padding.top, rect.height - elem.clientHeight - padding.bottom) + 'px'

        return [{
          left: (-elem.clientWidth) + 'px'
        }, {
          left: rect.width + 'px'
        }]

      case 'top':

        elem.style.left = rand(0, rect.width - elem.clientWidth) + 'px'
        elem.style.top  = (-elem.clientWidth) + 'px'

        return [{
          top: (-elem.clientHeight) + 'px'
        }, {
          top: rect.height + 'px'
        }]

      case 'bottom':

        elem.style.left = rand(0, rect.width - elem.clientWidth) + 'px'
        elem.style.top  = rect.height + 'px'

        return [{
          top: rect.height + 'px'
        }, {
          top: (-elem.clientHeight) + 'px'
        }]
      case 'top-right':

        break
      case 'top-left':

        break
      case 'bottom-right':

        break
      case 'bottom-left':

        break
      case 'random':

        elem.style.opacity = 0.0
        elem.style.left    = rand(0, rect.width) - elem.clientWidth / 2 + 'px'
        elem.style.top     = rand(0, rect.height) - elem.clientHeight / 2 + 'px'

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

  _createTiming(rect, { duration, easing }) {
    let timing = {}
    timing.iterations = 1
    timing.duration   = parseInt(duration || this.opts.duration, 10) * (rect.width + this.elem.offsetWidth) / rect.width
    timing.easing     = easing || this.opts.easing

    return timing
  }

  hide() {
    this.elem.style.display = 'none'
  }

  show() {
    this.elem.style.display = 'block'
  }
}
