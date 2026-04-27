import asyncio
from prisma import Prisma
from src.utils.auth import hash_password

async def main():
    db = Prisma()
    await db.connect()
    
    await db.settings.create_many(data=[
        {"category": "priority", "name": "High"},
        {"category": "priority", "name": "Medium"},
        {"category": "priority", "name": "Low"},
        {"category": "location", "name": "Kitchen"},
        {"category": "location", "name": "Bathroom"},
        {"category": "location", "name": "Bedroom"},
        {"category": "location", "name": "Living Room"},
        {"category": "location", "name": "Garage"},
        {"category": "location", "name": "Yard"},
    ])
    
    users = [
        {"username": "mom", "passwordHash": hash_password("password123"), "name": "Mom"},
        {"username": "dad", "passwordHash": hash_password("password123"), "name": "Dad"},
        {"username": "kid1", "passwordHash": hash_password("password123"), "name": "Older Kid"},
        {"username": "kid2", "passwordHash": hash_password("password123"), "name": "Younger Kid"},
    ]
    
    for user_data in users:
        await db.user.create(data=user_data)
    
    print("Seed data created successfully")
    print("Default login: username=mom, password=password123")
    
    await db.disconnect()

if __name__ == "__main__":
    asyncio.run(main())