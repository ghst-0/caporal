function stripColor(str) {
  return str.replaceAll(/\x1B\[[0-9]+m/ig, '')
}

export { stripColor }
