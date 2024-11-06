(function () {
    'use strict';

    const triggerTicker = "CHMF";

    const allowedTickers = ['SBER', 'LKOH', 'NVTK', 'CHMF'];

    if (!allowedTickers.includes(triggerTicker)) return;


    setInterval(() => {
        console.log(window.alorTrade);
    }, 3000);

    // Создаем прокси для window.alorTrade
    window.alorTrade = new Proxy(window.alorTrade || {}, {
        set(target, property, value) {
            // Устанавливаем новое значение свойства
            target[property] = value;

            // Выводим обновленный объект в консоль
            console.log('alorTrade обновлен:', target);

            // Сообщаем об успешной записи значения
            return true;
        }
    });


    //window.sendLimitOrder(1, 1150, 'CHMF', 'MOEX', 'buy', 'D88141');

})();