## Project Case Study Submission – PrometheanTech

### 1. Project Name - Internal or generic project name

PromeDocAI - Multilingual Document Intelligence & Schema Extraction Platform

### 2. Employee Name - Name of the person filling the form

Yash Mahajan

### 3. Role - Frontend / Backend / DevOps

Full Stack Developer

### 4. Project Duration - Timeline of project

Sept 2024 - Dec 2025

### 5. Industry - SaaS, Fintech, Healthcare, etc.

SaaS / Enterprise Document Intelligence

### 6. Client Name Allowed - Yes or No (NDA)

PromeTechAi Innovations Pvt Ltd

### 7. Problem Statement - Client's core problem

Enterprises deal with massive volumes of unstructured documents, scanned PDFs, photographed reports, multi-column invoices, dense medical records, and multilingual government filings. Extracting usable data from these documents was entirely manual: operators visually scanned each page, manually entered data into spreadsheets, and cross-referenced tables by hand. This process was slow, error-prone, and unscalable. Many organizations also operated under strict NDA and data-residency rules, making third-party cloud AI services unsuitable.

### 8. Project Objective - Expected outcome

Build a fully self-hosted AI-powered document intelligence platform that:

* Detects document layout structure
* Extracts multilingual text accurately
* Converts complex tables into structured HTML/JSON
* Supports schema-driven extraction
* Runs fully offline on private infrastructure
* Provides modern upload, viewer, chat, and export interfaces

### 9. Solution Summary - What was built (simple terms)

Developed an AI-based document processing platform utilizing custom offline pipelines. The platform ingests documents natively, detects structural layouts (headers, tables, charts) using DocLayout YOLO, extracts text via multilingual PaddleOCR, and provides an intelligent semantic search interface through a Next.js frontend and Python FastAPI backend.

Built a two-product platform using Next.js 16 frontend and Python FastAPI backend.

#### Product 1: Document Processor

Users upload PDFs or images. Backend runs a three-stage AI pipeline:

* DocLayout-YOLO for layout detection
* PaddleOCR for multilingual OCR
* PP-StructureV3 for table extraction

Frontend provides split-panel viewer with bounding boxes, overlays, extracted data inspection, and AI chat.

#### Product 2: Schema Extraction

Users define schemas or auto-generate them using AI. System extracts structured values matching schemas, allows editing, exports JSON/CSV/XML, and routes data into APIs, databases, email, or cloud storage.

### 10. Key Features - Main functionalities

* Fully offline AI processing pipeline with no dependence on third-party APIs
* Automated async document upload and batch processing queues
* Bounding-box structural layout grounding (paragraphs, tables, images) using DocLayout YOLO
* High-accuracy multilingual OCR pipeline powered by PaddleOCR
* Reading order and spatial layout preservation for complex documents
* Bordered and borderless table extraction transforming images to structured JSON format
* Component-level image and chart extraction for downstream analytics capabilities
* Standardized AI SDK for seamless frontend and backend integration
* Intelligent NLP-powered semantic search, document classification, and entity recognition
* Interactive React-based Next.js frontend for analyzing and visualizing layout-grounded results

### 11. Frontend Tech - React, Angular, etc.

Next.js, React, TypeScript, Zustand, Tailwind CSS, Motion, Radix UI, shadcn/ui, React Hook Form, Zod, Vercel AI SDK, PostHog

### 12. Backend Tech - Node.js, Java, Python, etc.

Python, FastAPI, Uvicorn, DocLayout-YOLO, PaddleOCR, PaddleX PP-StructureV3, OpenCV, Pillow, pdf2image, boto3, LangChain, psutil, passlib, bcrypt, asyncio, numpy

### 13. Database - MongoDB, PostgreSQL, etc.

MongoDB

### 14. Cloud Platform - AWS, Azure, GCP

AWS

### 15. DevOps Tools - Docker, Kubernetes, CI/CD

Docker

### 16. AI/ML Used - Yes or No

Yes

### 17. AI/ML Details - Explain AI/ML usage

#### Pipeline 1: Layout Detection

YOLOv10-based DocLayout-YOLO model detects titles, text, tables, figures, lists.

#### Pipeline 2: OCR

PaddleOCR with orientation detection, MKLDNN acceleration, multilingual support.

#### Pipeline 3: Table Recognition

PP-StructureV3 reconstructs bordered and borderless tables into HTML.

#### Preprocessing

Deskew pipeline using Hough Transform, thresholding, CLAHE, affine correction.

#### AI Chat

Gemini integration through Vercel AI SDK for document Q&A.

### 18. Individual Contribution - Your exact work

* Designed and built the interactive Next.js components for document uploading, table visualization, and layout result rendering.
* Orchestrated the Python FastAPI microservices to handle large asynchronous document queues without blocking the main event loops.
* Implemented and tuned DocLayout YOLO models to physically map document structures into strict bounding-box JSON coordinates.
* Integrated PaddleOCR pipelines within the bounded layout boxes to perform focused high-accuracy text extraction.
* Developed custom extraction algorithms converting complex spatial table grids (both bordered and borderless) into coherent 2D JSON data structures.
* Created a standardized AI SDK serving as the programmatic bridge unifying the ML pipelines, React frontend, and database ingestion workflows.
* Built the global smart search UI, allowing instant semantic retrieval of information across thousands of scanned enterprise documents.

### 19. Challenges - Problems faced

* Heavy memory usage for PDFs
* Long-running inference requests causing timeouts
* Duplicate detections from object detection model
* Reading order reconstruction in complex layouts
* Borderless table extraction complexity
* Responsive overlay rendering accuracy
* Large ML Docker image size

### 20. Solutions - How challenges were solved

* Proactive psutil memory monitoring with thresholds
* StreamingResponse with keep-alive heartbeat tokens
* IoU-based duplicate filtering
* Coordinate sorting for reading order
* Dedicated table pipeline for tables only
* Percentage-based responsive overlay positioning
* Multi-stage Docker builds reducing image size

### 21. Measurable Results - Performance improvements (%)

* Reduced processing time from 15–20 min manual work to seconds/minutes automated
* Supported PDFs up to 50MB / 20 pages
* Prevented OOM crashes using memory controls
* Improved OCR accuracy via upscale preprocessing
* Enabled 300-second processing windows without timeout
* 100% private on-prem inference

### 22. Business Impact - Client-side benefits

* Built proprietary document AI IP
* Opened enterprise markets needing privacy compliance
* Enabled SaaS pricing tiers and monetization
* Reduced manual operational costs
* Enabled non-technical users to create extraction templates

### 23. Architecture Summary - High-level system design

Frontend (Next.js) handles UI, uploads, workflows, AI chat. Backend (FastAPI) runs OCR and extraction pipelines. MongoDB stores history and schemas. Supabase manages auth and credits. AWS S3 + CloudFront store and serve assets. Dockerized deployment across environments.

### 24. Scalability Improvements - Scaling/performance enhancements

* Streaming responses instead of full buffering
* Page-by-page PDF processing
* Threaded CPU-bound inference
* Parallel uploads to S3
* Configurable limits via environment variables
* Smaller Docker runtime images
* Frontend API proxying
* Extensible modular workflow engine
