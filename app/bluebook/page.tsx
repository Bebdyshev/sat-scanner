"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ThemeToggle } from "@/components/theme-toggle"
import { bluebookAPI, type DateLocationSetsResponse, type TestData } from "@/lib/bluebook-api"
import { Copy, Check, Download, LogIn, LogOut, RefreshCw } from "lucide-react"

export default function BluebookPage() {
  const [email, setEmail] = useState("yoyaye7963@fogdiver.com")
  const [password, setPassword] = useState("hAdxoqwygwu4sozmac")
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAutoLoading, setIsAutoLoading] = useState(true)
  const [dateLocationSets, setDateLocationSets] = useState<DateLocationSetsResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)
  const [selectedTest, setSelectedTest] = useState<TestData | null>(null)
  const [jsonData, setJsonData] = useState<Array<Record<string, unknown>> | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleLogin = useCallback(async () => {
    if (!email.trim() || !password.trim()) {
      setError("Please enter email and password")
      return false
    }

    setIsLoggingIn(true)
    setError("")

    try {
      await bluebookAPI.login(email.trim(), password.trim())
      setIsAuthenticated(true)
      setError("")
      return true
    } catch (err) {
      setError("Login failed: " + (err instanceof Error ? err.message : "Unknown error"))
      return false
    } finally {
      setIsLoggingIn(false)
    }
  }, [email, password])

  const handleLogout = () => {
    bluebookAPI.logout()
    setIsAuthenticated(false)
    setDateLocationSets(null)
    setSelectedTest(null)
    setJsonData(null)
    setIsModalOpen(false)
    setError("")
  }

  const handleFetchData = useCallback(async () => {
    setIsLoading(true)
    setError("")

    try {
      const data = await bluebookAPI.getDateLocationSets()
      setDateLocationSets(data)
    } catch (err) {
      setError("Failed to fetch data: " + (err instanceof Error ? err.message : "Unknown error"))
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Auto-login and fetch data on page load
  useEffect(() => {
    const autoLoginAndFetch = async () => {
      if (isAutoLoading && !isAuthenticated) {
        try {
          const loginSuccess = await handleLogin()
          // After successful login, automatically fetch data
          if (loginSuccess) {
            await handleFetchData()
          }
        } catch (err) {
          console.error('Auto-login failed:', err)
          const errorMessage = err instanceof Error ? err.message : 'Unknown error'
          setError(`Auto-login failed: ${errorMessage}`)
          
          // If it's an API error, show more details
          if (errorMessage.includes('API Error')) {
            setError(`API Error: ${errorMessage}. The bluebook.plus server may be down or the endpoint may have changed.`)
          }
        } finally {
          setIsAutoLoading(false)
        }
      }
    }

    autoLoginAndFetch()
  }, [isAutoLoading, isAuthenticated, handleLogin, handleFetchData])

  const handleSelectTest = async (test: TestData) => {
    setSelectedTest(test)
    setIsLoading(true)
    setError("")

    try {
      // Try to fetch test data using module1 or module2
      const testId = test.module1 || test.module2
      if (testId) {
        const data = await bluebookAPI.getTestData(testId, test.value)
        
        // Try to parse as JSON for structured display
        try {
          if (typeof data === 'string') {
            const parsed = JSON.parse(data)
            setJsonData(Array.isArray(parsed) ? parsed : [parsed as Record<string, unknown>])
          } else if (Array.isArray(data)) {
            setJsonData(data as Array<Record<string, unknown>>)
          } else {
            setJsonData([data as Record<string, unknown>])
          }
        } catch {
          setJsonData(null)
        }
        
        // Open modal with decrypted data
        setIsModalOpen(true)
      }
    } catch (err) {
      setError("Failed to fetch test data: " + (err instanceof Error ? err.message : "Unknown error"))
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCopyJson = () => {
    if (jsonData) {
      const jsonString = JSON.stringify(jsonData, null, 2)
      navigator.clipboard.writeText(jsonString)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleDownloadJson = () => {
    if (jsonData) {
      const jsonString = JSON.stringify(jsonData, null, 2)
      const blob = new Blob([jsonString], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${selectedTest?.value || 'test-data'}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Bluebook API Integration</h1>
            <p className="text-muted-foreground mt-2">
              Fetch and display data from bluebook.plus API
            </p>
          </div>
          <ThemeToggle />
        </div>

        {!isAuthenticated ? (
          /* Login Section */
          <Card className="p-6 max-w-md mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <LogIn className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">
                {isAutoLoading ? "Auto-logging in..." : "Login to Bluebook"}
              </h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Password
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
              </div>
              
              <div className="space-y-2">
              <Button 
                onClick={handleLogin} 
                disabled={isLoggingIn || isAutoLoading || !email.trim() || !password.trim()}
                className="w-full"
              >
                {isLoggingIn || isAutoLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    {isAutoLoading ? "Auto-logging in..." : "Logging in..."}
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    Login
                  </>
                )}
              </Button>
                
                <div className="text-xs text-muted-foreground text-center">
                  Credentials are pre-filled for demo purposes
                </div>
              </div>
            </div>
          </Card>
        ) : (
          /* Main Content */
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm text-green-600 dark:text-green-400">
                  ✓ Authenticated
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
              
              <Button
                onClick={handleFetchData}
                disabled={isLoading || isAutoLoading}
              >
                {isLoading || isAutoLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    {isAutoLoading ? "Auto-loading..." : "Loading..."}
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Fetch Data
                  </>
                )}
              </Button>
            </div>

            {/* Date Location Sets */}
            {dateLocationSets && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Available Tests</h2>
                {/* English Section */}
                {dateLocationSets.English && dateLocationSets.English.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-3 text-green-600 dark:text-green-400">
                      English ({dateLocationSets.English.length} tests)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {dateLocationSets.English.map((test, index) => (
                        <div key={index} className="border border-border rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-sm">{test.value}</h4>
                            {test.vip === 1 && (
                              <span className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded">
                                VIP
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">
                            Date: {test.date}
                          </p>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full"
                            onClick={() => handleSelectTest(test)}
                          >
                            Select Test
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Math Section */}
                {dateLocationSets.Math && dateLocationSets.Math.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-3 text-blue-600 dark:text-blue-400">
                      Math ({dateLocationSets.Math.length} tests)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {dateLocationSets.Math.map((test, index) => (
                        <div key={index} className="border border-border rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-sm">{test.value}</h4>
                            {test.vip === 1 && (
                              <span className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded">
                                VIP
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">
                            Date: {test.date}
                          </p>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full"
                            onClick={() => handleSelectTest(test)}
                          >
                            Select Test
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                
              </Card>
            )}

          </div>
        )}

        {/* Error Display */}
        {error && (
          <Card className="p-4 mt-6 border-destructive">
            <div className="flex items-center gap-2 text-destructive mb-3">
              <span className="font-medium">Error:</span>
              <span>{error}</span>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setError("")
                  setIsAutoLoading(true)
                }}
                disabled={isAutoLoading}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setError("")}
              >
                Dismiss
              </Button>
            </div>
          </Card>
        )}

        {/* Decrypted Data Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>Decrypted Test Data: {selectedTest?.value}</span>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCopyJson}
                    disabled={!jsonData}
                  >
                    {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                    {copied ? "Copied!" : "Copy All"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleDownloadJson}
                    disabled={!jsonData}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </DialogTitle>
              <DialogDescription>
                {selectedTest && (
                  <div className="grid grid-cols-2 gap-4 text-sm mt-2">
                    <div>
                      <span className="text-muted-foreground">Date:</span>
                      <span className="ml-2">{selectedTest.date}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">VIP:</span>
                      <span className="ml-2">{selectedTest.vip ? "Yes" : "No"}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Module 1:</span>
                      <span className="ml-2 font-mono text-xs">{selectedTest.module1}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Module 2:</span>
                      <span className="ml-2 font-mono text-xs">{selectedTest.module2}</span>
                    </div>
                  </div>
                )}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              {jsonData ? (
                Array.isArray(jsonData) ? (
                  jsonData.map((item, index) => (
                    <div key={index} className="border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-sm">
                          Question {index + 1}
                          {typeof item.type === 'string' && (
                            <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                              {item.type}
                            </span>
                          )}
                        </h3>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCopy(JSON.stringify(item, null, 2))}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        {typeof item.question === 'string' && (
                          <div>
                            <label className="text-xs font-medium text-muted-foreground">Question:</label>
                            <p className="text-sm mt-1">{item.question}</p>
                          </div>
                        )}
                        
                        {typeof item.article === 'string' && (
                          <div>
                            <label className="text-xs font-medium text-muted-foreground">Article:</label>
                            <div
                              className="text-sm mt-1 max-h-20 overflow-y-auto border border-border rounded p-2"
                              dangerouslySetInnerHTML={{ __html: item.article }}
                            />
                          </div>
                        )}
                        
                        {Array.isArray(item.options) && (
                          <div>
                            <label className="text-xs font-medium text-muted-foreground">Options:</label>
                            <div className="text-sm mt-1 space-y-1">
                              {item.options.map((option: { name: string; content: string }, optIndex: number) => (
                                <div key={optIndex} className="flex items-center gap-2">
                                  <span className="font-medium">{option.name}:</span>
                                  <span>{option.content}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {typeof item.correct === 'string' && (
                          <div>
                            <label className="text-xs font-medium text-muted-foreground">Correct Answer:</label>
                            <p className="text-sm mt-1 font-medium text-green-600 dark:text-green-400">
                              {item.correct}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-sm">Object</h3>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCopy(JSON.stringify(jsonData, null, 2))}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <pre className="text-xs font-mono bg-muted p-3 rounded overflow-x-auto">
                      {JSON.stringify(jsonData, null, 2)}
                    </pre>
                  </div>
                )
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    {isLoading ? "Loading test data..." : "No decrypted data available"}
                  </p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
