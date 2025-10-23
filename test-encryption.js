// Тест алгоритмов шифрования для генерации Value
const crypto = require('crypto-js')

// Ключи из decrypt.ts
const KEY_1 = "1118394794UHWU29"
const KEY_2 = "DDWDEF2344564412"

// Данные теста
const testData = {
  module1: "a333c1fd-7b95-4086-a9bf-1d7c8b137d23",
  module2: "98abbb37-6191-475b-986c-2431f021f4a2",
  value: "March 2023 Form A",
  date: "2023.03",
  vip: 0
}

const userData = {
  email: "yoyaye7963@fogdiver.com",
  userId: "user123"
}

const timestamp = Date.now()

console.log("=== ТЕСТ АЛГОРИТМОВ ШИФРОВАНИЯ ДЛЯ VALUE ===")
console.log("Test Data:", testData)
console.log("User Data:", userData)
console.log("Timestamp:", timestamp)
console.log("")

// Стратегия 1: module1 + timestamp
console.log("1. STRATEGY: module1 + timestamp")
const combined1 = testData.module1 + timestamp.toString()
const parsedKey1 = crypto.enc.Utf8.parse(KEY_1)
const encrypted1 = crypto.AES.encrypt(combined1, parsedKey1, {
  mode: crypto.mode.ECB,
  padding: crypto.pad.Pkcs7
})
const result1 = encrypted1.toString().replace(/[^0-9A-Fa-f]/g, '').toUpperCase()
console.log("Result:", result1)
console.log("Length:", result1.length)
console.log("")

// Стратегия 2: комбинация данных
console.log("2. STRATEGY: combined data")
const data2 = {
  module1: testData.module1,
  module2: testData.module2,
  date: testData.date,
  userId: userData.userId,
  timestamp: timestamp
}
const combined2 = JSON.stringify(data2)
const parsedKey2 = crypto.enc.Utf8.parse(KEY_2)
const encrypted2 = crypto.AES.encrypt(combined2, parsedKey2, {
  mode: crypto.mode.CBC,
  padding: crypto.pad.Pkcs7
})
const result2 = encrypted2.toString().replace(/[^0-9A-Fa-f]/g, '').toUpperCase()
console.log("Result:", result2)
console.log("Length:", result2.length)
console.log("")

// Стратегия 3: пользователь + тест
console.log("3. STRATEGY: user + test")
const combined3 = `${userData.email}:${testData.module1}:${timestamp}`
const parsedKey3 = crypto.enc.Utf8.parse(KEY_1)
const encrypted3 = crypto.AES.encrypt(combined3, parsedKey3, {
  mode: crypto.mode.ECB,
  padding: crypto.pad.Pkcs7
})
const result3 = encrypted3.toString().replace(/[^0-9A-Fa-f]/g, '').toUpperCase()
console.log("Result:", result3)
console.log("Length:", result3.length)
console.log("")

// Стратегия 4: только module1
console.log("4. STRATEGY: module1 only")
const parsedKey4 = crypto.enc.Utf8.parse(KEY_1)
const encrypted4 = crypto.AES.encrypt(testData.module1, parsedKey4, {
  mode: crypto.mode.ECB,
  padding: crypto.pad.Pkcs7
})
const result4 = encrypted4.toString().replace(/[^0-9A-Fa-f]/g, '').toUpperCase()
console.log("Result:", result4)
console.log("Length:", result4.length)
console.log("")

// Стратегия 5: двойное шифрование
console.log("5. STRATEGY: double encryption")
const data5 = {
  module1: testData.module1,
  module2: testData.module2,
  user: userData.email,
  timestamp: timestamp
}
const combined5 = JSON.stringify(data5)

// Первое шифрование с KEY_1
const parsedKey5a = crypto.enc.Utf8.parse(KEY_1)
const encrypted5a = crypto.AES.encrypt(combined5, parsedKey5a, {
  mode: crypto.mode.ECB,
  padding: crypto.pad.Pkcs7
})

// Второе шифрование с KEY_2
const parsedKey5b = crypto.enc.Utf8.parse(KEY_2)
const encrypted5b = crypto.AES.encrypt(encrypted5a.toString(), parsedKey5b, {
  mode: crypto.mode.ECB,
  padding: crypto.pad.Pkcs7
})
const result5 = encrypted5b.toString().replace(/[^0-9A-Fa-f]/g, '').toUpperCase()
console.log("Result:", result5)
console.log("Length:", result5.length)
console.log("")

// Анализ существующего Value
console.log("6. ANALYSIS OF EXISTING VALUE")
const existingValue = "0100333303F78D0658696A5F465FA63D4F7716DF75A1625A26ADCBFB2831A011"
console.log("Existing Value:", existingValue)
console.log("Length:", existingValue.length)

// Пытаемся расшифровать существующий Value
try {
  const parsedKey = crypto.enc.Utf8.parse(KEY_1)
  const decrypted = crypto.AES.decrypt(existingValue, parsedKey, {
    mode: crypto.mode.ECB,
    padding: crypto.pad.Pkcs7
  })
  const result = decrypted.toString(crypto.enc.Utf8)
  console.log("Decrypted with KEY_1:", result)
} catch (e) {
  console.log("Failed to decrypt with KEY_1")
}

try {
  const parsedKey = crypto.enc.Utf8.parse(KEY_2)
  const decrypted = crypto.AES.decrypt(existingValue, parsedKey, {
    mode: crypto.mode.ECB,
    padding: crypto.pad.Pkcs7
  })
  const result = decrypted.toString(crypto.enc.Utf8)
  console.log("Decrypted with KEY_2:", result)
} catch (e) {
  console.log("Failed to decrypt with KEY_2")
}

console.log("")
console.log("=== ВЫВОДЫ ===")
console.log("1. Все стратегии генерируют разные результаты")
console.log("2. Длина результатов варьируется")
console.log("3. Существующий Value не расшифровывается простыми методами")
console.log("4. Возможно, Value генерируется на сервере")
console.log("5. Или используется другой алгоритм/ключи")
