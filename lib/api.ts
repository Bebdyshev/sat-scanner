// API client for communicating with the backend FastAPI server

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000'

export interface Question {
  id: number
  type: "multiple-choice" | "grid-in"
  question: string
  options?: string[]
  correctAnswer?: number
  answer?: number
  explanation: string
}

export interface AnalysisResponse {
  analysis_id: string
  title: string
  description: string
  total_questions: number
  questions: Question[]
  created_at: string
  summary: string
}

export interface UploadResponse {
  message: string
  filename: string
  file_size: number
  analysis_id: string
}

export interface ApiError {
  detail: string
}

/**
 * Upload a PDF file for SAT question analysis
 */
export async function uploadSATQuestions(
  file: File,
  title?: string,
  description?: string
): Promise<AnalysisResponse> {
  const formData = new FormData()
  formData.append('file', file)
  
  if (title) {
    formData.append('title', title)
  }
  
  if (description) {
    formData.append('description', description)
  }

  const response = await fetch(`${BACKEND_URL}/leak/upload-questions-json`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const error: ApiError = await response.json()
    throw new Error(error.detail || `HTTP error! status: ${response.status}`)
  }

  return response.json()
}

/**
 * Upload a PDF file for ACT question analysis
 */
export async function uploadACTQuestions(
  file: File,
  title?: string,
  description?: string
): Promise<AnalysisResponse> {
  const formData = new FormData()
  formData.append('file', file)
  
  if (title) {
    formData.append('title', title)
  }
  
  if (description) {
    formData.append('description', description)
  }

  const response = await fetch(`${BACKEND_URL}/leak/upload-act-questions-json`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const error: ApiError = await response.json()
    throw new Error(error.detail || `HTTP error! status: ${response.status}`)
  }

  return response.json()
}

/**
 * Get analysis results by analysis ID
 */
export async function getAnalysisResult(analysisId: string): Promise<AnalysisResponse> {
  const response = await fetch(`${BACKEND_URL}/leak/questions/${analysisId}`)

  if (!response.ok) {
    const error: ApiError = await response.json()
    throw new Error(error.detail || `HTTP error! status: ${response.status}`)
  }

  return response.json()
}

/**
 * Health check for the backend
 */
export async function healthCheck(): Promise<{ status: string; message: string }> {
  const response = await fetch(`${BACKEND_URL}/health`)

  if (!response.ok) {
    throw new Error(`Backend health check failed: ${response.status}`)
  }

  return response.json()
}

/**
 * Check if backend is available
 */
export async function isBackendAvailable(): Promise<boolean> {
  try {
    await healthCheck()
    return true
  } catch (error) {
    console.error('Backend not available:', error)
    return false
  }
}
