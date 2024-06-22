const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 80; 
const host = '0.0.0.0';


















// Настройка CORS
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.post('/', (req, res) => {
    const { distance, heightSelf, heightTarget, rangeStep } = req.body;
    console.log(`Данные получены: distance=${distance}, heightSelf=${heightSelf}, heightTarget=${heightTarget}, rangeStep=${rangeStep}`);
    let tenthPart = 0;
    if (distance % 100 < rangeStep) {
        tenthPart = distance % 100;
    } else {
        tenthPart = distance % 100 - rangeStep;
    }
    console.log(tenthPart);

    res.json({ tenthPart });
});



// Запуск сервера
app.listen(port, host, () => {
    console.log(`Сервер запущен на http://${host}:${port}`);
});
