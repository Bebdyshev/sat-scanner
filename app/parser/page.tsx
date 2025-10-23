"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Upload, FileText, Loader2, Sparkles } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null)
  const [fileUrl, setFileUrl] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const router = useRouter()

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile)
      const url = URL.createObjectURL(droppedFile)
      setFileUrl(url)
      setShowPreview(true)
    }
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile)
      const url = URL.createObjectURL(selectedFile)
      setFileUrl(url)
      setShowPreview(true)
    }
  }, [])

  const handleAnalyze = async () => {
    if (!file) return

    setIsUploading(true)

    try {
      // Store only the object URL (small string) to avoid sessionStorage quota issues
      if (fileUrl) {
        sessionStorage.setItem("pdfFile", fileUrl)
        sessionStorage.setItem("pdfFileName", file.name)
        router.push("/analyze")
      } else {
        const url = URL.createObjectURL(file)
        setFileUrl(url)
        sessionStorage.setItem("pdfFile", url)
        sessionStorage.setItem("pdfFileName", file.name)
        router.push("/analyze")
      }
    } catch (error) {
      console.error("Error processing file:", error)
      setIsUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="h-screen flex flex-col">
        <div className="flex justify-end p-6">
          <ThemeToggle />
        </div>

        {!showPreview ? (
          /* Upload Area */
          <div className="flex-1 px-64 pb-6">
            <input 
              type="file" 
              accept=".pdf" 
              onChange={handleFileSelect} 
              className="hidden" 
              id="file-upload" 
            />
            <label 
              htmlFor="file-upload"
              className={`
                border border-dashed rounded-lg transition-colors cursor-pointer w-full h-full flex flex-col items-center justify-center
                ${
                  isDragging
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }
              `}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Upload className="w-8 h-8 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Upload SAT PDF</h3>
              <p className="text-muted-foreground mb-6">
                Drop your PDF file here or click to select
              </p>
              <Button variant="outline" className="pointer-events-none">
                Choose File
              </Button>
            </label>
          </div>
        ) : (
          /* PDF Preview */
          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">{file?.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file?.size && (file.size / 1024 / 1024).toFixed(2))} MB
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowPreview(false)
                    setFile(null)
                    setFileUrl(null)
                    if (fileUrl) URL.revokeObjectURL(fileUrl)
                  }}
                >
                  Upload New File
                </Button>
                <Button
                  onClick={handleAnalyze}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Analyze with AI
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            <div className="flex-1 p-6">
              {fileUrl && (
                <iframe
                  src={fileUrl}
                  className="w-full h-full border border-border rounded-lg"
                  title="PDF Preview"
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
