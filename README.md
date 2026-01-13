# Zerodha Clone – MERN Stack

A simplified Zerodha-like trading platform built using the MERN stack.  
This project demonstrates full-stack development concepts such as authentication, wallet management, stock trading, and order handling.

> This is an educational project built for learning and interview preparation (TCS Prime).

---

 Features

- User Signup & Login (JWT Authentication)
- Secure API routes using middleware
- Wallet system (add / withdraw funds)
- Market Buy & Sell orders
- Limit orders support
- Holdings tracking
- Order history
- Real-time balance updates
- Clean React-based UI

---

Tech Stack

Frontend
- React
- Axios
- CSS

Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (JSON Web Tokens)

---

Project Structure

zerodha-clone/
├── backend/
│ ├── src/
│ │ ├── models/
│ │ ├── controllers/
│ │ ├── routes/
│ │ ├── middleware/
│ │ └── scripts/
│ ├── server.js
│ └── package.json
│
└── frontend/
├── src/
│ ├── pages/
│ ├── services/
│ └── App.js
└── package.json


---

## 🔐 Authentication Flow

1. User signs up using email & password
2. User logs in
3. Backend generates a JWT token
4. Token is stored in browser localStorage
5. Token is sent in headers for protected routes

---

## 💰 Trading Flow

1. New user starts with ₹0 wallet balance
2. User adds money to wallet (simulated bank transfer)
3. User places Buy/Sell orders
4. Holdings update after successful trades
5. Order history is maintained

---

How to Run Locally

Backend Setup
```bash
cd backend
npm install
npm run dev

Frontend Setup
cd frontend
npm install
npm start

http://localhost:3000
http://localhost:5000


---

STEP 3: Commit README

After saving `README.md`, run:

```bash
git add README.md
git commit -m "Add project README"
git push


