// Short, human dates for the counselor workspace: "Today, 9:42 am".

export function time(d: Date): string {
  return d
    .toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    .replace('AM', 'am')
    .replace('PM', 'pm')
}

function sameDay(a: Date, b: Date): boolean {
  return a.toDateString() === b.toDateString()
}

export function when(iso: string, now = new Date()): string {
  const d = new Date(iso)
  if (now.getTime() - d.getTime() < 60 * 1000) return 'Just now'
  if (sameDay(d, now)) return `Today, ${time(d)}`
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  if (sameDay(d, yesterday)) return `Yesterday, ${time(d)}`
  return day(d)
}

export function day(d: Date): string {
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

export function initials(name: string): string {
  const words = name.split(/\s+/).filter((w) => w && w.toLowerCase() !== 'and')
  if (words.length >= 2) return (words[0][0] + words[words.length - 1][0]).toUpperCase()
  return (words[0] ?? '?').slice(0, 2).toUpperCase()
}

export function visitTime(iso: string, now = new Date()): string {
  const d = new Date(iso)
  const tomorrow = new Date(now)
  tomorrow.setDate(now.getDate() + 1)
  const label = sameDay(d, now) ? 'Today' : sameDay(d, tomorrow) ? 'Tomorrow' : day(d)
  return `${label}, ${time(d)}`
}
