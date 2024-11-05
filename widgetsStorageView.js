(function () {
    'use strict';

    // Create modal window
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.right = '0';
    modal.style.width = '300px';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
    modal.style.boxShadow = '-2px 0 5px rgba(0, 0, 0, 0.5)';
    modal.style.overflowY = 'auto';
    modal.style.zIndex = '9999';
    modal.style.padding = '10px';
    modal.style.display = 'none'; // Hidden by default
    document.body.appendChild(modal);

    // Function to create a table from the data
    function createTable(data) {
        return JSON.stringify(data);
    }

    // Function to display data in the modal
    function displayData() {
        modal.innerHTML = '<h2>Данные виджетов</h2>';
        for (const [widgetKey, widgetData] of Object.entries(window.widgetsStorage)) {
            modal.innerHTML += `<h3>${widgetKey}</h3>`;
            modal.innerHTML += createTable(widgetData);
        }
        modal.style.display = 'block'; // Show the modal
    }

    // Create a Proxy to wrap the widgetsStorage
    const handler = {
        set(target, property, value) {
            target[property] = value;
            displayData(); // Display updated data
            return true;
        }
    };

    // Delay the initialization of the Proxy by 15 seconds
    setTimeout(() => {
        if (!window.widgetsStorage) {
            window.widgetsStorage = {}; // Initialize if not set
        }
        window.widgetsStorage = new Proxy(window.widgetsStorage, handler);

        // Optional: Display modal initially if there's existing data
        if (Object.keys(window.widgetsStorage).length > 0) {
            displayData();
        }
    }, 15000); // 15000 milliseconds = 15 seconds

})();