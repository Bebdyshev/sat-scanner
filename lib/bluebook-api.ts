// Bluebook API integration
const API_BASE_URL = 'https://api-prod.bluebook.plus'
const PROXY_URL = '/api/bluebook'

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

  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await fetch(PROXY_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          endpoint: '/auth/login/',
          method: 'POST',
          data: { email, password }
        })
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
      const response = await fetch(PROXY_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          endpoint: '/date_location_sets',
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`
          }
        })
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch date location sets: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()
      
      if (result.error) {
        throw new Error(result.error)
      }

      return result.data
    } catch (error) {
      console.error('Fetch date location sets error:', error)
      throw error
    }
  }

  async getTestData(testId: string): Promise<any> {
    if (!this.accessToken) {
      throw new Error('Not authenticated. Please login first.')
    }

    try {
      const response = await fetch(PROXY_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          endpoint: `/getexam/${testId}`,
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`
          }
        })
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch test data: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()
      
      if (result.error) {
        throw new Error(result.error)
      }

      return result.data
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
