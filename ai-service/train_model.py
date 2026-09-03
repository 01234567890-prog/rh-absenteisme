import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import joblib

df = pd.read_csv("data/Absenteeism_at_work.csv", sep=";")

df["late_ratio"] = df["Distance from Residence to Work"] / df["Distance from Residence to Work"].max()
df["leave_ratio"] = df["Absenteeism time in hours"] / df["Absenteeism time in hours"].max()

df["label"] = (df["Absenteeism time in hours"] > df["Absenteeism time in hours"].median()).astype(int)

X = df[["late_ratio", "leave_ratio"]]
y = df["label"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = LogisticRegression()
model.fit(X_train, y_train)

accuracy = accuracy_score(y_test, model.predict(X_test))
print(f"Model accuracy: {accuracy:.2f}")

joblib.dump(model, "trained_model.pkl")
print("Model saved to trained_model.pkl")