from datetime import date
import joblib
import pandas as pd

model = joblib.load("trained_model.pkl")


def predict_risk(late_ratio: float, leave_ratio: float) -> tuple[float, str]:
    X = pd.DataFrame([[late_ratio, leave_ratio]], columns=["late_ratio", "leave_ratio"])

    probability = model.predict_proba(X)[0][1]
    score = round(float(probability), 2)
    level = score_to_level(score)

    return score, level


def score_to_level(score: float) -> str:
    if score >= 0.6:
        return "HIGH"
    elif score >= 0.3:
        return "MEDIUM"
    else:
        return "LOW"