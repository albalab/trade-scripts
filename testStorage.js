(function() {
    // Устанавливаем значение в хранилище
    window.albalabStorage.set('widget1', { ticker: 'AAPL', price: 150 });

    // Получаем значение из хранилища
    const data = window.albalabStorage.get('widget1');
    console.log('Data for widget1:', data);
})();
