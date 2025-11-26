# 🏗️ Структура проекта

src/
├── 📁 assets/ # Статические ресурсы
│ ├── icons/ # SVG иконки, иконки для приложения
│
├── 📁 components/ # Переиспользуемые UI компоненты
│ ├── UI/ # Базовые компоненты (Button, Input, Card, Modal)
│ ├── Layout/ # Компоненты макета (Header, Footer, Grid)
│ └── Common/ # Общие компоненты приложения
│
├── 📁 features/ # Функциональные модули (бизнес-логика)
│ ├── tasks/ # Всё для работы с задачами
│ │ ├── components/# Компоненты задач (TaskItem, TaskList, TaskForm)
│ │ ├── hooks/ # Хуки задач (useTasks, useTaskActions)
│ │ ├── utils/ # Утилиты задач (фильтрация, сортировка)
│ │ └── types.ts # Типы для задач
│ ├── projects/ # Всё для работы с проектами
│ └── settings/ # Настройки приложения
│
├── 📁 fonts/ # Кастомные шрифты
│ ├── Inter/ # Файлы шрифта Inter
│ └── Roboto/ # Файлы шрифта Roboto
│
├── 📁 global/ # Глобальные настройки
│ ├── constants.ts # Константы приложения
│ ├── config.ts # Конфигурация приложения
│ └── types.ts # Глобальные TypeScript типы
│
├── 📁 hooks/ # Кастомные React хуки
│ ├── useTasks.ts # Логика работы с задачами
│ ├── useLocalStorage.ts # Работа с localStorage
│ └── useApi.ts # API запросы
│
├── 📁 pages/ # Страницы приложения (роуты)
│ ├── Incoming/ # Страница "Входящие"
│ │ ├── Incoming.tsx
│ │ └── incoming.css
│ ├── Today/ # Страница "Сегодня"
│ └── Projects/ # Страница "Проекты"
│
├── 📁 sidebar/ # Компоненты сайдбара
│ ├── Sidebar.tsx # Основной компонент сайдбара
│ ├── SidebarItem.tsx # Элемент сайдбара
│ └── sidebar.css # Стили сайдбара
│
├── 📁 styles/ # Глобальные стили
│ ├── globals.css # Основные глобальные стили
│ ├── variables.css # CSS переменные (цвета, шрифты)
│ └── themes/ # Темы оформления
│
├── 📁 utils/ # Вспомогательные функции
│ ├── taskUtils.ts # Утилиты для задач
│ ├── dateUtils.ts # Работа с датами
│ └── formatters.ts # Форматирование данных
│
└── 📁 types/ # TypeScript типы
├── taskTypes.ts # Типы для задач
├── apiTypes.ts # Типы API
└── common.ts # Общие типы
