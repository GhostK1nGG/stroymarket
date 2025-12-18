// app_api.js — ЛР3: SPA, работающая с реальным API Yii2

import { AppApi } from './components/AppApi.js';
import { ProductApiService } from './services/products.api.js';
import { bus } from './state/bus.js';

function init() {
  const app = new AppApi({
    listRoot: document.getElementById('items-list'),
    formElement: document.getElementById('item-form'),
    bannerRoot: document.getElementById('banner'),
    totalCountEl: document.getElementById('total-count'),
    service: new ProductApiService(),
    bus,
  });

  app.init();
}

document.addEventListener('DOMContentLoaded', init);
