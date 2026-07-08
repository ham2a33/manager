# 09_CHANNEL_INTEGRATIONS.md

Version: 1.0

Status: Draft

---

# 1. Overview

AI Manager работает через систему Connectors.

Каждый Connector отвечает за интеграцию с одной внешней платформой.

Например

Instagram Connector

WhatsApp Connector

Telegram Connector

Website Connector

Facebook Connector

Email Connector

Каждый Connector реализует один и тот же интерфейс.

Благодаря этому AI Engine не знает откуда пришло сообщение.

Для него существует только Message.

---

# 2. Общая схема

Клиент

↓

Instagram

↓

Meta

↓

Webhook

↓

AI Manager

↓

AI

↓

Ответ

↓

Meta

↓

Instagram

↓

Клиент

Абсолютно такая же схема работает для WhatsApp.

---

# 3. Connector Interface

Каждый Connector обязан реализовать одинаковые методы.

connect()

disconnect()

receive_message()

send_message()

verify_webhook()

refresh_token()

health_check()

normalize_message()

upload_attachment()

download_attachment()

Это обязательный контракт.

---

# 4. Подключение компании

Новая компания должна пройти мастер подключения.

Шаг 1

Создать компанию.

↓

Шаг 2

Выбрать канал.

↓

Шаг 3

Авторизоваться.

↓

Шаг 4

Подтвердить права.

↓

Шаг 5

Проверка подключения.

↓

Готово.

---

# 5. OAuth

Все подключения происходят только через OAuth.

Пользователь никогда не вводит:

Access Token

Refresh Token

App Secret

API Key

Все выполняется автоматически.

---

# 6. Instagram

После нажатия

Подключить Instagram

Backend генерирует OAuth URL.

↓

Пользователь входит в Meta.

↓

Выбирает бизнес.

↓

Выбирает страницу.

↓

Выбирает Instagram.

↓

Подтверждает разрешения.

↓

Meta возвращает Code.

↓

Backend получает Access Token.

↓

Сохраняет его безопасно.

↓

Создает Channel.

↓

Регистрирует Webhook.

↓

Проверяет соединение.

↓

Готово.

---

# 7. WhatsApp

Процесс полностью аналогичный.

Подключить WhatsApp

↓

Meta OAuth

↓

Выбор Business Account

↓

Выбор Phone Number

↓

Получение Token

↓

Регистрация Webhook

↓

Проверка

↓

Готово.

---

# 8. Channel

После подключения создается запись.

Company

↓

Channel

Тип

Instagram

или

WhatsApp

Channel содержит:

Platform

External ID

Display Name

Status

Permissions

Created At

Последняя синхронизация

---

# 9. Webhook

Каждый Connector обязан иметь собственный Webhook.

Instagram

/api/v1/webhooks/instagram

WhatsApp

/api/v1/webhooks/whatsapp

Telegram

/api/v1/webhooks/telegram

Website

/api/v1/webhooks/site

---

# 10. Webhook Verification

При регистрации Meta выполняет проверку.

Backend обязан:

Проверить Verify Token.

Вернуть Challenge.

Если проверка не прошла.

Webhook не активируется.

---

# 11. Получение сообщений

Webhook получает POST.

↓

Connector проверяет подпись.

↓

Создает Universal Message.

↓

Передает Message Gateway.

После этого Connector больше ничего не делает.

---

# 12. Отправка сообщений

AI сформировал ответ.

↓

Connector получает Universal Response.

↓

Преобразует формат.

↓

Отправляет через API платформы.

Connector никогда не изменяет текст.

---

# 13. Вложения

Connector обязан поддерживать.

Изображения

PDF

Видео

Голосовые

Документы

Любое вложение преобразуется в единый внутренний формат.

---

# 14. Повторная отправка

Если API платформы недоступно.

Ответ помещается в Retry Queue.

Система автоматически повторяет отправку.

Через:

30 секунд

1 минуту

5 минут

15 минут

После превышения лимита.

Уведомить владельца.

---

# 15. Refresh Token

Backend автоматически следит.

Если Token скоро истекает.

↓

Получить новый.

↓

Обновить.

Компания ничего не замечает.

---

# 16. Ограничения

Каждый Connector сообщает.

Максимальная длина сообщения.

Поддерживаемые вложения.

Максимальный размер файла.

Rate Limit.

Это позволяет Backend учитывать ограничения каждой платформы.

---

# 17. Ошибки

Connector обязан различать.

Ошибка сети.

Ошибка авторизации.

Просроченный Token.

Rate Limit.

Ошибка платформы.

Недоступность API.

Каждая ошибка имеет собственный обработчик.

---

# 18. Отключение

Если пользователь нажал.

Отключить канал.

↓

Webhook удаляется.

↓

Token удаляется.

↓

Channel становится Inactive.

↓

История сохраняется.

---

# 19. Добавление нового Connector

Чтобы добавить новый канал.

Разработчик реализует Connector Interface.

Регистрирует Connector.

Готово.

Никакой другой код изменять нельзя.

---

# 20. Основные правила

1. Каждый канал является независимым модулем.

2. Все каналы используют один Message Flow.

3. Все каналы используют один AI Engine.

4. Все сообщения приводятся к Universal Message.

5. Connector не содержит бизнес-логики.

6. Connector не знает про AI.

7. Connector не работает с базой напрямую.

8. Все обращения идут через Backend Services.

9. Любой новый канал подключается без изменения ядра.

10. AI Manager должен поддерживать неограниченное количество Connector'ов.
