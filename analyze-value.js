// Анализ связи между данными и Value хешем
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

console.log("=== АНАЛИЗ СВЯЗИ ДАННЫХ И VALUE ХЕША ===");
console.log("Test Data:", testData);
console.log("Value Hash:", valueHash);
console.log("");

// 1. Анализ структуры хеша
console.log("1. АНАЛИЗ СТРУКТУРЫ ХЕША:");
console.log("Длина хеша:", valueHash.length);
console.log("Начинается с:", valueHash.substring(0, 4));
console.log("Первые 8 символов:", valueHash.substring(0, 8));
console.log("");

// 2. Попытка найти связь с module1
console.log("2. СВЯЗЬ С MODULE1:");
console.log("module1:", testData.module1);
console.log("module1 UUID длина:", testData.module1.length);
console.log("");

// 3. Анализ возможных алгоритмов хеширования
console.log("3. АНАЛИЗ ВОЗМОЖНЫХ АЛГОРИТМОВ:");

// MD5
const md5Hash = crypto.createHash('md5').update(JSON.stringify(testData)).digest('hex');
console.log("MD5 от JSON:", md5Hash);

// SHA1
const sha1Hash = crypto.createHash('sha1').update(JSON.stringify(testData)).digest('hex');
console.log("SHA1 от JSON:", sha1Hash);

// SHA256
const sha256Hash = crypto.createHash('sha256').update(JSON.stringify(testData)).digest('hex');
console.log("SHA256 от JSON:", sha256Hash);

console.log("");

// 4. Анализ только module1
console.log("4. АНАЛИЗ ТОЛЬКО MODULE1:");
const module1Md5 = crypto.createHash('md5').update(testData.module1).digest('hex');
const module1Sha1 = crypto.createHash('sha1').update(testData.module1).digest('hex');
const module1Sha256 = crypto.createHash('sha256').update(testData.module1).digest('hex');

console.log("module1 MD5:", module1Md5);
console.log("module1 SHA1:", module1Sha1);
console.log("module1 SHA256:", module1Sha256);

console.log("");

// 5. Анализ комбинаций
console.log("5. АНАЛИЗ КОМБИНАЦИЙ:");
const combined = testData.module1 + testData.module2;
const combinedHash = crypto.createHash('md5').update(combined).digest('hex');
console.log("module1 + module2 MD5:", combinedHash);

const withDate = testData.module1 + testData.date;
const withDateHash = crypto.createHash('md5').update(withDate).digest('hex');
console.log("module1 + date MD5:", withDateHash);

console.log("");

// 6. Поиск паттернов в хеше
console.log("6. ПОИСК ПАТТЕРНОВ:");
console.log("Хеш в верхнем регистре:", valueHash.toUpperCase());
console.log("Хеш в нижнем регистре:", valueHash.toLowerCase());
console.log("");

// 7. Анализ как hex
console.log("7. АНАЛИЗ КАК HEX:");
try {
  const hexBuffer = Buffer.from(valueHash, 'hex');
  console.log("Hex buffer length:", hexBuffer.length);
  console.log("Hex buffer:", hexBuffer.toString('hex'));
  console.log("As string:", hexBuffer.toString('utf8'));
} catch (e) {
  console.log("Не валидный hex:", e.message);
}

console.log("");
console.log("=== ВОЗМОЖНЫЕ ВЫВОДЫ ===");
console.log("1. Value может быть статическим токеном для аутентификации");
console.log("2. Может быть результатом хеширования комбинации данных");
console.log("3. Может быть связан с временными метками или сессиями");
console.log("4. Может быть частью более сложного алгоритма аутентификации");
