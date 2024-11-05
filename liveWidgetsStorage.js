(function () {
    'use strict';

    // Используем глобальное хранилище
    const storage = window.myGlobalStorage;

    // Проверка и инициализация объекта widgetsStorage
    if (!storage.widgetsStorage) {
        storage.widgetsStorage = {};
    }


    const enabledWidgets = [
        'TRADES_WIDGET',
        'ORDERBOOK_WIDGET',
        //'MARKET_WIDGET',
        //'PULSE_WIDGET',
        'LIGHT_TV_WIDGET',
        'CHART_TV_WIDGET',
    ];

    // Функция для получения данных о тикерах
    function parseOkoScreener(okoScreenerWidget) {

        if (!okoScreenerWidget) {
            console.error('Элемент oko_screener не найден.');
            return;
        }

        const tableBody = okoScreenerWidget.querySelector('tbody');
        if (!tableBody) return;


        const rows = tableBody.querySelectorAll('tr');
        const tickers = [];

        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length === 6) {
                const ticker = {
                    ticker: cells[0].innerText.trim(),
                    groups: [...cells[1].querySelectorAll('div')].map(div => div.style.background),
                    lastPrice: cells[2].innerText.trim(),
                    priceChange: cells[3].innerText.trim(),
                    volume: cells[4].innerText.trim(),
                    time: cells[5].innerText.trim()
                };
                tickers.push(ticker);
            }
        });

        if (tickers.length > 0) {
            //const latestTicker = tickers[0].ticker; // Получение последнего тикера (первый элемент в массиве)
            //console.log('Tickers:', tickers);

            return tickers;

        }
    }

    function parseOrderBookData(orderBookWidget) {

        // Проверяем, что контейнер найден
        if (!orderBookWidget) {
            console.error('Элемент ORDERBOOK_WIDGET не найден.');
            return;
        }

        // Извлекаем тикер из data-symbol-id
        const ticker = orderBookWidget.getAttribute('data-symbol-id');

        // Находим элементы с заявками на покупку (цены и объемы)
        const bidsPricesElement = orderBookWidget.querySelector('.bidsPrices');
        const bidsQuantityElement = orderBookWidget.querySelector('.bidsQuantity');

        // Находим элементы с заявками на продажу (цены и объемы)
        const asksPricesElement = orderBookWidget.querySelector('.asksPricesAndYields');
        const asksQuantityElement = orderBookWidget.querySelector('.asksQuantity');

        // Проверяем, что все необходимые элементы найдены
        if (!bidsPricesElement || !bidsQuantityElement || !asksPricesElement || !asksQuantityElement) {
            console.error('Не все необходимые элементы найдены.');
            return;
        }

        // Получаем данные о заявках на покупку (цены и объемы)
        const bidsPricesArray = bidsPricesElement.textContent.trim().split(/\s+/)
            .map(price => parseFloat(price.replace(',', '.')));
        const bidsQuantityArray = bidsQuantityElement.textContent.trim().split(/\s+/)
            .map(quantity => parseInt(quantity, 10));

        // Получаем данные о заявках на продажу (цены и объемы)
        const asksPricesArray = asksPricesElement.textContent.trim().split(/\s+/)
            .map(price => parseFloat(price.replace(',', '.')));
        const asksQuantityArray = asksQuantityElement.textContent.trim().split(/\s+/)
            .map(quantity => parseInt(quantity, 10));

        // Получаем текущее время в миллисекундах
        const timestamp = Date.now();

        // Определяем максимальное количество знаков после запятой в ценах бидов
        let decimalPlaces = 0;
        bidsPricesArray.forEach(price => {
            const decimalPart = price.toString().split('.')[1];
            if (decimalPart) {
                decimalPlaces = Math.max(decimalPlaces, decimalPart.length);
            }
        });

        // Рассчитываем шаг цены
        let minPriceStep;

        if (decimalPlaces > 0) {
            minPriceStep = Math.pow(10, -decimalPlaces); // Шаг цены на основе количества знаков после запятой
        } else {
            minPriceStep = 1; // Если знаков после запятой нет, устанавливаем шаг цены равным 1
        }

        return {
            ticker,
            timestamp,
            minPriceStep, // Добавляем шаг цены
            bids: {
                prices: bidsPricesArray,
                quantities: bidsQuantityArray,
            },
            asks: {
                prices: asksPricesArray,
                quantities: asksQuantityArray,
            }
        };
    }


    // Функция для отслеживания изменений в виджете
    function trackChanges(widget) {
        const observer = new MutationObserver(mutations => {
            //console.log(`Widget ${widget.getAttribute('data-widget-id')} has been updated!`);

            // Получаем тип и HTML виджета
            const widgetId = widget.getAttribute('data-widget-id');
            const widgetHtml = widget.outerHTML;
            const widgetType = getWidgetType(widget);

            if (widgetType) {
                // Сохраняем виджет
                let data;

                if(widgetType === 'orderbook_widget') {
                    data = parseOrderBookData(widget);
                }

                if(widgetType === 'oko_screener') {
                    data = parseOkoScreener(widget);
                }

                saveWidgetToStorage(widgetId, {
                    html: widgetHtml,
                    data: data,
                    type: widgetType
                });
                // Проверяем и чистим неактивные виджеты из хранилища
                //cleanUpStorage();
            }
        });

        observer.observe(widget, { childList: true, subtree: true, attributes: true });
        console.log(`Started tracking changes for widget ${widget.getAttribute('data-widget-id')}`);
    }

    function saveWidgetToStorage(widgetId, widgetData) {
        storage.widgetsStorage[widgetId] = widgetData;
        //console.log('Updated global storage:', unsafeWindow.widgetsStorage);
    }


    // Функция для проверки, включено ли отслеживание для виджета
    function isTrackingEnabled(widget) {
        //const checkbox = widget.querySelector('input[type="checkbox"]');
        return false; //checkbox && checkbox.checked;
    }

    // Функция для определения типа виджета
    function getWidgetType(widget) {

        const widgetType = widget.getAttribute('data-widget-type');
        const reizWidget = widget.getAttribute('main-widget');
        const okoWidget = widget.getAttribute('data-widget-load');

        const directWidgetTypes = ['ORDERBOOK_WIDGET', 'TRADES_WIDGET'];
        if(directWidgetTypes.includes(widgetType)){
            return widgetType.toLowerCase();
        }

        if(reizWidget !== null){
            return `reiz_${reizWidget}`;
        }

        if(okoWidget !== null){
            return `oko_${okoWidget}`;
        }

    }

    // Функция для создания глобального модального окна с настройками
    function createGlobalModal() {
        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '50%';
        modal.style.left = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
        modal.style.zIndex = '1000';
        modal.style.padding = '20px';
        modal.style.background = 'white';
        modal.style.border = '1px solid black';
        modal.style.display = 'none';
        modal.style.maxHeight = '80vh';
        modal.style.overflowY = 'auto';

        const title = document.createElement('h2');
        title.textContent = 'Widget Tracking Settings';
        modal.appendChild(title);

        const widgetList = document.createElement('div');
        modal.appendChild(widgetList);

        // Добавляем виджеты в список
        const widgets = getWidgets();

        widgets.forEach(widget => {
            const widgetId = widget.getAttribute('data-widget-id');
            const widgetType = getWidgetType(widget);

            const label = document.createElement('label');
            label.textContent = `${widgetId} (${widgetType})`;

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = isTrackingEnabled(widget);

            checkbox.addEventListener('change', async () => {
                if (checkbox.checked) {
                    trackChanges(widget);
                } else {

                }
            });

            label.appendChild(checkbox);
            widgetList.appendChild(label);
            widgetList.appendChild(document.createElement('br'));
        });

        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        modal.appendChild(closeButton);
        document.body.appendChild(modal);

        return modal;
    }

    // Функция для добавления элемента в корень виджета
    function addElementToWidget(widget) {
        if(!widget) return;
        const rootElement = widget.querySelector('.react-draggable');
        if (rootElement) {
            // Создаем зеленый элемент
            const element = document.createElement('div');
            element.style.zIndex = '10';
            element.style.position = 'absolute';
            element.style.right = '4px';
            element.style.bottom = '4px';
            element.style.width = '20px';
            element.style.height = '20px';
            element.style.background = 'green';
            element.style.borderRadius = '20px';
            element.style.cursor = 'pointer';

            // Создаем глобальное модальное окно для настроек
            const globalModal = createGlobalModal();

            // Открываем глобальное модальное окно при клике на зеленый элемент
            element.addEventListener('click', () => {
                globalModal.style.display = 'block';
            });

            rootElement.appendChild(element);
        }
    }

    function getWidgets(){
        const widgetsAll = document.querySelectorAll('div[data-widget-id]');
        const widgetsFiltered = [];
        widgetsAll.forEach(widget => {
            const widgetType = widget.getAttribute('data-widget-type');
            const mainWidget = widget.getAttribute('main-widget');
            if (!enabledWidgets.includes(widgetType)) return;
            if (widgetType === 'CHART_TV_WIDGET' && mainWidget === null) return;
            widgetsFiltered.unshift(widget);

        });
        return widgetsFiltered;
    }

    // Запускаем через 10 секунд
    setTimeout(() => {
        const widgets = getWidgets();
        widgets.forEach(widget => {
            addElementToWidget(widget);
        });
    }, 10000);


})();