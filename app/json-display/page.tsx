"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ThemeToggle } from "@/components/theme-toggle"
import { Copy, Check, Download, Eye, EyeOff } from "lucide-react"

// Sample SAT questions data
const sampleQuestions = [
  {
    "type": "choice",
    "article": "<p>The following text is from John Matheus's 1925 novel <i>Fog</i>. The story happens in a city where heavy fog has set in.</p><blockquote style=\"margin-left: 40px;\"><p>The little conductor stood on tiptoe in an effort to keep one hand on the signal rope, craning his neck in a vain and dissatisfied endeavor to pierce the miasma of the fog. The motorman chafed in his box, thinking of the drudging lot of the laboring man. He <u>registered</u> discontent.</p></blockquote>",
    "question": "As used in the text, what does the word \"registered\" most nearly mean?",
    "options": [
      {
        "name": "A",
        "content": "enrolled"
      },
      {
        "name": "B",
        "content": "valued"
      },
      {
        "name": "C",
        "content": "disregarded"
      },
      {
        "name": "D",
        "content": "displayed"
      }
    ],
    "correct": "displayed",
    "solution": "<strong>翻译</strong>：<br>以下文字节选自约翰・马修斯 1925 年的小说《雾》。故事发生在一座浓雾弥漫的城市。<br>小个子售票员踮起脚尖，努力用一只手抓住信号绳，伸长脖子，徒劳又不满地试图穿透这雾气。司机在驾驶室里烦躁不安，想着劳工们辛苦的命运。他流露出不满情绪。<br>在文中，\"registered\" 一词最接近以下哪个意思？<br><strong>解析</strong>：<br>文中描述司机心里想着劳工辛苦，然后 \"registered discontent\" ，结合语境是说司机表现出、流露出不满情绪， register有流露表现出的意思。<br><ul><li><strong>A 选项 \"enrolled\"</strong>&nbsp;：意思是 \"登记；注册\" ，与文中表达的 \"流露出（情绪）\" 意思不符。</li><li><strong>B 选项 \"valued\"</strong>&nbsp;：意为 \"重视；珍视\" ，不符合语境。</li><li><strong>C 选项 \"disregarded\"</strong>&nbsp;：是 \"忽视；不理会\" 的意思，和原文逻辑不符。</li><li><strong>D 选项 \"displayed\"</strong>&nbsp;：表示 \"展示；表现出\" ，\"displayed discontent\" 即 \"表现出不满\" ，符合原文语境。</li></ul>综上，正确答案是 D。<br>文中火车司机对现状不满，\"registered\" 在此处应表示 \"表现出\" 不满，最接近 \"displayed\" 的意思。<br>正确答案是 D。<br>"
  },
  {
    "type": "choice",
    "article": "<p>Although fewer companies trade their stocks on the Tehran Stock Exchange in Tehran, Iran, than on the stock exchanges in London, Mumbai, or Tokyo, the Tehran Stock Exchange has the advantage of focusing on local companies and thus reflecting economic circumstances that are ______ Iran. This sensitivity to unique, rapidly evolving local conditions benefits the companies and investors alike.</p>",
    "question": "Which choice completes the text with the most logical and precise word or phrase?",
    "options": [
      {
        "name": "A",
        "content": "irrelevant to"
      },
      {
        "name": "B",
        "content": "prohibitive in"
      },
      {
        "name": "C",
        "content": "distinctive to"
      },
      {
        "name": "D",
        "content": "unchanging in"
      }
    ],
    "correct": "distinctive to",
    "solution": "<strong>翻译</strong>：<br>尽管在伊朗德黑兰证券交易所进行股票交易的公司数量，比在伦敦、孟买或东京证券交易所交易的公司数量少，但德黑兰证券交易所的优势在于聚焦本地公司，从而反映出____伊朗的经济情况。这种对独特且快速变化的本地情况的敏感性，使公司和投资者都受益。<br><strong>解析</strong>：<br><ul><li><strong>A 选项 \"irrelevant to\"</strong>&nbsp;：意思是 \"与…… 无关\" 。如果经济情况与伊朗无关，就无法体现德黑兰证券交易所聚焦本地公司的优势，不符合语境。</li><li><strong>B 选项 \"prohibitive in\"</strong>&nbsp;：表示 \"在…… 方面禁止性的；抑制性的\" 。文中没有提及经济情况在伊朗是禁止性或抑制性相关内容，该选项不合适。</li><li><strong>C 选项 \"distinctive to\"</strong>&nbsp;：意为 \"为…… 所特有的\" 。德黑兰证券交易所聚焦本地公司，能反映出伊朗特有的经济情况，符合文中 \"独特的本地情况\" 这一表述，逻辑合理。</li><li><strong>D 选项 \"unchanging in\"</strong>&nbsp;：意思是 \"在…… 方面不变的\" 。但文中提到本地情况是 \"快速变化的\" ，该选项与原文矛盾。</li></ul>综上，正确答案是 C。<br>"
  },
  {
    "type": "choice",
    "article": "<p>In a study by Mika R. Moran, Daniel A. Rodriguez, and colleagues, residents of Caracas, Venezuela, and of Fortaleza, Brazil, were surveyed about parks in their cities. Of the 1,043 respondents from Caracas, 44.7% indicated that they use the city's parks, and of the 938 respondents from Fortaleza, 35.7% indicated using city parks. <u>It may be tempting to assume the difference is due to different levels of access to parks:</u> however, given that the percentage of Caracas respondents who reported living within a 10-minute walk of a park was much lower than that reported by Fortaleza respondents, greater proximity alone can't explain the difference in park use.</p>",
    "question": "Which choice best describes the function of the underlined portion in the text as a whole?",
    "options": [
      {
        "name": "A",
        "content": "It introduces a counterexample to the scenario described earlier in the text."
      },
      {
        "name": "B",
        "content": "It provides context to help understand the scope of the researchers' survey."
      },
      {
        "name": "C",
        "content": "It marks a shift from a discussion of the researchers' conclusion to a discussion of their methods."
      },
      {
        "name": "D",
        "content": "It presents a potential explanation for the team's findings that the text goes on to refute."
      }
    ],
    "correct": "It presents a potential explanation for the team's findings that the text goes on to refute.",
    "solution": "<strong>翻译</strong>：<br>在米卡・R・莫兰、丹尼尔・A・罗德里格斯及同事开展的一项研究中，对委内瑞拉加拉加斯和巴西福塔莱萨的居民进行了关于城市公园的调查。在来自加拉加斯的 1043 名受访者中，44.7% 的人表示会使用城市公园；在来自福塔莱萨的 938 名受访者中，35.7% 的人表示会使用城市公园。<u>人们可能会倾向于认为这种差异是由于公园可达性不同造成的</u>：然而，鉴于加拉加斯报告称居住在距离公园步行 10 分钟范围内的受访者比例远低于福塔莱萨的受访者，仅靠更近的距离并不能解释公园使用情况的差异。<br><strong>题目翻译</strong>：<br>4. 以下哪个选项最能描述文中划线部分在整体文本中的作用？<br><strong>解析</strong>：<br><ul><li>划线句提出一种可能的解释，即认为两个城市公园使用比例差异是公园可达性不同导致的，但后文通过对比居住在公园附近的受访者比例，说明仅靠距离近不能解释差异，也就是对划线句的解释进行了反驳。</li><li><strong>A 选项</strong>：划线句不是反例，反例是用来反驳某个观点的具体事例，这里只是一种假设的解释，该选项错误。</li><li><strong>B 选项</strong>：划线句没有提供关于研究范围的背景信息，该选项错误。</li><li><strong>C 选项</strong>：文中没有从研究结论转向研究方法的讨论，该选项错误。</li><li><strong>D 选项</strong>：准确指出划线句呈现了一种对研究结果的潜在解释，且后文进行了反驳，符合文意。</li></ul><br>综上，正确答案是 D。<br>"
  }
]

