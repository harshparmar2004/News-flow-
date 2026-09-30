import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding categories...");

  const categories = [
    {
      name: "AI & Robotics",
      slug: "ai-robotics",
      description: "Frontier foundation models, autonomous agents, neural architectures, and embodied robotics.",
      display_order: 1,
    },
    {
      name: "Startups & VC",
      slug: "startups-vc",
      description: "Early-stage disruption, unicorn valuations, venture capital trends, and founder memos.",
      display_order: 2,
    },
    {
      name: "Gadgets & Hardware",
      slug: "gadgets-hardware",
      description: "Consumer silicon, spatial computing, next-gen wearables, and industrial hardware.",
      display_order: 3,
    },
    {
      name: "Cybersecurity",
      slug: "cybersecurity",
      description: "Zero-day vulnerabilities, cryptographic protocols, state-sponsored campaigns, and infosec defenses.",
      display_order: 4,
    },
    {
      name: "Policy & Big Tech",
      slug: "policy-big-tech",
      description: "Antitrust litigation, global AI treaties, privacy legislation, and tech conglomerate strategy.",
      display_order: 5,
    },
  ];

  const catMap: Record<string, string> = {};

  for (const cat of categories) {
    const record = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    catMap[cat.slug] = record.id;
  }

  console.log("Seeding realistic NewsFlow tech news articles...");

  const articles = [
    {
      title: "Anthropic Unveils Context Caching & Multi-Modal Agent Architectures",
      slug: "anthropic-unveils-context-caching-multimodal-agent-architectures",
      summary: "A fundamental shift in API economics: developers can now persist massive prompt states at a 90% discount, paving the way for persistent autonomous code agents.",
      cover_image_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80",
      categoryId: catMap["ai-robotics"],
      author: "NewsFlow AI",
      published_at: new Date(Date.now() - 1000 * 60 * 45), // 45 mins ago
      status: "published",
      rank_score: 96,
      is_featured: true,
      views_count: 1420,
      reading_time_minutes: 5,
      source_url: "https://techcrunch.com/2026/anthropic-caching-launch",
      tags: JSON.stringify(["Anthropic", "Claude", "LLMs", "Developer Tools", "AI Architecture"]),
      affiliate_links: JSON.stringify([
        {
          label: "Designing Large Language Model Applications (O'Reilly)",
          url: "https://amazon.com/dp/1098150391?tag=newsflow-20",
          price: "$49.99",
          badge: "Editor's Choice",
          description: "Essential systems design guide for production AI agent architectures."
        },
        {
          label: "Apple M4 Max MacBook Pro (16-inch, 64GB RAM)",
          url: "https://amazon.com/dp/B0D5N4M2L8?tag=newsflow-20",
          price: "$3,499.00",
          badge: "Recommended Gear",
          description: "The gold standard workstation for local LLM experimentation and parallel agent dev."
        }
      ]),
      seo_meta: JSON.stringify({
        title: "Anthropic Unveils Context Caching & Agent Architectures | NewsFlow",
        description: "How prompt caching and multi-modal tool use in Claude 3.7 are changing enterprise software economics.",
        og_image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80"
      }),
      body: `## The Economics of Long-Horizon Autonomy

Building software with autonomous AI agents has historically confronted an unforgiving financial cliff: re-transmitting vast repositories of codebase context, API specifications, and multi-turn conversational memory costs dollar amounts that compound quadratically with workflow length.

Today's announcement from Anthropic fundamentally reframes this equation. By introducing hardware-level prompt caching across Claude 3.7 Sonnet and Opus, cached context blocks can now be queried with up to a **90% price reduction** and **80% lower latency**.

> "This is not merely a pricing change; it represents a qualitative architectural transition. When retaining 200,000 tokens of persistent state costs pennies rather than dollars per turn, software agents transform from ephemeral query responders into persistent digital coworkers."

### How Cache Invalidation Works at the Boundary

Unlike traditional key-value application caches, Anthropic's implementation operates hierarchically across the model's key-value attention cache:

1. **Prefix Match Verification:** The system computes cryptographic hashes of sequential input blocks down to token-level granularity.
2. **5-Minute Ephemeral TTL:** Frequently pinged sessions sustain their cached attention weights without eviction penalties.
3. **Multi-Modal Cross-Attention:** Images, tool definitions, and structured schemas share the unified KV-cache layer alongside natural language text.

### The Broader Market Implication

Cloud providers and enterprise software suites that built bespoke RAG (Retrieval Augmented Generation) pipelines to circumvent context window limits must now re-evaluate their architectures. When feeding an entire repository directly into the model context is cheaper than vector indexing and reranking, the simplicity dividend favors unadorned, context-rich prompting.

The race between frontier labs is no longer measured solely in raw benchmark scores—it is measured in operational throughput, unit cost, and developer friction.`
    },
    {
      title: "OpenAI 'Strawberry' Reasoning Architecture: Inference Compute Takes Center Stage",
      slug: "openai-reasoning-architecture-inference-compute-center-stage",
      summary: "Why the AI frontier is transitioning from pre-training scaling laws to test-time search and Monte Carlo tree evaluation.",
      cover_image_url: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1600&q=80",
      categoryId: catMap["ai-robotics"],
      author: "NewsFlow AI",
      published_at: new Date(Date.now() - 1000 * 60 * 180), // 3 hours ago
      status: "published",
      rank_score: 93,
      is_featured: false,
      views_count: 980,
      reading_time_minutes: 4,
      source_url: "https://www.theverge.com/2026/openai-inference-compute-shift",
      tags: JSON.stringify(["OpenAI", "Reasoning", "Inference Compute", "Machine Learning"]),
      affiliate_links: JSON.stringify([
        {
          label: "Reinforcement Learning: An Introduction (Sutton & Barto)",
          url: "https://amazon.com/dp/0262039249?tag=newsflow-20",
          price: "$68.00",
          badge: "Foundational Reading",
          description: "The definitive textbook on reward optimization and dynamic search."
        }
      ]),
      seo_meta: JSON.stringify({
        title: "OpenAI Reasoning Architecture: The Inference Compute Shift | NewsFlow",
        description: "Analysis of test-time search, chain-of-thought verification, and the post-pretraining frontier.",
        og_image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1600&q=80"
      }),
      body: `## The Exhaustion of Easy Internet Text

For five years, frontier language modeling adhered to an almost mechanical certainty: double the parameters, double the compute cluster, scrape more raw tokens from the open internet, and downstream intelligence will scale predictably.

That paradigm is encountering hard physical and informational constraints. High-quality human prose on the public web is largely exhausted, while energy grids face bottlenecks in supplying 100-megawatt data centers.

### The Rise of Test-Time Search

Enter the paradigm of **test-time compute**. Rather than relying purely on next-token probability distributions formulated during months of expensive pre-training, models are now equipped with recursive search loops:

- **Chain-of-Thought Verification:** The model explores branching solution trees before committing to an output token.
- **Self-Correction Heuristics:** Automated critic modules evaluate intermediate mathematical and code deductions.
- **Dynamic Compute Allocation:** Trivial questions consume 50 milliseconds; complex architectural bugs consume 30 seconds of internal reflection.

This changes everything for software development. An agent that 'thinks' for two minutes before writing a critical compiler patch delivers vastly superior reliability compared to a lightning-fast model that hallucinates subtly on line 42.`
    },
    {
      title: "Apple Prepares M5 Ultra Chiplet Packaging for Spatial Computing Refresh",
      slug: "apple-prepares-m5-ultra-chiplet-packaging-spatial-computing",
      summary: "Leaked supply chain documents reveal Apple's transition to TSMC's 2nm SoIC-X hybrid bonding, targeting a 40% thermal reduction for next-gen headsets.",
      cover_image_url: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=1600&q=80",
      categoryId: catMap["gadgets-hardware"],
      author: "NewsFlow AI",
      published_at: new Date(Date.now() - 1000 * 60 * 360), // 6 hours ago
      status: "published",
      rank_score: 88,
      is_featured: false,
      views_count: 730,
      reading_time_minutes: 3,
      source_url: "https://arstechnica.com/gadgets/2026/apple-m5-ultra-soic",
      tags: JSON.stringify(["Apple", "Silicon", "Hardware", "Vision Pro", "TSMC"]),
      affiliate_links: JSON.stringify([]),
      seo_meta: JSON.stringify({
        title: "Apple M5 Ultra Chiplet Packaging Leaks | NewsFlow",
        description: "TSMC 2nm hybrid bonding, unified memory architecture, and spatial computing thermal optimizations.",
        og_image: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=1600&q=80"
      }),
      body: `## The Thermal Barrier in Wearable Silicon

The principal obstacle confronting augmented and spatial computing has never been display resolution or optical clarity—it has been thermal dissipation and weight. Packing 16 CPU cores, 40 GPU cores, and dedicated neural accelerators into a chassis worn on the human forehead requires aggressive engineering trade-offs.

According to semiconductor supply chain telemetry from Taipei, Apple has initiated tape-out trials for its **M5 silicon generation**, leveraging TSMC's 2nm fabrication node with SoIC-X (System-on-Integrated-Chips) true 3D hybrid bonding.

### Key Architectural Enhancements

- **Direct Silicon-to-Silicon Stacking:** Interconnect density jumps by 8x compared to conventional interposers, virtually eliminating latency between memory modules and computing cores.
- **Unified Memory Bandwidth:** Surpassing 1.2 TB/s on consumer-tier silicon.
- **Dedicated Neural Processing Slices:** Real-time sensor fusion and eye-tracking computations run on isolated low-power coprocessors without waking the primary GPU cluster.

This paves the way for a substantially lighter spatial computer slated for early 2027, shedding over 200 grams while extending standalone operational battery life.`
    },
    {
      title: "Critical OpenSSL 0-Day Flaw Patched: Global Infrastructure Scramble",
      slug: "critical-openssl-0-day-flaw-patched-global-infrastructure-scramble",
      summary: "Security researchers identify an out-of-bounds memory corruption vulnerability in TLS 1.3 session resumption handshakes affecting millions of servers worldwide.",
      cover_image_url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1600&q=80",
      categoryId: catMap["cybersecurity"],
      author: "NewsFlow AI",
      published_at: new Date(Date.now() - 1000 * 60 * 540), // 9 hours ago
      status: "published",
      rank_score: 95,
      is_featured: false,
      views_count: 1840,
      reading_time_minutes: 4,
      source_url: "https://krebsonsecurity.com/2026/openssl-critical-zero-day",
      tags: JSON.stringify(["Cybersecurity", "OpenSSL", "Infosec", "Zero Day", "Vulnerability"]),
      affiliate_links: JSON.stringify([
        {
          label: "Yubico YubiKey 5C NFC Dual Security Key",
          url: "https://amazon.com/dp/B08FX8TKV3?tag=newsflow-20",
          price: "$55.00",
          badge: "Essential Security",
          description: "Hardware-backed FIDO2 authentication protecting root credentials against credential stuffing."
        }
      ]),
      seo_meta: JSON.stringify({
        title: "Critical OpenSSL 0-Day Flaw Patched | NewsFlow",
        description: "Emergency patch released for CVE-2026-8812 memory corruption in TLS handshakes.",
        og_image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1600&q=80"
      }),
      body: `## Emergency Patch Release: CVE-2026-8812

In the early hours of Tuesday, the OpenSSL Project Management Committee issued an out-of-cycle critical security advisory, urging immediate upgrades across all enterprise Linux distributions, cloud load balancers, and containerized microservices.

The vulnerability, cataloged as **CVE-2026-8812** with a CVSS v4.0 severity rating of **9.8**, involves an out-of-bounds heap buffer overflow triggered during the parsing of malformed early-data session tickets under specific TLS 1.3 resumption configurations.

### Who Is Affected?

Organizations running OpenSSL versions 3.2.0 through 3.4.1 with server-side TLS session caching enabled are immediately vulnerable to remote code execution (RCE) without prior authentication.

> "What makes this particular flaw precarious is its location in the pre-handshake parsing loop. An unauthenticated remote attacker can dispatch crafted TCP packets that corrupt heap memory before client verification completes."

### Immediate Remediation Steps

1. Upgrade to OpenSSL **3.4.2** or **3.3.3** immediately across all public ingress points.
2. In environments where immediate binary recompilation is impossible, disable \`SSL_OP_NO_TICKET\` as an emergency mitigation.
3. Audit memory integrity and monitor outbound network egress for anomalous lateral movement.`
    },
    {
      title: "EU AI Act Foundation Model Enforcement Phase Takes Effect",
      slug: "eu-ai-act-foundation-model-enforcement-phase-takes-effect",
      summary: "Stringent systemic risk audits, copyright transparency logs, and energy consumption disclosures now mandatory for Tier-1 frontier developers in Europe.",
      cover_image_url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80",
      categoryId: catMap["policy-big-tech"],
      author: "NewsFlow AI",
      published_at: new Date(Date.now() - 1000 * 60 * 720), // 12 hours ago
      status: "published",
      rank_score: 86,
      is_featured: false,
      views_count: 620,
      reading_time_minutes: 3,
      source_url: "https://reuters.com/technology/eu-ai-act-enforcement-2026",
      tags: JSON.stringify(["EU AI Act", "Regulation", "Policy", "Big Tech", "Compliance"]),
      affiliate_links: JSON.stringify([]),
      seo_meta: JSON.stringify({
        title: "EU AI Act Foundation Model Enforcement Phase | NewsFlow",
        description: "Brussels initiates active compliance reviews for frontier AI labs operating in the European single market.",
        og_image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80"
      }),
      body: `## The Brussels Effect Reaches Generative AI

The regulatory honeymoon for frontier artificial intelligence laboratories in Europe officially ended this morning. Following the expiration of the European Union's 24-month phased transition window, the EU Artificial Intelligence Board has commenced formal oversight of general-purpose AI (GPAI) models with systemic risk capabilities.

Under the codified criteria, any model trained with cumulative compute exceeding **10^25 FLOPs** is automatically designated as possessing systemic risk.

### Mandatory Compliance Filings

Frontier developers operating within the EU single market must now satisfy three primary mandates:

- **Granular Copyright Disclosures:** Comprehensive documentation detailing the provenance, scraping methodologies, and opt-out compliance of training corpora.
- **Red-Teaming Evaluation Logs:** Unredacted third-party audits evaluating cyber offensive capabilities, chemical/biological weapon synthesis risks, and autonomous jailbreaking vectors.
- **Standardized Energy Footprint Metrics:** Detailed carbon equivalent reporting measuring kilowatt-hour consumption during both training runs and high-volume inference hosting.

Non-compliance carries financial penalties up to **€35 million or 7% of annual global turnover**, whichever is higher—creating an intense compliance scramble among Silicon Valley tech giants.`
    },
    {
      title: "Seed-Stage AI Valuations Defy Gravity as Sovereign Funds Anchor Mega-Rounds",
      slug: "seed-stage-ai-valuations-defy-gravity-sovereign-funds-anchor-mega-rounds",
      summary: "Pre-product research teams with two-page whitepapers command $100M+ post-money caps as Gulf and East Asian state investment vehicles bypass traditional venture syndicates.",
      cover_image_url: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1600&q=80",
      categoryId: catMap["startups-vc"],
      author: "NewsFlow AI",
      published_at: new Date(Date.now() - 1000 * 60 * 960), // 16 hours ago
      status: "published",
      rank_score: 89,
      is_featured: false,
      views_count: 810,
      reading_time_minutes: 4,
      source_url: "https://bloomberg.com/news/articles/2026/seed-ai-valuations-sovereign-wealth",
      tags: JSON.stringify(["Startups", "Venture Capital", "Funding", "Sovereign Wealth", "Seed Rounds"]),
      affiliate_links: JSON.stringify([]),
      seo_meta: JSON.stringify({
        title: "Seed-Stage AI Valuations Defy Gravity | NewsFlow",
        description: "Analysis of sovereign wealth capital inflows into frontier AI pre-product rounds.",
        og_image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1600&q=80"
      }),
      body: `## The Disruption of the Traditional Venture Stack

In Silicon Valley's traditional seed financing playbook, founding teams built a minimum viable product, validated early customer retention signals, and raised $3 million at a $15 million valuation from angel syndicates and boutique micro-VCs.

In 2026, when top-tier research talent spins out of frontier research institutions, that conventional playbook is obsolete.

### Direct Sovereign Inflows

Sovereign wealth vehicles from Abu Dhabi, Riyadh, and Singapore are writing $20 million to $50 million lead checks directly into seed rounds, driving initial caps beyond $100 million before the companies have written a single line of customer-facing production code.

The primary driver is compute access. Securing clusters of next-generation GPU accelerators requires upfront capital commitments that traditional seed fund sizes simply cannot underwrite without severe portfolio concentration risk.

As one prominent GP remarked this week: *"If you cannot provide access to 10,000 interconnect chips within 30 days of incorporation, your term sheet is non-competitive."*`
    }
  ];

  for (const art of articles) {
    await prisma.article.upsert({
      where: { slug: art.slug },
      update: art,
      create: art,
    });
  }

  console.log("Database seeded successfully with 5 categories and 6 tech news articles!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });