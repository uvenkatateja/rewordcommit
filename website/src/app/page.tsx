import { CopyButton } from "@/components/copy-button"
import { InteractiveTerminal } from "@/components/interactive-terminal"

export default function Home() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-20">
      <div className="max-w-3xl w-full space-y-16">
        {/* Header */}
        <div className="text-center space-y-6">
          <p className="text-sm text-neutral-400 tracking-wide">v1.0.0</p>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-neutral-900 text-balance leading-[1.1]">
            Never write a commit message <span className="text-amber-600">again.</span>
          </h1>
          <p className="text-neutral-500 text-lg max-w-lg mx-auto">
            One command that reads your diff and rewrites your commit message instantly.
          </p>
        </div>

        {/* Install command */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-4 bg-neutral-950 text-neutral-100 font-mono text-sm px-6 py-4 rounded-xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)]">
            <code>
              <span className="text-neutral-500">$</span> npm install -g rewordcommit
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
