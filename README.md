# ambulance-dispatch-system
A full-stack Ambulance Dispatching System for managing emergency requests, ambulance allocation, driver tracking, and real-time dispatch using Spring Boot, PostgreSQL, and React.
# 🚑 Ambulance Dispatching System

## 📌 Overview

The Ambulance Dispatching System is a full-stack web application designed to streamline emergency medical transportation by connecting patients, dispatchers, ambulance drivers, and administrators. The system enables efficient ambulance allocation, real-time status updates, and secure management of emergency requests.

## 🎯 Objectives

* Provide quick and efficient ambulance dispatch.
* Reduce emergency response time.
* Manage ambulance availability and driver assignments.
* Enable secure authentication and role-based access.
* Maintain accurate records of emergency requests and trips.

## ✨ Features

### 👤 Patient

* Register and log in securely.
* Request an ambulance.
* Track request status.
* View request history.

### 🎧 Dispatcher

* View incoming emergency requests.
* Assign the nearest available ambulance.
* Monitor active trips.
* Update request status.

### 🚑 Driver

* Receive dispatch notifications.
* Accept or reject assignments.
* Update trip status.
* Share live location (future enhancement).

### 👨‍💼 Administrator

* Manage users.
* Manage ambulances.
* Manage drivers.
* View reports and system statistics.

## 🛠️ Technology Stack

### Backend

* Java
* Spring Boot
* Spring Security
* JWT Authentication
* Spring Data JPA (Hibernate)

### Database

* PostgreSQL

### Frontend

* React.js

### Tools

* Git
* GitHub
* Maven
* Postman
* IntelliJ IDEA / Eclipse
* VS Code

## 📂 Project Structure

```text
ambulance-dispatch-system/
│
├── backend/
├── frontend/
├── database/
├── docs/
├── README.md
└── .gitignore
```

## 🔄 Workflow

1. Patient submits an emergency request.
2. Dispatcher reviews the request.
3. System identifies an available ambulance.
4. Dispatcher assigns the ambulance.
5. Driver accepts the assignment.
6. Driver reaches the patient and starts the trip.
7. Trip is completed and the request is closed.

## 🔐 Security

* JWT Authentication
* Role-Based Access Control (RBAC)
* Password encryption using BCrypt
* Input validation
* Secure REST APIs

## 🚀 Future Enhancements

* GPS-based nearest ambulance detection
* Real-time tracking with WebSockets
* Push notifications
* SMS alerts
* Hospital integration
* Analytics dashboard

## 👥 Team

* Member 1 – Authentication & User Management
* Member 2 – Ambulance & Driver Management
* Member 3 – Dispatch & Emergency Request Management

## 📄 License

This project is developed for learning, academic, and portfolio purposes.

