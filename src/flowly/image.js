import Base from './base'

export default class FlowlyImage extends Base {
  constructor(image, options) {
    super(options)
    this.elem = this._createImage(image)
  }

  _createImage(image) {
    const t = document.createElement('img')

    t.style.position = 'absolute'
    t.className      = image.className || this.opts.image.className
    t.style.width    = image.width  || this.opts.image.width
    t.style.height   = image.height || this.opts.image.height
    t.style.zIndex   = 2147483647
    t.src = image.url
    return t
  }

  onload(func) {
    this.elem.addEventListener('load', func)
  }

  addAnimation(image, rect, onfinish) {
    const effect = this._createEffect(this.elem, rect, this.opts.direction)
    const timing = this._createTiming(image)

    this.elem.animate(effect, timing).onfinish = onfinish
  }
}
