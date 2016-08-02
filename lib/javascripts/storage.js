class Storage {
  constructor(namespace) {
    this.namespace = namespace;
  }

  get(key) {
    return JSON.parse(localStorage.getItem(`${this.namespace}:${key}`));
  }

  set(keyOrObject, value) {
    if (typeof keyOrObject === 'string') {
      let key = `${this.namespace}:${keyOrObject}`;
      localStorage.setItem(key, JSON.stringify(value));
    } else if (typeof keyOrObject === 'object') {
      Object.keys(keyOrObject).forEach(key => {
        localStorage.setItem(`${this.namespace}:${key}`, JSON.stringify(keyOrObject[key]));
      });
    }
  }
}

export default Storage;
