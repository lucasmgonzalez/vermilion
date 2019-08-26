module.exports = {
  ucfirst: (string) => typeof string === 'string' ? `${string.charAt(0).toUpperCase()}${string.substring(1)}` : ''
}
