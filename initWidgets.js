// initWidgets.js
export const initWidgets = async () => {
    const { addCustomMenuItem } = await import('https://bitbucket.org/albalab/trade-scripts/raw/main/menuManager.js');
    const { createCandlesWidget } = await import('https://bitbucket.org/albalab/trade-scripts/raw/main/widgetManager.js');

    const widgetsConfig = [
        {
            widgetName: 'Alor Candles',
            localStorageKey: 'albalab_widgets_1',
            iframeUrl: 'https://trade-6rl.pages.dev/#/alorcandles'
        },
        {
            widgetName: 'Alor Trades',
            localStorageKey: 'albalab_alor_trades',
            iframeUrl: 'https://trade-6rl.pages.dev/#/alortrades'
        },
        {
            widgetName: 'Robot1',
            localStorageKey: 'albalab_robot_1',
            iframeUrl: 'https://trade-6rl.pages.dev/#/alortrades'
        }
    ];

    const observer = new MutationObserver((mutations) => {
        mutations.forEach(() => {
            widgetsConfig.forEach(widgetConfig => {
                addCustomMenuItem(widgetConfig, createCandlesWidget);
            });
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });
};

// Асинхронный вызов initWidgets с ожиданием
(async () => {
    await initWidgets();
})();
