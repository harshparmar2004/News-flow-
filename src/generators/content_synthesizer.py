"""
AI Content Synthesizer & Pre-built Templates for Tech Notes.
Generates structured multi-page slides data for any topic.
"""

import os
import json
import logging
from typing import List, Dict, Any

logger = logging.getLogger(__name__)

# Pre-built complete master templates
TEMPLATES: Dict[str, Dict[str, Any]] = {
    "python": {
        "title": "Object-Oriented Programming",
        "badge_tag": "OOPs Notes",
        "brand_handle": "by @PyCode.Hubb",
        "pages": [
            {
                "title": "Object-Oriented Programming",
                "subtitle": "Part - 1: Classes & Objects",
                "badge": "OOPs Notes",
                "sections": [
                    {"type": "heading", "text": "* 1. What is OOPs ?"},
                    {
                        "type": "bullets",
                        "items": [
                            "Definition: Programming paradigm based on 'Objects' containing data and logic.",
                            "Core Goal: Make code modular, reusable, scalable, and easy to maintain.",
                            "Python Support: Python is dynamically typed and fully supports multi-paradigm OOP."
                        ]
                    },
                    {
                        "type": "card_grid",
                        "title": "* 4 Main Pillars of OOPs:",
                        "cards": [
                            {"title": "1. Encapsulation", "desc": "Data hiding & wrapping"},
                            {"title": "2. Inheritance", "desc": "Reusing parent attributes"},
                            {"title": "3. Polymorphism", "desc": "Many forms, same interface"},
                            {"title": "4. Abstraction", "desc": "Hiding internal complexity"}
                        ]
                    },
                    {
                        "type": "diagram",
                        "left_title": "CLASS (Blueprint)",
                        "right_title1": "OBJECT 1: car1 = Car('Tesla')",
                        "right_title2": "OBJECT 2: car2 = Car('BMW')",
                        "arrow_label": "Instantiates",
                        "left_lines": ["• Attributes: brand, hp", "• Methods: drive(), brake()", "• Template in Memory"],
                        "right_desc1": "• RAM Address: 0x7fa920",
                        "right_desc2": "• RAM Address: 0x7fa948"
                    },
                    {
                        "type": "code_box",
                        "title": "* Python Class & Object Syntax:",
                        "code": [
                            "class Car:",
                            "    def __init__(self, brand, hp):",
                            "        self.brand = brand     # Instance attribute",
                            "        self.hp = hp",
                            "my_car = Car('Tesla', 450)        # Object instantiation",
                            "print(my_car.brand)                # Output: Tesla"
                        ]
                    }
                ]
            },
            {
                "title": "Python OOPs Mastery",
                "subtitle": "Part - 2: Constructor & Self",
                "badge": "OOPs Notes",
                "sections": [
                    {"type": "heading", "text": "* 2. Understanding __init__ and self :"},
                    {
                        "type": "bullets",
                        "items": [
                            "__init__(): Special dunder method invoked automatically when a new object is created.",
                            "self: Reference to the current instance of the class; binds attributes to the instance.",
                            "Instance Attributes: Unique to each instance; defined inside __init__ with self.",
                            "Class Attributes: Shared across all instances; defined directly inside the class body."
                        ]
                    },
                    {
                        "type": "code_box",
                        "title": "* Instance vs Class Attributes Example:",
                        "code": [
                            "class Student:",
                            "    school_name = 'Tech High'    # Class attribute (shared)",
                            "",
                            "    def __init__(self, name, roll):",
                            "        self.name = name           # Instance attribute",
                            "        self.roll = roll",
                            "",
                            "s1 = Student('Alice', 101)",
                            "print(s1.school_name, s1.name)    # Output: Tech High Alice"
                        ]
                    },
                    {
                        "type": "table",
                        "headers": ["Attribute Type", "Scope", "Access Syntax"],
                        "rows": [
                            ["Instance Var", "Specific to single object", "self.var_name"],
                            ["Class Var", "Shared across all objects", "ClassName.var_name"],
                            ["Local Var", "Only inside a single method", "var_name inside def"]
                        ]
                    }
                ]
            },
            {
                "title": "Python OOPs Mastery",
                "subtitle": "Part - 3: Encapsulation & Data Hiding",
                "badge": "OOPs Notes",
                "sections": [
                    {"type": "heading", "text": "* 3. Encapsulation & Access Modifiers :"},
                    {
                        "type": "bullets",
                        "items": [
                            "Definition: Restricting direct access to an object's internal state to prevent tampering.",
                            "Public Members: Accessible anywhere inside or outside the class (e.g. self.name).",
                            "Protected Members: Prefix with single underscore '_'; convention for internal use.",
                            "Private Members: Prefix with double underscore '__'; triggers Python name mangling."
                        ]
                    },
                    {
                        "type": "card_grid",
                        "title": "* Python Access Modifier Rules:",
                        "cards": [
                            {"title": "Public", "desc": "self.name (Anywhere)"},
                            {"title": "Protected", "desc": "self._balance (Internal)"},
                            {"title": "Private", "desc": "self.__pin (Mangled)"},
                            {"title": "Properties", "desc": "@property decorator"}
                        ]
                    },
                    {
                        "type": "code_box",
                        "title": "* Getter and Setter Implementation:",
                        "code": [
                            "class BankAccount:",
                            "    def __init__(self, balance):",
                            "        self.__balance = balance       # Private variable",
                            "",
                            "    @property",
                            "    def balance(self):",
                            "        return self.__balance          # Getter method",
                            "",
                            "    @balance.setter",
                            "    def balance(self, amount):",
                            "        if amount >= 0: self.__balance = amount"
                        ]
                    }
                ]
            },
            {
                "title": "Python OOPs Mastery",
                "subtitle": "Part - 4: Inheritance & Super()",
                "badge": "OOPs Notes",
                "sections": [
                    {"type": "heading", "text": "* 4. Inheritance & Method Overriding :"},
                    {
                        "type": "bullets",
                        "items": [
                            "Definition: Mechanism where a child class derives attributes and methods from a parent class.",
                            "Code Reusability: Avoid DRY (Don't Repeat Yourself) violations across large codebases.",
                            "super(): Built-in function used to call the parent class methods or __init__ constructor.",
                            "Method Overriding: Child class defines a method with the same name as the parent."
                        ]
                    },
                    {
                        "type": "diagram",
                        "left_title": "PARENT (Vehicle)",
                        "right_title1": "CHILD 1: Car(Vehicle)",
                        "right_title2": "CHILD 2: ElectricCar(Car)",
                        "arrow_label": "Inherits",
                        "left_lines": ["• brand, year", "• start_engine()", "• Base Logic"],
                        "right_desc1": "• Adds doors, trunk_size",
                        "right_desc2": "• Adds battery_kwh"
                    },
                    {
                        "type": "code_box",
                        "title": "* Inheritance with super() Syntax:",
                        "code": [
                            "class Animal:",
                            "    def __init__(self, name): self.name = name",
                            "    def speak(self): return 'Sound'",
                            "",
                            "class Dog(Animal):",
                            "    def __init__(self, name, breed):",
                            "        super().__init__(name)        # Call parent constructor",
                            "        self.breed = breed",
                            "    def speak(self): return 'Woof!'  # Overridden method"
                        ]
                    }
                ]
            },
            {
                "title": "Python OOPs Mastery",
                "subtitle": "Part - 5: Magic / Dunder Methods",
                "badge": "OOPs Notes",
                "sections": [
                    {"type": "heading", "text": "* 5. Magic (Dunder) Methods Cheat Sheet :"},
                    {
                        "type": "bullets",
                        "items": [
                            "Dunder Methods: Double Underscore methods like __init__, __str__, and __repr__.",
                            "Operator Overloading: Allows custom classes to respond to +, -, *, len(), and print().",
                            "Pythonic Code: Enables objects to behave seamlessly with Python's built-in ecosystem."
                        ]
                    },
                    {
                        "type": "table",
                        "headers": ["Dunder Method", "Triggered By", "Example Use"],
                        "rows": [
                            ["__str__(self)", "str(obj), print(obj)", "User-friendly string"],
                            ["__repr__(self)", "repr(obj), terminal", "Unambiguous debug output"],
                            ["__len__(self)", "len(obj)", "Return collection size"],
                            ["__eq__(self, o)", "obj1 == obj2", "Compare equality"],
                            ["__add__(self, o)", "obj1 + obj2", "Overload + operator"]
                        ]
                    },
                    {
                        "type": "code_box",
                        "title": "* Custom Dunder Methods in Action:",
                        "code": [
                            "class Book:",
                            "    def __init__(self, title, pages):",
                            "        self.title, self.pages = title, pages",
                            "    def __str__(self): return f'{self.title} ({self.pages}p)'",
                            "    def __len__(self): return self.pages",
                            "",
                            "b = Book('Clean Code', 464)",
                            "print(b)      # Output: Clean Code (464p)",
                            "print(len(b)) # Output: 464"
                        ]
                    }
                ]
            }
        ]
    },

    "docker": {
        "title": "Docker Architecture & CLI",
        "badge_tag": "Docker Notes",
        "brand_handle": "by @DevOps.Hubb",
        "pages": [
            {
                "title": "Docker Fundamentals",
                "subtitle": "Part - 1: Containers vs VMs",
                "badge": "Docker Notes",
                "sections": [
                    {"type": "heading", "text": "* 1. What is Docker & Containers ?"},
                    {
                        "type": "bullets",
                        "items": [
                            "Definition: Open platform for developing, shipping, and running applications anywhere.",
                            "Containers: Lightweight, standalone, executable packages with code, runtime, and tools.",
                            "Containers vs VMs: Share host OS kernel, start in milliseconds, consume 10x less RAM.",
                            "Portability: 'Build once, run anywhere' across dev, staging, and production."
                        ]
                    },
                    {
                        "type": "card_grid",
                        "title": "* Docker Core Architecture:",
                        "cards": [
                            {"title": "Docker Client", "desc": "CLI tool (docker run)"},
                            {"title": "Docker Daemon", "desc": "dockerd manages containers"},
                            {"title": "Images", "desc": "Read-only blueprint layers"},
                            {"title": "Containers", "desc": "Running image instances"}
                        ]
                    },
                    {
                        "type": "diagram",
                        "left_title": "DOCKER CLIENT",
                        "right_title1": "REGISTRY (Docker Hub)",
                        "right_title2": "DOCKER HOST (Daemon)",
                        "arrow_label": "REST API",
                        "left_lines": ["• docker build", "• docker pull", "• docker run"],
                        "right_desc1": "• Public/Private Repos",
                        "right_desc2": "• Images & Running Containers"
                    },
                    {
                        "type": "code_box",
                        "title": "* Hello World Docker Command:",
                        "code": [
                            "# Pull image and run an interactive container with port mapping",
                            "docker run -d -p 8080:80 --name my-web nginx:alpine",
                            "",
                            "# Verify running container status",
                            "docker ps"
                        ]
                    }
                ]
            },
            {
                "title": "Docker Cheat Sheet",
                "subtitle": "Part - 2: Essential CLI Commands",
                "badge": "Docker Notes",
                "sections": [
                    {"type": "heading", "text": "* 2. Must-Know Docker Commands :"},
                    {
                        "type": "bullets",
                        "items": [
                            "Container Lifecycle: Commands to create, execute, inspect, and remove containers.",
                            "Image Operations: Commands to build from Dockerfiles and pull from Docker Hub.",
                            "Housekeeping: Pruning dangling images and reclaiming system disk space."
                        ]
                    },
                    {
                        "type": "table",
                        "headers": ["Command", "Description", "Example"],
                        "rows": [
                            ["docker run", "Create & start container", "docker run -p 3000:3000 app"],
                            ["docker ps -a", "List all containers", "docker ps -a --format 'table'"],
                            ["docker exec", "Run command in container", "docker exec -it web sh"],
                            ["docker logs", "Fetch container stdout", "docker logs -f --tail 50 web"],
                            ["docker build", "Build image from Dockerfile", "docker build -t api:v1 ."],
                            ["docker stop/rm", "Stop and delete container", "docker stop web && docker rm web"]
                        ]
                    },
                    {
                        "type": "code_box",
                        "title": "* Pro Docker CLI Aliases & Cleanup:",
                        "code": [
                            "# Clean all stopped containers, unused networks, and dangling images",
                            "docker system prune -af --volumes",
                            "",
                            "# Inspect live container resource usage (CPU/Memory)",
                            "docker stats --no-stream"
                        ]
                    }
                ]
            },
            {
                "title": "Docker Deep Dive",
                "subtitle": "Part - 3: Production Dockerfile",
                "badge": "Docker Notes",
                "sections": [
                    {"type": "heading", "text": "* 3. Writing Efficient Dockerfiles :"},
                    {
                        "type": "bullets",
                        "items": [
                            "Layer Caching: Place infrequently changed instructions (COPY package.json) first.",
                            "Minimal Base Images: Always use Alpine or Slim variants for small attack surface.",
                            "Non-Root User: Run processes under a dedicated user for production security.",
                            ".dockerignore: Exclude node_modules, .git, and temporary files from context."
                        ]
                    },
                    {
                        "type": "code_box",
                        "title": "* Multi-Stage Production Dockerfile Example:",
                        "code": [
                            "# Stage 1: Build binary / dependencies",
                            "FROM python:3.11-slim AS builder",
                            "WORKDIR /app",
                            "COPY requirements.txt .",
                            "RUN pip install --no-cache-dir -r requirements.txt",
                            "",
                            "# Stage 2: Minimal runtime container",
                            "FROM python:3.11-slim",
                            "WORKDIR /app",
                            "COPY --from=builder /usr/local/lib/python3.11 /usr/local/lib/python3.11",
                            "COPY . .",
                            "USER 1000",
                            "EXPOSE 8000",
                            "CMD ['uvicorn', 'main:app', '--host', '0.0.0.0', '--port', '8000']"
                        ]
                    }
                ]
            },
            {
                "title": "Docker Compose",
                "subtitle": "Part - 4: Multi-Container Stacks",
                "badge": "Docker Notes",
                "sections": [
                    {"type": "heading", "text": "* 4. Docker Compose & Persistent Volumes :"},
                    {
                        "type": "bullets",
                        "items": [
                            "Compose: YAML tool for defining and running multi-container Docker applications.",
                            "Networking: Containers in the same compose file communicate via service name as DNS.",
                            "Volumes: Decouples persistent data (e.g. Postgres DB data) from container lifecycles."
                        ]
                    },
                    {
                        "type": "code_box",
                        "title": "* docker-compose.yml Production Stack:",
                        "code": [
                            "version: '3.8'",
                            "services:",
                            "  web:",
                            "    build: .",
                            "    ports: ['8000:8000']",
                            "    depends_on: ['db']",
                            "    environment:",
                            "      - DATABASE_URL=postgres://user:pass@db:5442/app",
                            "  db:",
                            "    image: postgres:15-alpine",
                            "    volumes:",
                            "      - pgdata:/var/lib/postgresql/data",
                            "volumes:",
                            "  pgdata:"
                        ]
                    }
                ]
            }
        ]
    },

    "kubernetes": {
        "title": "Kubernetes Architecture & Orchestration",
        "badge_tag": "K8s Notes",
        "brand_handle": "by @CloudNative.Notes",
        "pages": [
            {
                "title": "Kubernetes Architecture",
                "subtitle": "Part - 1: Control Plane & Nodes",
                "badge": "K8s Notes",
                "sections": [
                    {"type": "heading", "text": "* 1. What is Kubernetes (K8s) ?"},
                    {
                        "type": "bullets",
                        "items": [
                            "Definition: Open-source container orchestration platform for automated scaling and management.",
                            "Self-Healing: Restarts failed containers, reschedules nodes, and replaces unresponsive pods.",
                            "Declarative Config: You define the desired state; K8s reconciliation loop achieves it."
                        ]
                    },
                    {
                        "type": "card_grid",
                        "title": "* Control Plane Components:",
                        "cards": [
                            {"title": "kube-apiserver", "desc": "Hub of all communications"},
                            {"title": "etcd", "desc": "Consistent key-value store"},
                            {"title": "kube-scheduler", "desc": "Assigns pods to nodes"},
                            {"title": "controller-manager", "desc": "Regulates cluster state"}
                        ]
                    },
                    {
                        "type": "diagram",
                        "left_title": "CONTROL PLANE",
                        "right_title1": "WORKER NODE 1",
                        "right_title2": "WORKER NODE 2",
                        "arrow_label": "Kubelet",
                        "left_lines": ["• API Server", "• etcd DB", "• Schedulers"],
                        "right_desc1": "• Pods (Nginx, API)",
                        "right_desc2": "• Kube-Proxy + CNI"
                    },
                    {
                        "type": "code_box",
                        "title": "* Essential Cluster Health Commands:",
                        "code": [
                            "kubectl cluster-info",
                            "kubectl get nodes -o wide",
                            "kubectl get pods -A"
                        ]
                    }
                ]
            },
            {
                "title": "Kubernetes Core Objects",
                "subtitle": "Part - 2: Pods & Deployments",
                "badge": "K8s Notes",
                "sections": [
                    {"type": "heading", "text": "* 2. Pods, Deployments & ReplicaSets :"},
                    {
                        "type": "bullets",
                        "items": [
                            "Pod: Smallest deployable unit in K8s; encapsulates one or more co-located containers.",
                            "ReplicaSet: Ensures a specified number of identical pod replicas are running at all times.",
                            "Deployment: Provides declarative updates for Pods; enables rolling updates and instant rollbacks."
                        ]
                    },
                    {
                        "type": "code_box",
                        "title": "* Deployment YAML Manifest (deployment.yaml):",
                        "code": [
                            "apiVersion: apps/v1",
                            "kind: Deployment",
                            "metadata: { name: web-api }",
                            "spec:",
                            "  replicas: 3",
                            "  selector: { matchLabels: { app: web } }",
                            "  template:",
                            "    metadata: { labels: { app: web } }",
                            "    spec:",
                            "      containers:",
                            "      - name: api",
                            "        image: nginx:alpine",
                            "        ports: [{ containerPort: 80 }]"
                        ]
                    }
                ]
            },
            {
                "title": "Kubernetes Networking",
                "subtitle": "Part - 3: Services & Ingress",
                "badge": "K8s Notes",
                "sections": [
                    {"type": "heading", "text": "* 3. Exposing Pods with Services :"},
                    {
                        "type": "bullets",
                        "items": [
                            "Problem: Pod IPs are ephemeral and change whenever a pod restarts.",
                            "Service: Stable virtual IP and DNS name that load-balances traffic across matching pods.",
                            "Service Types: ClusterIP (internal), NodePort (static port on node), LoadBalancer (cloud external)."
                        ]
                    },
                    {
                        "type": "table",
                        "headers": ["Service Type", "Accessibility", "Use Case"],
                        "rows": [
                            ["ClusterIP", "Inside cluster only", "Inter-service / Databases"],
                            ["NodePort", "NodeIP:NodePort (30000+)", "Dev / Direct Node Testing"],
                            ["LoadBalancer", "External Cloud IP", "Production public endpoints"],
                            ["Ingress", "HTTP/HTTPS Host routing", "Domain SSL & Path proxy"]
                        ]
                    }
                ]
            },
            {
                "title": "Kubernetes Cheat Sheet",
                "subtitle": "Part - 4: kubectl Command Reference",
                "badge": "K8s Notes",
                "sections": [
                    {"type": "heading", "text": "* 4. Must-Know kubectl Commands :"},
                    {
                        "type": "table",
                        "headers": ["Command", "Action", "Flags"],
                        "rows": [
                            ["kubectl apply -f .", "Deploy all manifests", "--dry-run=client"],
                            ["kubectl get pods", "List pods in namespace", "-n prod -w"],
                            ["kubectl describe pod", "Inspect events and failures", "<pod-name>"],
                            ["kubectl logs -f", "Stream container stdout", "--tail 100"],
                            ["kubectl exec -it", "Open interactive shell", "-- sh"],
                            ["kubectl rollout undo", "Instant rollback deployment", "deployment/web"]
                        ]
                    },
                    {
                        "type": "code_box",
                        "title": "* Pro Troubleshooting Shortcut:",
                        "code": [
                            "# Port-forward pod to localhost without exposing public service",
                            "kubectl port-forward pod/web-api-7b8f9 8080:80",
                            "",
                            "# Sort pods by memory usage",
                            "kubectl top pods --sort-by=memory"
                        ]
                    }
                ]
            }
        ]
    }
}


