(function () {
    'use strict';

    // Массив с настройками для каждого виджета
    const widgetsConfig = [
        {
            widgetName: 'Alor Candles', // Название виджета
            localStorageKey: 'albalab_widgets_1', // Ключ для хранения в localStorage
            iframeUrl: 'https://trade-6rl.pages.dev/#/alorcandles' // URL для iframe
        },
        {
            widgetName: 'Alor Trades', // Название виджета
            localStorageKey: 'albalab_alor_trades', // Ключ для хранения в localStorage
            iframeUrl: 'https://trade-6rl.pages.dev/#/alortrades' // URL для iframe
        },
        {
            widgetName: 'TCS Candles', // Второй виджет
            localStorageKey: 'another_widget_storage', // Ключ для второго виджета
            iframeUrl: 'https://trade-6rl.pages.dev/#/tcscandles' // URL для второго виджета
        },
        ,
        {
            widgetName: 'TCS Trades', // Второй виджет
            localStorageKey: 'trades_widget_storage', // Ключ для второго виджета
            iframeUrl: 'https://trade-6rl.pages.dev/#/tcstrades' // URL для второго виджета
        }
        // Можно добавить больше виджетов в этом формате
    ];

    // Функция для добавления кастомного пункта меню для каждого виджета
    function addCustomMenuItem(widgetConfig) {
        const menu = document.querySelector('.pro-menu.sh-tools-menu.jpt-tools.jpt-widgets-menu.kvt-menu-load');

        if (menu && !menu.querySelector(`#CUSTOM_TICKER_GROUP_ITEM2_${widgetConfig.localStorageKey}`)) {
            const newMenuItemWrapper = document.createElement('li');
            newMenuItemWrapper.className = 'pro-menu-item-wrapper';

            const newMenuItemLink = document.createElement('a');
            newMenuItemLink.id = `CUSTOM_TICKER_GROUP_ITEM2_${widgetConfig.localStorageKey}`;
            newMenuItemLink.className = 'pro-menu-item pro-popover-dismiss src-components-Menu-styles-item-ec06f';
            newMenuItemLink.innerHTML = `
        <span class="src-components-Menu-styles-icon-3a013">
          <span class="pro-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="rgb(var(--pro-icon-color))" stroke-width="2"/>
            </svg>
          </span>
        </span>
        <div class="pro-text-overflow-ellipsis pro-fill">${widgetConfig.widgetName}</div>
        <span class="pro-menu-item-left-content"><span></span></span>`
            ;

            newMenuItemLink.addEventListener('click', () => {
                createCandlesWidget(widgetConfig); // Вызов функции создания виджета с текущим конфигом
            });

            newMenuItemWrapper.appendChild(newMenuItemLink);
            menu.appendChild(newMenuItemWrapper);
        }
    }

    // Мутационный наблюдатель для отслеживания изменений в DOM
    const observer = new MutationObserver((mutations) => {
        let shouldRun = false;
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length > 0 || mutation.type === 'childList') {
                shouldRun = true;
            }
        });
        if (shouldRun) {
            widgetsConfig.forEach(widgetConfig => addCustomMenuItem(widgetConfig)); // Добавляем пункты меню для всех виджетов
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Функция для получения React Fiber ключа
    const getReactFiberKeyString = (node) => {
        return Object.keys(node).find(
            (key) =>
                key.startsWith("__reactInternalInstance$") ||
                key.startsWith("__reactFiber$")
        );
    };

    // Функция для создания кастомного виджета
    const createCustomWidget = (widgetConfig) => {
        const space_node = document.querySelector("#SpacePanel");
        if (!space_node) {
            console.error("SpacePanel не найден.");
            return false;
        }

        const fiber = getReactFiberKeyString(space_node);
        if (!fiber) {
            console.error("React Fiber не найден.");
            return false;
        }

        return space_node[fiber].return.memoizedProps.addWidget({
            pinned: false,
            widgetType: "LIGHT_TV_WIDGET",
            payload: { widgetName: widgetConfig.widgetName }
        });
    };

    // Функция для создания и управления виджетом
    const createCandlesWidget = (widgetConfig) => {
        const widget = createCustomWidget(widgetConfig);
        if (!widget) {
            console.error("Не удалось создать виджет.");
            return;
        }

        const { widgetId } = widget.payload;
        const widget_ids = JSON.parse(localStorage.getItem(widgetConfig.localStorageKey)) || [];
        widget_ids.push(widgetId);
        localStorage.setItem(widgetConfig.localStorageKey, JSON.stringify(widget_ids));

        console.log(`Создан виджет с ID: ${widgetId}`);
    };

    // Функция для вставки iframe и отправки сообщений в уже существующие виджеты
    setTimeout(function () {
        widgetsConfig.forEach(widgetConfig => {
            let widgets = localStorage.getItem(widgetConfig.localStorageKey);
            if (widgets) {
                try {
                    widgets = JSON.parse(widgets);
                    widgets.forEach(widgetId => {
                        let elements = document.querySelectorAll(`[data-widget-id="${widgetId}"]`);

                        elements.forEach(element => {
                            let widgetBlock = element.querySelector('.widget');
                            if (widgetBlock) {
                                widgetBlock.innerHTML = `<iframe src="${widgetConfig.iframeUrl}" style="width: 100%; height: 100%;" class="custom-iframe"></iframe>`;

                                let iframe = widgetBlock.querySelector('iframe.custom-iframe');
                                if (iframe) {
                                    function sendMessage() {
                                        const message = { time: new Date().toISOString(), data: "Your message here" };
                                        iframe.contentWindow.postMessage(message, '*');
                                    }
                                    setInterval(sendMessage, 10000); // 10 секунд
                                }
                            }
                        });
                    });
                } catch (e) {
                    console.error(`Ошибка при обработке ${widgetConfig.localStorageKey}:`, e);
                }
            }
        });
    }, 10000); // Задержка в 10 секунд перед выполнением скрипта
})();
