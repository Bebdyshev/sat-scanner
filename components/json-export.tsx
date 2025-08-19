"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Download, Eye, Copy, Check } from "lucide-react"

interface Question {
  id: number
  type: "multiple-choice" | "grid-in"
  question: string
  options?: string[]
  correctAnswer?: number
  answer?: number
  explanation: string
}

interface JsonExportProps {
  questions: Question[]
  fileName: string
  variant?: "default" | "outline"
  size?: "default" | "sm" | "lg"
  className?: string
}

export function JsonExport({ questions, fileName, variant = "outline", size = "default", className }: JsonExportProps) {
  const [copied, setCopied] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  const jsonString = JSON.stringify(questions, null, 2)
  const exportFileName = `${fileName.replace(".pdf", "")}_questions.json`

  const handleDownload = () => {
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(jsonString)
    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileName)
    linkElement.click()
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonString)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy JSON:", err)
    }
  }

  const validateQuestions = () => {
    const issues = []
    questions.forEach((q, index) => {
      if (!q.question.trim()) issues.push(`Question ${index + 1}: Missing question text`)
      if (q.type === "multiple-choice" && (!q.options || q.options.length < 2))
        issues.push(`Question ${index + 1}: Needs at least 2 options`)
      if (q.type === "multiple-choice" && (q.correctAnswer === undefined || q.correctAnswer < 0))
        issues.push(`Question ${index + 1}: Missing correct answer`)
      if (q.type === "grid-in" && q.answer === undefined) issues.push(`Question ${index + 1}: Missing answer`)
      if (!q.explanation.trim()) issues.push(`Question ${index + 1}: Missing explanation`)
    })
    return issues
  }

  const validationIssues = validateQuestions()

  return (
    <div className={`flex gap-2 ${className}`}>
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size={size}>
            <Eye className="w-4 h-4 mr-2" />
            Preview JSON
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="font-serif">JSON Preview - {exportFileName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {validationIssues.length > 0 && (
              <Card className="border-destructive/20 bg-destructive/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-destructive text-sm font-medium">Validation Issues</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="text-sm text-destructive space-y-1">
                    {validationIssues.map((issue, index) => (
                      <li key={index}>• {issue}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  {questions.length} questions • {(new Blob([jsonString]).size / 1024).toFixed(1)} KB
                </p>
                <Button onClick={handleCopy} size="sm" variant="outline">
                  {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                  {copied ? "Copied!" : "Copy JSON"}
                </Button>
              </div>
              <Textarea
                value={jsonString}
                readOnly
                className="font-mono text-xs h-96 resize-none"
                placeholder="JSON preview will appear here..."
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Button onClick={handleDownload} variant={variant} size={size} disabled={validationIssues.length > 0}>
        <Download className="w-4 h-4 mr-2" />
        Download JSON
      </Button>
    </div>
  )
}
