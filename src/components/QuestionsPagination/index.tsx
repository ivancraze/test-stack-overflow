import { Pagination } from 'react-bootstrap'

interface QuestionsPaginationProps {
  page: number
  hasMore: boolean
  disabled: boolean
  onPageChange: (page: number) => void
}

export const QuestionsPagination = ({
  page,
  hasMore,
  disabled,
  onPageChange,
}: QuestionsPaginationProps) => {
  return (
    <Pagination className="mb-0 justify-content-center">
      <Pagination.Prev
        disabled={disabled || page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        Назад
      </Pagination.Prev>
      <Pagination.Item
        active
        activeLabel="(текущая)"
        disabled={disabled || page === 1}
      >
        {page}
      </Pagination.Item>
      <Pagination.Next
        disabled={disabled || !hasMore}
        onClick={() => onPageChange(page + 1)}
      >
        Далее
      </Pagination.Next>
    </Pagination>
  )
}