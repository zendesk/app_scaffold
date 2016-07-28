class Storage {
  constructor(scope) {
    this.scope = scope;
  }

  get(key) {
    return JSON.parse(localStorage.getItem(key));
  }

  set(keyOrObject, value) {
    if (typeof keyOrObject === 'string') {
      let key = `${this.scope}:${keyOrObject}`;
      localStorage.setItem(key, JSON.stringify(value));
    } else if (typeof keyOrObject === 'object') {
      Object.keys(keyOrObject).forEach(function(key) {
        localStorage.setItem(`${this.scope}:${key}`, JSON.stringify(keyOrObject[key]));
      });
    }
  }
}

export default Storage;
