const express = require('express');
const path = require('path');
const app = express();
const port = 80;

// Настройка статической папки
app.use(express.static(path.join(__dirname, 'public')));

// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});
