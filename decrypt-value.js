// Скрипт для расшифровки Value заголовка
const crypto = require('crypto-js')

// Ключи из decrypt.ts
const KEY_1 = "1118394794UHWU29"
const KEY_2 = "DDWDEF2344564412"

// Value для расшифровки
const VALUE_TO_DECRYPT = "0100333303F78D0658696A5F465FA63D4F7716DF75A1625A26ADCBFB2831A011"

console.log("=== РАСШИФРОВКА VALUE ЗАГОЛОВКА ===")
console.log("Value:", VALUE_TO_DECRYPT)
console.log("Длина:", VALUE_TO_DECRYPT.length)
console.log("")

// Функция для попытки расшифровки с разными методами
function tryDecryptWithMethod(encryptedString, key, methodName, options = {}) {
  try {
    const parsedKey = crypto.enc.Utf8.parse(key)
    const decrypted = crypto.AES.decrypt(encryptedString, parsedKey, options)
    const result = decrypted.toString(crypto.enc.Utf8)
    
    if (result && result.length > 0 && !result.includes('\u0000')) {
      console.log(`✅ ${methodName}:`, result)
      return result
    }
  } catch (e) {
    console.log(`❌ ${methodName}: Failed`)
  }
  return null
}

// Функция для попытки расшифровки с DES
function tryDecryptWithDES(encryptedString, key, methodName) {
  try {
    const parsedKey = crypto.enc.Utf8.parse(key)
    const decrypted = crypto.DES.decrypt(encryptedString, parsedKey, {
      mode: crypto.mode.ECB,
      padding: crypto.pad.Pkcs7
    })
    const result = decrypted.toString(crypto.enc.Utf8)
    
    if (result && result.length > 0 && !result.includes('\u0000')) {
      console.log(`✅ ${methodName}:`, result)
      return result
    }
  } catch (e) {
    console.log(`❌ ${methodName}: Failed`)
  }
  return null
}

// Функция для попытки расшифровки с Triple DES
function tryDecryptWithTripleDES(encryptedString, key, methodName) {
  try {
    const parsedKey = crypto.enc.Utf8.parse(key)
    const decrypted = crypto.TripleDES.decrypt(encryptedString, parsedKey, {
      mode: crypto.mode.ECB,
      padding: crypto.pad.Pkcs7
    })
    const result = decrypted.toString(crypto.enc.Utf8)
    
    if (result && result.length > 0 && !result.includes('\u0000')) {
      console.log(`✅ ${methodName}:`, result)
      return result
    }
  } catch (e) {
    console.log(`❌ ${methodName}: Failed`)
  }
  return null
}

// Функция для попытки расшифровки с разными форматами ключей
function tryDecryptWithKeyFormats(encryptedString, key, methodName) {
  const keyFormats = [
    { format: 'UTF8', parser: crypto.enc.Utf8.parse },
    { format: 'Hex', parser: crypto.enc.Hex.parse },
    { format: 'Base64', parser: crypto.enc.Base64.parse }
  ]
  
  for (const keyFormat of keyFormats) {
    try {
      const parsedKey = keyFormat.parser(key)
      const decrypted = crypto.AES.decrypt(encryptedString, parsedKey, {
        mode: crypto.mode.ECB,
        padding: crypto.pad.Pkcs7
      })
      const result = decrypted.toString(crypto.enc.Utf8)
      
      if (result && result.length > 0 && !result.includes('\u0000')) {
        console.log(`✅ ${methodName} (${keyFormat.format}):`, result)
        return result
      }
    } catch (e) {
      // Игнорируем ошибки
    }
  }
  
  console.log(`❌ ${methodName}: Failed with all key formats`)
  return null
}

// Функция для попытки расшифровки как hex строки
function tryDecryptAsHex(hexString, key, methodName) {
  try {
    // Конвертируем hex в bytes
    const buf = crypto.enc.Hex.parse(hexString)
    
    // Используем ключи как key и IV
    const parsedKey = crypto.enc.Utf8.parse(key)
    const iv = crypto.enc.Utf8.parse(KEY_2)
    
    const decrypted = crypto.AES.decrypt(
      buf.toString(crypto.enc.Base64),
      parsedKey,
      {
        iv: iv,
        mode: crypto.mode.CBC,
        padding: crypto.pad.Pkcs7
      }
    )
    
    const result = decrypted.toString(crypto.enc.Utf8)
    if (result && result.length > 0) {
      console.log(`✅ ${methodName}:`, result)
      return result
    }
  } catch (e) {
    console.log(`❌ ${methodName}: Failed`)
  }
  return null
}

// Функция для попытки расшифровки с переставленными ключами
function tryDecryptWithSwappedKeys(hexString, methodName) {
  try {
    const buf = crypto.enc.Hex.parse(hexString)
    const key = crypto.enc.Utf8.parse(KEY_2) // Используем второй ключ как key
    const iv = crypto.enc.Utf8.parse(KEY_1)  // Используем первый ключ как IV
    
    const decrypted = crypto.AES.decrypt(
      buf.toString(crypto.enc.Base64),
      key,
      {
        iv: iv,
        mode: crypto.mode.CBC,
        padding: crypto.pad.Pkcs7
      }
    )
    
    const result = decrypted.toString(crypto.enc.Utf8)
    if (result && result.length > 0) {
      console.log(`✅ ${methodName}:`, result)
      return result
    }
  } catch (e) {
    console.log(`❌ ${methodName}: Failed`)
  }
  return null
}

