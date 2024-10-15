# Genius Plus Server 🛠️

**Genius Plus Server** is the backend API powering the Genius Plus AI application for students. It handles authentication, task management, AI integration, database management, and more. The backend is built with Express, TypeScript, PostgreSQL, and uses Drizzle ORM for database operations.

---

## 🚀 Features

- **Authentication**: JWT-based authentication and password hashing with bcrypt 🔐
- **Task Management**: Create, update, delete, and rearrange to-do items 📝
- **AI Integration**: Provides APIs for text-to-speech, speech-to-text, and image generation based on prompts 💡
- **Database Management**: Uses Drizzle ORM and PostgreSQL for efficient data handling 🗄️
- **Email Notifications**: Uses Nodemailer for sending email notifications 📧

---

## 💻 Tech Stack

- **Server**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL (using @vercel/postgres and Drizzle ORM)
- **Authentication**: JWT, bcrypt
- **Logging**: Winston, Daily Rotate File
- **Cloud Services**: Cloudinary for image management, OpenAI API for AI features
- **Environment Management**: dotenv for environment variables

---

## 📦 Installation & Setup

### 1️⃣ Clone the repository:

```bash
git clone https://github.com/yourusername/genius-plus-server.git
```

### 2️⃣ Install dependencies:

```bash
cd genius-plus-server
bun install
```

### 3️⃣ Setup environment variables:

Create a `.env` file at the root of the project and add the necessary environment variables (e.g., database credentials, JWT secrets, OpenAI API keys, etc.). Follow the `.env.example` file for reference.

### 4️⃣ Run database migrations:

```bash
bun db:migrate
```

### 5️⃣ Start the development server:

```bash
bun run dev
```

The server will be running at `http://localhost:5000`. or at the port you specified in the .env file.

---

## 🛠️ Available Scripts

- **Development**: `bun run dev`
- **Production**: `bun run start`
- **Build**: `bun run build`
- **Linting**: `bun run lint` and `bun run lint:fix`
- **Prettier Formatting**: `bun run prettier`
- **Database Migrations**: `bun run db:migrate`
- **Generate Database Schema**: `bun run db:generate`
- **Open Drizzle Studio**: `bun run db:studio`

---

## ⚠️ Ongoing Development

This backend API is part of the **Genius Plus** project and is still under active development 🚧. New features and improvements are being added regularly. You may encounter **bugs** or incomplete features. Thank you for your patience!

---

## 🌟 Contributing

We welcome contributions! Feel free to submit issues, fork the repo, or open pull requests. Please ensure to run linting and formatting before submitting any changes.

---

## 📧 Contact

For any questions or support, reach out at [naeemhasan28@gmail.com](mailto:naeemhasan28@gmail.com).

---

Stay tuned for updates! 🎉
