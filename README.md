# Shopping App

A full-stack shopping list application with user authentication, list and item management, and analytics. The frontend (EJS + Express) talks to a REST API backed by MySQL.

## Tech Stack

| Layer | Stack |
|-------|--------|
| **Frontend** | Node.js, Express, EJS, Axios, express-session |
| **API** | Node.js, Express 5, MySQL2, bcrypt |
| **Database** | MySQL / MariaDB |

## Project Structure

```
CSC7083_WebDev_ShoppingApp/
├── Shopping/                 # Frontend app (port 3000)
│   ├── app.js
│   ├── routes/
│   ├── controllers/
│   ├── views/                # EJS templates
│   └── package.json
├── ShoppingAPI/              # Backend API (port 3002)
│   ├── app.js
│   ├── routes/
│   ├── controllers/
│   ├── utils/
│   ├── database/             # SQL schema
│   └── package.json
└── README.md
```

## Features

- **Auth**: Register, login, logout (session-based)
- **Lists**: Create, edit, delete shopping lists; view lists per user
- **Items**: Add, edit, delete items on a list (name, quantity, category, notes, purchase status)
- **Analytics**: Stats view (driven by `/stats/:userId`)

## Prerequisites

- **Node.js** (v18+ recommended)
- **MySQL** or **MariaDB** (e.g. XAMPP, MAMP, or standalone)

## Setup

### 1. Database

1. Create a MySQL database (e.g. `CSC7084_shopping_app` or your preferred name).
2. Import the schema:

   ```bash
   mysql -u your_user -p your_database < ShoppingAPI/database/CSC7084_shopping_app.sql
   ```

   Or run the SQL in `ShoppingAPI/database/CSC7084_shopping_app.sql` via phpMyAdmin / MySQL Workbench.

### 2. Environment Variables

**ShoppingAPI/.env** (required for the API):

```env
PORT=3002
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASS=your_mysql_password
DB_NAME=your_database_name
DB_PORT=3306
```

**Shopping/.env** (optional; defaults used if omitted):

```env
PORT=3000
```

If the frontend calls the API by URL, you may also need something like `API_BASE_URL=http://localhost:3002` in `Shopping/.env` if that’s how the app is configured.

### 3. Install Dependencies

```bash
# API
cd ShoppingAPI
npm install

# Frontend
cd ../Shopping
npm install
```

### 4. Run the Application

Start the **API first**, then the frontend (each in its own terminal).

**Terminal 1 – API**

```bash
cd ShoppingAPI
npm start
```

**Terminal 2 – Frontend**

```bash
cd Shopping
npm start
```

Both use **nodemon**, so they reload on file changes.

Open **http://localhost:3000** in your browser to use the app.

## API Overview

| Base | Method | Path | Description |
|------|--------|------|-------------|
| `/users` | POST | `/register` | Register user |
| `/users` | POST | `/login` | Login |
| `/lists` | POST | `/` | Create list |
| `/lists` | GET | `/user/:userId` | Get all lists for user |
| `/lists` | GET | `/:id` | Get list by id |
| `/lists` | PUT | `/:id` | Update list |
| `/lists` | DELETE | `/:id` | Delete list |
| `/items` | POST | `/` | Create item |
| `/items` | GET | `/list/:listId` | Get items for list |
| `/items` | GET | `/:id` | Get item by id |
| `/items` | PUT | `/:id` | Update item |
| `/items` | DELETE | `/:id` | Delete item |
| `/stats` | GET | `/:userId` | Get user stats |

## License

ISC
