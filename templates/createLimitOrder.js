(function () {
    'use strict';

    setInterval(() => {

        if(window.createLimitOrder) {
            window.createLimitOrder();
        }

    }, 5000);

})();