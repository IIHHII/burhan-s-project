# Northcoders News API

## Setup Instructions

### Prerequisites
- **Node.js** (v16+) and **npm**
- **PostgreSQL** installed and running

### Installation
1. Clone the repo and navigate to the directory:
   git clone <your-repo-url>
   cd <project-directory>
2. Install dependencies:
   npm install

### Environment Variables
Create the following `.env` files in the project root:
- **`.env.development`**:
   PGDATABASE=nc_news_dev
- **`.env.test`**:
   PGDATABASE=nc_news_test

### Database Setup
1. Create databases:
   CREATE DATABASE nc_news_dev;
   CREATE DATABASE nc_news_test;
2. Set up tables:
   npm run setup-dbs
3. Seed development database:
   npm run seed

---

## Running Tests
Run tests using:
npm test

---

## Notes
- Ensure `.env` files are in place before running the project.
- `.env` files are ignored by Git and should not be shared publicly.

---