# Cattleya Gardenia — Admin Dashboard

A web-based administration dashboard for managing an online gardening and landscaping business: products, orders, customers, reviews, and sales analytics.

## Overview

This dashboard is the back-office of **Cattleya Gardenia**, a platform for landscaping services and gardening product sales. It gives administrators a single interface to manage the catalog, track orders, moderate reviews, and monitor business performance through charts and KPIs.

## Features

- **Dashboard & Analytics** — sales KPIs, monthly trends, category distribution, top products
- **Product Management** — add, edit, delete products with images, prices and stock
- **Order Management** — order tracking, status distribution, daily orders, order details
- **User Management** — customer accounts and roles (admin, specialist, client)
- **Review Moderation** — publish or delete customer reviews
- **Weather-Based Planning** — intervention feasibility using the OpenWeatherMap API, with customer e-mail notification

## Tech Stack

| Layer | Technology |
|---|---|
| Front-end | React, Vite, Tailwind CSS |
| Back-end | PHP |
| API | Python, Flask |
| Database | MySQL |
| Local server | XAMPP |

## Project Structure

```text
admin-dashboard/
├── ADMIN_DASHBOARD_backend/   # PHP endpoints (CRUD operations)
├── flask_api/                 # Flask API (weather analysis)
├── export_data/               # Exported datasets
├── public/                    # Static assets
├── src/                       # React application
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

## Installation

**Prerequisites:** Node.js, XAMPP, Python 3.9+

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/admin-dashboard.git
cd admin-dashboard

# 2. Install front-end dependencies
npm install

# 3. Install Flask dependencies
cd flask_api
pip install -r requirements.txt
```

**Database & back-end**

1. Start Apache and MySQL in XAMPP.
2. Create a MySQL database and import the SQL file.
3. Copy `ADMIN_DASHBOARD_backend/` into `htdocs/` and set your credentials in `db_config.php`.

## Usage

```bash
# Start the Flask API
cd flask_api
python app.py

# Start the front-end (from the project root)
npm run dev
```

