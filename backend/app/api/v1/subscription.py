from fastapi import APIRouter

router = APIRouter()


@router.get("/current")
async def current_subscription():
    return {
        "plan": "mvp",
        "status": "active",
        "limits": {"conversations": 1000, "knowledge_documents": 100},
    }

