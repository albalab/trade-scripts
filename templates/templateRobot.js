(function () {
    'use strict';

    const triggerTicker = "CHMF";

    const allowedTickers = ['SBER', 'LKOH', 'NVTK', 'CHMF'];

    if (!allowedTickers.includes(triggerTicker)) return;


    /*setInterval(() => {
        console.log(window.alorTrade);
    }, 3000);*/

    const checkAlorTradeInterval = setInterval(() => {
        // Проверяем доступность window.alorTrade
        if (window.alorTrade) {
            // Как только объект становится доступен, устанавливаем прокси
            window.alorTrade = new Proxy(window.alorTrade, {
                set(target, property, value) {
                    // Устанавливаем новое значение свойства
                    target[property] = value;

                    // Выводим обновленный объект в консоль
                    console.log('alorTrade обновлен:', target);

                    // Сообщаем об успешной записи значения
                    return true;
                }
            });

            // Очищаем таймер, так как прокси уже установлен
            clearInterval(checkAlorTradeInterval);
            console.log("Прокси для alorTrade установлен.");
        }
    }, 1000); // Проверяем каждые 100 миллисекунд



    //window.sendLimitOrder(1, 1150, 'CHMF', 'MOEX', 'buy', 'D88141');

})();