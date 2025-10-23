// Продвинутый анализ связи между данными и Value хешем
const crypto = require('crypto');

// Данные из консоли
const testData = {
  module1: "a333c1fd-7b95-4086-a9bf-1d7c8b137d23",
  module2: "98abbb37-6191-475b-986c-2431f021f4a2", 
  value: "March 2023 Form A",
  date: "2023.03",
  vip: 0
};

// Value хеш из curl запроса
const valueHash = "0100333303F78D0658696A5F465FA63D4F7716DF75A1625A26ADCBFB2831A011";

console.log("=== ПРОДВИНУТЫЙ АНАЛИЗ VALUE ХЕША ===");
console.log("");

// 1. Анализ как timestamp
console.log("1. АНАЛИЗ КАК TIMESTAMP:");
const timestamp = Date.now();
console.log("Текущий timestamp:", timestamp);
console.log("Timestamp в hex:", timestamp.toString(16));
console.log("");

// 2. Анализ структуры хеша более детально
console.log("2. ДЕТАЛЬНЫЙ АНАЛИЗ СТРУКТУРЫ:");
console.log("Полный хеш:", valueHash);
console.log("Длина:", valueHash.length);
console.log("Первые 4 символа:", valueHash.substring(0, 4));
console.log("Следующие 4:", valueHash.substring(4, 8));
console.log("Следующие 4:", valueHash.substring(8, 12));
console.log("");

// 3. Попытка декодировать как UUID
console.log("3. АНАЛИЗ КАК UUID:");
const uuidParts = [
  valueHash.substring(0, 8),
  valueHash.substring(8, 12),
  valueHash.substring(12, 16),
  valueHash.substring(16, 20),
  valueHash.substring(20, 32)
];
console.log("UUID части:", uuidParts);
console.log("Попытка собрать UUID:", uuidParts.join('-'));
console.log("");

// 4. Анализ с учетом даты теста
console.log("4. АНАЛИЗ С ДАТОЙ ТЕСТА:");
const testDate = new Date('2023-03-01'); // March 2023
const testTimestamp = testDate.getTime();
console.log("Дата теста:", testDate);
console.log("Timestamp теста:", testTimestamp);
console.log("Timestamp в hex:", testTimestamp.toString(16));
console.log("");

// 5. Анализ как комбинация данных + время
console.log("5. КОМБИНАЦИЯ ДАННЫХ + ВРЕМЯ:");
const combinedWithTime = testData.module1 + testTimestamp;
const combinedHash = crypto.createHash('md5').update(combinedWithTime).digest('hex');
console.log("module1 + timestamp MD5:", combinedHash);

const combinedWithDate = testData.module1 + testData.date;
const dateHash = crypto.createHash('md5').update(combinedWithDate).digest('hex');
console.log("module1 + date MD5:", dateHash);
console.log("");

// 6. Анализ как статический токен
console.log("6. АНАЛИЗ КАК СТАТИЧЕСКИЙ ТОКЕН:");
console.log("Возможно это статический токен для аутентификации");
console.log("Может быть связан с:");
console.log("- Аккаунтом пользователя");
console.log("- Подпиской/лицензией");
console.log("- Конкретным тестом");
console.log("- Временным окном доступа");
console.log("");

// 7. Попытка найти паттерны в hex
console.log("7. ПОИСК ПАТТЕРНОВ В HEX:");
const hexBuffer = Buffer.from(valueHash, 'hex');
console.log("Hex buffer:", hexBuffer);
console.log("Первые 4 байта:", hexBuffer.subarray(0, 4));
console.log("Следующие 4 байта:", hexBuffer.subarray(4, 8));
console.log("");

// 8. Анализ как зашифрованные данные
console.log("8. АНАЛИЗ КАК ЗАШИФРОВАННЫЕ ДАННЫЕ:");
console.log("Возможно это зашифрованная комбинация:");
console.log("- User ID + Test ID");
console.log("- Session token + timestamp");
console.log("- License key + expiration");
console.log("");

// 9. Проверка на статичность
console.log("9. ПРОВЕРКА НА СТАТИЧНОСТЬ:");
console.log("Если Value статичен, то он может быть:");
console.log("- Лицензионным ключом");
console.log("- API ключом");
console.log("- Токеном доступа к конкретному тесту");
console.log("- Частью системы аутентификации");
console.log("");

console.log("=== РЕКОМЕНДАЦИИ ===");
console.log("1. Проверить, меняется ли Value между запросами");
console.log("2. Попробовать использовать Value для других тестов");
console.log("3. Проверить, связан ли Value с пользователем");
console.log("4. Возможно, Value генерируется на основе:");
console.log("   - User ID + Test ID + timestamp");
console.log("   - Session token + secret key");
console.log("   - License + expiration date");
