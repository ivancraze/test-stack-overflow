export function formatDate(timestamp: number): string {
  return new Intl.DateTimeFormat('ru-RU', { dateStyle: 'medium' }).format(
    new Date(timestamp * 1000),
  )
}
