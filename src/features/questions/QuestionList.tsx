import { useEffect, useState } from 'react'
import { ListGroup } from 'react-bootstrap'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import { QuestionCard } from '@/components'
import { useAppDispatch, useAppSelector } from '@/store'

import { questionMoved, questionsSwapped, scoreChanged } from './questionsSlice'

export const QuestionList = () => {
  const dispatch = useAppDispatch()
  const { items } = useAppSelector((state) => state.questions)
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const [selectedForSwapId, setSelectedForSwapId] = useState<number | null>(null)

  function selectForSwap(id: number) {
    if (selectedForSwapId === null) {
      setSelectedForSwapId(id)
    } else {
      dispatch(questionsSwapped({ firstId: selectedForSwapId, secondId: id }))
      setExpandedId(null)
      setSelectedForSwapId(null)
    }
  }

  useEffect(() => {
    function closeOnOutsideClick(event: PointerEvent) {
      const target = event.target
      if (target instanceof Element && target.closest('[data-question-card]')) return
      setExpandedId(null)
      setSelectedForSwapId(null)
    }

    document.addEventListener('pointerdown', closeOnOutsideClick)
    return () => document.removeEventListener('pointerdown', closeOnOutsideClick)
  }, [dispatch])

  return (
    <DndProvider backend={HTML5Backend}>
      <ListGroup as="ul" style={{ isolation: 'isolate' }}>
        {items.map((question) => (
          <QuestionCard
            key={question.question_id}
            question={question}
            expanded={expandedId === question.question_id}
            selectedForSwap={selectedForSwapId === question.question_id}
            onExpand={() =>
              setExpandedId(expandedId === question.question_id ? null : question.question_id)
            }
            onDoubleClick={() => selectForSwap(question.question_id)}
            onScoreChange={(delta) => dispatch(scoreChanged({ id: question.question_id, delta }))}
            onDrop={(sourceId) => {
              dispatch(questionMoved({ sourceId, targetId: question.question_id }))
              setExpandedId(null)
              setSelectedForSwapId(null)
            }}
          />
        ))}
      </ListGroup>
    </DndProvider>
  )
}
