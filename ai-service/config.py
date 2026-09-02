import os
from dotenv import load_dotenv
load_dotenv()
SPRING_BOOT_URL = os.getenv("SPRING_BOOT_URL")
AI_API_KEY = os.getenv("AI_API_KEY")