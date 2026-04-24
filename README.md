E-Commerce Full Stack Project
📁 Project Structure
ecommerce-project/
 ├── backend/
 ├── frontend/
⚙️ Tech Stack
Backend: NestJS, Node.js, JWT, REST API
Frontend: Angular / React
🚀 Run Project
Backend
cd backend
npm install
npm run start:dev
Frontend
cd frontend
npm install
npm start
🔐 Auth Header
Authorization: Bearer <JWT_TOKEN>
📦 API Endpoints
Auth
POST /auth/register
POST /auth/login
Users
GET /users/profile
PATCH /users/change-password
Addresses
POST /addresses
GET /addresses
GET /addresses/:id
PATCH /addresses/:id
DELETE /addresses/:id
PATCH /addresses/:id/default
⚠️ Notes
Backend runs on http://localhost:3000
Frontend runs separately
JWT required for protected routes