"use client"

import { useState, useEffect, useCallback } from "react"

const TYPING_SPEED = 50
const LINE_DELAY = 400
const RESTART_DELAY = 4000

interface TerminalLine {
  type: "command" | "output" | "success" | "dim" | "highlight"
  text: string
  delay?: number
}

const TERMINAL_SEQUENCE: TerminalLine[] = [
  { type: "command", text: 'git commit -m "fix"' },
  { type: "dim", text: "[main 4a2b1c9] fix", delay: 300 },
  { type: "dim", text: " 1 file changed, 23 insertions(+), 8 deletions(-)" },
  { type: "command", text: "rewordcommit", delay: 600 },
  { type: "dim", text: "→ Analyzing diff...", delay: 200 },
  { type: "dim", text: "→ Reading changed files...", delay: 400 },
  { type: "output", text: "", delay: 300 },
  { type: "dim", text: '  Original:  "fix"' },
  { type: "highlight", text: '  Suggested: "fix: resolve crash when loading invalid JSON config"', delay: 200 },
  { type: "output", text: "", delay: 400 },
  { type: "output", text: "  [y] Apply  [e] Edit  [n] Cancel" },
  { type: "command", text: "y", delay: 800 },
  { type: "success", text: "✓ Commit message updated", delay: 200 },
]

export function InteractiveTerminal() {
  const [lines, setLines] = useState<{ type: string; text: string }[]>([])
  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  const [currentCharIndex, setCurrentCharIndex] = useState(0)

  const resetTerminal = useCallback(() => {
    setLines([])
    setCurrentLineIndex(0)
    setCurrentCharIndex(0)
  }, [])

  useEffect(() => {
    if (currentLineIndex >= TERMINAL_SEQUENCE.length) {
      const timeout = setTimeout(resetTerminal, RESTART_DELAY)
      return () => clearTimeout(timeout)
    }

    const currentLine = TERMINAL_SEQUENCE[currentLineIndex]

    if (currentLine.type === "command") {
      if (currentCharIndex === 0 && currentLine.delay) {
        const timeout = setTimeout(() => {
          setCurrentCharIndex(1)
        }, currentLine.delay)
        return () => clearTimeout(timeout)
      }

      if (currentCharIndex <= currentLine.text.length) {
        const timeout = setTimeout(() => {
          setLines((prev) => {
            const newLines = [...prev]
            const lineIndex = newLines.findIndex(
              (l, i) => i === prev.length - 1 && l.type === "command"
            )

            if (lineIndex === -1 || currentCharIndex === 1) {
              return [
                ...prev.filter(
                  (_, i) =>
                    i !== prev.length - 1 ||
                    prev[prev.length - 1]?.type !== "command" ||
                    prev[prev.length - 1]?.text !== ""
                ),
                ...(currentCharIndex === 1 ? [] : []),
                { type: "command", text: currentLine.text.slice(0, currentCharIndex) },
              ]
            }

            newLines[lineIndex] = {
              type: "command",
              text: currentLine.text.slice(0, currentCharIndex),
            }
            return newLines
          })
          setCurrentCharIndex((c) => c + 1)
        }, TYPING_SPEED)
        return () => clearTimeout(timeout)
      } else {
        const timeout = setTimeout(() => {
          setCurrentLineIndex((i) => i + 1)
          setCurrentCharIndex(0)
        }, LINE_DELAY)
        return () => clearTimeout(timeout)
      }
    } else {
      const delay = currentLine.delay || LINE_DELAY
      const timeout = setTimeout(() => {
        setLines((prev) => [...prev, { type: currentLine.type, text: currentLine.text }])
        setCurrentLineIndex((i) => i + 1)
        setCurrentCharIndex(0)
      }, delay)
      return () => clearTimeout(timeout)
    }
  }, [currentLineIndex, currentCharIndex, resetTerminal])

  return (
    <div className="relative">
      {/* Terminal glow effect */}
      <div className="absolute -inset-4 bg-gradient-to-b from-neutral-200/50 to-transparent rounded-3xl blur-2xl opacity-60" />

      {/* Terminal window */}
      <div className="relative bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-neutral-200/50 overflow-hidden">
        {/* Window controls */}
        <div className="flex items-center gap-2 px-4 py-3 bg-neutral-100/50 border-b border-neutral-200/50">
          <div className="w-3 h-3 rounded-full bg-neutral-300" />
          <div className="w-3 h-3 rounded-full bg-neutral-300" />
          <div className="w-3 h-3 rounded-full bg-neutral-300" />
          <span className="ml-3 text-xs text-neutral-500 font-mono">~/projects/my-app</span>
        </div>

        {/* Terminal content */}
        <div className="p-5 font-mono text-xs min-h-[280px] space-y-1">
          {lines.map((line, i) => (
            <div key={i} className="flex items-start">
              {line.type === "command" && (
                <>
                  <span className="text-emerald-600 mr-2">❯</span>
                  <span className="text-neutral-900">{line.text}</span>
                </>
              )}
              {line.type === "output" && <span className="text-neutral-700">{line.text}</span>}
              {line.type === "dim" && <span className="text-neutral-500">{line.text}</span>}
              {line.type === "success" && <span className="text-emerald-600">{line.text}</span>}
              {line.type === "highlight" && <span className="text-amber-600">{line.text}</span>}
            </div>
          ))}

          {/* Cursor */}
          {currentLineIndex < TERMINAL_SEQUENCE.length && (
            <div className="flex items-start">
              {TERMINAL_SEQUENCE[currentLineIndex]?.type === "command" && currentCharIndex > 0 && (
                <span className="text-emerald-600 mr-2">❯</span>
              )}
              {TERMINAL_SEQUENCE[currentLineIndex]?.type === "command" && currentCharIndex === 0 && (
                <span className="text-emerald-600 mr-2">❯</span>
              )}
              <span className="w-2 h-5 bg-neutral-400 animate-pulse" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
