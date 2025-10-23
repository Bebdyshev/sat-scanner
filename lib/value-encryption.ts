// Генератор Value заголовка используя алгоритмы шифрования из decrypt.ts
import CryptoJS from 'crypto-js'

// Те же ключи что и в decrypt.ts
const KEY_1 = "1118394794UHWU29"
const KEY_2 = "DDWDEF2344564412"

export interface TestData {
  module1: string
  module2: string
  value: string
  date: string
  vip: number
}

export interface UserData {
  userId?: string
  email?: string
  sessionToken?: string
}

/**
 * Генерирует Value заголовок используя найденный алгоритм
 * @param testData - данные теста
 * @param userData - данные пользователя
 * @param timestamp - временная метка (опционально)
 * @returns сгенерированный Value заголовок
 */
export function generateValueWithFoundAlgorithm(
  testData: TestData
): string {
  // Используем найденный алгоритм: AES CBC с KEY_1 как ключ и KEY_2 как IV
  // Шифруем название теста
  
  try {
    const testName = testData.value || 'Test Data'
    const parsedKey = CryptoJS.enc.Utf8.parse(KEY_1)
    const iv = CryptoJS.enc.Utf8.parse(KEY_2)
    
    const encrypted = CryptoJS.AES.encrypt(testName, parsedKey, {
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
      iv: iv
    })
    
    // Конвертируем в hex формат как в оригинальном Value
    const hexString = encrypted.ciphertext.toString(CryptoJS.enc.Hex)
    
    console.log('=== FOUND ALGORITHM GENERATION ===')
    console.log('Test name:', testName)
    console.log('Encrypted hex:', hexString)
    console.log('Length:', hexString.length)
    console.log('=================================')
    
    return hexString.toUpperCase()
  } catch (error) {
    console.error('Error generating Value:', error)
    return getStaticValue()
  }
}

/**
 * Шифрует module1 + timestamp
 */
function encryptModule1AndTime(module1: string, timestamp: number): string {
  try {
    const combined = module1 + timestamp.toString()
    const parsedKey = CryptoJS.enc.Utf8.parse(KEY_1)
    
    const encrypted = CryptoJS.AES.encrypt(combined, parsedKey, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    })
    
    return encrypted.toString().replace(/[^0-9A-Fa-f]/g, '').toUpperCase()
  } catch {
    return ''
  }
}

/**
 * Шифрует комбинацию данных
 */
function encryptCombinedData(testData: TestData, userData?: UserData, timestamp?: number): string {
  try {
    const data = {
      module1: testData.module1,
      module2: testData.module2,
      date: testData.date,
      userId: userData?.userId || '',
      timestamp: timestamp || Date.now()
    }
    
    const combined = JSON.stringify(data)
    const parsedKey = CryptoJS.enc.Utf8.parse(KEY_2)
    
    const encrypted = CryptoJS.AES.encrypt(combined, parsedKey, {
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    })
    
    return encrypted.toString().replace(/[^0-9A-Fa-f]/g, '').toUpperCase()
  } catch {
    return ''
  }
}

/**
 * Шифрует пользователя + тест
 */
function encryptUserAndTest(testData: TestData, userData?: UserData, timestamp?: number): string {
  try {
    const user = userData?.email || userData?.userId || 'default'
    const test = testData.module1
    const time = timestamp || Date.now()
    
    const combined = `${user}:${test}:${time}`
    const parsedKey = CryptoJS.enc.Utf8.parse(KEY_1)
    
    const encrypted = CryptoJS.AES.encrypt(combined, parsedKey, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    })
    
    return encrypted.toString().replace(/[^0-9A-Fa-f]/g, '').toUpperCase()
  } catch {
    return ''
  }
}

/**
 * Шифрует только module1
 */
function encryptModule1(module1: string): string {
  try {
    const parsedKey = CryptoJS.enc.Utf8.parse(KEY_1)
    
    const encrypted = CryptoJS.AES.encrypt(module1, parsedKey, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    })
    
    return encrypted.toString().replace(/[^0-9A-Fa-f]/g, '').toUpperCase()
  } catch {
    return ''
  }
}

/**
 * Шифрует с использованием обоих ключей
 */
function encryptWithBothKeys(testData: TestData, userData?: UserData, timestamp?: number): string {
  try {
    const data = {
      module1: testData.module1,
      module2: testData.module2,
      user: userData?.email || 'default',
      timestamp: timestamp || Date.now()
    }
    
    const combined = JSON.stringify(data)
    
    // Сначала шифруем с KEY_1
    const parsedKey1 = CryptoJS.enc.Utf8.parse(KEY_1)
    const encrypted1 = CryptoJS.AES.encrypt(combined, parsedKey1, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    })
    
    // Затем шифруем результат с KEY_2
    const parsedKey2 = CryptoJS.enc.Utf8.parse(KEY_2)
    const encrypted2 = CryptoJS.AES.encrypt(encrypted1.toString(), parsedKey2, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    })
    
    return encrypted2.toString().replace(/[^0-9A-Fa-f]/g, '').toUpperCase()
  } catch {
    return ''
  }
}

/**
 * Возвращает статический Value
 */
function getStaticValue(): string {
  return '0100333303F78D0658696A5F465FA63D4F7716DF75A1625A26ADCBFB2831A011'
}

/**
 * Пытается расшифровать существующий Value для понимания структуры
 */
export function analyzeValueWithDecryption(value: string): {
  decryptedWithKey1?: string
  decryptedWithKey2?: string
  possibleStructures: string[]
} {
  const possibleStructures: string[] = []
  
  try {
    // Пытаемся расшифровать с KEY_1
    const parsedKey1 = CryptoJS.enc.Utf8.parse(KEY_1)
    const decrypted1 = CryptoJS.AES.decrypt(value, parsedKey1, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    })
    const result1 = decrypted1.toString(CryptoJS.enc.Utf8)
    
    if (result1 && result1.length > 0) {
      possibleStructures.push('Decrypted with KEY_1: ' + result1)
    }
  } catch {
    // Игнорируем ошибки
  }
  
  try {
    // Пытаемся расшифровать с KEY_2
    const parsedKey2 = CryptoJS.enc.Utf8.parse(KEY_2)
    const decrypted2 = CryptoJS.AES.decrypt(value, parsedKey2, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    })
    const result2 = decrypted2.toString(CryptoJS.enc.Utf8)
    
    if (result2 && result2.length > 0) {
      possibleStructures.push('Decrypted with KEY_2: ' + result2)
    }
  } catch {
    // Игнорируем ошибки
  }
  
  return {
    possibleStructures
  }
}

/**
 * Тестирует все стратегии шифрования
 */
export function testAllEncryptionStrategies(testData: TestData, userData?: UserData): {
  strategies: Record<string, string>
  analysis: ReturnType<typeof analyzeValueWithDecryption>
} {
  const timestamp = Date.now()
  
  return {
    strategies: {
      'module1 + time': encryptModule1AndTime(testData.module1, timestamp),
      'combined data': encryptCombinedData(testData, userData, timestamp),
      'user + test': encryptUserAndTest(testData, userData, timestamp),
      'module1 only': encryptModule1(testData.module1),
      'both keys': encryptWithBothKeys(testData, userData, timestamp),
      'static': getStaticValue()
    },
    analysis: analyzeValueWithDecryption(getStaticValue())
  }
}
