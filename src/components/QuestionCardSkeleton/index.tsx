import { ListGroup, Placeholder, Stack } from 'react-bootstrap'

export const QuestionCardSkeleton = () => (
  <div role="status">
    <span className="visually-hidden">Загружаем вопросы…</span>
    <ListGroup as="ul" aria-hidden="true">
      <ListGroup.Item as="li">
        <Placeholder as="div" animation="glow">
          <Stack direction="horizontal" gap={3}>
            <div className="d-flex flex-column align-items-center gap-1 flex-shrink-0">
              <Placeholder
                as="span"
                className="rounded-circle"
                style={{ width: 32, height: 32 }}
              />
              <Placeholder as="span" style={{ width: 20, height: 20 }} />
              <Placeholder
                as="span"
                className="rounded-circle"
                style={{ width: 32, height: 32 }}
              />
            </div>
            <div className="flex-grow-1">
              <Placeholder as="span" xs={10} />
              <Placeholder as="span" xs={7} />
            </div>
            <Placeholder as="span" style={{ width: 16, height: 24 }} />
          </Stack>
        </Placeholder>
      </ListGroup.Item>
    </ListGroup>
  </div>
)
