// ==UserScript==
// @name         ALBALAB Terminal extensions
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  ALBALAB Terminal extensions
// @author       Your Name
// @match        https://www.tbank.ru/terminal/

// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @connect      bitbucket.org

// ==/UserScript==

(function() {
    const scriptsToLoad = [
        'https://bitbucket.org/albalab/trade-scripts/raw/main/tickersGroups.js',
        'https://bitbucket.org/albalab/trade-scripts/raw/main/injectWidgets.js',

        'https://bitbucket.org/albalab/trade-scripts/raw/main/liveWidgetsStorage.js',
        'https://bitbucket.org/albalab/trade-scripts/raw/main/widgetsStorageView.js',

        //'https://bitbucket.org/albalab/trade-scripts/raw/main/myButtons.js',

        'https://bitbucket.org/albalab/trade-scripts/raw/main/templates/initLimitOrder.js',
        //'https://bitbucket.org/albalab/trade-scripts/raw/main/templates/createLimitOrder.js',

        'https://bitbucket.org/albalab/trade-scripts/raw/main/templates/templateRobot.js',

        //'https://bitbucket.org/albalab/trade-scripts/raw/main/templates/templateWS.js',

        'https://bitbucket.org/albalab/trade-scripts/raw/main/subscribeAlorTrade.js',

    ];

    scriptsToLoad.forEach(function(scriptUrl) {
        GM_xmlhttpRequest({
            method: "GET",
            url: scriptUrl + '?v=' + new Date().getTime(),
            onload: function(response) {
                const scriptContent = response.responseText;
                const script = document.createElement('script');
                script.type = 'module'; // Устанавливаем type="module" для поддержки модулей
                script.textContent = scriptContent;
                document.head.appendChild(script);
            },
            onerror: function() {
                console.error('Failed to load the script:', scriptUrl);
            }
        });
    });
})();
