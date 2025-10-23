// Тест расшифровки API ответа
const crypto = require('crypto-js')

// Ключи из decrypt.ts
const KEY_1 = "1118394794UHWU29"
const KEY_2 = "DDWDEF2344564412"

// Пример зашифрованного API ответа (первые 200 символов)
const ENCRYPTED_API_RESPONSE = "20AF88A303A608E98BC1C2B8BFF7BA09826649F18681FF5C26BFF591875212CA4F331CED500F10FF69EA63BEC020ED14AC0D9A80DFA8B435FDDD55761295E5BC9EA217E0AE3244B9A653314916B4E261A1D60F1B942AEE81BD2EF4B3D3E716403808336D65A437D4DFE2306B1468C9C8E030CBDBF9CD83889CB3A769EDAF91E08B3799F129C66794429E86205F2F0C32080B594C3CBE053277E15A898864E63E3E9955C48DFDF5A79057D8724A51B89380998B87668CDA958789400EE529EB4DEA9437ECDA1A15D325507AE6635584DC3ECAD3D8B0355FAABDF01394E10506509045C090022382ADFA77F96E3A092F8043E2A4F2EB48271AA85"

console.log("=== ТЕСТ РАСШИФРОВКИ API ОТВЕТА ===")
console.log("Зашифрованный ответ (первые 200 символов):", ENCRYPTED_API_RESPONSE)
console.log("Длина:", ENCRYPTED_API_RESPONSE.length)
console.log("")

// Функция для расшифровки hex строки (из decrypt.ts)
function nodeStyleDecrypt(hexString) {
  try {
    // Convert hex string to bytes
    const buf = crypto.enc.Hex.parse(hexString)
    
    // Use the keys as key and IV (16 bytes each)
    const key = crypto.enc.Utf8.parse(KEY_1) // 16 bytes
    const iv = crypto.enc.Utf8.parse(KEY_2)  // 16 bytes
    
    // Decrypt using AES-128-CBC
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
    return result || null
  } catch (error) {
    console.error('Node style decrypt failed:', error)
    return null
  }
}

// Функция для попытки расшифровки с переставленными ключами
function tryDecryptWithSwappedKeys(hexString) {
  try {
    const buf = crypto.enc.Hex.parse(hexString)
    const key = crypto.enc.Utf8.parse(KEY_2) // Use second key as key
    const iv = crypto.enc.Utf8.parse(KEY_1)  // Use first key as IV
    
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
    return result || null
  } catch (error) {
    return null
  }
}

// Функция для попытки расшифровки с разными методами
function tryDifferentDecryptionMethods(hexString) {
  const methods = [
    { name: 'AES CBC with KEY_1 as key, KEY_2 as IV', func: nodeStyleDecrypt },
    { name: 'AES CBC with KEY_2 as key, KEY_1 as IV', func: tryDecryptWithSwappedKeys }
  ]
  
  for (const method of methods) {
    try {
      const result = method.func(hexString)
      if (result && result.length > 0 && !result.includes('\u0000')) {
        console.log(`✅ ${method.name}:`)
        console.log('Результат:', result)
        console.log('Длина:', result.length)
        console.log('Первые 200 символов:', result.substring(0, 200))
        console.log('')
        
        // Попробуем распарсить как JSON
        try {
          const jsonData = JSON.parse(result)
          console.log('✅ Успешно распарсен как JSON!')
          console.log('JSON ключи:', Object.keys(jsonData))
          console.log('JSON структура:', JSON.stringify(jsonData, null, 2).substring(0, 500) + '...')
          return { success: true, data: jsonData, method: method.name }
        } catch {
          console.log('❌ Не является валидным JSON')
        }
        
        return { success: true, data: result, method: method.name }
      }
    } catch (error) {
      console.log(`❌ ${method.name}: Failed - ${error.message}`)
    }
  }
  
  return { success: false, error: 'All decryption methods failed' }
}

// Тест расшифровки
console.log("1. ПОПЫТКА РАСШИФРОВКИ:")
const result = tryDifferentDecryptionMethods(ENCRYPTED_API_RESPONSE)

if (result.success) {
  console.log("✅ РАСШИФРОВКА УСПЕШНА!")
  console.log("Метод:", result.method)
  console.log("Тип данных:", typeof result.data)
  
  if (typeof result.data === 'object') {
    console.log("JSON ключи:", Object.keys(result.data))
  }
} else {
  console.log("❌ РАСШИФРОВКА НЕУДАЧНА")
  console.log("Ошибка:", result.error)
}

console.log("")
console.log("2. ДОПОЛНИТЕЛЬНЫЕ ТЕСТЫ:")

// Тест с разными длинами hex строки
const testLengths = [32, 64, 128, 256, 512]
testLengths.forEach(length => {
  const testHex = ENCRYPTED_API_RESPONSE.substring(0, length)
  console.log(`Тест с длиной ${length}:`, testHex)
  
  const testResult = nodeStyleDecrypt(testHex)
  if (testResult) {
    console.log(`  ✅ Расшифровано: ${testResult.substring(0, 50)}...`)
  } else {
    console.log(`  ❌ Не удалось расшифровать`)
  }
})

console.log("")
console.log("=== ЗАКЛЮЧЕНИЕ ===")
if (result.success) {
  console.log("✅ API ответ успешно расшифрован!")
  console.log("✅ Можно интегрировать в Bluebook API")
  console.log("✅ Функция decryptApiResponse будет работать")
} else {
  console.log("❌ Нужно исследовать другие методы расшифровки")
  console.log("❌ Возможно, используется другой алгоритм")
}
