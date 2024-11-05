(function () {
    'use strict';

setInterval(() => {

    if(window.widgetsStorage){
        console.log("HELLO FROM ROBOT");
    }

    if(window.createLimitOrder) {
        window.createLimitOrder();
    }

}, 5000);

})();