const express = require('express');
const path = require('path');
const app = express();
const port = 80;
const host = '0.0.0.0';

// Настройка статической папки
app.use(express.static(path.join(__dirname, 'public')));

// Запуск сервера
app.listen(port, host, () => {
    console.log(`Сервер запущен на http://${host}:${port}`);
});
