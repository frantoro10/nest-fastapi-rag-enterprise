# Enterprise RAG Platform: Corporate Knowledge System

![Status](https://img.shields.io/badge/Status-In%20Development-yellow?style=flat-square)
![Stack](https://img.shields.io/badge/Stack-NestJS%20|%20Python%20|%20Next.js-blue?style=flat-square)


An enterprise-grade SaaS solution designed to allow secure querying of private internal documentation using **Retrieval-Augmented Generation (RAG)**.

Unlike public AI tools, this platform ensures data privacy by processing sensitive documents (PDFs) within a controlled microservices architecture, leveraging **Supabase (pgvector)** for semantic search and **NestJS** for robust role-based access control.

---

## 🏗️ System Architecture

This project implements a **Hybrid Microservices Architecture**. The design focuses on separating concerns: NestJS handles business logic and security, while Python handles high-performance vector processing.

```mermaid
graph TD
    subgraph Client_Side [Client Side]
        UI[" Frontend (Next.js)"]
    end

    subgraph Backend_Ecosystem [Backend Ecosystem]
        Gateway[" API Gateway (NestJS)"]
        AI_Service[" AI Engine (Python FastAPI)"]
    end

    subgraph Infrastructure
        DB[(" Supabase Postgres + Vector")]
        Storage[" Supabase Storage"]
    end

    subgraph External_APIs [External APIs]
        LLM["⚡ Groq / OpenAI API"]
    end

    %% Flow connections
    UI -->|JWT Auth & Uploads| Gateway
    Gateway -->|Store PDF| Storage
    Gateway -->|Store Metadata| DB
    Gateway -->|Trigger Ingestion| AI_Service
    
    AI_Service -->|Fetch PDF| Storage
    AI_Service -->|Generate Embeddings| DB
    AI_Service -->|Vector Search| DB
    AI_Service -->|Generate Answer| LLM
    
    Gateway -.->|Return Response| UI

```

The logic is finished; it is just necessary to deploy the servers (Nest and Python). You can test the RAG system using Postman or other similar tools to use the endpoints! 

You can find all the info of the key in the .env-sample! 
