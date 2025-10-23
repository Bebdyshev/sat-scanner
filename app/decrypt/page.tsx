"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ThemeToggle } from "@/components/theme-toggle"
import { comprehensiveDecrypt } from "@/lib/decrypt"
import { Unlock, Copy, Check, AlertCircle, Download } from "lucide-react"

export default function DecryptPage() {
  const [encryptedInput, setEncryptedInput] = useState("")
  const [decryptedOutput, setDecryptedOutput] = useState("")
  const [isDecrypting, setIsDecrypting] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState("")
  const [decryptionMethod, setDecryptionMethod] = useState("")
  const [jsonData, setJsonData] = useState<Array<Record<string, unknown>> | null>(null)

  const handleDecrypt = async () => {
    if (!encryptedInput.trim()) {
      setError("Please enter an encrypted string")
      return
    }

    setIsDecrypting(true)
    setError("")

    try {
      // Try comprehensive decryption with all methods
      const result = comprehensiveDecrypt(encryptedInput.trim())
      
      if (result) {
        setDecryptedOutput(result)
        setDecryptionMethod("Successfully decrypted using comprehensive method")
        setError("")
        
        // Try to parse as JSON
        try {
          const parsed = JSON.parse(result)
          setJsonData(parsed)
        } catch {
          // If not JSON, try to clean and parse
          try {
            const cleaned = result.replace(/^["']|["']$/g, '') // Remove quotes if present
            const parsed = JSON.parse(cleaned)
            setJsonData(parsed)
          } catch {
            setJsonData(null)
          }
        }
      } else {
        setError("Failed to decrypt with all methods. The string might not be encrypted with the provided keys or use a different encryption algorithm.")
        setDecryptionMethod("")
        setJsonData(null)
      }
    } catch (err) {
      setError("Decryption failed: " + (err instanceof Error ? err.message : "Unknown error"))
      setDecryptionMethod("")
    } finally {
      setIsDecrypting(false)
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
      a.download = 'decrypted-data.json'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  const clearAll = () => {
    setEncryptedInput("")
    setDecryptedOutput("")
    setError("")
    setDecryptionMethod("")
    setJsonData(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Encryption/Decryption Tool</h1>
            <p className="text-muted-foreground mt-2">
              Decrypt strings using the provided encryption keys
            </p>
          </div>
          <ThemeToggle />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Decryption Section */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Unlock className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Decrypt String</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Encrypted String
                </label>
                <Textarea
                  value={encryptedInput}
                  onChange={(e) => setEncryptedInput(e.target.value)}
                  placeholder="Enter encrypted string here..."
                  className="min-h-[100px]"
                />
              </div>
              
              <Button 
                onClick={handleDecrypt} 
                disabled={isDecrypting || !encryptedInput.trim()}
                className="w-full"
              >
                {isDecrypting ? (
                  <>
                    <Unlock className="w-4 h-4 mr-2 animate-spin" />
                    Decrypting...
                  </>
                ) : (
                  <>
                    <Unlock className="w-4 h-4 mr-2" />
                    Decrypt
                  </>
                )}
              </Button>
              
              {decryptedOutput && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Decrypted Result
                  </label>
                  <div className="relative">
                    <Textarea
                      value={decryptedOutput}
                      readOnly
                      className="min-h-[100px] pr-10"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute top-2 right-2"
                      onClick={() => handleCopy(decryptedOutput)}
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                  {decryptionMethod && (
                    <div className="mt-2 text-sm text-green-600 dark:text-green-400">
                      ✓ {decryptionMethod}
                    </div>
                  )}
                </div>
              )}

            </div>
          </Card>

          {/* JSON Blocks Section */}
          {jsonData && (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold">JSON Data</h2>
                  <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
                    {Array.isArray(jsonData) ? `${jsonData.length} items` : 'Object'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCopyJson}
                  >
                    {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                    {copied ? "Copied!" : "Copy All"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleDownloadJson}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {Array.isArray(jsonData) ? (
                  jsonData.map((item, index) => (
                    <div key={index} className="border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-sm">
                          Item {index + 1}
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
                )}
              </div>
            </Card>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <Card className="p-4 mt-6 border-destructive">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">Error:</span>
              <span>{error}</span>
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <Button variant="outline" onClick={clearAll}>
            Clear All
          </Button>
        </div>
      </div>
    </div>
  )
}
