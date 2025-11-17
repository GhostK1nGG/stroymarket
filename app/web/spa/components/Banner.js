import { bus } from '../state/bus.js';

export class Banner {
  constructor(rootElement) {
    this.rootElement = rootElement;

    // Подписываемся на события
    bus.on('banner:info', (msg) => this.showInfo(msg));
    bus.on('banner:error', (msg) => this.showError(msg));
    bus.on('banner:clear', () => this.clear());

    // Начально скрыт
    this.clear();
  }

  showInfo(message) {
    this.rootElement.textContent = message;
    this.rootElement.className = 'banner banner--info';
  }

  showError(message) {
    this.rootElement.textContent = message;
    this.rootElement.className = 'banner banner--error';
  }

  clear() {
    this.rootElement.textContent = '';
    this.rootElement.className = 'banner banner--hidden';
  }
}
