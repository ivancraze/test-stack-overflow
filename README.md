# Stack Overflow Questions

Проектик на React, TypeScript, Redux Toolkit и React Bootstrap, показывает вопросы Stack Overflow с `react-redux` в заголовке.
Загрузка через createAsyncThunk и локальные изменения используют один Redux slice.
Можно выбрать дату, локально менять рейтинг, раскрывать подробности и менять порядок карточек по грип-кнопке или даблклику.

## Требования

- Node.js `^20.19.0` или `>=22.12.0`
- npm

## Установка и запуск

```bash
npm install
npm run dev
```

Откройте URL, напечатанный Vite в терминале (обычно `http://localhost:5173`).
Приложение обращается к Stack Exchange API напрямую; отдельные ключи или .env не требуются.

## Проверки и

Тесты покрывают редьюсер вопросов: увеличение и уменьшение рейтинга, перенос и обмен
элементов списка. Сценарии и комментарии написаны на русском в
`src/features/questions/questionsSlice.test.ts`. Отдельный `loadQuestions.test.ts` проверяет загрузку из настоящего Stack Exchange API и сохранение ответа в Redux. Для него нужны интернет и доступный API; он расходует квоту запросов.

```bash
npm test
```

## Production build

```bash
npm run build
npm run preview
```

Данные получает Stack Exchange API `/2.3/search/advanced` с параметрами `site=stackoverflow`, `title=react-redux`, `sort=votes`, `order=desc` и выбранной датой `fromdate`. Компоненты интерфейса построены на React Bootstrap и Bootstrap 5.

## Качество кода

```bash
npm run lint
npm run lint:fix
npm run format
```

ESLint использует рекомендуемые правила JavaScript, TypeScript, React и React Hooks. Импорты сортируются автоматически; JSX-пропсы форматируются по одному на строку.

## Структура

- `src/store` — настройка Redux store, его типы и типизированные хуки.
- `src/pages` — экран вопросов: выбор даты, состояния загрузки, список и пагинация.
- `src/layouts` — общий контейнер страницы AppLayout.
- `src/features/questions` — API-запрос, slice, композиция списка вопросов и тесты.
- `src/components` — компоненты интерфейса в отдельных папках, включая QuestionCard; общий `index.ts` экспортирует их для импорта через `@/components`.
- `src/types` — общие типы данных и схемы проверки ответа API.
- `src/constants` — все константы.
- `src/utils` — функции-утилиты.

## Дополнительно

- Добавил пагинацию, показалось нужным
