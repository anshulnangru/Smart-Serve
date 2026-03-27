"""
seed.py — Populate the SmartServe PostgreSQL database with sample data.
Run once after starting the server for the first time:
    python seed.py
"""
import asyncio
import os
from dotenv import load_dotenv

load_dotenv()

from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.future import select

from app.database.connection import Base
from app.models.user import User
from app.models.service import Service, ServicePackage
from app.models.review import Review

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+asyncpg://postgres:postgres@localhost:5432/smartserve",
)

SERVICES_DATA = [
    {"id": 1,  "name": "Full Home Deep Cleaning",     "category_id": "cleaning",   "category": "Cleaning",        "description": "Our expert team does thorough cleaning of your entire home including kitchen, bathrooms, and all rooms.",  "rating": 4.9, "reviews_count": 12500, "price": 79,  "original_price": 99,  "duration": "4-5 hours",  "image": "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop",  "badge": "Bestseller",  "includes": ["Kitchen cleaning", "Bathroom scrubbing", "Floor mopping", "Window wiping", "Furniture dusting"], "professionals_count": 450},
    {"id": 2,  "name": "Bathroom Deep Cleaning",       "category_id": "cleaning",   "category": "Cleaning",        "description": "Complete bathroom sanitization including tiles, fixtures, and hard-to-reach areas.",                           "rating": 4.8, "reviews_count": 8700,  "price": 35,  "original_price": 45,  "duration": "1.5 hours", "image": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&h=400&fit=crop",  "badge": None,          "includes": ["Tile scrubbing", "Toilet sanitization", "Shower cleaning", "Mirror polishing"],               "professionals_count": 320},
    {"id": 3,  "name": "Kitchen Deep Cleaning",        "category_id": "cleaning",   "category": "Cleaning",        "description": "Professional kitchen cleaning covering chimney, stove, countertops, and cabinets.",                            "rating": 4.7, "reviews_count": 6400,  "price": 45,  "original_price": 60,  "duration": "2-3 hours", "image": "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop",  "badge": "Popular",     "includes": ["Chimney cleaning", "Stove cleaning", "Cabinet wipe-down", "Countertop polish"],                "professionals_count": 280},
    {"id": 4,  "name": "Sofa & Carpet Cleaning",       "category_id": "cleaning",   "category": "Cleaning",        "description": "Deep steam cleaning for sofas, carpets and upholstery. Removes stains, allergens and odors.",                 "rating": 4.8, "reviews_count": 5200,  "price": 59,  "original_price": None, "duration": "2-3 hours", "image": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop",  "badge": None,          "includes": ["Steam cleaning", "Stain removal", "Deodorizing", "Dry cleaning"],                               "professionals_count": 210},
    {"id": 5,  "name": "AC Service & Repair",          "category_id": "appliance",  "category": "Appliance Repair","description": "Complete AC servicing including filter cleaning, gas check, and performance optimization.",                    "rating": 4.8, "reviews_count": 9800,  "price": 49,  "original_price": 69,  "duration": "1-2 hours", "image": "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&h=400&fit=crop",  "badge": "Most Booked", "includes": ["Filter cleaning", "Gas level check", "Coil cleaning", "Performance test"],                    "professionals_count": 380},
    {"id": 6,  "name": "Washing Machine Repair",       "category_id": "appliance",  "category": "Appliance Repair","description": "Expert diagnosis and repair for all brands of washing machines.",                                              "rating": 4.7, "reviews_count": 4300,  "price": 39,  "original_price": None, "duration": "1-2 hours", "image": "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600&h=400&fit=crop",  "badge": None,          "includes": ["Diagnosis", "Part replacement", "Test wash", "Warranty on repair"],                             "professionals_count": 190},
    {"id": 7,  "name": "Refrigerator Repair",          "category_id": "appliance",  "category": "Appliance Repair","description": "Repair all types of refrigerators, from cooling issues to compressor problems.",                                "rating": 4.6, "reviews_count": 3100,  "price": 45,  "original_price": 55,  "duration": "1-2 hours", "image": "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=600&h=400&fit=crop",  "badge": None,          "includes": ["Diagnosis", "Cooling check", "Gas refill if needed", "90-day warranty"],                        "professionals_count": 160},
    {"id": 8,  "name": "Classic Facial & Cleanup",     "category_id": "salon",      "category": "Salon & Spa",     "description": "Rejuvenating facial treatment at home. Includes cleansing, exfoliation, face massage, and a hydrating mask.","rating": 4.9, "reviews_count": 15600, "price": 39,  "original_price": 55,  "duration": "45 mins",   "image": "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&h=400&fit=crop",  "badge": "Top Rated",   "includes": ["Cleansing", "Exfoliation", "Face massage", "Hydrating mask", "Moisturizer"],                    "professionals_count": 520},
    {"id": 9,  "name": "Full Body Massage",            "category_id": "salon",      "category": "Salon & Spa",     "description": "Relaxing full body massage by certified therapists at your doorstep.",                                          "rating": 4.9, "reviews_count": 9200,  "price": 89,  "original_price": 120, "duration": "60 mins",   "image": "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&h=400&fit=crop",  "badge": "Popular",     "includes": ["Full body massage", "Aromatherapy oil", "Hot towel compress", "Relaxation music"],              "professionals_count": 340},
    {"id": 10, "name": "Haircut & Styling (Women)",    "category_id": "salon",      "category": "Salon & Spa",     "description": "Professional haircut, wash, blow-dry, and styling by expert stylists at home.",                                "rating": 4.8, "reviews_count": 11200, "price": 49,  "original_price": 65,  "duration": "1 hour",    "image": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=400&fit=crop",  "badge": "Bestseller",  "includes": ["Hair wash", "Haircut", "Blow dry", "Styling"],                                                  "professionals_count": 460},
    {"id": 11, "name": "Plumbing - Leak Repair",       "category_id": "plumbing",   "category": "Plumbing",        "description": "Fast and reliable leak detection and repair for pipes, taps, and fixtures.",                                    "rating": 4.7, "reviews_count": 6700,  "price": 29,  "original_price": None, "duration": "Per hour",  "image": "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=600&h=400&fit=crop",  "badge": None,          "includes": ["Leak detection", "Pipe repair", "Tap repair", "Sealant application"],                           "professionals_count": 250},
    {"id": 12, "name": "Bathroom Tap & Fitting",       "category_id": "plumbing",   "category": "Plumbing",        "description": "Installation and replacement of bathroom taps, shower heads, and fittings.",                                   "rating": 4.6, "reviews_count": 3400,  "price": 35,  "original_price": 45,  "duration": "1-2 hours", "image": "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&h=400&fit=crop",  "badge": None,          "includes": ["Tap installation", "Shower fitting", "Leak testing"],                                           "professionals_count": 180},
    {"id": 13, "name": "Electrician - Multiple Jobs",  "category_id": "electrical", "category": "Electrician",     "description": "Certified electricians for wiring, switchboard repair, fan installation, and all electrical work.",             "rating": 4.6, "reviews_count": 4500,  "price": 29,  "original_price": None, "duration": "Per hour",  "image": "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&h=400&fit=crop",  "badge": None,          "includes": ["Wiring work", "Switchboard repair", "Fan installation", "Light fitting"],                       "professionals_count": 290},
    {"id": 14, "name": "Fan & Light Installation",     "category_id": "electrical", "category": "Electrician",     "description": "Safe installation of ceiling fans, LED lights, and fixtures. Includes wiring and testing.",                     "rating": 4.7, "reviews_count": 3800,  "price": 25,  "original_price": 35,  "duration": "30-60 mins","image": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop",  "badge": "Quick Fix",   "includes": ["Fan installation", "Light fitting", "Wiring", "Safety check"],                                  "professionals_count": 220},
    {"id": 15, "name": "Interior Home Painting",       "category_id": "painting",   "category": "Painting",        "description": "Professional interior painting with premium quality paints. Neat, quick and clean with zero mess.",            "rating": 4.8, "reviews_count": 5600,  "price": 199, "original_price": 249, "duration": "1-3 days",  "image": "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600&h=400&fit=crop",  "badge": "Premium",     "includes": ["Wall prep", "Primer coat", "2 paint coats", "Touch-up", "Clean up"],                           "professionals_count": 170},
    {"id": 16, "name": "Cockroach & Ant Control",      "category_id": "pest",       "category": "Pest Control",    "description": "Effective pest control treatment for cockroaches, ants, and common household pests.",                            "rating": 4.7, "reviews_count": 7200,  "price": 49,  "original_price": 69,  "duration": "1-2 hours", "image": "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&h=400&fit=crop",  "badge": "Popular",     "includes": ["Gel treatment", "Spray treatment", "30-day guarantee"],                                         "professionals_count": 200},
    {"id": 17, "name": "Furniture Assembly",           "category_id": "carpentry",  "category": "Carpentry",       "description": "Assemble flat-pack furniture (IKEA, Pepperfry, Urban Ladder, etc.) quickly and correctly.",                    "rating": 4.7, "reviews_count": 4100,  "price": 35,  "original_price": None, "duration": "Per piece", "image": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=400&fit=crop",  "badge": None,          "includes": ["Assembly", "Tightening & adjustment", "Safety check"],                                          "professionals_count": 190},
]

REVIEWS_DATA = [
    {"service_id": 1,  "rating": 5.0, "comment": "Absolutely amazing service! My house looks brand new.", "user_name": "Priya Sharma",  "avatar": "https://i.pravatar.cc/150?img=1"},
    {"service_id": 1,  "rating": 5.0, "comment": "Exceeded my expectations! Every corner was spotless.",   "user_name": "Rohit Verma",   "avatar": "https://i.pravatar.cc/150?img=2"},
    {"service_id": 1,  "rating": 4.0, "comment": "Great service overall. Minor timing issue but top-notch quality.", "user_name": "Anita Desai",   "avatar": "https://i.pravatar.cc/150?img=5"},
    {"service_id": 5,  "rating": 5.0, "comment": "AC is running like new! Very professional technician.",  "user_name": "Vikram Kumar",  "avatar": "https://i.pravatar.cc/150?img=3"},
    {"service_id": 5,  "rating": 5.0, "comment": "Very satisfied! Came on time, serviced AC thoroughly.",  "user_name": "Neha Gupta",    "avatar": "https://i.pravatar.cc/150?img=6"},
    {"service_id": 8,  "rating": 5.0, "comment": "Brilliant facial! My skin feels amazing!",               "user_name": "Sunita Rao",    "avatar": "https://i.pravatar.cc/150?img=7"},
    {"service_id": 9,  "rating": 5.0, "comment": "Best massage ever! Very professional therapist.",         "user_name": "Kavitha M",     "avatar": "https://i.pravatar.cc/150?img=8"},
    {"service_id": 2,  "rating": 4.0, "comment": "Bathroom looks brand new! Took a bit longer than expected.", "user_name": "Arun Patel", "avatar": "https://i.pravatar.cc/150?img=4"},
    {"service_id": 10, "rating": 5.0, "comment": "Loved the haircut! Understood exactly what I wanted.",   "user_name": "Meera Joshi",   "avatar": "https://i.pravatar.cc/150?img=9"},
    {"service_id": 13, "rating": 5.0, "comment": "Quick, efficient, and safe. Fixed all issues in one visit.", "user_name": "Suresh B",  "avatar": "https://i.pravatar.cc/150?img=10"},
]


async def seed():
    engine = create_async_engine(DATABASE_URL, echo=False)
    AsyncSession = async_sessionmaker(engine, expire_on_commit=False)

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSession() as session:
        # Check if already seeded
        existing = await session.execute(select(Service).limit(1))
        if existing.scalar_one_or_none():
            print("✅ Database already seeded — skipping.")
            await engine.dispose()
            return

        print("🌱 Seeding services...")
        for s in SERVICES_DATA:
            service = Service(
                id=s["id"],
                name=s["name"],
                category_id=s["category_id"],
                category=s["category"],
                description=s["description"],
                rating=s["rating"],
                reviews_count=s["reviews_count"],
                price=s["price"],
                original_price=s["original_price"],
                duration=s["duration"],
                image=s["image"],
                badge=s["badge"],
                includes=s["includes"],
                professionals_count=s["professionals_count"],
            )
            session.add(service)
        await session.flush()

        print("🌱 Seeding sample demo users for reviews...")
        demo_users = []
        for r in REVIEWS_DATA:
            user = User(
                name=r["user_name"],
                email=f"{r['user_name'].lower().replace(' ', '.')}@demo.com",
                password_hash="demo",
                avatar=r["avatar"],
            )
            session.add(user)
            demo_users.append((user, r))
        await session.flush()

        print("🌱 Seeding reviews...")
        for user, r in demo_users:
            review = Review(
                user_id=user.id,
                service_id=r["service_id"],
                rating=r["rating"],
                comment=r["comment"],
            )
            session.add(review)

        await session.commit()
        print("✅ Seed complete! 17 services + 10 reviews inserted.")

    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(seed())
