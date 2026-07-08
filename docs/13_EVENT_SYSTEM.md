# 13_EVENT_SYSTEM.md

Version: 1.0

Status: Draft

---

# 1. Overview

AI Manager использует событийную архитектуру (Event-Driven Architecture).

Компоненты системы не должны напрямую вызывать друг друга, если это не требуется.

После выполнения важных действий публикуются события (Events).

Другие модули могут подписываться на эти события и выполнять собственную работу.

---

# 2. Основные понятия

Event — факт, который уже произошел.

Примеры:

- MessageReceived
- MessageSent
- ConversationCreated
- LeadCreated
- AIResponseGenerated
- DocumentUploaded

Event не содержит бизнес-логику.

Он только сообщает системе о произошедшем.

---

# 3. Event Bus

Event Bus отвечает за доставку событий подписчикам.

Схема:

Module

↓

Publish Event

↓

Event Bus

↓

Subscribers

Если подписчиков несколько.

Все получают событие независимо.

---

# 4. Основные события MVP

Сообщения

- MessageReceived
- MessageProcessed
- MessageSent
- MessageFailed

Диалоги

- ConversationCreated
- ConversationClosed
- ConversationAssignedToAI
- ConversationAssignedToHuman

AI

- AIRequestStarted
- AIResponseGenerated
- AIProviderFailed

Knowledge Base

- DocumentUploaded
- DocumentProcessed
- DocumentIndexed

Leads

- LeadCreated
- LeadUpdated

Компания

- CompanyCreated
- CompanyUpdated

Каналы

- ChannelConnected
- ChannelDisconnected

---

# 5. MessageReceived

Публикуется сразу после получения сообщения.

Подписчики:

- SaveMessageHandler
- AnalyticsHandler
- SpamCheckHandler
- AIProcessingHandler

---

# 6. AIResponseGenerated

После успешного ответа AI.

Подписчики:

- SendMessageHandler
- StatisticsHandler
- AuditHandler

---

# 7. LeadCreated

После создания лида.

Подписчики:

- NotificationHandler
- StatisticsHandler

---

# 8. DocumentUploaded

После загрузки документа.

Подписчики:

- ChunkingHandler
- EmbeddingHandler

---

# 9. Notification Events

События могут создавать уведомления.

Например:

SubscriptionExpiring

↓

Telegram Notification

AIProviderFailed

↓

Telegram Notification

LeadCreated

↓

Telegram Notification

---

# 10. Retry Events

Если задача завершилась ошибкой.

Публикуется:

JobFailed

↓

RetryWorker

↓

Повторная попытка

Если лимит превышен.

↓

ManualReviewRequired

---

# 11. Event Structure

Каждое событие содержит:

event_id

event_name

company_id

timestamp

source

payload

trace_id

version

---

# 12. Event Versioning

Каждое событие имеет версию.

Например:

MessageReceived v1

MessageReceived v2

Это позволит безопасно изменять формат событий.

---

# 13. Ordering

Для одного Conversation события должны обрабатываться по порядку.

Нельзя:

Message #2

↓

раньше

↓

Message #1

При необходимости используется очередь.

---

# 14. Idempotency

Одно событие может прийти повторно.

Обработчики обязаны быть идемпотентными.

Повторная обработка не должна создавать дубликаты.

---

# 15. Monitoring

Для каждого события фиксируется:

- время публикации;
- время обработки;
- обработчик;
- статус;
- ошибки.

Это используется для диагностики.

---

# 16. Будущие события

Архитектура должна позволять добавлять новые события без изменения существующих обработчиков.

Например:

- PaymentReceived
- CRMLeadCreated
- VoiceCallStarted
- EmailReceived
- AppointmentBooked

---

# 17. Правила

1. События описывают только факт.
2. Event Bus не содержит бизнес-логики.
3. Каждый обработчик отвечает только за одну задачу.
4. Один Event может иметь несколько подписчиков.
5. Ошибка одного обработчика не должна останавливать остальные.
6. Все события логируются.
7. Все события содержат company_id.
8. Все события имеют версию.
9. Повторная обработка должна быть безопасной.
10. Новые обработчики можно добавлять без изменения существующего кода.
