"""
College Engineering & Research Portal — 16 Academic Disciplines Triage Engine.
Accurately categorizes technical dispatches into one of 16 engineering branches:
cse, aids, it, ece, ee, me, robotics, civil, biotech, biomedical, chem,
aerospace, materials, ev-auto, environmental, industrial.
"""

import re
from typing import Dict, Any, Optional

COLLEGE_BRANCHES = {
    "cse": {
        "slug": "cse",
        "name": "Computer Science & Engineering",
        "patterns": [
            r"\b(?:algorithms?|data structures?|compilers?|operating systems?|distributed systems?|cloud infrastructure|software engineering|microservices|kubernetes|docker|databases?|linux kernel|programming languages?|open-source|backend|frontend)\b"
        ]
    },
    "aids": {
        "slug": "aids",
        "name": "Artificial Intelligence & Data Science",
        "patterns": [
            r"\b(?:artificial intelligence|ai|machine learning|deep learning|llms?|large language models?|neural networks?|computer vision|nlp|transformers?|diffusion models?|generative ai|pytorch|tensorflow|data science|agentic|rag|deepseek|openai|gemini)\b"
        ]
    },
    "it": {
        "slug": "it",
        "name": "Information Technology & Cybersecurity",
        "patterns": [
            r"\b(?:cybersecurity|infosec|zero-day|vulnerabilit(?:y|ies)|malware|ransomware|firewall|network security|data breaches?|penetration testing|devops|sysadmin|cisa|incident response|identity management|cloud security)\b"
        ]
    },
    "ece": {
        "slug": "ece",
        "name": "Electronics & Communication Engineering",
        "patterns": [
            r"\b(?:vlsi|semiconductors?|microelectronics|fpga|embedded systems?|microcontrollers?|arm cortex|risc-v|5g|6g|rf engineering|antennas?|telecom|signal processing|pcb design|optical communications?|integrated circuits?)\b"
        ]
    },
    "ee": {
        "slug": "ee",
        "name": "Electrical Engineering",
        "patterns": [
            r"\b(?:power systems?|smart grids?|high voltage|substations?|transformers?|generators?|electric machines?|power electronics|inverters?|renewable energy|solar pv|wind turbines?|transmission lines?)\b"
        ]
    },
    "me": {
        "slug": "me",
        "name": "Mechanical Engineering",
        "patterns": [
            r"\b(?:thermodynamics|fluid mechanics|finite element|fea|cfd|computational fluid|cad\/cam|solidworks|additive manufacturing|3d printing|turbines?|hvac|heat exchangers?|cnc machining|mechanical vibrations?)\b"
        ]
    },
    "robotics": {
        "slug": "robotics",
        "name": "Robotics & Mechatronics",
        "patterns": [
            r"\b(?:robots?|robotic|robotics|humanoids?|bipedal|quadrupeds?|actuators?|manipulators?|ros2?|robot operating system|slam|autonomous mobile robots?|amr|cobots?|drones?|uav|kinematics|dexterous manipulation)\b"
        ]
    },
    "civil": {
        "slug": "civil",
        "name": "Civil & Structural Engineering",
        "patterns": [
            r"\b(?:structural engineering|reinforced concrete|seismic design|earthquake engineering|bridges?|skyscrapers?|geotechnical|soil mechanics|bim|building information|smart cities|hydraulic structures?|tunnels?|transportation engineering)\b"
        ]
    },
    "biotech": {
        "slug": "biotech",
        "name": "Biotechnology Engineering",
        "patterns": [
            r"\b(?:biotechnology|crispr|cas9|gene editing|synthetic biology|recombinant dna|fermentation|bioreactors?|genomics|sequencing|metabolic engineering|plasmids?|enzymes?|bioinformatics|biofuel)\b"
        ]
    },
    "biomedical": {
        "slug": "biomedical",
        "name": "Biomedical Engineering",
        "patterns": [
            r"\b(?:biomedical|prosthetics?|neural implants?|brain-computer interface|bci|medical devices?|mri|ct scans?|ultrasound imaging|pacemakers?|biocompatible|tissue engineering|biomechanics|surgical robotics?)\b"
        ]
    },
    "chem": {
        "slug": "chem",
        "name": "Chemical Engineering",
        "patterns": [
            r"\b(?:chemical engineering|catalysis|chemical reactors?|distillation columns?|polymers?|separation processes?|process engineering|mass transfer|petrochemical|fluidized bed|green chemistry|refiner(?:y|ies))\b"
        ]
    },
    "aerospace": {
        "slug": "aerospace",
        "name": "Aerospace Engineering",
        "patterns": [
            r"\b(?:aerospace|aerodynamics|propulsion|rocketry|rockets?|satellites?|cubesats?|orbit|hypersonic|supersonic|avionics|spacecraft|payload|nasa|isro|spacex|re-entry|jet engines?)\b"
        ]
    },
    "materials": {
        "slug": "materials",
        "name": "Materials Science & Metallurgy",
        "patterns": [
            r"\b(?:materials science|metallurgy|nanomaterials?|graphene|carbon nanotubes|superconductors?|alloys?|crystallography|composites?|corrosion resistance|perovskites?|smart materials?|phase change)\b"
        ]
    },
    "ev-auto": {
        "slug": "ev-auto",
        "name": "Automobile & EV Engineering",
        "patterns": [
            r"\b(?:electric vehicles?|evs?|lithium-ion|solid-state batter(?:y|ies)|battery management systems?|bms|regenerative braking|powertrains?|electric motors?|charging infrastructure|adas|autonomous vehicles?|chassis)\b"
        ]
    },
    "environmental": {
        "slug": "environmental",
        "name": "Environmental Engineering",
        "patterns": [
            r"\b(?:environmental engineering|wastewater treatment|water purification|desalination|air pollution control|carbon capture|circular economy|waste management|effluent treatment|reverse osmosis|climate mitigation)\b"
        ]
    },
    "industrial": {
        "slug": "industrial",
        "name": "Industrial & Production Engineering",
        "patterns": [
            r"\b(?:industrial engineering|smart manufacturing|industry 4\.0|supply chains?|lean manufacturing|six sigma|total quality management|tqm|operations research|erp systems?|assembly lines?|kaizen|factory automation)\b"
        ]
    }
}

