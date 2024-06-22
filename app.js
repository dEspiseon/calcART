const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 80;
const host = '0.0.0.0';

// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Пути к файлам JSON
const dataFilePaths = [
    path.join(__dirname, 'h0.json'),
    path.join(__dirname, 'h1.json'),
    path.join(__dirname, 'h2.json')
];

// Метод для чтения данных из файла
function readDataFile(filePath, callback) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            callback(err);
            return;
        }
        try {
            const jsonData = JSON.parse(data);
            callback(null, jsonData);
        } catch (error) {
            callback(error);
        }
    });
}

// Метод для обработки данных
function processData(clientdistance, heightSelf, heightTarget, rangeStep, jsonData) {
    let maxDistanceData = null;
    let minDistanceData = null;

    for (let i = 0; i < jsonData.length; i++) {
        if (jsonData[i].distance <= clientdistance) {
            if (!maxDistanceData || jsonData[i].distance > maxDistanceData.distance) {
                maxDistanceData = jsonData[i];
            }
        }
        if (jsonData[i].distance >= clientdistance) {
            if (!minDistanceData || jsonData[i].distance < minDistanceData.distance) {
                minDistanceData = jsonData[i];
            }
        }
    }

    if (maxDistanceData && minDistanceData) {
        let tenthPart = 0;
        if (clientdistance % 100 < rangeStep) {
            tenthPart = clientdistance % 100;
        } else {
            tenthPart = clientdistance % 100 - rangeStep;
        }
        const heightDifference = (heightSelf - heightTarget) / 100 * minDistanceData.height_adjustment;
        const elevation = (maxDistanceData.sight - ((maxDistanceData.sight - minDistanceData.sight) / rangeStep) * tenthPart) + heightDifference;
        return { elevation };
    } else {
        
        return { error: 'Данные для расчета элевации неверные' };
    }
}

// Обработчик POST запроса
app.post('/', (req, res) => {
    const { clientdistance, heightSelf, heightTarget, rangeStep } = req.body;

    let results = [];
    let filesProcessed = 0;

    dataFilePaths.forEach((filePath, index) => {
        readDataFile(filePath, (err, jsonData) => {
            if (err) {
                console.error(`Ошибка при чтении файла ${filePath}:`, err);
                results.push({ file: path.basename(filePath, path.extname(filePath)), error: 'Ошибка при чтении файла' });
            } else {
                const result = processData(clientdistance, heightSelf, heightTarget, rangeStep, jsonData);
                if (result.error) {
                    results.push({ file: path.basename(filePath, path.extname(filePath)), error: result.error });
                } else {
                    results.push({ file: path.basename(filePath, path.extname(filePath)), elevation: result.elevation });
                }
            }
            filesProcessed++;

            if (filesProcessed === dataFilePaths.length) {
                res.json({ results });
            }
        });
    });
});

// Запуск сервера
app.listen(port, host, () => {
    console.log(`Сервер запущен на http://${host}:${port}`);
});
