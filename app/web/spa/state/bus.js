// Простая шина событий: on (подписаться) и emit (отправить событие)
const listeners = {};

export const bus = {
  on(eventName, handler) {
    if (!listeners[eventName]) {
      listeners[eventName] = [];
    }
    listeners[eventName].push(handler);
  },

  emit(eventName, payload) {
    if (!listeners[eventName]) {
      return;
    }
    listeners[eventName].forEach((handler) => handler(payload));
  },
};
