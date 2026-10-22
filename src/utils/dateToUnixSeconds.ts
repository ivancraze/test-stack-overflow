export function dateToUnixSeconds(date: string): number {
  const [year, month, day] = date.split('-').map(Number)
  return Math.floor(new Date(year, month - 1, day).getTime() / 1000)
}
