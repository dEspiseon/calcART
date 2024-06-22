// Расчет табличного прицела

function findClosestNumbers() {
  const outputDiv = document.getElementById('output');
  outputDiv.textContent = ''; // Очищаем предыдущий вывод

  const inputVal = parseInt(document.getElementById('inputField').value, 10);
  if (isNaN(inputVal)) {
    outputDiv.textContent = 'Введите число.';
    return; // Если введено не число, выводим сообщение
  }

  const rows = Array.from(document.querySelectorAll('#data-table tr:not(:first-child)'));
  const distances = rows.map(row => parseInt(row.cells[0].textContent, 10));

  // Находим индекс ближайшего числа
  let closestIndex = distances.reduce((prev, curr, index) => {
    return (Math.abs(curr - inputVal) < Math.abs(distances[prev] - inputVal) ? index : prev);
  }, 0);

  // Получаем значение из поля ввода
  const inputValue = document.getElementById('inputField').value;
  
  // Извлекаем две последние цифры
  const lastTwoDigits = inputValue.slice(-2);
  let number; // Объявляем переменную здесь, чтобы она была доступна вне блока if

  // Проверяем, являются ли извлеченные символы цифрами
  if (lastTwoDigits.length === 2 && !isNaN(lastTwoDigits)) {
    // Преобразуем строку в число
    number = parseInt(lastTwoDigits, 10);
    
    // Если число больше 50, начинаем считать с 0
    if (number > 50) {
      number = number - 50;
    }
  } else {
    outputDiv.textContent = 'Введите корректное число в поле ввода.';
    return; // Если последние две цифры не являются числом, выводим сообщение
  }

  // Получаем информацию из второй колонки для ближайшего числа
  const closestValues = [];
  if (inputVal === distances[closestIndex]) {
    // Если введенное число равно найденному
    closestValues.push(rows[closestIndex].cells[1].textContent);
  } else if (inputVal < distances[closestIndex]) {
    // Если введенное число меньше найденного
    if (closestIndex > 0) closestValues.push(rows[closestIndex - 1].cells[1].textContent);
    closestValues.push(rows[closestIndex].cells[1].textContent);
  } else {
    // Если введенное число больше найденного
    closestValues.push(rows[closestIndex].cells[1].textContent);
    if (closestIndex < rows.length - 1) closestValues.push(rows[closestIndex + 1].cells[1].textContent);
  }

  // Расчет по формуле и вывод результата
  if (closestValues.length === 2) {
    const upperSight = parseFloat(closestValues[0]);
    const lowerSight = parseFloat(closestValues[1]);
    const rangeStep = 50; // Ступень дальности всегда 50
    const adjustedSight = upperSight - ((upperSight - lowerSight) / rangeStep) * number;
    outputDiv.textContent += ' Скорректированный прицел: ' + adjustedSight.toFixed(2);
  } else {
    outputDiv.textContent += ' Недостаточно данных для расчета.';
  }

  // Выделяем ближайшую ячейку в первой колонке
  rows.forEach((row, index) => {
    row.cells[0].classList.toggle('highlight', index === closestIndex);
  });
}

// Расчет высот

function calcheight() {
  const outputDiv = document.getElementById('output');
  const height1 = parseFloat(document.getElementById('height1').value);
  const height2 = parseFloat(document.getElementById('height2').value);

  if (!isNaN(height1) && !isNaN(height2)) {
    const resultheight = height1 - height2;
    outputDiv.textContent += ' Скорректированная высота: ' + resultheight;
    return resultheight; // Возвращаем результат для дальнейшего использования
  } else {
    outputDiv.textContent += ' Недостаточно данных для расчета.';
    return null; // Возвращаем null, если данные некорректны
  }
}

// Поиск числа в 3 колонке 

function elevationCorrection() {
  const outputDiv = document.getElementById('output');
  const inputVal = parseInt(document.getElementById('inputField').value, 10);
  if (isNaN(inputVal)) {
    outputDiv.textContent = 'Введите число.';
    return null; // Если введено не число, выводим сообщение
  }

  const rows = Array.from(document.querySelectorAll('#data-table tr:not(:first-child)'));
  const distances = rows.map(row => parseInt(row.cells[0].textContent, 10));

  // Находим индекс ближайшего числа
  let closestIndex = distances.reduce((prev, curr, index) => {
    return (Math.abs(curr - inputVal) < Math.abs(distances[prev] - inputVal) ? index : prev);
  }, 0);

  // Получаем значение из третьей колонки для ближайшего числа
  const closestValueInThirdColumn = parseFloat(rows[closestIndex].cells[2].textContent);

  // Выводим значение в output
  outputDiv.textContent += ' Значение в третьей колонке: ' + closestValueInThirdColumn;
  return closestValueInThirdColumn; // Возвращаем значение для дальнейшего использования
}

function test1(resultheight, closestValueInThirdColumn) {
  const outputDiv = document.getElementById('output');
  const num2 = 100;
  if (!isNaN(resultheight) && !isNaN(closestValueInThirdColumn)) {
    const testresult = (resultheight / num2) * closestValueInThirdColumn;
    outputDiv.textContent += ' Поправка на высоту: ' + testresult;
    return testresult; // Возвращаем результат для дальнейшего использования
  } else {
    outputDiv.textContent += ' Недостаточно данных для расчета.';
    return null; // Возвращаем null, если данные некорректны
  }
}

function test2(adjustedSight, testresult) {
  const outputDiv = document.getElementById('output');
  if (!isNaN(adjustedSight) && !isNaN(testresult)) {
    const test1result = adjustedSight + testresult;
    outputDiv.textContent += ' Исчислительный прицел: ' + test1result.toFixed(2);
  } else {
    outputDiv.textContent += ' Недостаточно данных для расчета.';
  }
}

// Полный расчет

function visualresult() {
  findClosestNumbers();
  const resultheight = calcheight();
  const closestValueInThirdColumn = elevationCorrection();
  if (resultheight !== null && closestValueInThirdColumn !== null) {
    const testresult = test1(resultheight, closestValueInThirdColumn);
    if (testresult !== null) {
      const adjustedSight = parseFloat(document.getElementById('output').textContent.match(/Скорректированный прицел: ([\d.]+)/)[1]);
      test2(adjustedSight, testresult);
    }
  }
}

document.getElementById('heightresult').addEventListener('click', visualresult);
