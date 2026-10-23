import { configureStore } from '@reduxjs/toolkit'
import { afterEach, expect, it, vi } from 'vitest'

import { QUESTION_TITLE_KEYWORD } from '@/constants'

import { loadQuestions, questionsReducer } from './questionsSlice'

// Возвращаем настоящий fetch после теста, чтобы подмена не влияла на другие проверки.
afterEach(() => vi.restoreAllMocks())

it('добирает пять вопросов с react-redux в заголовке и сохраняет их в Redux', async () => {
  const questionsMock = [
    'React + Redux: Data not being passed correctly',
    'React Redux useSelector',
    'React-Redux dispatch',
    'react&#45;redux &lt;Provider&gt;',
    `${QUESTION_TITLE_KEYWORD} store`,
    `${QUESTION_TITLE_KEYWORD} hooks`,
    `${QUESTION_TITLE_KEYWORD} connect`,
    `${QUESTION_TITLE_KEYWORD} middleware`,
  ].map((title, index) => ({
    question_id: index + 1,
    title,
    score: 10 - index,
    is_answered: false,
    last_activity_date: 1,
  }))

  console.log(questionsMock)

  // Подменяем только сеть. Фильтрация, добор вопросов и Redux выполняются по-настоящему.
  vi.spyOn(globalThis, 'fetch')
    .mockRejectedValue(new Error('Лишний запрос к API'))
    .mockResolvedValueOnce(
      // На первой странице подходит только №3 — пятёрку нужно добрать со второй.
      new Response(JSON.stringify({ items: questionsMock.slice(0, 3), has_more: true })),
    )
    .mockResolvedValueOnce(
      new Response(JSON.stringify({ items: questionsMock.slice(3), has_more: true })),
    )

  const date = '2023-01-01'
  const store = configureStore({ reducer: { questions: questionsReducer } })

  const request = store.dispatch(loadQuestions({ date }))
  expect(store.getState().questions.status).toBe('loading')
  // Ждём завершения thunk; при ошибке unwrap завершит тест ошибкой.
  const response = await request.unwrap()

  // Проверяем отбор нужных вопросов, количество и порядок по рейтингу.
  expect(response.map((question) => question.question_id)).toEqual([3, 4, 5, 6, 7])

  // Проверяем состояние Redux после загрузки
  expect(store.getState().questions).toMatchObject({
    status: 'succeeded',
    items: response,
    resultsDate: date,
    error: null,
  })
})
