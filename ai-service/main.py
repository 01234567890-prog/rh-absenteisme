from fastapi import FastAPI
from datetime import date
from spring_client import (
    get_all_users,
    get_presences_by_user,
    get_leaves_by_user,
    send_prediction,
)
from model import calculate_risk_score, score_to_level

app = FastAPI(title="PulseHR AI Service")


@app.get("/")
def health_check():
    return {"status": "AI service is running"}


@app.post("/predict/{user_id}")
async def predict_for_user(user_id: int):
    presences = await get_presences_by_user(user_id)
    leaves = await get_leaves_by_user(user_id)

    late_count = sum(1 for p in presences if p["status"] == "LATE")
    leave_count = len(leaves)
    total_days = max(len(presences), 1)

    score = calculate_risk_score(late_count, leave_count, total_days)
    level = score_to_level(score)

    prediction_data = {
        "score": score,
        "level": level,
        "predictionDate": str(date.today()),
        "analysisPeriod": "last_recorded_data",
        "userId": user_id,
    }

    result = await send_prediction(prediction_data)
    return result


@app.post("/predict/all")
async def predict_for_all():
    users = await get_all_users()
    results = []
    for user in users:
        prediction = await predict_for_user(user["id"])
        results.append(prediction)
    return results