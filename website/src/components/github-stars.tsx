import { Github } from "lucide-react"

async function getStars() {
  try {
    const res = await fetch(
      "https://api.github.com/repos/uvenkatateja/rewordcommit",
      { next: { revalidate: 3600 } }
    )
    if (!res.ok) return null
    const data = await res.json()
    return data.stargazers_count as number
  } catch {
    return null
  }
}

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "m"
  if (num >= 1000) return (num / 1000).toFixed(1) + "k"
  return num.toString()
}

export async function GithubStars() {
  const stars = await getStars()

  return (
    <a
      href="https://github.com/uvenkatateja/rewordcommit"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1.5 text-neutral-400 hover:text-neutral-600 transition-colors text-sm"
    >
      <Github className="w-4 h-4" />
      <span>{stars !== null ? formatNumber(stars) : "—"}</span>
    </a>
  )
}
