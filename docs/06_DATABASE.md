# 07_DATABASE.md

Version: 1.0

Status: Draft

---

# 1. Overview

AI Manager использует PostgreSQL как основную базу данных.

Все данные разделяются по Company.

Каждая компания полностью изолирована.

Ни одна компания не может получить доступ к данным другой.

Все основные таблицы обязаны содержать поле:

company_id

Это основное правило Multi-Tenant архитектуры.

---

# 2. Основные сущности

База данных состоит из следующих модулей.

Authentication

Companies

Users

Channels

Conversations

Messages

Knowledge Base

AI

Leads

Statistics

Subscriptions

Logs

Settings

Files

---

# 3. Таблица Companies

Назначение:

Хранение информации о компании.

Поля:

id

uuid

name

slug

description

logo_url

email

phone

website

timezone

language

currency

status

created_at

updated_at

deleted_at

Каждая компания является корневой сущностью.

---

# 4. Таблица Users

Назначение:

Пользователи компании.

Поля

id

company_id

telegram_id

first_name

last_name

username

role

is_owner

is_active

last_login

created_at

updated_at

В будущем:

несколько операторов.

---

# 5. Таблица Channels

Назначение

Подключенные каналы.

Поля

id

company_id

platform

channel_name

external_id

access_token

refresh_token

expires_at

status

last_sync

created_at

---

Platform

Instagram

WhatsApp

Telegram

Website

Facebook

---

# 6. Таблица Conversations

Назначение

Все диалоги.

Поля

id

company_id

channel_id

client_id

status

assigned_user_id

ai_provider

ai_model

summary

last_message_at

created_at

updated_at

---

# 7. Таблица Clients

Каждый клиент хранится отдельно.

Поля

id

company_id

platform

external_user_id

phone

email

username

first_name

last_name

language

notes

created_at

updated_at

Если один и тот же человек напишет снова.

Используется существующая запись.

---

# 8. Таблица Messages

Самая большая таблица системы.

Поля

id

conversation_id

company_id

sender_type

message_type

text

attachments

reply_to

status

provider

model

tokens

cost

metadata

created_at

---

sender_type

CLIENT

AI

OWNER

SYSTEM

---

# 9. Таблица AI Settings

Настройки искусственного интеллекта.

Поля

id

company_id

provider

model

temperature

max_tokens

system_prompt

company_prompt

language

tone

working_hours

auto_reply

human_escalation

created_at

---

# 10. Таблица Knowledge Files

Загруженные документы.

Поля

id

company_id

filename

file_type

file_size

storage_path

status

uploaded_by

created_at

---

# 11. Таблица Knowledge Chunks

Разбитые части документов.

Поля

id

file_id

company_id

chunk_index

content

embedding_id

token_count

created_at

Embedding хранится в Qdrant.

В PostgreSQL хранится только связь.

---

# 12. Таблица Leads

Потенциальные клиенты.

Поля

id

company_id

conversation_id

client_id

status

service

budget

comment

created_at

---

# 13. Таблица Statistics

Дневная статистика.

Поля

id

company_id

date

messages

conversations

leads

ai_answers

human_answers

tokens

cost

---

# 14. Таблица Subscriptions

Подписка компании.

Поля

id

company_id

plan

status

expires_at

limits

usage

created_at

---

# 15. Таблица Logs

Все события системы.

Поля

id

company_id

event

level

payload

created_at

---

# 16. Таблица Files

Все загруженные файлы.

Поля

id

company_id

filename

mime_type

size

storage_path

checksum

created_at

---

# 17. Связи между таблицами

Company
│
├── Users
├── Channels
├── Clients
├── Conversations
├── Messages
├── Leads
├── Knowledge Files
├── AI Settings
├── Statistics
├── Logs
├── Files
└── Subscription

Conversation

↓

Messages

Conversation

↓

Lead

Knowledge File

↓

Knowledge Chunk

---

# 18. Правила

Все таблицы содержат:

id

created_at

updated_at

Все внешние ключи используют UUID там, где это удобно для внешних API, а внутренние связи могут использовать bigint для производительности (решение фиксируется на этапе реализации).

Никогда не удалять данные физически.

Использовать Soft Delete там, где это требуется.

---

# 19. Индексы

Обязательно индексировать:

company_id

conversation_id

client_id

telegram_id

external_user_id

platform

status

created_at

last_message_at

Это критично для производительности.

---

# 20. Основные принципы

1. Полная Multi-Tenant архитектура.

2. Все данные принадлежат компании.

3. Все сообщения сохраняются.

4. История никогда не удаляется автоматически.

5. AI Provider можно менять без изменения структуры базы.

6. База знаний отделена от сообщений.

7. Все действия логируются.

8. База должна выдерживать миллионы сообщений.

9. Архитектура должна быть готова к масштабированию.

10. Любые будущие функции добавляются без изменения существующих таблиц.
