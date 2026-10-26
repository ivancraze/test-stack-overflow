import { format, parseISO } from 'date-fns'
import { ru } from 'date-fns/locale/ru'
import { useEffect, useRef, useState } from 'react'
import { Alert, Button, Card, Form, Spinner, Stack } from 'react-bootstrap'
import DatePicker from 'react-datepicker'

import { QuestionCardSkeleton } from '@/components'
import { DEFAULT_DATE, QUESTION_TITLE_KEYWORD,QUESTIONS_LIMIT } from '@/constants'
import { QuestionList } from '@/features/questions/QuestionList'
import { loadQuestions } from '@/features/questions/questionsSlice'
import { useAppDispatch, useAppSelector } from '@/store'

export const QuestionsPage = () => {
  const dispatch = useAppDispatch()
  const datePickerRef = useRef<DatePicker>(null)
  const [selectedDate, setSelectedDate] = useState(DEFAULT_DATE)
  const { resultsDate, items, status, error } = useAppSelector((state) => state.questions)
  const isLoading = status === 'loading'
  const isInitialLoading = isLoading && resultsDate === null

  useEffect(() => {
    if (status === 'idle') {
      void dispatch(loadQuestions({ date: DEFAULT_DATE }))
    }
  }, [dispatch, status])

  const canSearch = selectedDate !== resultsDate
  const isCurrentResults = resultsDate === selectedDate

  return (
    <Stack gap={4}>
      <Stack>
        <Card.Text className="text-secondary">
          {QUESTIONS_LIMIT} самых популярных вопросов с {`"${QUESTION_TITLE_KEYWORD}"`} в заголовке, созданных начиная с
          выбранной даты.
        </Card.Text>
      </Stack>

      <Form
        className="border rounded bg-body p-3"
        onSubmit={(event) => {
          event.preventDefault()
          if (!canSearch || isLoading || !selectedDate) return
          datePickerRef.current?.setOpen(false)
          void dispatch(loadQuestions({ date: selectedDate }))
        }}
        onKeyDown={(event) => {
          // DatePicker перехватывает Enter в поле даты, поэтому отправляем форму явно.
          if (event.key === 'Enter' && event.target instanceof HTMLInputElement) {
            event.preventDefault()
            event.currentTarget.requestSubmit()
          }
        }}
      >
        <Stack direction="horizontal" gap={3} className="align-items-end flex-wrap">
          <Form.Group>
            <Form.Label htmlFor="from-date">Показывать вопросы с</Form.Label>
            <DatePicker
              ref={datePickerRef}
              id="from-date"
              selected={selectedDate ? parseISO(selectedDate) : null}
              dateFormat="dd.MM.yyyy"
              locale={ru}
              className="form-control"
              wrapperClassName="d-block"
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              placeholderText="дд.мм.гггг"
              disabled={isLoading}
              onChange={(date: Date | null) =>
                setSelectedDate(date ? format(date, 'yyyy-MM-dd') : '')
              }
            />
          </Form.Group>
          {canSearch && (
            <Button type="submit" variant="success" disabled={isLoading || !selectedDate}>
              {isLoading ? 'Загрузка...' : 'Поиск'}
            </Button>
          )}
        </Stack>
      </Form>

      <Stack gap={3}>
        <Stack direction="horizontal" className="justify-content-between align-items-center">
          <Card.Title as="h2" className="h4 mb-0">
            Популярное
          </Card.Title>
          {isLoading && (
            <Stack direction="horizontal" gap={2} className="text-secondary" role="status">
              <Spinner animation="border" size="sm" />
              <span>Загрузка…</span>
            </Stack>
          )}
        </Stack>
        {error && (
          <Alert variant="danger" className="mb-0">
            {error}
          </Alert>
        )}
        {isInitialLoading ? (
          <QuestionCardSkeleton />
        ) : items.length > 0 ? (
          <QuestionList key={resultsDate} />
        ) : !isLoading && !error && isCurrentResults ? (
          <Alert variant="light" className="mb-0">
            По выбранной дате вопросов не найдено.
          </Alert>
        ) : null}
      </Stack>
    </Stack>
  )
}
