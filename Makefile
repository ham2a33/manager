.PHONY: install dev test lint compose-up compose-down migrate migrate-docker

install:
	python3 -m pip install -r requirements.txt

dev:
	uvicorn app.main:app --app-dir backend --host 0.0.0.0 --port 8000 --reload

test:
	pytest

lint:
	ruff check backend telegram-bot

migrate:
	alembic upgrade head

migrate-docker:
	docker compose run --rm backend alembic upgrade head

compose-up:
	docker compose up --build -d

compose-down:
	docker compose down -v

