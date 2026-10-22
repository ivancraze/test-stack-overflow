import './QuestionCard.css'

import { useCallback } from 'react'
import { Button, Collapse,ListGroup, Stack } from 'react-bootstrap'
import { CaretDownFill, CaretUpFill, GripVertical } from "react-bootstrap-icons";
import { useDrag, useDrop } from 'react-dnd'

import { QUESTION_DRAG_TYPE } from '@/constants'
import type { Question } from '@/types/questions'
import { formatDate } from '@/utils'

interface QuestionCardProps {
  question: Question
  expanded: boolean
  selectedForSwap: boolean
  onExpand: () => void
  onDoubleClick: () => void
  onDrop: (sourceId: number) => void
  onScoreChange: (delta: 1 | -1) => void
}

export const QuestionCard = ({
  question,
  expanded,
  selectedForSwap,
  onExpand,
  onDoubleClick,
  onDrop,
  onScoreChange,
}: QuestionCardProps) => {
  const [{ dragging }, drag, preview] = useDrag(
    () => ({
      type: QUESTION_DRAG_TYPE,
      item: { id: question.question_id },
      collect: (monitor) => ({ dragging: monitor.isDragging() }),
    }),
    [question.question_id],
  )

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: QUESTION_DRAG_TYPE,
      canDrop: (item: { id: number }) => item.id !== question.question_id,
      drop: (item: { id: number }) => onDrop(item.id),
      collect: (monitor) => ({ isOver: monitor.isOver() && monitor.canDrop() }),
    }),
    [question.question_id, onDrop],
  )

  const connectCard = useCallback(
    (node: HTMLLIElement | null) => {
      preview(drop(node))
    },
    [preview, drop],
  )

  const connectHandle = useCallback(
    (node: HTMLButtonElement | null) => {
      drag(node)
    },
    [drag],
  )

  return (
    <ListGroup.Item
      as="li"
      ref={connectCard}
      action
      data-question-card
      className={`question-card${question.is_answered ? ' border-success bg-success-subtle' : ''}${selectedForSwap ? ' border-warning border-2' : ''}${dragging ? ' opacity-50' : ''}${isOver ? ' border-primary border-2' : ''}`}
      onClick={onExpand}
      onDoubleClick={onDoubleClick}
    >
      <Stack direction="horizontal" gap={3}>
        <div
          className="d-flex flex-column align-items-center gap-1 flex-shrink-0"
          onClick={(event) => event.stopPropagation()}
          onDoubleClick={(event) => event.stopPropagation()}
        >
          <Button
            type="button"
            variant="outline-secondary"
            size="sm"
            className="rounded-circle d-inline-flex align-items-center justify-content-center p-0"
            style={{ width: 32, height: 32 }}
            onClick={() => onScoreChange(1)}
          >
            <CaretUpFill style={{ transform: 'translateY(-1px)' }} />
          </Button>
          <span className="fs-5 lh-1 text-body">{question.score}</span>
          <Button
            type="button"
            variant="outline-secondary"
            size="sm"
            className="rounded-circle d-inline-flex align-items-center justify-content-center p-0"
            style={{ width: 32, height: 32 }}
            onClick={() => onScoreChange(-1)}
          >
            <CaretDownFill style={{ transform: 'translateY(1px)' }} />
          </Button>
        </div>
        <span className="flex-grow-1 mb-0">{question.title}</span>
        <Button
          ref={connectHandle}
          type="button"
          variant="outline"
          size="lg"
          style={{ cursor: 'grab' }}
          onClick={(event) => event.stopPropagation()}
        >
          <GripVertical />
        </Button>
      </Stack>
      <Collapse in={expanded}>
        <dl className="row mt-3 mb-0">
          <dt className="col-sm-4">Автор</dt>
          <dd className="col-sm-8">{question.owner?.display_name ?? 'Не указан'}</dd>
          <dt className="col-sm-4">Репутация</dt>
          <dd className="col-sm-8">{question.owner?.reputation?.toLocaleString('ru-RU') ?? '—'}</dd>
          <dt className="col-sm-4">Просмотры</dt>
          <dd className="col-sm-8">{question.view_count?.toLocaleString('ru-RU') ?? '—'}</dd>
          <dt className="col-sm-4">Активность</dt>
          <dd className="col-sm-8">{formatDate(question.last_activity_date)}</dd>
        </dl>
      </Collapse>
    </ListGroup.Item>
  )
}
