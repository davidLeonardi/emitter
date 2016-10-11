//A base class to support event emission.

export default class Emitter {

  constructor() {
    this._observers = {};
  }

  emit(eventName, payload) {
    if (this._observers[eventName]) {
      this._observers[eventName].forEach((callback) => {
        callback(payload);
      });
    }
  }

  on(eventName, callback) {
    if (!eventName && !callback && !typeof callback === 'function') {
      return;
    }

    if (!this._observers[eventName]) {
      this._observers[eventName] = [];
    }

    this._observers[eventName].push(callback);
    let handlerPosition = this._observers[eventName].length - 1;
    return {
      remove: () => {
        this._observers[eventName].splice(handlerPosition, 1);
      }
    };
  }

}