def get_template_for_topic(topic: str) -> Dict[str, Any]:
    """Retrieve pre-built template or synthesize dynamic structured content for topic."""
    from src.generators.tech_logos import normalize_tech_name
    tech = normalize_tech_name(topic)

    if tech in TEMPLATES:
        data = TEMPLATES[tech]
        data["topic"] = topic
        return data

    # Intelligent fallback synthesizer for arbitrary topics (ChatGPT, MERN, DSA, SQL, Git, etc.)
    return generate_dynamic_tech_notes(topic)


def generate_dynamic_tech_notes(topic: str) -> Dict[str, Any]:
    """
    Intelligently synthesizes structured notebook pages for any custom tech topic.
    """
    from src.generators.tech_logos import normalize_tech_name
    tech = normalize_tech_name(topic)
    badge = f"{topic[:14]} Notes" if len(topic) < 14 else f"{tech.capitalize()} Notes"

    return {
        "topic": topic,
        "title": f"{topic.upper()} MASTERY",
        "badge_tag": badge,
        "brand_handle": f"by @{tech.capitalize()}.Notes",
        "pages": [
            {
                "title": f"{topic} Overview",
                "subtitle": "Part - 1: Core Fundamentals",
                "badge": badge,
                "sections": [
                    {"type": "heading", "text": f"* 1. What is {topic} ?"},
                    {
                        "type": "bullets",
                        "items": [
                            f"Definition: Industry-standard technology used for modern software engineering.",
                            f"Key Purpose: Solves critical performance, scalability, and workflow bottlenecks.",
                            f"Ecosystem: Integrates seamlessly across full-stack and cloud platforms."
                        ]
                    },
                    {
                        "type": "card_grid",
                        "title": f"* 4 Core Concepts of {topic}:",
                        "cards": [
                            {"title": "1. Architecture", "desc": "Underlying data structure"},
                            {"title": "2. Runtime", "desc": "Execution lifecycle"},
                            {"title": "3. Optimization", "desc": "High efficiency patterns"},
                            {"title": "4. Tooling", "desc": "CLI and debugging ecosystem"}
                        ]
                    },
                    {
                        "type": "diagram",
                        "left_title": "INPUT / BLUEPRINT",
                        "right_title1": "COMPILED ARTIFACT",
                        "right_title2": "LIVE RUNTIME INSTANCE",
                        "arrow_label": "Transforms",
                        "left_lines": ["• Declarative config", "• Source specs", "• Schema definition"],
                        "right_desc1": "• Immutable build",
                        "right_desc2": "• Production deployment"
                    },
                    {
                        "type": "code_box",
                        "title": f"* {topic} Quickstart Snippet:",
                        "code": [
                            f"# Initialize {topic} configuration",
                            f"import {tech.lower()}",
                            "",
                            f"client = {tech.lower()}.Client(api_version='v2')",
                            f"result = client.execute(operation='start')",
                            "print('Status:', result.status)"
                        ]
                    }
                ]
            },
            {
                "title": f"{topic} Deep Dive",
                "subtitle": "Part - 2: Architecture & Workflow",
                "badge": badge,
                "sections": [
                    {"type": "heading", "text": f"* 2. {topic} Workflow Mechanics :"},
                    {
                        "type": "bullets",
                        "items": [
                            "Step 1: Parse requirements and initialize base execution context.",
                            "Step 2: Apply business constraints and validate schema contracts.",
                            "Step 3: Dispatch asynchronous workloads with automated retry policies."
                        ]
                    },
                    {
                        "type": "table",
                        "headers": ["Feature / Component", "Role & Impact", "Best Practice"],
                        "rows": [
                            ["Core Engine", "Executes primary workloads", "Use connection pooling"],
                            ["Cache Layer", "Sub-millisecond reads", "Set strict TTL policies"],
                            ["Event Bus", "Decouples microservices", "Idempotent consumers"],
                            ["Security Guard", "Role-based access", "Least-privilege tokens"]
                        ]
                    },
                    {
                        "type": "code_box",
                        "title": "* Production Architecture Code:",
                        "code": [
                            f"async def process_{tech.lower()}_pipeline(payload: dict):",
                            "    try:",
                            "        validated = validate_schema(payload)",
                            "        return await dispatch_worker(validated)",
                            "    except Exception as err:",
                            "        logger.error(f'Failure: {err}')"
                        ]
                    }
                ]
            },
            {
                "title": f"{topic} Reference",
                "subtitle": "Part - 3: Best Practices & Traps",
                "badge": badge,
                "sections": [
                    {"type": "heading", "text": "* 3. Common Pitfalls & Anti-Patterns :"},
                    {
                        "type": "bullets",
                        "items": [
                            "Pitfall 1: Ignoring proper indexing or state lifecycle management.",
                            "Pitfall 2: Unhandled async exceptions causing unobserved task crashes.",
                            "Pitfall 3: Storing secrets in plaintext instead of environment variables."
                        ]
                    },
                    {
                        "type": "card_grid",
                        "title": "* Production Checklist:",
                        "cards": [
                            {"title": "Zero Leaks", "desc": "Dispose connections cleanly"},
                            {"title": "Tracing", "desc": "Log correlation IDs"},
                            {"title": "Metrics", "desc": "Monitor P99 latency"},
                            {"title": "Backups", "desc": "Automated snapshotting"}
                        ]
                    }
                ]
            }
        ]
    }
