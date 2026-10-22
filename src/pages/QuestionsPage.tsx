import { format, parseISO } from 'date-fns'
import { ru } from 'date-fns/locale/ru'
import { useEffect, useState } from 'react'
import { Alert, Button, Card, Form, Spinner, Stack } from 'react-bootstrap'
import DatePicker from 'react-datepicker'

import { QuestionCardSkeleton, QuestionsPagination } from '@/components'
import { DEFAULT_DATE, PAGE_SIZE } from '@/constants'
import { QuestionList } from '@/features/questions/QuestionList'
import { loadQuestions } from '@/features/questions/questionsSlice'
import { useAppDispatch, useAppSelector } from '@/store'

export const QuestionsPage = () => {
  const dispatch = useAppDispatch()
  const [selectedDate, setSelectedDate] = useState(DEFAULT_DATE)
  const { resultsDate, items, status, error, page, hasMore } = useAppSelector(
    (state) => state.questions,
  )
  const isLoading = status === 'loading'
  const isInitialLoading = isLoading && resultsDate === null

  useEffect(() => {
    if (status === 'idle') {
      void dispatch(loadQuestions({ date: DEFAULT_DATE, page: 1 }))
    }
  }, [dispatch, status])

  const canSearch = selectedDate !== resultsDate
  const isCurrentResults = resultsDate === selectedDate

  return (
    <Stack gap={4}>
      <Stack>
        <Card.Text className="text-secondary">
          Вопросы по react-redux, созданные начиная с выбранной даты, по {PAGE_SIZE} на странице.
        </Card.Text>
      </Stack>

      <Form className="border rounded bg-body p-3" onSubmit={(event) => event.preventDefault()}>
        <Stack direction="horizontal" gap={3} className="align-items-end flex-wrap">
          <Form.Group>
            <Form.Label htmlFor="from-date">Показывать вопросы с</Form.Label>
            <DatePicker
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
            <Button
              type="button"
              variant="success"
              disabled={isLoading || !selectedDate}
              onClick={() => void dispatch(loadQuestions({ date: selectedDate, page: 1 }))}
            >
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
          <QuestionList key={`${resultsDate}-${page}`} />
        ) : !isLoading && !error && isCurrentResults ? (
          <Alert variant="light" className="mb-0">
            По выбранной дате вопросов не найдено.
          </Alert>
        ) : null}
        {resultsDate !== null && (items.length > 0 || page > 1) && (
          <QuestionsPagination
            page={page}
            hasMore={hasMore}
            disabled={isLoading || !isCurrentResults}
            onPageChange={(nextPage) => {
              void dispatch(loadQuestions({ date: resultsDate, page: nextPage }))
            }}
          />
        )}
      </Stack>
    </Stack>
  )
}
