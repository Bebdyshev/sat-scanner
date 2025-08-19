"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Plus, Trash2, Eye } from "lucide-react"
import { JsonExport } from "@/components/json-export"
import { ThemeToggle } from "@/components/theme-toggle"

interface Question {
  id: number
  type: "multiple-choice" | "grid-in"
  question: string
  options?: string[]
  correctAnswer?: number
  answer?: number
  explanation: string
}

export default function EditPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [pdfUrl, setPdfUrl] = useState<string>("")
  const [fileName, setFileName] = useState<string>("")
  const [editingId, setEditingId] = useState<number | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Get data from sessionStorage
    const questionsData = sessionStorage.getItem("extractedQuestions")
    const pdfData = sessionStorage.getItem("pdfFile")
    const pdfFileName = sessionStorage.getItem("pdfFileName")

    if (!questionsData || !pdfData || !pdfFileName) {
      router.push("/")
      return
    }

    setQuestions(JSON.parse(questionsData))
    setPdfUrl(pdfData)
    setFileName(pdfFileName)
  }, [router])

  const updateQuestion = (id: number, field: keyof Question, value: any) => {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, [field]: value } : q)))
  }

  const updateOption = (questionId: number, optionIndex: number, value: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId && q.options
          ? { ...q, options: q.options.map((opt, idx) => (idx === optionIndex ? value : opt)) }
          : q,
      ),
    )
  }

  const addOption = (questionId: number) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === questionId && q.options ? { ...q, options: [...q.options, "New option"] } : q)),
    )
  }

  const removeOption = (questionId: number, optionIndex: number) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId && q.options && q.options.length > 2
          ? { ...q, options: q.options.filter((_, idx) => idx !== optionIndex) }
          : q,
      ),
    )
  }

  const addQuestion = () => {
    const newId = Math.max(...questions.map((q) => q.id)) + 1
    const newQuestion: Question = {
      id: newId,
      type: "multiple-choice",
      question: "New question",
      options: ["Option A", "Option B", "Option C", "Option D"],
      correctAnswer: 0,
      explanation: "Explanation for this question",
    }
    setQuestions((prev) => [...prev, newQuestion])
    setEditingId(newId)
  }

  const removeQuestion = (id: number) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id))
  }

  const saveChanges = () => {
    // Update sessionStorage with edited questions
    sessionStorage.setItem("extractedQuestions", JSON.stringify(questions))
    setEditingId(null)
    // Could also send to API to save permanently
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-serif font-bold text-foreground">Edit Questions</h1>
              <p className="text-muted-foreground font-sans mt-1">
                Modify and refine extracted questions from {fileName}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Button onClick={() => router.push("/analyze")} variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Analysis
              </Button>
              <Button onClick={saveChanges}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Questions Editor */}
          <div className="order-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-serif font-bold text-foreground">Questions ({questions.length})</h2>
              <div className="flex gap-2">
                <Button onClick={addQuestion} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Question
                </Button>
                <JsonExport questions={questions} fileName={fileName} size="sm" />
              </div>
            </div>

            <div className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
              {questions.map((question, index) => (
                <Card key={question.id} className="border-2 hover:border-primary/20 transition-colors">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-serif flex items-center gap-2">
                        <span className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </span>
                        Question {index + 1}
                      </CardTitle>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingId(editingId === question.id ? null : question.id)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeQuestion(question.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Question Type */}
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Type</label>
                      <Select
                        value={question.type}
                        onValueChange={(value: "multiple-choice" | "grid-in") =>
                          updateQuestion(question.id, "type", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                          <SelectItem value="grid-in">Grid-in</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Question Text */}
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Question</label>
                      <Textarea
                        value={question.question}
                        onChange={(e) => updateQuestion(question.id, "question", e.target.value)}
                        className="min-h-[80px]"
                        placeholder="Enter the question text..."
                      />
                    </div>

                    {/* Options for Multiple Choice */}
                    {question.type === "multiple-choice" && question.options && (
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Answer Options</label>
                        <div className="space-y-2">
                          {question.options.map((option, optIndex) => (
                            <div key={optIndex} className="flex gap-2 items-center">
                              <span className="w-6 h-6 bg-muted text-muted-foreground rounded flex items-center justify-center text-xs font-medium">
                                {String.fromCharCode(65 + optIndex)}
                              </span>
                              <Input
                                value={option}
                                onChange={(e) => updateOption(question.id, optIndex, e.target.value)}
                                className="flex-1"
                              />
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => removeOption(question.id, optIndex)}
                                disabled={question.options!.length <= 2}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                          <Button size="sm" variant="outline" onClick={() => addOption(question.id)} className="w-full">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Option
                          </Button>
                        </div>

                        {/* Correct Answer */}
                        <div className="mt-4">
                          <label className="text-sm font-medium text-foreground mb-2 block">Correct Answer</label>
                          <Select
                            value={question.correctAnswer?.toString()}
                            onValueChange={(value) =>
                              updateQuestion(question.id, "correctAnswer", Number.parseInt(value))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select correct answer" />
                            </SelectTrigger>
                            <SelectContent>
                              {question.options.map((_, optIndex) => (
                                <SelectItem key={optIndex} value={optIndex.toString()}>
                                  {String.fromCharCode(65 + optIndex)}. {question.options![optIndex]}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}

                    {/* Answer for Grid-in */}
                    {question.type === "grid-in" && (
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Answer</label>
                        <Input
                          type="number"
                          value={question.answer || ""}
                          onChange={(e) => updateQuestion(question.id, "answer", Number.parseFloat(e.target.value))}
                          placeholder="Enter the numerical answer"
                        />
                      </div>
                    )}

                    {/* Explanation */}
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Explanation</label>
                      <Textarea
                        value={question.explanation}
                        onChange={(e) => updateQuestion(question.id, "explanation", e.target.value)}
                        className="min-h-[60px]"
                        placeholder="Explain the correct answer..."
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* PDF Viewer */}
          <div className="order-2">
            <div className="sticky top-8">
              <Card className="h-[calc(100vh-120px)]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-serif">
                    <Eye className="w-5 h-5" />
                    PDF Reference
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <iframe src={pdfUrl} className="w-full h-[calc(100vh-200px)] border-0" title="PDF Reference" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
