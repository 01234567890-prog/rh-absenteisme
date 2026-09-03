import httpx
from config import SPRING_BOOT_URL, AI_API_KEY

HEADERS = {"X-API-KEY": AI_API_KEY}


async def get_all_presences():
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{SPRING_BOOT_URL}/presences", headers=HEADERS)
        response.raise_for_status()
        return response.json()


async def get_all_leaves():
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{SPRING_BOOT_URL}/leaves", headers=HEADERS)
        response.raise_for_status()
        return response.json()


async def get_all_users():
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{SPRING_BOOT_URL}/users", headers=HEADERS)
        response.raise_for_status()
        return response.json()


async def send_prediction(prediction_data: dict):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{SPRING_BOOT_URL}/predictions", headers=HEADERS, json=prediction_data
        )
        response.raise_for_status()
        return response.json()


async def get_presences_by_user(user_id: int):
    presences = await get_all_presences()
    return [p for p in presences if p["userId"] == user_id]


async def get_leaves_by_user(user_id: int):
    leaves = await get_all_leaves()
    return [l for l in leaves if l["userId"] == user_id and l["status"] == "APPROVED"]