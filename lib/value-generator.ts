// Генератор Value заголовка для bluebook API
import crypto from 'crypto'

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
 * Генерирует Value заголовок для API запросов
 * @param testData - данные теста
 * @param userData - данные пользователя
 * @param timestamp - временная метка (опционально)
 * @returns сгенерированный Value заголовок
 */
export function generateValueHeader(
  testData: TestData, 
  userData?: UserData, 
  timestamp?: number
): string {
  // Если передан timestamp, используем его, иначе текущее время
  const ts = timestamp || Date.now()
  
  // Различные стратегии генерации Value
  
  // Стратегия 1: Статический токен (если Value не меняется)
  if (isStaticToken()) {
    return '0100333303F78D0658696A5F465FA63D4F7716DF75A1625A26ADCBFB2831A011'
  }
  
  // Стратегия 2: На основе module1 + timestamp
  const strategy2 = generateFromModule1AndTime(testData.module1, ts)
  
  // Стратегия 3: На основе комбинации данных
  const strategy3 = generateFromCombinedData(testData, userData, ts)
  
  // Стратегия 4: На основе пользователя + теста
  const strategy4 = generateFromUserAndTest(testData, userData, ts)
  
  // Возвращаем первую рабочую стратегию
  return strategy2 || strategy3 || strategy4 || getDefaultValue()
}

/**
 * Проверяет, является ли Value статическим токеном
 */
function isStaticToken(): boolean {
  // Если Value не меняется между запросами, это статический токен
  return true // Пока используем статический токен
}

/**
 * Генерирует Value на основе module1 и времени
 */
function generateFromModule1AndTime(module1: string, timestamp: number): string {
  const combined = module1 + timestamp.toString()
  const hash = crypto.createHash('sha256').update(combined).digest('hex')
  return hash.toUpperCase()
}

/**
 * Генерирует Value на основе комбинации данных
 */
function generateFromCombinedData(testData: TestData, userData?: UserData, timestamp?: number): string {
  const data = {
    module1: testData.module1,
    module2: testData.module2,
    date: testData.date,
    userId: userData?.userId || '',
    timestamp: timestamp || Date.now()
  }
  
  const combined = JSON.stringify(data)
  const hash = crypto.createHash('sha256').update(combined).digest('hex')
  return hash.toUpperCase()
}

/**
 * Генерирует Value на основе пользователя и теста
 */
function generateFromUserAndTest(testData: TestData, userData?: UserData, timestamp?: number): string {
  const user = userData?.email || userData?.userId || 'default'
  const test = testData.module1
  const time = timestamp || Date.now()
  
  const combined = `${user}:${test}:${time}`
  const hash = crypto.createHash('sha256').update(combined).digest('hex')
  return hash.toUpperCase()
}

/**
 * Возвращает значение по умолчанию
 */
function getDefaultValue(): string {
  return '0100333303F78D0658696A5F465FA63D4F7716DF75A1625A26ADCBFB2831A011'
}

/**
 * Анализирует существующий Value заголовок
 */
export function analyzeValueHeader(value: string): {
  length: number
  isHex: boolean
  possibleStrategies: string[]
  suggestions: string[]
} {
  const isHex = /^[0-9A-Fa-f]+$/.test(value)
  const length = value.length
  
  const possibleStrategies = []
  const suggestions = []
  
  if (length === 64) {
    possibleStrategies.push('SHA256 hash')
    possibleStrategies.push('Double MD5 hash')
    possibleStrategies.push('Custom 32-byte token')
  }
  
  if (isHex) {
    possibleStrategies.push('Hex-encoded data')
    suggestions.push('Может быть зашифрованными данными')
  }
  
  if (value.startsWith('0100')) {
    suggestions.push('Начинается с 0100 - возможно версия или тип')
  }
  
  return {
    length,
    isHex,
    possibleStrategies,
    suggestions
  }
}

/**
 * Тестирует различные стратегии генерации Value
 */
export function testValueGeneration(testData: TestData, userData?: UserData): {
  static: string
  module1Time: string
  combined: string
  userTest: string
  analysis: ReturnType<typeof analyzeValueHeader>
} {
  const timestamp = Date.now()
  
  return {
    static: getDefaultValue(),
    module1Time: generateFromModule1AndTime(testData.module1, timestamp),
    combined: generateFromCombinedData(testData, userData, timestamp),
    userTest: generateFromUserAndTest(testData, userData, timestamp),
    analysis: analyzeValueHeader(getDefaultValue())
  }
}
