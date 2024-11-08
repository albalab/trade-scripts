
    'use strict';

    // Load groups from localStorage or use default if not set
    const savedGroups = JSON.parse(localStorage.getItem('tickerGroups'));
    const groups = savedGroups || [
        {
            enabled: true,
            tickers: ["MRKS", "MRKY", "MRKC", "DVEC", "MRKV", "MRKZ", "LSNG"],
            color: "rgba(0, 128, 128, 1)" // Темно-бирюзовый
        },
        {
            enabled: true,
            tickers: ["GAZP", "NVTK", "SIBN", "OGKB", "TGKA"],
            color: "rgba(0, 230, 255, 1)" // Светло-голубой
        },
        {
            enabled: false,
            tickers: ["BANE", "LKOH", "RNFT", "ROSN", "TATN"],
            color: "rgba(128, 0, 0, 1)" // Темно-красный
        },
        {
            enabled: true,
            tickers: ["SELG", "POLY", "PLZL", "UGLD"],
            color: "rgba(255, 105, 0, 1)" // Ярко-оранжевый
        },
        {
            enabled: true,
            tickers: ["MAGN", "CHMF", "NLMK"],
            color: "rgba(154, 99, 36, 1)" // Коричневый
        },
        {
            enabled: true,
            tickers: ["TGKN", "TGKB", "TGKA"],
            color: "rgba(230, 25, 75, 1)" // Красный
        },
        {
            enabled: true,
            tickers: ["NMTP", "FESH", "FLOT"],
            color: "rgba(67, 99, 216, 1)" // Средне-синий
        },
        {
            enabled: true,
            tickers: ["MTLR", "RASP"],
            color: "rgba(102, 153, 255, 1)" // Светло-синий
        }
    ];

    function createTickerGradientMap() {
        const tickerGradientMap = {};

        groups.forEach((group) => {
            if (group.enabled) {
                group.tickers.forEach((ticker) => {
                    if (!tickerGradientMap[ticker]) {
                        tickerGradientMap[ticker] = [];
                    }
                    tickerGradientMap[ticker].push(group.color);
                });
            }
        });

        Object.keys(tickerGradientMap).forEach((ticker) => {
            const colors = tickerGradientMap[ticker];
            const colorStops = [];

            if (colors.length < 15) {
                colorStops.push(`transparent 0% ${100 - colors.length * 15}%`);
            }

            colors.forEach((color, index) => {
                const start = 100 - (colors.length - index) * 15;
                const end = start + 15; // Конец каждого цвета
                colorStops.push(`${color} ${start}%, ${color} ${end}%`);
            });

            tickerGradientMap[ticker] = `linear-gradient(90deg, ${colorStops.join(', ')})`;
        });

        return tickerGradientMap;
    }

    const tickerGradientMap = createTickerGradientMap();

    function findAndStyleTickers() {
        const marketWidgetContainers = document.querySelectorAll('[data-widget-type="MARKET_WIDGET"]');

        marketWidgetContainers.forEach((container) => {
            const tickerElements = container.querySelectorAll('[class*="src-components-SymbolLogoAndName-SymbolLogoAndName-ticker"]');

            if (tickerElements.length > 0) {
                tickerElements.forEach((element) => {
                    const ticker = element.textContent.trim();
                    if (tickerGradientMap[ticker]) {
                        element.parentNode.style.background = tickerGradientMap[ticker];
                    }
                });
            }
        });
    }

    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }

    const debouncedFindAndStyleTickers = debounce(findAndStyleTickers, 100);

    const observer = new MutationObserver((mutations) => {
        let shouldRun = false;
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length > 0 || mutation.type === 'childList') {
                shouldRun = true;
            }
        });
        if (shouldRun) {
            debouncedFindAndStyleTickers();
            addCustomMenuItem(); // Ensure the menu item is added when the DOM changes
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    findAndStyleTickers();

    // Function to add a new menu item "Группы инструментов"
    function addCustomMenuItem() {
        const menu = document.querySelector('.pro-menu.sh-tools-menu.jpt-tools.jpt-widgets-menu.kvt-menu-load');

        if (menu && !menu.querySelector('#CUSTOM_TICKER_GROUP_ITEM')) {
            const newMenuItemWrapper = document.createElement('li');
            newMenuItemWrapper.className = 'pro-menu-item-wrapper';

            const newMenuItemLink = document.createElement('a');
            newMenuItemLink.id = 'CUSTOM_TICKER_GROUP_ITEM';
            newMenuItemLink.className = 'pro-menu-item pro-popover-dismiss src-components-Menu-styles-item-ec06f';
            newMenuItemLink.innerHTML = `
        <span class="src-components-Menu-styles-icon-3a013">
          <span class="pro-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="rgb(var(--pro-icon-color))" stroke-width="2"/>
            </svg>
          </span>
        </span>
        <div class="pro-text-overflow-ellipsis pro-fill">Группы тикеров</div>
        <span class="pro-menu-item-left-content"><span></span></span>`
            ;

            newMenuItemLink.addEventListener('click', openPopup);

            newMenuItemWrapper.appendChild(newMenuItemLink);
            menu.appendChild(newMenuItemWrapper);
        }
    }

    // Function to create and display the popup
    function openPopup() {
        // Check if popup already exists
        if (document.querySelector('#custom-popup')) return;

        const popup = document.createElement('div');
        popup.id = 'custom-popup';
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.width = '600px';
        popup.style.height = 'auto';
        popup.style.backgroundColor = 'rgba(33, 49, 63, 1)';
        popup.style.border = '1px solid rgba(72, 99, 123, 1)';
        popup.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
        popup.style.zIndex = '1000';
        popup.style.padding = '30px';

        const container = document.createElement('div');
        container.style.width = '100%';

        groups.forEach((group, index) => {
            createGroupRow(group, container);
        });

        const addButton = document.createElement('button');
        addButton.textContent = 'Добавить группу';
        addButton.style.margin = '20px 290px 10px 0';
        addButton.addEventListener('click', () => {
            createGroupRow({ enabled: true, tickers: [], color: '#000000' }, container);
        });

        const closeButton = document.createElement('button');
        closeButton.textContent = 'Закрыть';
        closeButton.style.margin = '10px 5px';
        closeButton.style.display = 'inline-block';
        closeButton.addEventListener('click', () => {
            document.body.removeChild(popup);
        });

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Сохранить';
        saveButton.style.margin = '20px 10px 10px';
        saveButton.style.display = 'inline-block';
        saveButton.addEventListener('click', () => {
            saveGroups(container);
            location.reload(); // Reload the page
        });


        popup.appendChild(container);
        popup.appendChild(addButton);
        popup.appendChild(saveButton);
        popup.appendChild(closeButton);
        document.body.appendChild(popup);
    }

    // Function to create a new group row in the popup
    function createGroupRow(group, container) {
        const row = document.createElement('div');
        row.style.marginBottom = '10px';
        row.style.whiteSpace = 'nowrap';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = group.enabled;
        checkbox.style.marginRight = '10px';

        const tickerInput = document.createElement('input');
        tickerInput.type = 'text';
        tickerInput.value = group.tickers.join(', ');
        tickerInput.style.marginRight = '10px';
        tickerInput.style.background = 'none';
        tickerInput.style.width = '80%';
        tickerInput.style.borderBottom = 'solid 1px rgba(255,255,255,0.1)';

        const colorInput = document.createElement('input');
        colorInput.type = 'color';
        colorInput.value = rgbToHex(group.color); // Converts RGBA to HEX for input type="color"
        colorInput.style.width = '40px';
        colorInput.style.marginRight = '10px';
        colorInput.style.border = 'none';

        const deleteButton = document.createElement('button');
        deleteButton.textContent = '✖';
        deleteButton.style.marginLeft = '10px';
        deleteButton.addEventListener('click', () => {
            container.removeChild(row);
        });

        row.appendChild(checkbox);
        row.appendChild(tickerInput);
        row.appendChild(colorInput);
        row.appendChild(deleteButton);
        container.appendChild(row);
    }

    // Function to save groups to localStorage
    function saveGroups(container) {
        const newGroups = [];
        const rows = container.querySelectorAll('div');

        rows.forEach((row, index) => {
            const checkbox = row.querySelector('input[type="checkbox"]');
            const tickerInput = row.querySelector('input[type="text"]');
            const colorInput = row.querySelector('input[type="color"]');

            if (checkbox && tickerInput && colorInput) {
                const tickers = tickerInput.value.split(',').map(t => t.trim());
                const color = hexToRgba(colorInput.value);
                newGroups.push({
                    enabled: checkbox.checked,
                    tickers: tickers,
                    color: color
                });
            }
        });

        localStorage.setItem('tickerGroups', JSON.stringify(newGroups));
    }

    // Function to convert RGBA to HEX
    function rgbToHex(color) {
        const rgba = color.match(/\d+/g);
        const r = parseInt(rgba[0]).toString(16).padStart(2, '0');
        const g = parseInt(rgba[1]).toString(16).padStart(2, '0');
        const b = parseInt(rgba[2]).toString(16).padStart(2, '0');
        return `#${r}${g}${b}`;
    }

    // Function to convert HEX to RGBA
    function hexToRgba(hex) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, 1)`;
    }

    // Check and add the custom menu item on initial load
    addCustomMenuItem();

