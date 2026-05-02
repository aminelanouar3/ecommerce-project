📦 E-Commerce Backend API (NestJS + Stripe + PostgreSQL)

A full-featured e-commerce backend API built with NestJS, TypeORM, PostgreSQL, and Stripe.
It supports authentication, cart, orders, payments, email notifications, and admin management.

🚀 Features
🔐 Authentication
User registration & login
JWT authentication
Password reset (forgot / reset password)
Role-based access (USER / ADMIN)
👤 User Management
Get profile
Change password
🏠 Address System
Create / update / delete addresses
Get user addresses
Set default address
🛍 Product Management
Public product listing
Admin CRUD (create / update / delete products)
🛒 Cart System
Add to cart
Update quantity
Remove items
View cart
📦 Orders System
Create order (checkout)
View user orders
Order lifecycle management
Order Status Flow
PENDING → PAID → PROCESSING → SHIPPED → DELIVERED
                    ↓
                 CANCELLED
💳 Stripe Payment Integration
Stripe Checkout session
Secure payment flow
Webhook handling
Payment status tracking
📧 Email Notifications
Forgot password email
Order status updates (e.g. shipped)
🔐 Admin Features
View all orders
Update order status
Product management
🧱 Tech Stack
NestJS
TypeORM
PostgreSQL
Stripe API
JWT Authentication
Nodemailer (email service)
📁 Project Structure
src/
│
├── auth/         # Authentication module
├── users/        # User management
├── products/     # Product module
├── cart/         # Cart module
├── orders/       # Orders module
├── payment/      # Stripe integration + webhook
├── mail/         # Email service
└── main.ts
⚙️ Installation
git clone https://github.com/your-username/ecommerce-backend.git
cd ecommerce-backend
npm install
🔐 Environment Variables

Create a .env file:

DATABASE_URL=your_postgres_url

JWT_SECRET=your_jwt_secret

STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

PORT=3000
▶️ Running the Project
Development
npm run start:dev
Production
npm run build
npm run start:prod
💳 Stripe Webhook Setup (Local Testing)

Install Stripe CLI:

stripe login

Start webhook listener:

stripe listen --forward-to localhost:3000/payment/webhook
📡 API Endpoints
Auth
POST /auth/register
POST /auth/login
POST /auth/forgot-password
POST /auth/reset-password
Users
GET  /users/profile
PATCH /users/change-password
Addresses
POST   /addresses
GET    /addresses
PATCH  /addresses/:id
DELETE /addresses/:id
PATCH  /addresses/:id/default
Products
GET    /products
POST   /products        (ADMIN)
PATCH  /products/:id    (ADMIN)
DELETE /products/:id    (ADMIN)
Cart
POST   /cart
GET    /cart
PATCH  /cart/:id
DELETE /cart/:id
Orders
POST /orders
GET  /orders
Admin Orders
GET  /orders/admin
PATCH /orders/admin/:id/status
Payment (Stripe)
POST /payment/:orderId
GET  /payment/status/:id
POST /payment/webhook
PATCH /payment/cancel/:id
🔄 Payment Flow
1. User creates order
2. Calls /payment/:orderId
3. Backend creates Stripe session
4. User pays on Stripe checkout
5. Stripe webhook notifies backend
6. Order is updated:
   - PAID
   - PROCESSING
7. Stock is updated
8. Email is sent
🛡 Security
JWT authentication
Role-based access control (ADMIN / USER)
Stripe webhook signature verification
Protected admin routes
📧 Email System

Triggered events:

Password reset email
Order shipped notification
🚀 Future Improvements
Real-time order updates (WebSockets)
Invoice generation (PDF)
Analytics dashboard (admin stats)
Docker deployment
Frontend integration (Angular/React)
👨‍💻 Author

Built as a full-stack learning project to master:

Backend architecture (NestJS)
Payment systems (Stripe)
E-commerce workflows
Authentication & security
