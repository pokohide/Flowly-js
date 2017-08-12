import { randomStr } from '../utils'

export default class Base {
  constructor() {
    this.token = randomStr()
  }

  _createEffect(elem, type) {
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

  _createTiming() {
    let timing = {}
    timing.iterations = 1
    timing.duration = 3000 // (text.duration || this.opts.duration) * (this.app.clientWidth + t.offsetWidth) / this.app.clientWidth
    timing.easing = text.easing || this.opts.easing
  }
}
