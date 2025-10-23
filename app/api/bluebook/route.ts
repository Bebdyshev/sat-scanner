import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = 'https://api-prod.bluebook.plus'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { endpoint, method = 'GET', data, headers = {} } = body

    if (!endpoint) {
      return NextResponse.json({ error: 'Endpoint is required' }, { status: 400 })
    }

    const url = `${API_BASE_URL}${endpoint}`
    
    const fetchOptions: RequestInit = {
      method,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:144.0) Gecko/20100101 Firefox/144.0',
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Referer': 'https://bluebook.plus/',
        'Origin': 'https://bluebook.plus',
        'Sec-GPC': '1',
        'Connection': 'keep-alive',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site',
        'Priority': 'u=0',
        'TE': 'trailers',
        'Content-Type': 'application/json',
        ...headers
      }
    }

    if (data && method !== 'GET') {
      fetchOptions.body = JSON.stringify(data)
    }

    // Log the full request details
    console.log('=== FULL REQUEST DETAILS ===')
    console.log('Environment:', process.env.NODE_ENV)
    console.log('URL:', url)
    console.log('Method:', method)
    console.log('Headers:', fetchOptions.headers)
    console.log('Body:', fetchOptions.body)
    console.log('============================')

    const response = await fetch(url, fetchOptions)
    const responseData = await response.text()

    // Log the response for debugging
    console.log('API Response Status:', response.status)
    console.log('API Response Headers:', Object.fromEntries(response.headers.entries()))
    console.log('API Response Data Length:', responseData.length)
    console.log('API Response Data Type:', typeof responseData)
    console.log('API Response Data Preview:', responseData.substring(0, 500) + '...')
    
    // Check if response contains binary/encrypted data
    if (responseData.includes('\u0000') || responseData.includes('\x00')) {
      console.log('⚠️  Detected binary/encrypted data in response')
      console.log('Binary data preview (hex):', Buffer.from(responseData.substring(0, 100), 'binary').toString('hex'))
    }

    // Try to parse as JSON, fallback to text
    let parsedData
    try {
      parsedData = JSON.parse(responseData)
    } catch {
      parsedData = responseData
    }

    // Handle different response statuses
    if (!response.ok) {
      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText,
        data: parsedData
      })
      
      return NextResponse.json({
        error: `API Error: ${response.status} ${response.statusText}`,
        data: parsedData,
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      }, { status: response.status })
    }

    return NextResponse.json({
      data: parsedData,
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    })
  } catch (error) {
    console.error('Proxy error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
