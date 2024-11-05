(function() {

    if(window?.albalabStorage) {
        console.log(window.albalabStorage);
    } else {
        setInterval(() => {
            window.albalabStorage = 'exist';
        }, 1000)
    }

})();
