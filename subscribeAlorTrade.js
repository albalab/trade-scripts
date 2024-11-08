
    'use strict';

    // Соединение с WebSocket сервером
    const socket = new WebSocket('ws://localhost:4444'); // Замените URL на ваш сервер

    window.myStorage = window.myStorage || {};

    // Обработка получения сообщений от WebSocket сервера
    socket.onmessage = (event) => {

        const trade = JSON.parse(event.data); // Парсим данные

        window.myStorage.alorTrade = trade;

        //console.log('Получены данные с сервера:', trade); // Выводим данные в консоль

        // Вы можете здесь обрабатывать данные как вам нужно
        // Например, добавить их на страницу или работать с ними по-другому
    };

    // Логирование событий открытия и закрытия соединения
    socket.onopen = () => {
        console.log('Соединение с WebSocket установлено');
    };

    socket.onerror = (error) => {
        console.error('Ошибка WebSocket:', error);
    };

    socket.onclose = () => {
        console.log('Соединение WebSocket закрыто');
    };

