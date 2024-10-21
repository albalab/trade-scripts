(function() {
    'use strict';

    const iframe = document.createElement('iframe');
    iframe.setAttribute('ref', 'chartIframe');
    iframe.src = 'http://127.0.0.1:8080/#/candles-chart-iframe';

    // Устанавливаем стили для фиксированного позиционирования
    iframe.style.position = 'fixed'; // Фиксированное позиционирование
    iframe.style.top = '0';           // Отступ сверху
    iframe.style.left = '0';          // Отступ слева
    iframe.style.width = '800px';     // Ширина iframe
    iframe.style.height = '600px';    // Высота iframe
    iframe.style.border = 'none';     // Убираем границу
    iframe.style.zIndex = '1000';     // Устанавливаем высокий z-index

    // Вставляем iframe в конец body
    document.body.appendChild(iframe);
})();