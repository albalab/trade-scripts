(function() {

    if(window?.albalabStorage) {
        console.log(window.albalabStorage);
    } else {
        setTimeout(() => {
            window.albalabStorage = 'exist';
        }, 1000)
    }

})();
