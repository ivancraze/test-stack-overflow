import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Alert, Button, Card, Col, Container, Row, Stack } from 'react-bootstrap'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Не удалось отобразить приложение', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container fluid className="bg-body-tertiary min-vh-100 px-3 py-5">
          <Row className="justify-content-center">
            <Col xs={12} md={8} lg={6}>
              <Alert variant="danger">
                <Stack gap={3}>
                  <Alert.Heading>Не удалось отобразить страницу</Alert.Heading>
                  <Card.Text>Обновите страницу, чтобы попробовать ещё раз.</Card.Text>
                  <Button variant="danger" onClick={() => window.location.reload()}>
                    Обновить страницу
                  </Button>
                </Stack>
              </Alert>
            </Col>
          </Row>
        </Container>
      )
    }

    return this.props.children
  }
}
