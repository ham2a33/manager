# 02_AI_SYSTEM.md

Version: 1.0

---

# 1. AI Philosophy

AI Manager никогда не должен зависеть от одного поставщика искусственного интеллекта.

Вся архитектура строится вокруг понятия AI Provider.

Provider — это отдельный модуль, который умеет работать с конкретной моделью.

Например

OpenAI

Claude

Gemini

DeepSeek

Grok

Ollama

Внутри системы они должны быть взаимозаменяемыми.

Никакой другой модуль системы не должен знать, какой Provider используется в данный момент.

---

# 2. AI Architecture

                        AI Engine

                            │

        ┌───────────────────┼────────────────────┐

        ▼                   ▼                    ▼

 OpenAI Provider    Claude Provider     Gemini Provider

        ▼                   ▼                    ▼

    OpenAI API       Anthropic API       Google API

Каждый Provider реализует одинаковый интерфейс.

---

# 3. AI Provider Interface

Каждый AI Provider обязан реализовать следующие методы.

generate_response()

stream_response()

count_tokens()

calculate_cost()

health_check()

supports_images()

supports_voice()

supports_reasoning()

supports_tools()

supports_streaming()

Независимо от модели система всегда работает одинаково.

---

# 4. AI Engine

AI Engine ничего не знает про OpenAI.

Он знает только AI Provider.

Пример работы

Получить сообщение

↓

Получить историю

↓

Получить документы

↓

Получить настройки

↓

Выбрать Provider

↓

Сгенерировать ответ

↓

Вернуть ответ

---

# 5. Company Settings

Каждая компания может выбрать собственного AI.

Например

Company A

Provider

OpenAI

Model

gpt-5

--------------------

Company B

Provider

Claude

Model

claude-opus

--------------------

Company C

Provider

Gemini

Model

gemini-pro

--------------------

Company D

Provider

DeepSeek

Model

deepseek-chat

Все компании работают одновременно.

Каждая использует свою модель.

---

# 6. Поддерживаемые Provider

Версия MVP

✅ OpenAI

Версия 1.1

✅ Claude

Версия 1.2

✅ Gemini

Версия 1.3

✅ DeepSeek

Версия 1.4

✅ Grok

Версия 2.0

✅ Ollama

Версия 2.1

Любые кастомные Provider

---

# 7. AI Factory

Создание Provider должно происходить через фабрику.

Например

Provider = AIProviderFactory.create()

Фабрика сама определяет

какой Provider создать

какую модель использовать

какие ключи использовать

какие ограничения действуют

---

# 8. Возможности моделей

Каждый Provider сообщает системе свои возможности.

Например

OpenAI

Images

YES

Voice

YES

Streaming

YES

Tools

YES

-------------------

Claude

Images

YES

Voice

NO

Streaming

YES

Tools

YES

-------------------

Gemini

Images

YES

Video

YES

Voice

YES

Streaming

YES

AI Engine автоматически использует доступные функции.

---

# 9. AI Failover

Если основной Provider недоступен.

Например

OpenAI вернул ошибку.

Система автоматически пытается использовать резервный Provider.

Например

OpenAI

↓

Ошибка

↓

Claude

↓

Ошибка

↓

Gemini

↓

Ответ успешно получен

Все переключение происходит автоматически.

---

# 10. Стоимость

Каждый Provider обязан возвращать стоимость запроса.

Например

Prompt Tokens

Completion Tokens

Общая стоимость

Валюта

Эти данные используются в статистике компании.

---

# 11. AI Memory

Независимо от Provider.

История всегда хранится внутри AI Manager.

Не внутри OpenAI.

Не внутри Claude.

Не внутри Gemini.

Это позволяет менять модели без потери истории.

---

# 12. Prompt Builder

Промпт всегда строится внутри AI Manager.

Он состоит из

System Prompt

+

Company Prompt

+

Conversation History

+

Knowledge Base

+

Current Message

Только после этого он передается Provider.

---

# 13. Будущие возможности

Несколько моделей одновременно.

Например

OpenAI отвечает за диалог.

Claude проверяет качество ответа.

Gemini анализирует изображения.

DeepSeek пишет код.

Все это должно поддерживаться архитектурой.

---

# 14. Основные правила

Provider нельзя использовать напрямую.

Все обращения только через AI Engine.

Добавление нового Provider не должно требовать изменения существующего кода.

Каждый Provider является независимым модулем.

Каждый Provider тестируется отдельно.

Все Provider должны соответствовать одному интерфейсу.
