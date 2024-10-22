(function () {
    'use strict';

    // Функция для добавления пункта меню
    function addCustomMenuItem() {
        const menu = document.querySelector('.pro-menu.sh-tools-menu.jpt-tools.jpt-widgets-menu.kvt-menu-load');

        if (menu && !menu.querySelector('#CUSTOM_TICKER_GROUP_ITEM2')) {
            const newMenuItemWrapper = document.createElement('li');
            newMenuItemWrapper.className = 'pro-menu-item-wrapper';

            const newMenuItemLink = document.createElement('a');
            newMenuItemLink.id = 'CUSTOM_TICKER_GROUP_ITEM2';
            newMenuItemLink.className = 'pro-menu-item pro-popover-dismiss src-components-Menu-styles-item-ec06f';
            newMenuItemLink.innerHTML = `
        <span class="src-components-Menu-styles-icon-3a013">
          <span class="pro-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="rgb(var(--pro-icon-color))" stroke-width="2"/>
            </svg>
          </span>
        </span>
        <div class="pro-text-overflow-ellipsis pro-fill">Alor Candles</div>
        <span class="pro-menu-item-left-content"><span></span></span>`
            ;

            newMenuItemLink.addEventListener('click', () => {
                createCandlesWidget(); // Вызов функции создания виджета
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
            addCustomMenuItem(); // Добавление нового пункта меню при изменениях DOM
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
    const createCustomWidget = () => {
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
        });
    };

    // Функция для создания виджета "Candles"
    const createCandlesWidget = () => {
        const widget = createCustomWidget();
        if (!widget) {
            console.error("Не удалось создать виджет.");
            return;
        }

        const { widgetId } = widget.payload;
        const widget_ids = JSON.parse(localStorage.getItem("albalab_widgets")) || [];
        widget_ids.push(widgetId);
        localStorage.setItem("albalab_widgets", JSON.stringify(widget_ids));

        console.log(`Создан виджет с ID: ${widgetId}`);
    };

    // Задержка в 10 секунд перед выполнением скрипта
    setTimeout(function () {
        // Проверяем наличие объекта albalab_widgets в localStorage
        let widgets = localStorage.getItem('albalab_widgets');
        if (widgets) {
            try {
                // Преобразуем строку в массив
                widgets = JSON.parse(widgets);

                // Проходим по каждому значению в массиве
                widgets.forEach(widgetId => {
                    // Ищем блоки с атрибутом data-widget-id, равным текущему значению
                    let elements = document.querySelectorAll(`[data-widget-id="${widgetId}"]`);

                    elements.forEach(element => {
                        // Ищем внутренний блок с классом widget внутри элемента
                        let widgetBlock = element.querySelector('.widget');
                        if (widgetBlock) {
                            // Вставляем iframe
                            widgetBlock.innerHTML = `<iframe src="https://trade-6rl.pages.dev/#/alorcandles" style="width: 100%; height: 100%;" class="custom-iframe"></iframe>`;

                            // Находим iframe внутри текущего widgetBlock
                            let iframe = widgetBlock.querySelector('iframe.custom-iframe');

                            if (iframe) {
                                // Функция для отправки сообщения в iframe
                                function sendMessage() {
                                    const message = { time: new Date().toISOString(), data: "Your message here" }; // Ваши данные
                                    iframe.contentWindow.postMessage(message, '*'); // Отправка сообщения в iframe
                                }

                                // Устанавливаем интервал для отправки сообщения каждые 10 миллисекунд (может быть 5000 для 5 секунд)
                                setInterval(sendMessage, 100); // 5000 миллисекунд = 5 секунд
                            }
                        }
                    });
                });
            } catch (e) {
                console.error('Ошибка при обработке albalab_widgets:', e);
            }
        }
    }, 10000); // 10000 миллисекунд = 10 секунд

})();
