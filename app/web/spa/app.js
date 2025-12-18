// web/spa/app.js (ЛР2, моки, без API)

import { App } from './components/App.js';
import { MockProductService } from './services/products.mock.js';
import { bus } from './state/bus.js';

function init() {
  const app = new App({
    listRoot: document.getElementById('items-list'),
    formElement: document.getElementById('item-form'),
    bannerRoot: document.getElementById('banner'),
    totalCountEl: document.getElementById('total-count'),
    service: new MockProductService(),
    bus,
  });

  app.init();
}

document.addEventListener('DOMContentLoaded', init);
