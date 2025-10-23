// Bluebook API integration
const PROXY_URL = '/api/bluebook'
import { generateValueWithFoundAlgorithm, type TestData as ValueTestData } from './value-encryption'
import { comprehensiveDecrypt } from './decrypt'

export interface LoginResponse {
  access_token: string
  refresh_token: string
  user: {
    id: string
    email: string
  }
}

export interface TestData {
  module1: string
  module2: string
  value: string
  date: string
  vip: number
}

export interface DateLocationSetsResponse {
  Math: TestData[]
  English: TestData[]
}

export interface DateLocationSet {
  id: string
  name: string
  date: string
  modules: TestData[]
}

export class BluebookAPI {
  private accessToken: string | null = null
  private refreshToken: string | null = null

  /**
   * Decrypts API response if it's encrypted hex data
   * @param data - The API response data
   * @returns Decrypted data or original data if not encrypted
   */
  private decryptApiResponse(data: unknown): unknown {
    // Check if data is a hex string (encrypted)
    if (typeof data === 'string' && /^[0-9A-Fa-f]+$/.test(data)) {
      console.log('=== API RESPONSE DECRYPTION ===')
      console.log('Detected encrypted hex response')
      console.log('Hex length:', data.length)
      console.log('First 100 chars:', data.substring(0, 100))
      
      try {
        const decrypted = comprehensiveDecrypt(data)
        if (decrypted) {
          console.log('Successfully decrypted API response')
          console.log('Decrypted length:', decrypted.length)
          console.log('First 200 chars:', decrypted.substring(0, 200))
          
          // Try to parse as JSON
          try {
            const jsonData = JSON.parse(decrypted)
            console.log('Successfully parsed as JSON')
            console.log('JSON keys:', Object.keys(jsonData))
            return jsonData
          } catch {
            console.log('Not valid JSON, returning decrypted string')
            return decrypted
          }
        } else {
          console.log('Failed to decrypt, returning raw data')
          return data
        }
      } catch (error) {
        console.error('Decryption error:', error)
        return data
      }
    }
    
    return data
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const requestData = {
        endpoint: '/auth/login/',
        method: 'POST',
        data: { email, password }
      }
      
      console.log('=== LOGIN REQUEST ===')
      console.log('Request data:', requestData)
      console.log('=====================')
      
      const response = await fetch(PROXY_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      })

      if (!response.ok) {
        throw new Error(`Login failed: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()
      
      if (result.error) {
        throw new Error(result.error)
      }

      const data = result.data
      this.accessToken = data.access_token
      this.refreshToken = data.refresh_token
      
      return {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        user: {
          id: data.user?.id || '',
          email: data.user?.email || ''
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  async getDateLocationSets(): Promise<DateLocationSetsResponse> {
    if (!this.accessToken) {
      throw new Error('Not authenticated. Please login first.')
    }

    try {
      // Генерируем Value для запроса списка тестов
      const testData: ValueTestData = {
        module1: 'date_location_sets',
        module2: '',
        value: 'Date Location Sets',
        date: new Date().toISOString().slice(0, 7),
        vip: 0
      }
      
      const generatedValue = generateValueWithFoundAlgorithm(testData)
      
      console.log('=== DATE LOCATION SETS VALUE GENERATION ===')
      console.log('Test data:', testData)
      console.log('Generated value:', generatedValue)
      console.log('==========================================')
      
      const requestData = {
        endpoint: '/date_location_sets',
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Value': generatedValue
        }
      }
      
      console.log('=== DATE LOCATION SETS REQUEST ===')
      console.log('Request data:', requestData)
      console.log('=================================')
      
      const response = await fetch(PROXY_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch date location sets: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()
      
      if (result.error) {
        console.error('API Error Response:', result)
        throw new Error(result.error)
      }

      if (!result.data) {
        console.error('No data in response:', result)
        throw new Error('No data received from API')
      }

      return result.data
    } catch (error) {
      console.error('Fetch date location sets error:', error)
      throw error
    }
  }

  async getTestData(testId: string, testName?: string): Promise<unknown> {
    if (!this.accessToken) {
      throw new Error('Not authenticated. Please login first.')
    }

    try {
      // Генерируем Value используя название теста
      const testData: ValueTestData = {
        module1: testId,
        module2: '', // Будет заполнено из ответа API
        value: testName || `Test ${testId}`,
        date: new Date().toISOString().slice(0, 7), // YYYY-MM
        vip: 0
      }
      
      const generatedValue = generateValueWithFoundAlgorithm(testData)
      
      console.log('=== TEST DATA VALUE GENERATION ===')
      console.log('Test data:', testData)
      console.log('Generated value:', generatedValue)
      console.log('===================================')
      
      const requestData = {
        endpoint: `/getexam/${testId}`,
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Value': generatedValue
        }
      }
      
      console.log('=== GET TEST DATA REQUEST ===')
      console.log('Request data:', requestData)
      console.log('=============================')
      
      const response = await fetch(PROXY_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch test data: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()
      
      if (result.error) {
        console.error('API Error Response:', result)
        throw new Error(result.error)
      }

      if (!result.data) {
        console.error('No data in response:', result)
        throw new Error('No data received from API')
      }

      // Decrypt the response if it's encrypted
      const decryptedData = this.decryptApiResponse(result.data)
      return decryptedData
    } catch (error) {
      console.error('Fetch test data error:', error)
      throw error
    }
  }

  isAuthenticated(): boolean {
    return this.accessToken !== null
  }

  getAccessToken(): string | null {
    return this.accessToken
  }

  logout(): void {
    this.accessToken = null
    this.refreshToken = null
  }
}

// Create a singleton instance
export const bluebookAPI = new BluebookAPI()
