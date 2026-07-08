# 09_BACKEND_STRUCTURE.md

Version: 1.0

Status: Draft

---

# 1. Backend Overview

Backend является центральной частью AI Manager.

Backend отвечает за:

- обработку сообщений;
- работу AI;
- подключение каналов;
- хранение данных;
- авторизацию;
- бизнес-логику;
- работу с очередями;
- уведомления;
- аналитику.

Backend НЕ содержит интерфейс пользователя.

Telegram, Web Dashboard и API являются отдельными клиентами.

---

# 2. Технологический стек

Язык:

Python 3.13+

Framework:

FastAPI

ORM:

SQLAlchemy 2.x

Миграции:

Alembic

Валидация:

Pydantic v2

База данных:

PostgreSQL

Кэш:

Redis

Очереди:

Celery + Redis
(или Dramatiq / Arq — окончательный выбор фиксируется перед реализацией)

Векторная база:

Qdrant

Хранилище файлов:

S3 (MinIO для локальной разработки)

AI:

LiteLLM + OpenAI / Claude / Gemini

Контейнеризация:

Docker

Reverse Proxy:

Nginx

---

# 3. Структура проекта

backend/

app/

api/

core/

config/

database/

models/

schemas/

repositories/

services/

providers/

connectors/

ai/

knowledge/

workers/

tasks/

events/

middleware/

utils/

storage/

logs/

tests/

docs/

scripts/

---

# 4. Назначение папок

api/

HTTP API.

Только прием запросов.

Никакой бизнес-логики.

---

services/

Вся бизнес-логика проекта.

Например:

ConversationService

LeadService

MessageService

CompanyService

KnowledgeService

---

repositories/

Работа с базой.

Repository ничего не знает о FastAPI.

---

models/

SQLAlchemy модели.

---

schemas/

Pydantic схемы.

Request.

Response.

DTO.

---

providers/

Работа с AI.

OpenAI

Claude

Gemini

DeepSeek

Grok

Ollama

---

connectors/

Instagram

WhatsApp

Telegram

Website

Каждый Connector независим.

---

knowledge/

RAG.

Embeddings.

Chunking.

Search.

Indexing.

---

workers/

Фоновые процессы.

Обработка PDF.

Retry.

Sync.

---

events/

Event Bus.

События системы.

---

middleware/

JWT.

Logging.

Rate Limit.

Tracing.

---

utils/

Вспомогательные функции.

---

storage/

Работа с файлами.

---

tests/

Unit

Integration

E2E

---

# 5. Service Layer

Сервисы не должны знать.

FastAPI.

Telegram.

Instagram.

HTTP.

Они работают только с данными.

---

# 6. Repository Layer

Repository отвечает только за:

CRUD.

Поиск.

Фильтрацию.

Никакой бизнес-логики.

---

# 7. API Layer

API только:

Получить запрос.

Проверить данные.

Вызвать Service.

Вернуть ответ.

---

# 8. Event System

После важных действий публикуются события.

Например:

MessageReceived

LeadCreated

ConversationClosed

KnowledgeUpdated

AIResponseGenerated

NotificationRequested

Любой модуль может подписаться на событие.

---

# 9. Background Jobs

В фоне выполняются:

создание Embeddings;

обработка документов;

повторная отправка сообщений;

обновление токенов;

генерация Summary;

очистка временных файлов.

---

# 10. AI Layer

AI разделяется на:

AI Engine

Prompt Builder

Provider Factory

Providers

Memory

Knowledge

Decision Engine

---

# 11. Connectors

Каждый Connector содержит:

Webhook

OAuth

API Client

Normalizer

Sender

Health Check

---

# 12. Security

Backend обязан поддерживать:

JWT;

RBAC (роли);

шифрование секретов;

Rate Limiting;

Audit Log;

валидацию Webhook.

---

# 13. Логирование

Логируются:

входящие запросы;

исходящие ответы;

ошибки;

действия пользователя;

вызовы AI;

интеграции;

фоновые задачи.

---

# 14. Конфигурация

Все настройки берутся из переменных окружения.

Никаких секретов в коде.

Конфигурация разделяется на:

Development

Testing

Production

---

# 15. Тестирование

Минимальные требования:

Unit Tests

Integration Tests

API Tests

Repository Tests

Provider Tests

Connector Tests

---

# 16. Архитектурные принципы

- Clean Architecture.
- SOLID.
- Dependency Injection.
- Repository Pattern.
- Service Layer.
- Event-Driven.
- Асинхронность.
- Multi-Tenant.
- Расширяемость.

---

# 17. Что запрещено

- SQL внутри API Router.
- Бизнес-логика в Connector.
- Бизнес-логика в Repository.
- Прямые вызовы AI из Router.
- Прямой доступ к базе из Telegram-бота.
- Хранение секретов в коде.
- Связь модулей через глобальные переменные.

---

# 18. Главная цель

Backend должен позволять:

- заменить Telegram на Web Dashboard без изменения логики;
- заменить OpenAI на Claude/Gemini без изменения AI Engine;
- добавить новый канал без изменения ядра;
- масштабировать отдельные компоненты независимо.
