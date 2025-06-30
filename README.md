# 🚀 Web Push Notifications with Node.js + MySQL

This project demonstrates how to implement Web Push Notifications with:
- Node.js + Express
- Service Workers for browser push
- MySQL for storing subscriptions
- Environment configuration with `.env`

---

## 📦 Features

✅ Automatic subscription storage in MySQL  
✅ Manual and programmatic push notification sending  
✅ Database migration script  
✅ Environment-based configuration

---

## ⚙️ Prerequisites

- Node.js (v16 or higher recommended)
- MySQL server

---

## 📂 Installation

1. **Clone the repo:**
   ```bash
   git clone https://github.com/yourusername/yourproject.git
   cd yourproject
````

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure database:**

   Create a `.env` file in your project root:

   ```ini
   MYSQL_HOST=localhost
   MYSQL_USER=root
   MYSQL_PASSWORD=mysql
   MYSQL_DB=webpush
   ```

---

## 🗄️ Database Migration

Run the migration script to create the database and table:

```bash
npm run migrate
```

This will:
✅ Connect to your MySQL server
✅ Create the database if it doesn’t exist
✅ Create the `push_subscriptions` table if it doesn’t exist

---

## 🚀 Running the Server

Start your server with:

```bash
npm start
```

Your app will be available at [http://localhost:8001](http://localhost:8001).

---

## 🖥️ Testing Push Notifications

1. Open your browser at [http://localhost:8001](http://localhost:8001)
2. Allow notifications when prompted
3. Your browser will subscribe automatically and send the subscription to the server
4. To send a manual notification, run:

   ```bash
   curl -X POST http://localhost:8001/send
   ```

---

## 🗃️ Project Scripts

* `npm run migrate` — Run database migration script
* `npm start` — Start the server

---

## 📁 Project Structure

```
.
├── client/
│   ├── index.html
│   ├── client.js
│   └── worker.js
├── db.js
├── migrate.js
├── index.js
├── .env
└── package.json
```

---

## 🔐 Security Notes

* Browsers require HTTPS for push notifications in production.
* For local development, `localhost` is considered a secure context.
* Add `.env` to your `.gitignore` to avoid committing sensitive credentials.

---

## 📄 License

MIT

---

🎉 **Happy coding!**

```

---
