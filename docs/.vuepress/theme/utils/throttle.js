export function throttle (fn, wait, maxTimelong) {
  var timeout = null,
    startTime = Date.parse(new Date())
  return function () {
    if (timeout !== null) clearTimeout(timeout)
    var curTime = Date.parse(new Date())
    if (curTime - startTime >= maxTimelong) {
      fn.call(this)
      startTime = curTime
    } else {
      timeout = setTimeout(fn.bind(this), wait)
    }
  }
}