import { CopyButton } from "@/components/copy-button"
import { InteractiveTerminal } from "@/components/interactive-terminal"
import { GithubStars } from "@/components/github-stars"
import { NpmDownloads } from "@/components/npm-downloads"
import { Suspense } from "react"

export default function Home() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-10">
      <div className="max-w-3xl w-full space-y-12">
        {/* Header */}
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center gap-6">
            <p className="text-xs text-neutral-400 tracking-wide">v1.0.1</p>
            <div className="flex items-center gap-4">
              <Suspense fallback={<span className="text-neutral-400 text-sm">—</span>}>
                <NpmDownloads />
              </Suspense>
              <Suspense fallback={<span className="text-neutral-400 text-sm">—</span>}>
                <GithubStars />
              </Suspense>
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-neutral-900 text-balance leading-[1.1]">
            Wrote <span className="text-amber-600">"fix"</span> again?
          </h1>
          <p className="text-neutral-500 text-sm max-w-lg mx-auto">
            Reword it in seconds.
          </p>
        </div>

        {/* Install command */}
        <div className="flex justify-center">
          <div className="relative inline-flex items-center gap-4 text-neutral-900 font-mono text-sm px-6 py-4">
            {/* Animated fire spark border */}
            <svg className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
              <defs>
                <linearGradient id="fireGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="50%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
              </defs>
              <rect
                x="1"
                y="1"
                width="calc(100% - 2px)"
                height="calc(100% - 2px)"
                rx="12"
                ry="12"
                fill="none"
                stroke="url(#fireGradient)"
                strokeWidth="2"
                strokeDasharray="4 3"
                style={{ animation: 'march 0.15s linear infinite' }}
              />
            </svg>
            <div className="relative flex items-center gap-4">
              <code>
                <span className="text-neutral-400">$</span> npm install -g rewordcommit
              </code>
              <CopyButton text="npm install -g rewordcommit" />
            </div>
          </div>
        </div>

        {/* Interactive Terminal */}
        <InteractiveTerminal />

        {/* Links */}
        <div className="flex items-center justify-center gap-10 text-sm">
          <a
            href="https://github.com/uvenkatateja/rewordcommit#readme"
            className="text-neutral-400 hover:text-neutral-900 transition-colors"
          >
            docs
          </a>
          <a
            href="https://github.com/uvenkatateja/rewordcommit"
            className="text-neutral-400 hover:text-neutral-900 transition-colors"
          >
            github
          </a>
          <a
            href="https://www.npmjs.com/package/rewordcommit"
            className="text-neutral-400 hover:text-neutral-900 transition-colors"
          >
            npm
          </a>
        </div>
      </div>
    </main>
  )
}
