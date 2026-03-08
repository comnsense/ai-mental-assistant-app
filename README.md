# AI Mental Assistant App
##   Преглед
AI Mental Assistant App е иновативна платформа за подкрепа на психичното здраве, която използва изкуствен интелект и обработка на естествен език (NLP), за да предоставя достъпна, анонимна и персонализирана психологическа подкрепа. Приложението предлага 24/7 достъп до виртуален асистент, способен на емпатично взаимодействие с потребители, изпитващи стрес, тревожност, депресия и други психични трудности.

#   Ключови функционалности
Интелигентен чат на живо – Реалновремева комуникация с AI асистент, базиран на OpenAI GPT модели

Емоционален анализ – Разпознаване на потребителските емоции чрез NLP и машинно обучение

Персонализирана подкрепа – Адаптивни отговори според историята и предпочитанията на потребителя

Сигурност и анонимност – Криптиране на данните и защита на личната информация

Спешна подкрепа – Механизъм за идентифициране на кризисни състояния и насочване към професионална помощ

Обратна връзка – Система за събиране на потребителски мнения и непрекъснато подобрение

# 🏗️ Архитектура
Проектът е изграден върху микросервисна архитектура, осигуряваща мащабируемост, гъвкавост и лесна поддръжка:

text
┌─────────────────────────────────────────────────────────────┐
│                     API Gateway                              │
└───────────────┬─────────────────────────────┬───────────────┘
                │                             │
    ┌───────────▼───────────┐     ┌───────────▼───────────┐
    │  User Management      │     │     Chat Service       │
    │  (Регистрация/Вход)   │     │  (Real-time комуникация)│
    └───────────────────────┘     └───────────┬───────────┘
                                              │
                                    ┌─────────▼─────────┐
                                    │   AI/NLP Service   │
                                    │   (OpenAI GPT)     │
                                    └─────────────────────┘
    ┌───────────────────────┐     ┌───────────────────────┐
    │   Feedback Service    │     │     Data Service       │
    │  (Обратна връзка)     │     │    (MongoDB)           │
    └───────────────────────┘     └───────────────────────┘

--------  


# 🛠️ Технологичен стек
## Frontend
React.js – Библиотека за изграждане на потребителски интерфейс
Socket.io-client – Двупосочна комуникация в реално време
CSS/HTML5 – Стилизация и структура

## Backend
Node.js + Express – Сървърна логика и REST API
Socket.io – WebSocket за real-time комуникация
MongoDB + Mongoose – NoSQL база данни и ODM
JWT (JSON Web Tokens) – Автентикация и управление на сесии
bcrypt – Криптографско хеширане на пароли

## Изкуствен интелект
OpenAI GPT – Генериране на персонализирани отговори
TensorFlow/Keras – Разработка на NLP модели за анализ на емоции
NLTK/SpaCy – Обработка на естествен език

## DevOps и инфраструктура
Heroku – Облачно хостване и разгръщане
GitHub Actions – CI/CD автоматизация
Docker – Контейнеризация на услугите
Prometheus + Grafana – Мониторинг на производителността
ELK Stack (Elasticsearch, Logstash, Kibana) – Логване и анализ

