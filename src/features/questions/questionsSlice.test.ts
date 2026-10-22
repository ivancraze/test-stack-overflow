import { describe, expect, it } from 'vitest'

import type { QuestionsState } from '@/types/questions'

import {
  initialQuestionsState,
  questionMoved,
  questionsReducer,
  questionsSwapped,
  scoreChanged,
} from './questionsSlice'

// Каждый тест получает новое состояние с тремя вопросами в порядке [1, 2, 3].
// Остальные поля состояния берём из slice, чтобы не дублировать его настройки.
function createState(): QuestionsState {
  return {
    ...initialQuestionsState,
    items: [
      {
        question_id: 1,
        title: 'Первый вопрос',
        score: 10,
        is_answered: false,
        last_activity_date: 1,
      },
      {
        question_id: 2,
        title: 'Второй вопрос',
        score: 5,
        is_answered: true,
        last_activity_date: 2,
      },
      {
        question_id: 3,
        title: 'Третий вопрос',
        score: 0,
        is_answered: false,
        last_activity_date: 3,
      },
    ],
  }
}

// Проверяем reducer напрямую: передаём состояние и действие, получаем новое состояние.
// Для этих проверок не нужны браузер, Redux store или запросы к API.
// describe объединяет тесты, it описывает сценарий, expect сравнивает результат с ожидаемым.
describe('Редьюсер вопросов', () => {
  it('увеличивает рейтинг выбранного вопроса на 1', () => {
    const state = createState()

    // Имитируем кнопку «вверх» у второго вопроса: его рейтинг должен стать 6 вместо 5.
    const nextState = questionsReducer(state, scoreChanged({ id: 2, delta: 1 }))

    // Проверяем рейтинги всех вопросов: остальные два не должны измениться.
    expect(nextState.items.map((question) => question.score)).toEqual([10, 6, 0])
  })

  it('уменьшает рейтинг выбранного вопроса на 1', () => {
    const state = createState()

    // Имитируем кнопку «вниз» у второго вопроса: 5 − 1 = 4.
    const nextState = questionsReducer(state, scoreChanged({ id: 2, delta: -1 }))

    expect(nextState.items.map((question) => question.score)).toEqual([10, 4, 0])
  })

  it('переносит вопрос на новую позицию, сдвигая остальные', () => {
    const state = createState()

    // Имитируем перенос первого вопроса на позицию третьего.
    const nextState = questionsReducer(state, questionMoved({ sourceId: 1, targetId: 3 }))

    // map оставляет только id, чтобы было проще увидеть порядок: [1, 2, 3] → [2, 3, 1].
    expect(nextState.items.map((question) => question.question_id)).toEqual([2, 3, 1])
  })

  it('меняет местами два вопроса, сохраняя остальные позиции', () => {
    const state = createState()

    // Отправляем действие обмена первого и третьего вопросов, как после двух двойных кликов.
    const nextState = questionsReducer(state, questionsSwapped({ firstId: 1, secondId: 3 }))

    // В отличие от переноса, второй вопрос остаётся на месте: [1, 2, 3] → [3, 2, 1].
    expect(nextState.items.map((question) => question.question_id)).toEqual([3, 2, 1])
  })
})
