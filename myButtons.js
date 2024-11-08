

    // Создаем контейнер для кнопок
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.bottom = '10px';
    container.style.right = '10px';
    container.style.zIndex = '1000';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '10px';

    // Кнопка для лимитной покупки
    const buyButton = document.createElement('button');
    buyButton.innerText = 'Нажать "Лим. покупка"';
    buyButton.style.padding = '10px';
    buyButton.style.backgroundColor = '#28a745';
    buyButton.style.color = 'white';
    buyButton.style.border = 'none';
    buyButton.style.borderRadius = '5px';
    buyButton.style.cursor = 'pointer';

    // Кнопка для лимитной продажи
    const sellButton = document.createElement('button');
    sellButton.innerText = 'Нажать "Лим. продажа"';
    sellButton.style.padding = '10px';
    sellButton.style.backgroundColor = '#dc3545';
    sellButton.style.color = 'white';
    sellButton.style.border = 'none';
    sellButton.style.borderRadius = '5px';
    sellButton.style.cursor = 'pointer';

    // Кнопка для лимитной покупки по лучшей цене
    const bestBuyButton = document.createElement('button');
    bestBuyButton.innerText = 'Лим. покупка по лучшей цене';
    bestBuyButton.style.padding = '10px';
    bestBuyButton.style.backgroundColor = '#17a2b8';
    bestBuyButton.style.color = 'white';
    bestBuyButton.style.border = 'none';
    bestBuyButton.style.borderRadius = '5px';
    bestBuyButton.style.cursor = 'pointer';

    // Кнопка для лимитной продажи по лучшей цене
    const bestSellButton = document.createElement('button');
    bestSellButton.innerText = 'Лим. продажа по лучшей цене';
    bestSellButton.style.padding = '10px';
    bestSellButton.style.backgroundColor = '#ffc107';
    bestSellButton.style.color = 'white';
    bestSellButton.style.border = 'none';
    bestSellButton.style.borderRadius = '5px';
    bestSellButton.style.cursor = 'pointer';

    // Функция для получения лучших цен
    function getBestPrices() {
        const bestOfferContainer = document.querySelector('.src-modules-CombinedOrder-components-BestOffer-styles-bestOfferBlock-48980');
        if (!bestOfferContainer) return { bestBuyPrice: null, bestSellPrice: null };

        const bestBuyPriceEl = bestOfferContainer.querySelector('.src-modules-CombinedOrder-components-BestOffer-styles-tagBid-17ced .pro-tag-content');
        const bestSellPriceEl = bestOfferContainer.querySelector('.src-modules-CombinedOrder-components-BestOffer-styles-tagAsk-52d6a .pro-tag-content');

        const bestBuyPrice = bestBuyPriceEl ? bestBuyPriceEl.textContent.trim() : null;
        const bestSellPrice = bestSellPriceEl ? bestSellPriceEl.textContent.trim() : null;

        return { bestBuyPrice, bestSellPrice };
    }

    // Обработчик для кнопки покупки
    buyButton.addEventListener('click', function() {
        const button = document.querySelector('button[data-jpt="buy"][data-order="limit"]');
        if (button) {
            button.click();
        } else {
            alert('Кнопка "Лим. покупка" не найдена!');
        }
    });

    // Обработчик для кнопки продажи
    sellButton.addEventListener('click', function() {
        const button = document.querySelector('button[data-jpt="sell"][data-order="limit"]');
        if (button) {
            button.click();
        } else {
            alert('Кнопка "Лим. продажа" не найдена!');
        }
    });

    // Обработчик для лимитной покупки по лучшей цене
    bestBuyButton.addEventListener('click', function() {
        const { bestBuyPrice } = getBestPrices();
        if (bestBuyPrice) {
            const priceInput = document.querySelector('#ORDER_PRICE_INPUT');
            priceInput.value = bestBuyPrice;  // Подставляем цену с запятой как есть
            priceInput.dispatchEvent(new Event('input'));  // Обновляем событие ввода
        } else {
            alert('Лучшая цена покупки не найдена!');
        }
    });

    // Обработчик для лимитной продажи по лучшей цене
    bestSellButton.addEventListener('click', function() {
        const { bestSellPrice } = getBestPrices();
        if (bestSellPrice) {
            const priceInput = document.querySelector('#ORDER_PRICE_INPUT');
            priceInput.value = bestSellPrice;  // Подставляем цену с запятой как есть
            priceInput.dispatchEvent(new Event('input'));  // Обновляем событие ввода
        } else {
            alert('Лучшая цена продажи не найдена!');
        }
    });

    // Добавляем кнопки в контейнер, а контейнер в тело документа
    container.appendChild(buyButton);
    container.appendChild(sellButton);
    container.appendChild(bestBuyButton);
    container.appendChild(bestSellButton);
    document.body.appendChild(container);


