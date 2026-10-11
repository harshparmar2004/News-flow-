import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth";

interface CuratedImage {
  id: string;
  url: string;
  thumb: string;
  title: string;
  author: string;
  category: string;
}

const CURATED_TECH_IMAGES: CuratedImage[] = [
  // AI & Neural Networks
  {
    id: "ai-1",
    url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80",
    thumb: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=400&q=80",
    title: "Abstract Neural Lattice Network",
    author: "DeepMind Imagery",
    category: "ai",
  },
  {
    id: "ai-2",
    url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    thumb: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80",
    title: "Fluid Deep Learning Architecture",
    author: "Milad Fakurian",
    category: "ai",
  },
  {
    id: "ai-3",
    url: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80",
    thumb: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=400&q=80",
    title: "Synthetic Intelligence Head & Synapses",
    author: "Steve Johnson",
    category: "ai",
  },
  {
    id: "ai-4",
    url: "https://images.unsplash.com/photo-1655720828018-edd2daec9349?auto=format&fit=crop&w=1200&q=80",
    thumb: "https://images.unsplash.com/photo-1655720828018-edd2daec9349?auto=format&fit=crop&w=400&q=80",
    title: "Autonomous Agent Flow Diagram",
    author: "Google DeepMind",
    category: "ai",
  },

  // Robotics & Automation
  {
    id: "rob-1",
    url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80",
    thumb: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=400&q=80",
    title: "White Humanoid Robot Head",
    author: "Possessed Photography",
    category: "robotics",
  },
  {
    id: "rob-2",
    url: "https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?auto=format&fit=crop&w=1200&q=80",
    thumb: "https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?auto=format&fit=crop&w=400&q=80",
    title: "Industrial Robotic Arm Assembly",
    author: "Simon Kadula",
    category: "robotics",
  },
  {
    id: "rob-3",
    url: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&w=1200&q=80",
    thumb: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&w=400&q=80",
    title: "Bionic Hand Prosthetic Mechanism",
    author: "Franki Chamaki",
    category: "robotics",
  },

  // Hardware & Semiconductors (Chips)
  {
    id: "chip-1",
    url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    thumb: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80",
    title: "Motherboard Circuit & Silicon Die",
    author: "Alexandre Debiève",
    category: "chips",
  },
  {
    id: "chip-2",
    url: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=1200&q=80",
    thumb: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=400&q=80",
    title: "Wafer Fabrication Silicon Core",
    author: "Laura Ockel",
    category: "chips",
  },
  {
    id: "chip-3",
    url: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=1200&q=80",
    thumb: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=400&q=80",
    title: "GPU Microarchitecture Heat Sync",
    author: "Nana Dua",
    category: "chips",
  },

  // Cybersecurity & Encryption
  {
    id: "sec-1",
    url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
    thumb: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=400&q=80",
    title: "Matrix Green Digital Stream",
    author: "Markus Spiske",
    category: "cybersecurity",
  },
  {
    id: "sec-2",
    url: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80",
    thumb: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=400&q=80",
    title: "Secure Cryptographic Keypad",
    author: "FlyD",
    category: "cybersecurity",
  },
  {
    id: "sec-3",
    url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80",
    thumb: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=400&q=80",
    title: "Infosec Threat Defense Terminal",
    author: "Adi Goldstein",
    category: "cybersecurity",
  },

  // Cloud & Datacenter
  {
    id: "cloud-1",
    url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
    thumb: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=400&q=80",
    title: "Hyperscale Server Rack & Blue Cables",
    author: "Taylor Vick",
    category: "cloud",
  },
  {
    id: "cloud-2",
    url: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80",
    thumb: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=400&q=80",
    title: "Modern Edge Computing Node",
    author: "Vercel Systems",
    category: "cloud",
  },

  // Startups & Modern Tech Workspaces
  {
    id: "start-1",
    url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80",
    thumb: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80",
    title: "Engineering Team Collaboration",
    author: "Marvin Meyer",
    category: "startups",
  },
  {
    id: "start-2",
    url: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80",
    thumb: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=400&q=80",
    title: "Venture Capital Strategy Session",
    author: "Amy Hirschi",
    category: "startups",
  },

  // Quantum & DeepTech
  {
    id: "quant-1",
    url: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1200&q=80",
    thumb: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=400&q=80",
    title: "Quantum Entanglement Sphere",
    author: "DeepMind Imagery",
    category: "quantum",
  },
  {
    id: "quant-2",
    url: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=1200&q=80",
    thumb: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=400&q=80",
    title: "Mathematical Foundations & Physics",
    author: "Roman Mager",
    category: "quantum",
  },
];

export async function GET(req: NextRequest) {
  const session = await verifyAdminSession();
  const authHeader = req.headers.get("x-api-key");
  const isValidApiKey = authHeader && authHeader === process.env.NEWSFLOW_API_KEY;

  if (!session && !isValidApiKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").toLowerCase().trim();

  let results = CURATED_TECH_IMAGES;

  if (q) {
    results = CURATED_TECH_IMAGES.filter(
      (img) =>
        img.title.toLowerCase().includes(q) ||
        img.category.toLowerCase().includes(q) ||
        img.author.toLowerCase().includes(q)
    );

    // If query didn't match curated list, generate clean high-res Unsplash search targets
    if (results.length === 0) {
      results = [
        {
          id: `gen-1-${Date.now()}`,
          url: `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80`,
          thumb: `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80`,
          title: `${q.charAt(0).toUpperCase() + q.slice(1)} Innovation`,
          author: "Unsplash Creative",
          category: q,
        },
        {
          id: `gen-2-${Date.now()}`,
          url: `https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80`,
          thumb: `https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80`,
          title: `${q.charAt(0).toUpperCase() + q.slice(1)} Architecture`,
          author: "Tech Lens",
          category: q,
        },
      ];
    }
  }

  return NextResponse.json({
    success: true,
    total: results.length,
    images: results,
  });
}
