import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { Question, QuestionsQuery, QuestionsState } from '@/types/questions'

import { fetchTopQuestions } from './stackExchangeApi'

export const initialQuestionsState: QuestionsState = {
  resultsDate: null,
  items: [],
  status: 'idle',
  error: null,
}

export const loadQuestions = createAsyncThunk<
  Question[],
  QuestionsQuery,
  { state: { questions: QuestionsState } }
>('questions/load', fetchTopQuestions, {
  condition: (_, { getState }) => getState().questions.status !== 'loading',
})

const questionsSlice = createSlice({
  name: 'questions',
  initialState: initialQuestionsState,
  reducers: {
    // Находит вопрос по id и меняет рейтинг на delta (+1 или −1), без запроса к API.
    scoreChanged(state, action: PayloadAction<{ id: number; delta: 1 | -1 }>) {
      const question = state.items.find((item) => item.question_id === action.payload.id)
      if (question) question.score += action.payload.delta
    },
    // Переносит перетаскиваемый вопрос на позицию целевого; остальные вопросы сдвигаются.
    questionMoved(state, action: PayloadAction<{ sourceId: number; targetId: number }>) {
      const from = state.items.findIndex((item) => item.question_id === action.payload.sourceId)
      const to = state.items.findIndex((item) => item.question_id === action.payload.targetId)
      if (from < 0 || to < 0 || from === to) return
      // Удаляем вопрос из исходной позиции и вставляем на целевую.
      const [question] = state.items.splice(from, 1)
      state.items.splice(to, 0, question)
    },
    // Меняет местами два вопроса, выбранных двойным кликом, сохраняя позиции остальных.
    questionsSwapped(state, action: PayloadAction<{ firstId: number; secondId: number }>) {
      const { firstId, secondId } = action.payload
      const firstIndex = state.items.findIndex((item) => item.question_id === firstId)
      const secondIndex = state.items.findIndex((item) => item.question_id === secondId)

      // Если вопрос не найден или выбран один и тот же вопрос, обмен не нужен.
      if (firstIndex === -1 || secondIndex === -1 || firstIndex === secondIndex) return

      // Сохраняем первый вопрос, чтобы не потерять его при замене вторым.
      const firstQuestion = state.items[firstIndex]
      state.items[firstIndex] = state.items[secondIndex]
      state.items[secondIndex] = firstQuestion
    },
  },
  extraReducers: (builder) => {
    builder
      // Включаем загрузку и убираем прошлую ошибку; текущий список пока сохраняем.
      .addCase(loadQuestions.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      // Сохраняем найденную пятёрку и дату успешного запроса.
      .addCase(loadQuestions.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
        state.resultsDate = action.meta.arg.date
      })
      // Показываем ошибку, сохраняя предыдущие результаты и параметры их загрузки.
      .addCase(loadQuestions.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? 'Не удалось загрузить вопросы'
      })
  },
})

export const { scoreChanged, questionMoved, questionsSwapped } = questionsSlice.actions
export const questionsReducer = questionsSlice.reducer
