# ShopEasy

ShopEasy is a full-stack food ordering system with a Django REST backend and a React + Vite frontend.

## What it does

- Browse menu items with images, prices, descriptions, and categories
- Add items to cart and place orders
- Log in and manage user profile and order history
- Choose payment method, including online payment or cash on delivery
- Track order status
- Use an admin dashboard to manage products, collections, images, and orders
- Support English and Arabic

## Tech Stack

### Backend

- Django 6.0.1
- Django REST Framework
- Djoser and SimpleJWT for authentication
- MySQL database
- Redis for cache and Celery broker
- WhiteNoise, CORS, Debug Toolbar, and Django Filter

### Frontend

- React 19
- Vite
- React Router
- Custom language context for English and Arabic
- Component-based UI with a dedicated admin folder

## Architecture

- The backend is organized as a Django API with separate apps for store, core, tags, and likes.
- Authentication is token-based with JWT.
- The frontend is a single-page app that uses shared contexts for auth, cart, and language.
- The admin dashboard is split into its own folder under `ShopEasy-front/src/pages/admin/` so it is easier to debug and extend.

## Optimizations

- Pagination is used for long product, collection, and order lists.
- Search inputs help narrow large admin lists quickly.
- Product images can be added, replaced, and removed without leaving the dashboard.
- Backend caching is configured through Redis.
- Frontend builds are optimized with Vite.

## Setup

### Requirements

- Python 3.12+
- Node.js 18+
- MySQL
- Redis

### Backend setup

```bash
cd ShopEasy-Api
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Update the database settings in `ShopEasy-Api/config/settings/dev.py` if your MySQL user, password, or host are different.

### Frontend setup

```bash
cd ShopEasy-front
npm install
npm run dev
```

### Build frontend

```bash
cd ShopEasy-front
npm run build
```

## Project READMEs

- Backend notes: `ShopEasy-Api/README.md`
- Frontend notes: `ShopEasy-front/README.md`