def clean_college_text(text: str) -> str:
    return re.sub(r'#\w+', '', text).lower()

def score_patterns(patterns: list, text: str) -> int:
    cnt = 0
    for pat in patterns:
        m = re.findall(pat, text, flags=re.IGNORECASE)
        cnt += len(m)
    return cnt

def classify_college_branch(
    title: str,
    summary: str = "",
    body_sample: str = "",
    source_category: Optional[str] = None
) -> str:
    """
    Classifies an incoming engineering article into one of the 16 college branches.
    Uses 4x title weight, 2x summary weight, 1x body weight, and +2 source desk prior.
    """
    t_clean = clean_college_text(title)
    s_clean = clean_college_text(summary)
    b_clean = clean_college_text(body_sample[:600])

    best_slug = "cse"
    max_score = 0

    norm_src = (source_category or "").strip().lower()

    for slug, info in COLLEGE_BRANCHES.items():
        t_sc = score_patterns(info["patterns"], t_clean) * 4
        s_sc = score_patterns(info["patterns"], s_clean) * 2
        b_sc = score_patterns(info["patterns"], b_clean)
        tot = t_sc + s_sc + b_sc

        # Source desk prior (+2)
        if norm_src and norm_src == slug:
            tot += 2

        if tot > max_score:
            max_score = tot
            best_slug = slug

    # Fall back to source category if valid and score is negligible
    if max_score <= 2 and norm_src and norm_src in COLLEGE_BRANCHES:
        return norm_src

    return best_slug
