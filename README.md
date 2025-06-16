# Amplify + Next.js + PostgreSQL Demo

This is a demo project built using **Next.js (App Router)**, **AWS Amplify Gen 2**, and **PostgreSQL**.

🧪 This version has no functionality yet, but the UI is deployed using the correct stack configuration to demonstrate development readiness and direction.

- 🔗 **Live Demo**: https://develop.d84z9t521k7je.amplifyapp.com/
- 📝 **Architecture & Scaling Plan (Notion)**: https://www.notion.so/Architecture-214748681a4c80159b25d811122ed35c

---

## 🛠️ Tech Stack

- **Next.js (App Router)**
- **AWS Amplify Gen 2**
  - Amplify Hosting (Lambda@Edge for SSR)
  - Amplify Functions (Lambda API)
  - Cognito (planned, for auth)
- **PostgreSQL** (via Prisma)
- **shadcn/ui** (for custom, accessible UI)

---

## 📐 Architecture Overview

- **SSR** is handled by **Lambda@Edge**, triggered by Next.js `app/` pages.
- **API logic** is defined under `amplify/functions/*`, delegating to shared logic in `/src`.
- **Database access** is only performed from Lambda (not from Lambda@Edge), ensuring VPC-compatible secure access to **PostgreSQL**.
- **Auth** will be handled by **Cognito** via Amplify UI components, distinguishing between **customer** and **partner** roles.

---

## 🚀 Planned Scaling Strategy

To support future growth from small to mid-scale, the project is designed to evolve with:

- Introduction of **Inversify.js** for class-based dependency injection in backend logic
- Implementation of **unit/integration tests** across both frontend and backend
- Integration of **batch processing** using AWS Lambda and **scheduled execution** via EventBridge
- Optional **server-side caching** with DynamoDB for non-real-time, high-read data

---

## ⚠️ Note

This project was built in a short timeframe (weekend) after the interview to demonstrate:

- My understanding of the required tech stack
- Ability to quickly adapt to new technologies
- Direction for scalable architecture and team-ready development

Thank you for reviewing!
