import { configureStore } from '@reduxjs/toolkit'
import { expect, it } from 'vitest'

import { PAGE_SIZE } from '@/constants'

import { loadQuestions, questionsReducer } from './questionsSlice'

it('получает вопросы из настоящего Stack Exchange API и сохраняет их в Redux', async () => {
  // Берём широкий период, чтобы получить непустой список, не привязываясь к конкретным вопросам.
  const date = '2020-01-01'
  const store = configureStore({ reducer: { questions: questionsReducer } })

  // Используем настоящий fetch: запрос, проверка ответа Zod и reducer работают как в приложении.
  const request = store.dispatch(loadQuestions({ date, page: 1 }))
  expect(store.getState().questions.status).toBe('loading')

  // Ждём ответ сервера. При сетевой ошибке или ошибке API unwrap завершит тест ошибкой.
  const response = await request.unwrap()

  // Точные заголовки и рейтинги со временем меняются, поэтому проверяем наличие и число вопросов.
  expect(response.items.length).toBeGreaterThan(0)
  expect(response.items.length).toBeLessThanOrEqual(PAGE_SIZE)

  // Проверяем, что реальные данные сервера сохранены в хранилище и загрузка завершена.
  expect(store.getState().questions).toMatchObject({
    status: 'succeeded',
    items: response.items,
    resultsDate: date,
    page: 1,
    hasMore: response.has_more,
    error: null,
  })
  // Даём настоящему серверу до 15 секунд на ответ; без сети тест не пройдёт.
}, 15_000)