console.log("1. AES РАСШИФРОВКА С KEY_1:")
tryDecryptWithMethod(VALUE_TO_DECRYPT, KEY_1, "AES ECB PKCS7", {
  mode: crypto.mode.ECB,
  padding: crypto.pad.Pkcs7
})

tryDecryptWithMethod(VALUE_TO_DECRYPT, KEY_1, "AES CBC PKCS7", {
  mode: crypto.mode.CBC,
  padding: crypto.pad.Pkcs7
})

tryDecryptWithMethod(VALUE_TO_DECRYPT, KEY_1, "AES ECB ZeroPadding", {
  mode: crypto.mode.ECB,
  padding: crypto.pad.ZeroPadding
})

console.log("")
console.log("2. AES РАСШИФРОВКА С KEY_2:")
tryDecryptWithMethod(VALUE_TO_DECRYPT, KEY_2, "AES ECB PKCS7", {
  mode: crypto.mode.ECB,
  padding: crypto.pad.Pkcs7
})

tryDecryptWithMethod(VALUE_TO_DECRYPT, KEY_2, "AES CBC PKCS7", {
  mode: crypto.mode.CBC,
  padding: crypto.pad.Pkcs7
})

tryDecryptWithMethod(VALUE_TO_DECRYPT, KEY_2, "AES ECB ZeroPadding", {
  mode: crypto.mode.ECB,
  padding: crypto.pad.ZeroPadding
})

console.log("")
console.log("3. DES РАСШИФРОВКА:")
tryDecryptWithDES(VALUE_TO_DECRYPT, KEY_1, "DES ECB PKCS7")
tryDecryptWithDES(VALUE_TO_DECRYPT, KEY_2, "DES ECB PKCS7")

console.log("")
console.log("4. TRIPLE DES РАСШИФРОВКА:")
tryDecryptWithTripleDES(VALUE_TO_DECRYPT, KEY_1, "TripleDES ECB PKCS7")
tryDecryptWithTripleDES(VALUE_TO_DECRYPT, KEY_2, "TripleDES ECB PKCS7")

console.log("")
console.log("5. РАЗНЫЕ ФОРМАТЫ КЛЮЧЕЙ:")
tryDecryptWithKeyFormats(VALUE_TO_DECRYPT, KEY_1, "AES with different key formats")

console.log("")
console.log("6. РАСШИФРОВКА КАК HEX:")
tryDecryptAsHex(VALUE_TO_DECRYPT, KEY_1, "AES CBC with KEY_1 as key, KEY_2 as IV")
tryDecryptAsHex(VALUE_TO_DECRYPT, KEY_2, "AES CBC with KEY_2 as key, KEY_1 as IV")

console.log("")
console.log("7. РАСШИФРОВКА С ПЕРЕСТАВЛЕННЫМИ КЛЮЧАМИ:")
tryDecryptWithSwappedKeys(VALUE_TO_DECRYPT, "AES CBC with swapped keys")

console.log("")
console.log("8. ПРОСТЫЕ МЕТОДЫ РАСШИФРОВКИ:")

// Base64 decode
try {
  const base64Decoded = atob(VALUE_TO_DECRYPT)
  console.log("✅ Base64 decode:", base64Decoded)
} catch (e) {
  console.log("❌ Base64 decode: Failed")
}

// Hex decode
try {
  if (/^[0-9a-fA-F]+$/.test(VALUE_TO_DECRYPT)) {
    let hexDecoded = ''
    for (let i = 0; i < VALUE_TO_DECRYPT.length; i += 2) {
      const hex = VALUE_TO_DECRYPT.substr(i, 2)
      hexDecoded += String.fromCharCode(parseInt(hex, 16))
    }
    console.log("✅ Hex decode:", hexDecoded)
  }
} catch (e) {
  console.log("❌ Hex decode: Failed")
}

// URL decode
try {
  const urlDecoded = decodeURIComponent(VALUE_TO_DECRYPT)
  console.log("✅ URL decode:", urlDecoded)
} catch (e) {
  console.log("❌ URL decode: Failed")
}

// Reverse
const reversed = VALUE_TO_DECRYPT.split('').reverse().join('')
console.log("✅ Reverse:", reversed)

console.log("")
console.log("9. АНАЛИЗ СТРУКТУРЫ:")
console.log("Первые 4 символа:", VALUE_TO_DECRYPT.substring(0, 4))
console.log("Следующие 4:", VALUE_TO_DECRYPT.substring(4, 8))
console.log("Следующие 4:", VALUE_TO_DECRYPT.substring(8, 12))
console.log("Последние 4:", VALUE_TO_DECRYPT.substring(VALUE_TO_DECRYPT.length - 4))

console.log("")
console.log("10. ПОПЫТКА РАСШИФРОВКИ ЧАСТЕЙ:")
const parts = [
  VALUE_TO_DECRYPT.substring(0, 32),
  VALUE_TO_DECRYPT.substring(32, 64)
]

parts.forEach((part, index) => {
  console.log(`Часть ${index + 1}:`, part)
  tryDecryptWithMethod(part, KEY_1, `AES ECB PKCS7 (часть ${index + 1})`, {
    mode: crypto.mode.ECB,
    padding: crypto.pad.Pkcs7
  })
})

console.log("")
console.log("=== ЗАКЛЮЧЕНИЕ ===")
console.log("Если ни один метод не сработал, возможно:")
console.log("1. Value генерируется на сервере с другими ключами")
console.log("2. Используется другой алгоритм шифрования")
console.log("3. Value содержит дополнительную информацию (timestamp, nonce)")
console.log("4. Это статический токен, не требующий расшифровки")
