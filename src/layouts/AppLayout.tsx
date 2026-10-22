import type { ReactNode } from 'react'
import { Badge, Container, Navbar } from 'react-bootstrap'

interface AppLayoutProps {
  children: ReactNode
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <>
      <Navbar bg="body-tertiary" className="border-bottom py-3">
        <Container fluid style={{ maxWidth: 800 }}>
          <Navbar.Brand as="span" className="mb-0 fw-semibold">
            Вопросы по <Badge bg="success">react-redux</Badge>
          </Navbar.Brand>
        </Container>
      </Navbar>
      <Container as="main" fluid className="py-4" style={{ maxWidth: 800 }}>
        {children}
      </Container>
    </>
  )
}
