from datetime import date


def calculate_risk_score(late_count: int, leave_count: int, total_days: int) -> float:
    if total_days == 0:
        return 0.0

    late_ratio = late_count / total_days
    leave_ratio = leave_count / total_days

    score = min((late_ratio * 0.5) + (leave_ratio * 0.5), 1.0)
    return round(score, 2)


def score_to_level(score: float) -> str:
    if score >= 0.6:
        return "HIGH"
    elif score >= 0.3:
        return "MEDIUM"
    else:
        return "LOW"