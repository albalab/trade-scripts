// widgetManager.js
const getReactFiberKeyString = (node) => {
    return Object.keys(node).find(
        (key) =>
            key.startsWith("__reactInternalInstance$") ||
            key.startsWith("__reactFiber$")
    );
};

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

export const createCandlesWidget = (widgetConfig) => {
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
