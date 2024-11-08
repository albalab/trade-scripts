// menuManager.js
export const addCustomMenuItem = (widgetConfig, createWidgetFunction) => {
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
            <span class="pro-menu-item-left-content"><span></span></span>`;

        newMenuItemLink.addEventListener('click', () => {
            createWidgetFunction(widgetConfig); // Используем переданную функцию создания виджета
        });

        newMenuItemWrapper.appendChild(newMenuItemLink);
        menu.appendChild(newMenuItemWrapper);
    }
};
