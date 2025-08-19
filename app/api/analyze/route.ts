import { type NextRequest, NextResponse } from "next/server"
import { uploadSATQuestions, AnalysisResponse } from "@/lib/api"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "File must be a PDF" }, { status: 400 })
    }

    // Call the backend API to analyze the PDF
    const analysisResult: AnalysisResponse = await uploadSATQuestions(
      file,
      "Extracted Questions",
      "Questions extracted from uploaded PDF"
    )

    // Transform the backend response to match frontend expectations
    const questions = analysisResult.questions.map((q, index) => ({
      id: q.id || index + 1,
      type: q.type,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      answer: q.answer,
      explanation: q.explanation,
    }))

    return NextResponse.json({
      success: true,
      questions,
      totalQuestions: analysisResult.total_questions,
      fileName: file.name,
      fileSize: file.size,
      analysisId: analysisResult.analysis_id,
      title: analysisResult.title,
      description: analysisResult.description,
      summary: analysisResult.summary,
    })
  } catch (error) {
    console.error("Error analyzing PDF:", error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Failed to analyze PDF" 
    }, { status: 500 })
  }
}
