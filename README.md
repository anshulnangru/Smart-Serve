# 🛠️ SmartServe – Home Services Marketplace Platform

SmartServe is a full-stack service marketplace platform that connects customers with verified service providers for various home and professional services.

Inspired by platforms like Urban Company, SmartServe allows users to discover services, book appointments, manage bookings, provide ratings and reviews, and interact with trusted professionals through a seamless digital experience.

---

## 🚀 Project Overview

Finding reliable professionals for home and personal services can be challenging. SmartServe simplifies this process by providing a centralized platform where customers can browse services, compare providers, and book appointments online.

The platform supports multiple user roles, secure authentication, booking management, service listings, and provider profiles, making it a complete service marketplace solution.

---

## ✨ Features

### 👤 User Features

* User Registration & Login
* JWT-Based Authentication
* Browse Available Services
* Search & Filter Providers
* Book Services Online
* Manage Bookings
* View Service History
* Submit Ratings & Reviews
* Update User Profile

### 🔧 Service Provider Features

* Provider Registration
* Service Listing Management
* Availability Management
* Booking Requests
* Earnings Tracking
* Profile Management

### 🛡️ Admin Features

* User Management
* Provider Verification
* Service Category Management
* Booking Monitoring
* Platform Analytics

---

## 🏗️ System Architecture

```text
Client (React Frontend)
           │
           ▼
      FastAPI Backend
           │
           ▼
 Authentication Layer
           │
           ▼
 Business Logic Layer
           │
           ▼
      PostgreSQL Database
```

---

## 🛠️ Tech Stack

### Frontend

* React.js
* JavaScript
* HTML5
* CSS3
* Axios
* React Router

### Backend

* FastAPI
* Python
* SQLAlchemy
* JWT Authentication
* Pydantic

### Database

* PostgreSQL

### Development Tools

* Git
* GitHub
* VS Code
* Postman

---

## 🔐 Authentication & Security

SmartServe uses JWT (JSON Web Tokens) for secure authentication.

Features include:

* Secure Login System
* Password Hashing
* Protected Routes
* Role-Based Authorization
* Session Management

---

## 📋 Project Workflow

### Customer Flow

```text
Register/Login
      │
      ▼
Browse Services
      │
      ▼
Select Provider
      │
      ▼
Book Service
      │
      ▼
Service Completion
      │
      ▼
Rate & Review
```

### Provider Flow

```text
Register
      │
      ▼
Create Profile
      │
      ▼
Add Services
      │
      ▼
Receive Bookings
      │
      ▼
Complete Service
      │
      ▼
Manage Reviews
```

---

## 📂 Project Structure

```text
SmartServe/
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── assets/
│
├── backend/
│   ├── app/
│   ├── routers/
│   ├── models/
│   ├── schemas/
│   ├── database/
│   ├── auth/
│   └── services/
│
├── requirements.txt
├── package.json
└── README.md
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/anshulnangru/Smart-Serve.git
cd Smart-Serve
```

### Backend Setup

```bash
cd backend

pip install -r requirements.txt

uvicorn main:app --reload
```

### Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

## 🌟 Key Functionalities

### Service Discovery

Users can browse multiple service categories such as:

* Home Cleaning
* Electrical Repairs
* Plumbing
* Beauty Services
* Appliance Repair
* Carpentry
* Painting

### Booking System

* Real-time service booking
* Appointment scheduling
* Booking status tracking
* Service history

### Reviews & Ratings

* Customer feedback system
* Provider ratings
* Service quality evaluation

---

## 📊 Future Enhancements

* Online Payment Integration
* Live Chat System
* Real-Time Notifications
* AI-Based Service Recommendations
* Google Maps Integration
* Mobile Application
* Provider Analytics Dashboard

---

## 🎯 Learning Outcomes

Through this project I learned:

* Full Stack Development
* REST API Development
* FastAPI Framework
* React Application Development
* JWT Authentication
* Database Design
* API Integration
* State Management
* Software Architecture
* Client-Server Communication

---

## 💼 Resume Highlights

This project demonstrates:

* Full Stack Development Skills
* Authentication & Authorization
* Backend API Development
* Frontend UI Development
* Database Integration
* Real-World Software Engineering Practices

---

## 👨‍💻 Author

**Anshul Nangru**

BCA Student | Full Stack Developer | Machine Learning Enthusiast

GitHub: https://github.com/anshulnangru

---

## ⭐ Support

If you found this project useful, consider giving the repository a ⭐ on GitHub.
