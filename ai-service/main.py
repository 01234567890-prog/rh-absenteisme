from fastapi import FastAPI
from spring_client import get_all_presences, get_all_leaves, get_all_users

app = FastAPI(title="PulseHR AI Service")


@app.get("/")
def health_check():
    return {"status": "AI service is running"}


@app.get("/test/presences")
async def test_presences():
    return await get_all_presences()