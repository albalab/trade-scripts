(function() {
    'use strict';

    window.sendLimitOrder = async function(volume, price, ticker, exchange, side, portfolio) {
        const orderDetails = {
            side: side,
            quantity: volume,
            price: price,
            instrument: {
                symbol: ticker,
                exchange: exchange,
                instrumentGroup: "TQBR"
            },
            user: { portfolio: portfolio },
            timeInForce: "oneday",
            comment: "Отправлено с фронта"
        };

        try {
            const response = await fetch('http://localhost:8123/limit-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderDetails)
            });
            const data = await response.json();
            console.log("Ответ сервера:", data);
        } catch (error) {
            console.error("Ошибка при отправке лимитного ордера:", error.message);
        }
    };
    
})();
