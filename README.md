# 🗳️ Polls & Voting MERN App

A full-stack web application where users can create, vote on, and view real-time polls. Built with the MERN stack and deployed on Render and Vercel.

**Live Demo:** [https://mern-polls-app-git-main-abhishek-0d1fe040.vercel.app/](https://mern-polls-app-git-main-abhishek-0d1fe040.vercel.app/)

---

## Preview

![Polls App Screenshot](https://github.com/user-attachments/assets/e4c5ee01-f18c-4e53-b75a-81007cc53882)


---

## ✨ Features

* **User Authentication:** Secure user registration and login using JSON Web Tokens (JWT).
* **Poll Creation:** Authenticated users can create polls with custom questions and multiple options.
* **Real-time Voting:** Users can cast a vote on any poll, with results updated instantly.
* **One-Vote-Per-User Rule:** The backend enforces a strict one-vote-per-user, per-poll policy.
* **Dynamic Results:** View poll results with vote counts and percentage bars.
* **Ownership Control:** Users can delete polls that they have created.
* **Fully Responsive:** A clean and modern UI built with Tailwind CSS that works on all devices.

---

## 🛠️ Tech Stack

* **Frontend:** React.js, Tailwind CSS, React Router, Axios, Context API
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (with Mongoose)
* **Authentication:** JSON Web Tokens (JWT), bcryptjs
* **Deployment:** Backend on **Render**, Frontend on **Vercel**

---

## 🚀 Setup and Installation

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
    cd your-repo-name
    ```
2.  **Setup Backend:**
    ```bash
    cd backend
    npm install
    # Create a .env file with MONGO_URI, PORT, and JWT_SECRET
    npm run server
    ```
3.  **Setup Frontend:**
    ```bash
    cd frontend
    npm install
    # Create a .env.local file with VITE_API_URL
    npm run dev
    ```