# Northcoders News API

## Setup Instructions

### Prerequisites
- **Node.js** (v16+) and **npm**
- **PostgreSQL** installed and running

### Installation
1. Clone the repo and navigate to the directory:
   ```bash
   git clone <your-repo-url>
   cd <project-directory>
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Environment Variables
Create the following `.env` files in the project root:
- **`.env.development`**:
   ```
   PGDATABASE=nc_news_dev
   ```
- **`.env.test`**:
   ```
   PGDATABASE=nc_news_test
   ```

### Database Setup
1. Create databases:
   ```sql
   CREATE DATABASE nc_news_dev;
   CREATE DATABASE nc_news_test;
   ```
2. Set up tables:
   ```bash
   npm run setup-dbs
   ```
3. Seed development database:
   ```bash
   npm run seed
   ```

---

## Running Tests
Run tests using:
```bash
npm test
```

---

## Notes
- Ensure `.env` files are in place before running the project.
- `.env` files are ignored by Git and should not be shared publicly.

---