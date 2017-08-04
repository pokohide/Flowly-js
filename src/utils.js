const rand = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min)
}

const randomStr = (length = 32) => {
  let s = ''
  for (let i = 0; i < length; i++) {
    const random = Math.random() * 16 | 0
    s += (i == 12 ? 4 : (i == 16 ? (random & 3 | 8) : random)).toString(16)
  }
  return s
}

module.exports = {
  rand,
  randomStr
}
