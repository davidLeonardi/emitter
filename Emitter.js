//A base class to support event emission.

/*globals CustomEvent*/

if (!(window.CustomEvent instanceof Function)) {
  //polyfill for IE
  let PolyfillCustomEvent = function(event, eventInit) {
    eventInit = eventInit || {};
    var newEvent = document.createEvent('CustomEvent');
    newEvent.initCustomEvent(event, eventInit.bubbles || false, eventInit.cancelable || false, eventInit.detail || undefined);
    return newEvent;
  };

  PolyfillCustomEvent.prototype = window.Event.prototype;
  window.CustomEvent = PolyfillCustomEvent;
}

let observers = Symbol();

export default class Emitter {

  constructor() {
    this[observers] = {};
  }

  dispatchEvent(customEvent) {
    if (!(customEvent instanceof CustomEvent) || !this[observers][customEvent.type]) { return false; }

    this[observers][customEvent.type].forEach((callback) => {
      callback(customEvent);
    });
    return true;
  }

  addEventListener(eventName, callback) {
    if (!eventName || !callback || !(callback instanceof Function)) {
      return null;
    }

    this[observers][eventName] = this[observers][eventName] || [];

    let handlerPosition = this[observers][eventName].push(callback) - 1;
    return {
      remove: () => {
        this[observers][eventName].splice(handlerPosition, 1);
      }
    };
  }
}

