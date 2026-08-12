# ChatRoom

A real-time chat application built with the MERN stack that enables users to communicate through instant messaging with real-time updates powered by Socket.io.

## 🚀 Features

* 🔐 User authentication
* 👤 User-based chat functionality
* 💬 Real-time messaging
* ⚡ Real-time communication using Socket.io
* 🔒 Protected application functionality
* 🌐 RESTful backend APIs
* 🗄️ MongoDB database integration
* 📱 Responsive user interface
* 🔄 Real-time frontend and backend communication
* 👥 Group conversations
* ✍️ Typing indicators
*  ✓ Message delivery/read status
* 🟢 Online/offline user status

## 🛠️ Tech Stack

### Frontend

* React.js
* JavaScript
* HTML5
* CSS3
* Axios

### Backend

* Node.js
* Express.js
* Socket.io
* REST APIs
* JWT Authentication

### Database

* MongoDB
* Mongoose

### Tools

* Git
* GitHub
* Postman
* VS Code

## 🏗️ Architecture

```text
                    ┌─────────────────┐
                    │   React Client  │
                    └────────┬────────┘
                             │
                    HTTP / REST APIs
                             │
                             ▼
                    ┌─────────────────┐
                    │ Express Server  │
                    └────────┬────────┘
                             │
                    ┌────────┴────────┐
                    │                 │
                    ▼                 ▼
              ┌───────────┐     ┌───────────┐
              │  MongoDB  │     │ Socket.io │
              └───────────┘     └─────┬─────┘
                                      │
                                      ▼
                              Real-Time Messages
```

## 🔐 Authentication

ChatRoom uses authentication to protect user-specific functionality.

JWT-based authentication is used to securely verify users and control access to protected resources.

## ⚡ Real-Time Communication

Socket.io is used to establish real-time communication between connected users.

Instead of continuously refreshing the application, messages can be delivered through a persistent real-time connection, providing a smoother chat experience.

## 🗄️ Database

MongoDB is used as the primary database, with Mongoose providing schema-based data modeling and interaction with the database.

The backend is responsible for managing and retrieving application data through RESTful APIs.

## 📂 Project Structure

```text
ChatRoom/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── socket/
│   ├── utils/
│   └── server.js
│
└── README.md
```

> Update the structure above if your actual folder names are different.

## ⚙️ Getting Started

### Prerequisites

Make sure you have the following installed:

* Node.js
* npm
* MongoDB
* Git

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/chatroom.git
```

### 2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 3. Install Backend Dependencies

Open another terminal:

```bash
cd backend
npm install
```

### 5. Run the Backend

```bash
cd backend
npm run dev
```

### 6. Run the Frontend

Open another terminal:

```bash
cd frontend
npm run dev
```

The application should now be available at your local frontend development URL.

## 🔄 Application Flow

```text
User
  │
  ▼
Register / Login
  │
  ▼
Authentication
  │
  ▼
Chat Interface
  │
  ├───────────────► API
  │
  └───────────────► Socket.io
                         │
                         ▼
                   Real-Time Message
                         │
                         ▼
                    Other User
```

## 🎯 Project Highlights

This project demonstrates practical experience with:

* Full-stack MERN development
* Real-time web communication
* WebSocket-based communication using Socket.io
* JWT authentication
* REST API development
* MongoDB database management
* Frontend-backend integration
* Client-server communication
* Authentication and protected resources
* Handling CORS in a full-stack application

## 🌐 Live Demo

🔗 **Live Demo:** https://chatroom-web-pi.vercel.app/

## 📁 Repository

🔗 **GitHub Repository:** https://github.com/Unknown8765-ak/chatroom-web

## 🔮 Future Improvements

Some potential improvements for future versions:

* 📎 File and image sharing
* 🔔 Notifications
* 🔍 Message search
* 🗑️ Message management

## 👨‍💻 Author

**Your Name** Amit Maurya

Full-Stack Developer | React.js | Next.js | Node.js | MongoDB

* 💻 GitHub: Add your GitHub profile
* 💼 LinkedIn: Add your LinkedIn profile
* 🌐 Portfolio: Add your portfolio

---

⭐ If you found this project interesting, consider giving it a star!

**Built with ❤️ using the MERN Stack + Socket.io**
