# JobOrbit – Microservices Professional Networking Platform

JobOrbit is a scalable professional networking platform built using a **microservices architecture**, supporting features like user profiles, connections, job postings, feeds, and real-time chat.  
The system is designed for modularity, scalability, and independent service deployment.

---

# 🏗️ Architecture Overview

- Microservices-based architecture  
- Service discovery using Eureka  
- API Gateway for centralized routing  
- Event-driven communication using Apache Kafka and RabbitMQ  
- Redis for caching and performance optimization  
- MySQL for persistent storage  
- Fully containerized using Docker  

---

# ⚙️ Tech Stack

### Backend
- Java  
- Spring Boot  
- Hibernate  
- RESTful APIs with clean service-layer architecture  

### Messaging & Caching
- Apache Kafka  
- RabbitMQ  
- Redis  

### Frontend
- Next.js  
- Tailwind CSS  

### DevOps
- Docker & Docker Compose  
- Monorepo managed with Turborepo  

---

# 📦 Core Features

- Modular microservices architecture with independent services  
- JWT-based authentication and role-based access control (RBAC)  
- Real-time chat using WebSockets  
- Asynchronous communication via Kafka and RabbitMQ  
- Redis caching for reduced latency and improved performance  
- Clean API design for seamless inter-service communication  

---

# 🧩 Services

- Auth Service  
- Profile Service  
- Feed Service  
- Chat Service  
- Job Service  
- Connection Service  
- API Gateway  
- Eureka Server  

---

#💡 Key Highlights

- Designed for scalability and high availability  
- Event-driven system improves reliability under load  
- Monorepo setup enables faster builds and shared configurations  
- Containerized environment ensures consistency across deployments  