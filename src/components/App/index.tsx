import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-datepicker/dist/react-datepicker.css'

import { AppLayout } from '@/layouts'
import { QuestionsPage } from '@/pages'

export const App = () => {
  return (
    <AppLayout>
      <QuestionsPage />
    </AppLayout>
  )
}