📋 Структура на проекта
text
AI_Mental_Assistant_App/
│
├── client/                    # Frontend (React)
│   ├── public/                # Статични файлове
│   │   └── index.html
│   ├── src/
│   │   ├── components/        # React компоненти
│   │   │   ├── ChatWindow.js  # Чат прозорец
│   │   │   ├── LoginForm.js   # Форма за вход
│   │   │   └── Settings.js    # Настройки
│   │   ├── services/          # API интеграции
│   │   │   └── socket.js      # Socket.io конфигурация
│   │   ├── App.js             # Основен компонент
│   │   └── index.js           # Входна точка
│   └── package.json
│
├── server/                     # Backend (Node.js)
│   ├── config/
│   │   └── database.js         # MongoDB конфигурация
│   ├── models/
│   │   ├── User.js             # Потребителски модел
│   │   ├── ChatSession.js      # Чат сесия модел
│   │   ├── Message.js          # Съобщение модел
│   │   └── Feedback.js         # Обратна връзка модел
│   ├── routes/
│   │   ├── auth.js             # Автентикация endpoints
│   │   ├── chat.js             # Чат endpoints
│   │   └── feedback.js         # Обратна връзка endpoints
│   ├── services/
│   │   ├── aiService.js        # OpenAI GPT интеграция
│   │   └── emotionAnalysis.js  # Емоционален анализ
│   ├── middleware/
│   │   └── auth.js             # JWT валидация
│   ├── app.js                  # Express конфигурация
│   ├── server.js                # Сървър стартиране
│   └── package.json
│
├── .env                         # Environment променливи
├── .gitignore                   # Git игнорирани файлове
├── docker-compose.yml           # Docker композиция
├── README.md                    # Документация
└── package.json                 # Основни зависимости


## 💾 Модели на база данни (MongoDB)

Users
javascript
{
  _id: ObjectId,
  username: String,
  email: String,
  hashedPassword: String,
  createdAt: Date,
  updatedAt: Date
}

ChatSessions
javascript
{
  _id: ObjectId,
  userId: ObjectId,
  status: String, // 'active', 'ended'
  createdAt: Date,
  endedAt: Date
}

Messages
javascript
{
  _id: ObjectId,
  chatSessionId: ObjectId,
  userId: ObjectId,
  messageText: String,
  sentAt: Date,
  direction: String // 'user_to_ai', 'ai_to_user'
}
 
 
-----

env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mental_health_app
JWT_SECRET=your_super_secret_jwt_key
OPENAI_API_KEY=your_openai_api_key
NODE_ENV=development

---

## 🔒 Сигурност
JWT токени – За сигурна автентикация и управление на сесии
bcrypt хеширане – Защитено съхранение на пароли
HTTPS – Криптирана комуникация клиент-сървър
Валидация на входните данни – Предотвратяване на инжекционни атаки
GDPR съвместимост – Прозрачност при обработката на лични данни

# 📊 Мониторинг и логване
Grafana – Визуализация на метрики в реално време
Prometheus – Събиране на производителностни данни
Kibana – Анализ и визуализация на логове
Elasticsearch – Съхранение и индексиране на логове

##  CI/CD с GitHub Actions
Проектът използва GitHub Actions за автоматично тестване и разгръщане:

yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install dependencies
        run: npm install
      - name: Run tests
        run: npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Heroku
        env:
          HEROKU_API_KEY: ${{ secrets.HEROKU_API_KEY }}
        run: |
          git push https://heroku:$HEROKU_API_KEY@git.heroku.com/your-app-name.git main

#  Използвани технологии и библиотеки

## Frontend
react – ^18.2.0
socket.io-client – ^4.5.0
axios – ^1.3.0
react-router-dom – ^6.8.0

## Backend
express – ^4.18.0
mongoose – ^7.0.0
jsonwebtoken – ^9.0.0
bcryptjs – ^2.4.3
socket.io – ^4.5.0
openai – ^3.2.0
dotenv – ^16.0.0

📝 API Endpoints
## Автентикация
POST /api/auth/register – Регистрация
POST /api/auth/login – Вход
GET /api/auth/profile – Профилна информация

## Чат
POST /api/chat/session – Създаване на нова сесия
GET /api/chat/history/:sessionId – История на чат
DELETE /api/chat/session/:sessionId – Приключване на сесия

## Обратна връзка
POST /api/feedback – Изпращане на обратна връзка
GET /api/feedback/user – Преглед на собствените мнения

## Лиценз
Този проект е разработен за дипломна работа във Варненски свободен университет "Черноризец Храбър". Всички права запазени.

## Автор
Мирела Свиленова Йосифова
Специалност: Информатика и компютърни науки
Факултетен номер: 193010038
Научен ръководител: Доц. д-р Веселина Спасова