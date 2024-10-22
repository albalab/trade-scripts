// ==UserScript==
// @name         ALBALAB Terminal extensions
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  ALBALAB Terminal extensions
// @author       Your Name
// @match        https://www.tbank.ru/terminal/

// @grant        GM_xmlhttpRequest
// @connect      bitbucket.org

// ==/UserScript==

(function() {
    const scriptsToLoad = [
        'https://bitbucket.org/albalab/trade/raw/main/tickersGroups.js',
        'https://bitbucket.org/albalab/trade/raw/main/alorCandlesWidget.js',
    ];

    scriptsToLoad.forEach(function(scriptUrl) {
        GM_xmlhttpRequest({
            method: "GET",
            url: scriptUrl + '?v=' + new Date().getTime(),
            onload: function(response) {
                const scriptContent = response.responseText;
                const script = document.createElement('script');
                script.textContent = scriptContent;
                document.head.appendChild(script);
            },
            onerror: function() {
                console.error('Failed to load the script:', scriptUrl);
            }
        });
    });
})();
