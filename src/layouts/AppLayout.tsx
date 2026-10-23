import type { ReactNode } from 'react'
import { Badge, Container, Navbar } from 'react-bootstrap'

import { QUESTION_TITLE_KEYWORD } from "@/constants";

interface AppLayoutProps {
  children: ReactNode
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <>
      <Navbar bg="body-tertiary" className="border-bottom py-3">
        <Container fluid style={{ maxWidth: 800 }}>
          <Navbar.Brand as="span" className="mb-0 fw-semibold">
            Вопросы по <Badge bg="success">{QUESTION_TITLE_KEYWORD}</Badge>
          </Navbar.Brand>
        </Container>
      </Navbar>
      <Container as="main" fluid className="py-4" style={{ maxWidth: 800 }}>
        {children}
      </Container>
    </>
  )
}
