## Project Case Study Submission – PrometheanTech

## 1. Project Name

Legit (News Platform – Backend)

## 2. Employee Name

Yash Mahajan

## 3. Role

Backend Developer (Node.js)

## 4. Project Duration

Apr 2024 – May 2024

## 5. Industry

Digital Media / News

## 6. Client Name Allowed

Legit (Naij.com Media Limited)

## 7. Problem Statement

The rapid spread of misinformation and fake news across digital platforms has created a major trust gap in online news consumption. Users often rely on multiple sources to verify claims, compare narratives, and identify credible reporting, making the process fragmented and time-consuming. Existing news applications primarily focus on content aggregation, while fact-checking platforms operate separately with limited real-time accessibility.

The client required a unified, scalable backend platform that could automatically ingest news from multiple trusted sources, intelligently categorize articles, deliver personalized feeds, and provide an AI-powered conversational interface for instant claim verification. The platform also needed secure authentication with both email/password and Google OAuth support to ensure seamless user onboarding and retention.

## 8. Project Objective

Build a production-ready Node.js REST API backend to power the Legit mobile application with an intelligent, secure, and scalable news ecosystem.

- Automated hourly ingestion of news from multiple RSS sources
- Smart article categorization through configurable keyword intelligence
- AI-powered fact-checking chatbot using GPT-3.5 Turbo
- JWT-based authentication with access and refresh token architecture
- OTP-driven password recovery through email workflows
- Personalized and paginated news feed APIs with category filters
- Trending news ingestion from Google RSS feeds
- Complete user account lifecycle management
- Dockerized deployment for reliable cloud hosting and portability

## 9. Solution Summary

Developed a robust Express.js REST API backend powered by MongoDB (Mongoose ODM), supporting authentication, news delivery, and AI services.

Implemented dual automated ingestion pipelines using node-cron that fetch, parse, deduplicate, categorize, and store articles from multiple RSS feeds every hour.

Integrated OpenAI GPT-3.5 Turbo to enable a conversational fact-checking chatbot for real-time claim verification.

Designed a secure authentication system using JWT access/refresh tokens, bcrypt password hashing, Google OAuth support, and OTP-based password recovery via Office365 SMTP.

Built a dynamic category engine that classifies content using configurable keyword mappings, and containerized the entire application with Docker using non-root security practices for production deployment.

## 10. Key Features

- Dual RSS news ingestion pipelines with hourly automated scheduling (node-cron)
- AI-powered fact-checking chatbot using OpenAI GPT-3.5 Turbo Chat Completions API
- Keyword-based article auto-categorization engine with 13 default categories and database-configurable tags
- JWT authentication with configurable access token expiry and 30-day refresh tokens
- Dual login method support: email/password ("legit") and Google OAuth ("google")
- Password recovery workflow: OTP generation → email delivery → OTP verification → password reset
- Bcrypt password hashing with auto-generated salts
- Paginated news feed API with category-based filtering
- Trending news pipeline from Google News RSS with IST timezone conversion
- Image extraction from article HTML content via regex with fallback thumbnails
- Article deduplication by GUID
- Dynamic category management system
- Account lifecycle management
- Structured JSON logging with Pino
- Docker containerization with non-root user execution

## 11. Frontend Tech

N/A

## 12. Backend Tech

Node.js, Express.js, Mongoose, jsonwebtoken, bcrypt, OpenAI SDK, rss-parser, node-cron, Nodemailer, moment-timezone, Pino.

## 13. Database

MongoDB

## 14. Cloud Platform

AWS

## 15. DevOps Tools

Docker, Bitbucket

## 16. AI/ML Used

Yes

## 17. AI/ML Details

- OpenAI GPT-3.5 Turbo integration for fact-checking chatbot
- Conversational responses using Chat Completions API
- Rule-based keyword categorization engine

## 18. Individual Contribution

- Designed and built complete REST API architecture
- Implemented dual RSS ingestion pipelines
- Built categorization engine
- Developed JWT authentication system
- Built password recovery flow
- Integrated OpenAI chatbot
- Designed MongoDB schemas/models
- Implemented pagination and filtering APIs
- Configured logging and Docker deployment

## 19. Challenges

- Concurrent RSS pipelines without duplicates
- Flexible categorization engine
- Missing article images
- JWT lifecycle management
- OTP recovery flow complexity
- Parsing inconsistent RSS HTML
- Date consistency across pipelines

## 20. Solutions

- GUID-based deduplication checks
- Two-tier category fallback system
- Random image fallback mechanism
- DB-driven token expiry configuration
- Login method aware auth branching
- Regex-based image extraction
- Timezone conversion handling

## 21. Measurable Results

- Automated hourly ingestion with zero manual effort
- 13 production-ready REST APIs delivered
- Reliable duplicate prevention
- Auto-classified articles into 13 categories
- Real-time AI fact-checking enabled
- Dockerized deployment consistency

## 22. Business Impact

- Differentiated platform with AI fact-checking
- Removed manual content curation
- Increased trust and engagement
- Reduced onboarding friction
- Scalable backend foundation created

## 23. Architecture Summary

Monolithic Express.js REST API with modular routes, MongoDB data layer, cron-based ingestion pipelines, JWT auth, OpenAI integration, SMTP recovery flow, structured logging, and Dockerized deployment.

## 24. Scalability Improvements

- Database-driven categories and prompts
- Runtime configurable token expiry
- Modular route architecture
- Centralized error handling
- Docker portability across environments
