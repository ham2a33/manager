# Coding Standards

## Python

Python 3.13+

PEP8

Black

Ruff

isort

mypy

---

Все функции имеют type hints.

Все классы имеют docstring.

Все сервисы имеют интерфейсы.

---

Название файлов

snake_case

Название классов

PascalCase

Название функций

snake_case

Константы

UPPER_CASE

---

Любая функция

Максимум

50 строк

---

Любой Service

Максимум

300 строк

---

Любой файл

Максимум

500 строк

После превышения

разбивать.

---

Repository

Только SQL.

---

Service

Только бизнес логика.

---

Router

Только HTTP.

---

Provider

Только AI.

---

Connector

Только интеграция.

---

100% typing

Обязательно.

---

Async

Все IO операции.

---

Комментарии

Только там

где логика сложная.

---

Любой PR

проходит

Black

Ruff

Pytest

Mypy
