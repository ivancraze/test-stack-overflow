import { API_URL, PAGE_SIZE } from '@/constants'
import {
  type QuestionsQuery,
  StackExchangeResponseSchema,
  type StackExchangeSuccessResponse,
} from '@/types/questions'
import { dateToUnixSeconds } from "@/utils";

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

export async function fetchTopQuestions({
  date,
  page,
}: QuestionsQuery): Promise<StackExchangeSuccessResponse> {
  const url = new URL('search/advanced', API_URL)
  url.search = new URLSearchParams({
    site: 'stackoverflow',
    title: 'react-redux',
    fromdate: String(dateToUnixSeconds(date)),
    pagesize: String(PAGE_SIZE),
    page: String(page),
    // Сортировка по голосам.
    sort: 'votes',
    order: 'desc',
  }).toString()

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
  return parseStackExchangeResponse(data)
}
