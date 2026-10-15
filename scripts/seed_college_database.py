"""
College Engineering & Research Portal — 16 Branches Database Seeder
Seeds the 16 academic disciplines into PostgreSQL / Neon.

Usage:
  python scripts/seed_college_database.py --db-url "postgresql://..."
"""

import sys
import os
import argparse
from sqlalchemy import create_engine, text

BRANCHES_SEED_DATA = [
    {"name": "Computer Science & Engineering", "slug": "cse", "order": 1, "desc": "Algorithms, operating systems, cloud systems, compiler design, and software engineering."},
    {"name": "Artificial Intelligence & Data Science", "slug": "aids", "order": 2, "desc": "Foundation models, machine learning, computer vision, deep neural networks, and big data."},
    {"name": "Information Technology & Cybersecurity", "slug": "it", "order": 3, "desc": "Enterprise networks, cloud security, zero-day research, cryptography, and DevOps."},
    {"name": "Electronics & Communication Engineering", "slug": "ece", "order": 4, "desc": "VLSI design, embedded systems, microelectronics, 5G/6G, RF, and signal processing."},
    {"name": "Electrical Engineering", "slug": "ee", "order": 5, "desc": "Smart grids, renewable energy, high voltage systems, power electronics, and electric drives."},
    {"name": "Mechanical Engineering", "slug": "me", "order": 6, "desc": "Thermodynamics, fluid mechanics, CAD/CAM, additive manufacturing, and robotics integration."},
    {"name": "Robotics & Mechatronics", "slug": "robotics", "order": 7, "desc": "Humanoids, bipedal kinematics, ROS2, autonomous mobile robots (AMR), and actuators."},
    {"name": "Civil & Structural Engineering", "slug": "civil", "order": 8, "desc": "Structural health, seismic resilience, smart concrete, geotechnical, and urban infrastructure."},
    {"name": "Biotechnology Engineering", "slug": "biotech", "order": 9, "desc": "CRISPR gene editing, synthetic biology, metabolic engineering, and bioreactor design."},
    {"name": "Biomedical Engineering", "slug": "biomedical", "order": 10, "desc": "Neural interfaces, prosthetics, medical imaging, biomaterials, and clinical devices."},
    {"name": "Chemical Engineering", "slug": "chem", "order": 11, "desc": "Catalysis, process optimization, industrial polymers, mass transfer, and green chemistry."},
    {"name": "Aerospace Engineering", "slug": "aerospace", "order": 12, "desc": "Hypersonics, propulsion systems, satellite orbital dynamics, and avionics."},
    {"name": "Materials Science & Metallurgy", "slug": "materials", "order": 13, "desc": "Nanomaterials, high-entropy alloys, superconductors, and computational metallurgy."},
    {"name": "Automobile & EV Engineering", "slug": "ev-auto", "order": 14, "desc": "Battery chemistries, electric powertrains, ADAS, BMS, and autonomous vehicles."},
    {"name": "Environmental Engineering", "slug": "environmental", "order": 15, "desc": "Water purification, carbon capture, circular waste management, and climate technology."},
    {"name": "Industrial & Production Engineering", "slug": "industrial", "order": 16, "desc": "Smart factories, Industry 4.0, lean manufacturing, supply chain optimization, and Six Sigma."}
]

def seed_branches(db_url: str):
    print(f"Connecting to database...")
    engine = create_engine(db_url)
    
    with engine.begin() as conn:
        # Check if Category table exists
        res = conn.execute(text("SELECT to_regclass('public.\"Category\"')")).scalar()
        if not res:
            print("Creating Category table...")
            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS "Category" (
                    id VARCHAR(36) PRIMARY KEY,
                    name VARCHAR(255) UNIQUE NOT NULL,
                    slug VARCHAR(255) UNIQUE NOT NULL,
                    description TEXT,
                    display_order INT DEFAULT 0,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
                )
            """))

        import uuid
        for b in BRANCHES_SEED_DATA:
            existing = conn.execute(text('SELECT id FROM "Category" WHERE slug = :s'), {"s": b["slug"]}).fetchone()
            if existing:
                conn.execute(text("""
                    UPDATE "Category"
                    SET name = :name, description = :desc, display_order = :order, updated_at = NOW()
                    WHERE slug = :s
                """), {"name": b["name"], "desc": b["desc"], "order": b["order"], "s": b["slug"]})
                print(f"  [UPDATED] {b['name']} ({b['slug']})")
            else:
                cid = f"col_{uuid.uuid4().hex[:16]}"
                conn.execute(text("""
                    INSERT INTO "Category" (id, name, slug, description, display_order)
                    VALUES (:id, :name, :slug, :desc, :order)
                """), {"id": cid, "name": b["name"], "slug": b["slug"], "desc": b["desc"], "order": b["order"]})
                print(f"  [CREATED] {b['name']} ({b['slug']}) -> ID: {cid}")

    print("\nSuccessfully seeded all 16 college engineering branches!")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Seed 16 engineering branches")
    parser.add_argument("--db-url", type=str, default=os.getenv("DATABASE_URL"), help="PostgreSQL connection string")
    args = parser.parse_args()

    if not args.db_url:
        print("Error: DATABASE_URL must be provided via argument or environment variable.")
        sys.exit(1)

    seed_branches(args.db_url)
