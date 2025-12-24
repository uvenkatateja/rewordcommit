import { Package } from "lucide-react"

async function getDownloads() {
  try {
    const res = await fetch(
      "https://api.npmjs.org/downloads/point/last-month/rewordcommit",
      { next: { revalidate: 3600 } }
    )
    if (!res.ok) return null
    const data = await res.json()
    return data.downloads as number
  } catch {
    return null
  }
}

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "m"
  if (num >= 1000) return (num / 1000).toFixed(1) + "k"
  return num.toString()
}

export async function NpmDownloads() {
  const downloads = await getDownloads()

  return (
    <a
      href="https://www.npmjs.com/package/rewordcommit"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1.5 text-neutral-400 hover:text-neutral-600 transition-colors text-sm"
    >
      <Package className="w-4 h-4" />
      <span>{downloads !== null ? formatNumber(downloads) : "—"}</span>
    </a>
  )
}
