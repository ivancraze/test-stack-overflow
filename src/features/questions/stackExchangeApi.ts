import { API_PAGE_SIZE, API_URL, QUESTION_TITLE_KEYWORD, QUESTIONS_LIMIT } from '@/constants'
import {
  type Question,
  type QuestionsQuery,
  StackExchangeResponseSchema,
  type StackExchangeSuccessResponse,
} from '@/types/questions'
import { dateToUnixSeconds } from '@/utils'

// https://api.stackexchange.com/docs/throttle
// Глобально храним настройку для паузы
let backoffUntil = 0

export function parseStackExchangeResponse(value: unknown): StackExchangeSuccessResponse {
  const result = StackExchangeResponseSchema.safeParse(value)
  if (!result.success) {
    throw new Error('некорректный список вопросов')
  }

  const data = result.data
  if ('error_id' in data) {
    throw new Error(data.error_message ?? 'Stack Exchange API вернул ошибку')
  }
  return data
}

async function fetchQuestionsPage(date: string, page: number): Promise<StackExchangeSuccessResponse> {
  const url = new URL('search/advanced', API_URL)
  url.search = new URLSearchParams({
    site: 'stackoverflow',
    title: QUESTION_TITLE_KEYWORD,
    fromdate: String(dateToUnixSeconds(date)),
    pagesize: String(API_PAGE_SIZE),
    page: String(page),
    // Сортировка по голосам.
    sort: 'votes',
    order: 'desc',
  }).toString()

  // Ограничение API действует и на следующую загрузку с другой датой.
  const wait = backoffUntil - Date.now()
  if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait))

  let response: Response
  try {
    response = await fetch(url)
  } catch {
    throw new Error('Не удалось подключиться к Stack Exchange API')
  }
  if (!response.ok) {
    throw new Error(`Ошибка запроса к Stack Exchange API (${response.status})`)
  }
  let data: unknown
  try {
    data = await response.json()
  } catch {
    throw new Error('Stack Exchange API вернул некорректный JSON')
  }
  const result = parseStackExchangeResponse(data)
  if (result.backoff !== undefined) backoffUntil = Date.now() + result.backoff * 1000
  return result
}

// Апишка от стака не позволяет искать точное вхождение ключа,
// поэтому костыль с накоплением пяти вопросов с нескольких страниц
export async function fetchTopQuestions({ date }: QuestionsQuery): Promise<Question[]> {
  const items: Question[] = []
  let page = 1
  let hasMore = true

  while (items.length < QUESTIONS_LIMIT && hasMore) {
    const result = await fetchQuestionsPage(date, page)
    const matchingQuestions = result.items.filter(
      (question) =>
        question.title.toLowerCase().includes(QUESTION_TITLE_KEYWORD) &&
        !items.some((item) => item.question_id === question.question_id),
    )
    items.push(...matchingQuestions)
    hasMore = result.has_more
    page += 1
  }

  // Порядок по рейтингу уже задан API.
  return items.slice(0, QUESTIONS_LIMIT)
}
