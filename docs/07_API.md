# 08_API.md

Version: 1.0

Status: Draft

---

# 1. API Overview

Backend предоставляет единое REST API.

Все клиенты работают только через него.

Backend является единственным источником данных.

Запрещается обращаться к базе данных напрямую.

---

# 2. Архитектура

Client

↓

REST API

↓

Router

↓

Service

↓

Repository

↓

Database

Каждый слой выполняет только свою задачу.

---

# 3. API Version

Все endpoint должны иметь версию.

Например

/api/v1/

Это позволит выпускать новые версии API.

---

# 4. Authentication

Все защищенные endpoint требуют JWT.

Исключения:

Instagram Webhook

WhatsApp Webhook

Health Check

---

# 5. Response Format

Любой успешный ответ.

{
    success: true,
    data: {},
    message: ""
}

Ошибка.

{
    success: false,
    error: "",
    code: ""
}

Структура ответа должна быть одинаковой.

---

# 6. Companies

GET

/api/v1/company

Получить информацию о компании.

---------------

PUT

/api/v1/company

Изменить компанию.

---------------

GET

/api/v1/company/settings

Настройки компании.

---

# 7. Conversations

GET

/api/v1/conversations

Получить список.

---------------

GET

/api/v1/conversations/{id}

Получить диалог.

---------------

POST

/api/v1/conversations/{id}/reply

Ответить клиенту.

---------------

POST

/api/v1/conversations/{id}/assign-ai

Передать AI.

---------------

POST

/api/v1/conversations/{id}/assign-human

Передать человеку.

---------------

POST

/api/v1/conversations/{id}/close

Закрыть диалог.

---

# 8. Messages

GET

/api/v1/messages

Получить сообщения.

---------------

POST

/api/v1/messages

Создать сообщение.

---------------

DELETE

/api/v1/messages/{id}

Удалить (Soft Delete).

---

# 9. Clients

GET

/api/v1/clients

Получить клиентов.

---------------

GET

/api/v1/clients/{id}

Карточка клиента.

---

# 10. Leads

GET

/api/v1/leads

Все лиды.

---------------

POST

/api/v1/leads

Создать лид.

---------------

PATCH

/api/v1/leads/{id}

Изменить.

---------------

DELETE

/api/v1/leads/{id}

Удалить.

---

# 11. Knowledge Base

POST

/api/v1/knowledge/upload

Загрузка документа.

---------------

GET

/api/v1/knowledge/files

Документы.

---------------

DELETE

/api/v1/knowledge/files/{id}

Удалить.

---------------

POST

/api/v1/knowledge/reindex

Переиндексация.

---

# 12. AI

GET

/api/v1/ai/settings

Настройки.

---------------

PUT

/api/v1/ai/settings

Изменить.

---------------

GET

/api/v1/ai/providers

Список Provider.

---------------

GET

/api/v1/ai/models

Модели.

---

# 13. Channels

GET

/api/v1/channels

Подключенные каналы.

---------------

POST

/api/v1/channels/connect

Подключить.

---------------

POST

/api/v1/channels/disconnect

Отключить.

---

# 14. Statistics

GET

/api/v1/statistics

Общая статистика.

---------------

GET

/api/v1/statistics/today

Сегодня.

---------------

GET

/api/v1/statistics/month

Месяц.

---

# 15. Subscription

GET

/api/v1/subscription

Информация.

---------------

POST

/api/v1/subscription/pay

Оплата.

---

# 16. Telegram

POST

/api/v1/telegram/update

Webhook Telegram.

---

# 17. Instagram

POST

/api/v1/webhooks/instagram

Получение сообщений.

GET

/api/v1/webhooks/instagram

Проверка Meta.

---

# 18. WhatsApp

POST

/api/v1/webhooks/whatsapp

Получение сообщений.

GET

/api/v1/webhooks/whatsapp

Проверка.

---

# 19. Health

GET

/api/v1/health

Проверка API.

GET

/api/v1/health/database

База данных.

GET

/api/v1/health/redis

Redis.

GET

/api/v1/health/providers

AI Providers.

---

# 20. Основные правила

1. REST API является единственной точкой входа.

2. Все ответы имеют одинаковую структуру.

3. Все ошибки логируются.

4. Все endpoint документируются через OpenAPI.

5. Каждый endpoint покрывается тестами.

6. Все endpoint являются асинхронными.

7. Все запросы валидируются через Pydantic.

8. Repository не вызывается напрямую из Router.

9. Router содержит только обработку HTTP.

10. Вся бизнес-логика находится в Service.
