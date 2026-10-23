import { decode } from 'html-entities'
import { z } from 'zod'

// Фикс < >
const HtmlTextSchema = z.string().transform((value) => decode(value))

export const QuestionOwnerSchema = z.object({
  display_name: HtmlTextSchema.optional(),
  reputation: z.number().optional(),
})

export const QuestionSchema = z.object({
  question_id: z.number(),
  title: HtmlTextSchema,
  score: z.number(),
  is_answered: z.boolean(),
  owner: QuestionOwnerSchema.optional(),
  view_count: z.number().optional(),
  // Stack Exchange API возвращает Unix timestamp в секундах.
  last_activity_date: z.number(),
})

export const StackExchangeSuccessResponseSchema = z.object({
  items: z.array(QuestionSchema),
  has_more: z.boolean(),
  //таймер ожидания в секундах от АПИ
  backoff: z.number().optional(),
})

export const StackExchangeErrorResponseSchema = z.object({
  error_id: z.number(),
  error_message: z.string().optional(),
})

export const StackExchangeResponseSchema = z.union([
  StackExchangeSuccessResponseSchema,
  StackExchangeErrorResponseSchema,
])

export type Question = z.infer<typeof QuestionSchema>
export type StackExchangeSuccessResponse = z.infer<typeof StackExchangeSuccessResponseSchema>
export interface QuestionsQuery {
  date: string
}

export interface QuestionsState {
  resultsDate: string | null
  items: Question[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}
