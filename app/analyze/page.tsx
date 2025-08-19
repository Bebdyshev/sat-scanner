"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Edit3, Eye, ArrowLeft } from "lucide-react"
import { JsonExport } from "@/components/json-export"
import { ThemeToggle } from "@/components/theme-toggle"
import { uploadSATQuestions } from "@/lib/api"

interface Question {
  id: number
  type: "multiple-choice" | "grid-in"
  question: string
  options?: string[]
  correctAnswer?: number
  answer?: number
  explanation: string
}

export default function AnalyzePage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [pdfUrl, setPdfUrl] = useState<string>("")
  const [fileName, setFileName] = useState<string>("")
  const [error, setError] = useState<string>("")
  const router = useRouter()

  useEffect(() => {
    const analyzePDF = async () => {
      try {
        // Get PDF data from sessionStorage
        const pdfData = sessionStorage.getItem("pdfFile")
        const pdfFileName = sessionStorage.getItem("pdfFileName")

        if (!pdfData || !pdfFileName) {
          router.push("/")
          return
        }

        setPdfUrl(pdfData)
        setFileName(pdfFileName)

        // Convert object URL to File for backend call
        const response = await fetch(pdfData)
        const blob = await response.blob()
        const file = new File([blob], pdfFileName, { type: "application/pdf" })

        // Directly call backend to avoid serverless payload limits
        const analysisResult = await uploadSATQuestions(
          file,
          "Extracted Questions",
          "Questions extracted from uploaded PDF"
        )

        setQuestions(analysisResult.questions)
      } catch (err) {
        setError("An error occurred while analyzing the PDF")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    analyzePDF()
  }, [router])

  const handleEditQuestions = () => {
    // Store questions in sessionStorage for edit page
    sessionStorage.setItem("extractedQuestions", JSON.stringify(questions))
    router.push("/edit")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-serif font-bold text-foreground mb-2">Analyzing PDF</h2>
          <p className="text-muted-foreground font-sans">AI is extracting questions from your document...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-serif font-bold text-foreground mb-4">Analysis Failed</h2>
            <p className="text-muted-foreground font-sans mb-6">{error}</p>
            <Button onClick={() => router.push("/")} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Upload
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-serif font-bold text-foreground">Analysis Complete</h1>
              <p className="text-muted-foreground font-sans mt-1">
                Extracted {questions.length} questions from {fileName}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Button onClick={() => router.push("/")} variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                New Analysis
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* PDF Viewer */}
          <div className="order-2 lg:order-1">
            <Card className="h-[600px]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-serif">
                  <Eye className="w-5 h-5" />
                  PDF Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <iframe src={pdfUrl} className="w-full h-[520px] border-0" title="PDF Preview" />
              </CardContent>
            </Card>
          </div>

          {/* Questions List */}
          <div className="order-1 lg:order-2">
            <div className="sticky top-8">
              <div className="flex gap-3 mb-6">
                <Button onClick={handleEditQuestions} className="flex-1">
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Questions
                </Button>
                <JsonExport questions={questions} fileName={fileName} className="flex-1" />
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="font-serif">Extracted Questions</CardTitle>
                </CardHeader>
                <CardContent className="max-h-[500px] overflow-y-auto space-y-4">
                  {questions.map((question, index) => (
                    <div key={question.id} className="p-4 border border-border rounded-lg bg-card/50">
                      <div className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </span>
                        <div className="flex-1">
                          <p className="font-sans font-medium text-foreground mb-2">{question.question}</p>
                          {question.type === "multiple-choice" && question.options && (
                            <div className="space-y-1">
                              {question.options.map((option, optIndex) => (
                                <div
                                  key={optIndex}
                                  className={`text-sm p-2 rounded ${
                                    optIndex === question.correctAnswer
                                      ? "bg-primary/10 text-primary font-medium"
                                      : "text-muted-foreground"
                                  }`}
                                >
                                  {String.fromCharCode(65 + optIndex)}. {option}
                                </div>
                              ))}
                            </div>
                          )}
                          {question.type === "grid-in" && (
                            <div className="text-sm bg-primary/10 text-primary p-2 rounded font-medium">
                              Answer: {question.answer}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
