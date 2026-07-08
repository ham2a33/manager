# 15_PROJECT_STRUCTURE.md

Version: 1.0

Status: Final

---

# Полная структура проекта

project/

├── backend/
│
├── telegram-bot/
│
├── frontend/ (Future)
│
├── mobile/ (Future)
│
├── docs/
│
├── docker/
│
├── scripts/
│
├── tests/
│
├── .env.example
├── docker-compose.yml
├── Makefile
└── README.md

---

backend/

app/

api/

v1/

auth.py

company.py

conversation.py

message.py

knowledge.py

ai.py

statistics.py

subscription.py

webhooks.py

health.py

core/

config.py

security.py

logging.py

database/

models/

repositories/

services/

providers/

openai/

claude/

gemini/

grok/

deepseek/

ollama/

connectors/

instagram/

whatsapp/

telegram/

website/

knowledge/

embedding/

chunking/

search/

workers/

events/

middleware/

storage/

utils/

tests/

---

telegram-bot/

handlers/

middlewares/

states/

keyboards/

services/

api_client/

utils/

---

docs/

00_PROJECT.md

01_ARCHITECTURE.md

02_AI_SYSTEM.md

03_MESSAGE_FLOW.md

04_CONVERSATION.md

05_TELEGRAM_PANEL.md

06_DATABASE.md

07_API.md

08_CHANNEL_INTEGRATIONS.md

09_BACKEND_STRUCTURE.md

10_KNOWLEDGE_BASE.md

11_PROMPT_SYSTEM.md

12_MULTI_TENANT.md

13_EVENT_SYSTEM.md

14_DEPLOYMENT_ARCHITECTURE.md

15_PROJECT_STRUCTURE.md

16_CODING_STANDARDS.md

17_IMPLEMENTATION_PLAN.md

18_ACCEPTANCE_CRITERIA.md
