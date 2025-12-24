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
            <p className="text-xs text-neutral-400 tracking-wide">v1.0.0</p>
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
            Never write a commit message <span className="text-amber-600">again.</span>
          </h1>
          <p className="text-neutral-500 text-sm max-w-lg mx-auto">
            One command that reads your diff and rewrites your commit message instantly.
          </p>
        </div>

        {/* Install command */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-4 bg-white/70 backdrop-blur-xl text-neutral-900 font-mono text-xs px-5 py-3 rounded-xl shadow-lg border border-neutral-200/50">
            <code>
              <span className="text-neutral-400">$</span> npm install -g rewordcommit
            </code>
            <CopyButton text="npm install -g rewordcommit" />
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
