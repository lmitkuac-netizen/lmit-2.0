import asyncio
import os
import sys
import uuid
import bcrypt
from datetime import datetime, timezone
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.environ.get("MONGO_URI")
if not MONGO_URI:
    print("Error: MONGO_URI not found in environment variables.")
    sys.exit(1)

client = AsyncIOMotorClient(MONGO_URI)
db = client.get_database()

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")

async def add_admin(email: str, password: str):
    email = email.lower().strip()
    existing = await db.users.find_one({"email": email})
    
    if existing:
        print(f"User {email} already exists! Updating password...")
        await db.users.update_one(
            {"email": email},
            {"$set": {"password_hash": hash_password(password)}}
        )
        print("Password updated successfully.")
    else:
        print(f"Creating new admin user: {email}")
        await db.users.insert_one({
            "id": str(uuid.uuid4()),
            "email": email,
            "password_hash": hash_password(password),
            "name": "Admin",
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat()
        })
        print("Admin user created successfully.")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python add_admin.py <email> <password>")
        sys.exit(1)
    
    email_arg = sys.argv[1]
    password_arg = sys.argv[2]
    
    asyncio.run(add_admin(email_arg, password_arg))
