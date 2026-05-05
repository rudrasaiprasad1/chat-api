# Chat API Backend

Production-ready backend built with **Node.js**, **Express**, **TypeScript**, **MySQL**, JWT authentication, and Firebase notifications.

---

# Tech Stack

- Node.js
- Express.js
- TypeScript
- MySQL
- JWT Auth
- PM2 (Production Process Manager)
- Nginx (Recommended Reverse Proxy)
- Firebase Admin SDK

---

# Project Structure

/backend
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── server.ts
│
├── dist/               # generated after build
├── .env
├── package.json
├── tsconfig.json

---

# Local Development Setup

## 1. Install Dependencies

```bash
npm install