export default function JsonDisplayPage() {
  const [jsonData, setJsonData] = useState(sampleQuestions)
  const [jsonString, setJsonString] = useState("")
  const [copied, setCopied] = useState(false)
  const [showFormatted, setShowFormatted] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    try {
      const formatted = JSON.stringify(jsonData, null, 2)
      setJsonString(formatted)
      setError("")
    } catch (err) {
      setError("Error formatting JSON: " + (err instanceof Error ? err.message : "Unknown error"))
    }
  }, [jsonData])

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'sat-questions.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleJsonInput = (value: string) => {
    try {
      const parsed = JSON.parse(value)
      setJsonData(parsed)
      setError("")
    } catch (err) {
      setError("Invalid JSON: " + (err instanceof Error ? err.message : "Unknown error"))
    }
  }

  const clearData = () => {
    setJsonData([])
    setError("")
  }

  const loadSampleData = () => {
    setJsonData(sampleQuestions)
    setError("")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">SAT Questions JSON Display</h1>
            <p className="text-muted-foreground mt-2">
              View and copy SAT questions in JSON format
            </p>
          </div>
          <ThemeToggle />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* JSON Display Section */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">JSON Data</h2>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowFormatted(!showFormatted)}
                >
                  {showFormatted ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                  {showFormatted ? "Hide" : "Show"} Formatted
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopy}
                >
                  {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                  {copied ? "Copied!" : "Copy"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleDownload}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
            
            <div className="space-y-4">
              {showFormatted ? (
                <div className="relative">
                  <Textarea
                    value={jsonString}
                    readOnly
                    className="min-h-[400px] font-mono text-sm"
                    placeholder="JSON data will appear here..."
                  />
                  <div className="absolute top-2 right-2">
                    <span className="text-xs text-muted-foreground bg-background px-2 py-1 rounded">
                      {jsonData.length} questions
                    </span>
                  </div>
                </div>
              ) : (
                <div className="min-h-[400px] p-4 bg-muted rounded-lg">
                  <p className="text-muted-foreground text-center">
                    JSON data is hidden. Click "Show Formatted" to view.
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Controls Section */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Controls</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Load Sample Data
                </label>
                <Button onClick={loadSampleData} className="w-full">
                  Load Sample SAT Questions
                </Button>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Clear Data
                </label>
                <Button variant="outline" onClick={clearData} className="w-full">
                  Clear All Questions
                </Button>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Import JSON
                </label>
                <Textarea
                  placeholder="Paste JSON data here to import..."
                  className="min-h-[100px] font-mono text-sm"
                  onChange={(e) => handleJsonInput(e.target.value)}
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Error Display */}
        {error && (
          <Card className="p-4 mt-6 border-destructive">
            <div className="flex items-center gap-2 text-destructive">
              <span className="font-medium">Error:</span>
              <span>{error}</span>
            </div>
          </Card>
        )}

        {/* Info Section */}
        <Card className="p-6 mt-8">
          <h3 className="text-lg font-semibold mb-4">About This Tool</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• This tool displays SAT questions in JSON format</p>
            <p>• You can copy the JSON data to clipboard</p>
            <p>• Download the JSON as a file</p>
            <p>• Import your own JSON data</p>
            <p>• All operations are performed locally in your browser</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
