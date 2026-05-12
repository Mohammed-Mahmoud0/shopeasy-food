# 🛒 ShopEasy

> A full-stack food ordering platform — browse, order, pay, and track, with a built-in admin dashboard and full Arabic/English support.

---

## ✨ Features

- **Menu browsing** — view items with images, prices, descriptions, and categories
- **Cart & ordering** — add items, choose payment method (online or cash on delivery), and place orders
- **Order tracking** — follow your order status from placement to delivery
- **User accounts** — log in, manage your profile, and view order history
- **Admin dashboard** — manage products, collections, images, and orders
- **Bilingual** — full English and Arabic support via a custom language context

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────┐
│                  Browser / User                      │
└───────────────────────┬──────────────────────────────┘
                        │  HTTP / JWT
┌───────────────────────▼──────────────────────────────┐
│             Frontend  (React 19 + Vite)              │
│  ┌───────────────┐  ┌──────────────┐  ┌──────────┐  │
│  │  Storefront   │  │    Admin     │  │ Contexts │  │
│  │ Menu · Cart   │  │  Dashboard   │  │ Auth     │  │
│  │ Orders        │  │  Products    │  │ Cart     │  │
│  │ Profile       │  │  Orders      │  │ Language │  │
│  └───────────────┘  └──────────────┘  └──────────┘  │
└───────────────────────┬──────────────────────────────┘
                        │  REST API  ·  SimpleJWT
┌───────────────────────▼──────────────────────────────┐
│          Backend  (Django 6 + DRF)                   │
│  ┌────────┐  ┌────────┐  ┌────────┐  ┌───────────┐  │
│  │ store  │  │  core  │  │orders  │  │tags/likes │  │
│  │Products│  │ Users  │  │ Cart   │  │ Tagging   │  │
│  │Collect.│  │  Auth  │  │Payment │  │ Reactions │  │
│  └────────┘  └────────┘  └────────┘  └───────────┘  │
└──────┬───────────────────────────┬────────────────────┘
       │                           │
┌──────▼──────┐  ┌──────────┐  ┌──▼───────┐
│    MySQL    │  │  Redis   │  │  Celery  │
│  Primary DB │  │  Cache + │  │  Async   │
│             │  │  Broker  │  │  Tasks   │
└─────────────┘  └──────────┘  └──────────┘
```

### Django Apps

| App | Responsibility |
|-----|----------------|
| `store` | Products, collections, images, filtering, pagination |
| `core` | User registration, profiles, Djoser + SimpleJWT auth |
| `orders` | Cart, checkout, payment method, order status |
| `tags` | Tagging system shared across entities |
| `likes` | Reaction/like system |

### Frontend Structure

```
ShopEasy-front/src/
├── pages/
│   ├── admin/        # Admin dashboard (isolated for easy extension)
│   └── ...           # Customer-facing pages
├── contexts/         # Auth, Cart, Language providers
└── components/       # Shared UI components
```

---

## 🛠️ Tech Stack

### Backend
| Tool | Purpose |
|------|---------|
| Django 6.0.1 | Web framework |
| Django REST Framework | API layer |
| Djoser + SimpleJWT | Authentication & token management |
| MySQL | Primary relational database |
| Redis | Caching + Celery message broker |
| Celery | Background task processing |
| WhiteNoise | Static file serving |
| django-cors-headers | Cross-origin request handling |
| Django Filter | Query filtering on API endpoints |
| Django Debug Toolbar | Development profiling |
| django-silk | Live request/query profiling & monitoring |
| Locust | Load & performance testing |
| pytest + unittest | Automated test suite |

### Frontend
| Tool | Purpose |
|------|---------|
| React 19 | UI framework |
| Vite | Build tool & dev server |
| React Router | Client-side routing |
| Context API | Auth, cart, and language state |

---

## ⚡ Optimizations

- **Pagination** on all long lists — products, collections, orders
- **Search inputs** in admin views to quickly narrow results
- **Image management** — add, replace, and remove product images without leaving the dashboard
- **Redis caching** on the backend to reduce database load
- **Vite builds** for optimized frontend bundle output

### Query Optimization

N+1 query problems are eliminated throughout the API using Django ORM techniques:

- `select_related()` for forward FK and one-to-one relationships (e.g. order → customer)
- `prefetch_related()` for reverse FK and many-to-many relationships (e.g. products → images, orders → items)
- Queryset-level annotations with `Count()` and `Avg()` to avoid per-object aggregation queries
- `only()` / `defer()` to fetch only the fields each view actually needs

---

## 🔍 Monitoring & Testing

### Silk — Request & Query Profiling

[django-silk](https://github.com/jazzband/django-silk) is enabled in development to profile every incoming request in real time.

```
http://localhost:8000/silk/
```

It records SQL queries per request, execution time, and slow query reports — useful for catching regressions after schema or ORM changes.

### Locust — Performance & Load Testing

[Locust](https://locust.io) load tests live under `ShopEasy-Api/locustfiles/`.

```bash
cd ShopEasy-Api
locust -f locustfiles/locustfile.py
# then open http://localhost:8089
```

Simulates concurrent users hitting the menu, cart, and order endpoints to surface bottlenecks before they reach production.

### pytest & unittest — Automated Tests

The test suite uses both `pytest` (via `pytest-django`) and Django's built-in `unittest`:

```bash
cd ShopEasy-Api
pytest                    # run all tests
pytest -v --tb=short      # verbose with short tracebacks
pytest store/tests/       # run a specific app's tests
```

Test coverage includes API endpoint correctness, authentication flows, order lifecycle, and edge cases on cart and payment logic.

---

## 🚀 Setup

### Requirements

- Python 3.12+
- Node.js 18+
- MySQL
- Redis

---

### Backend

```bash
cd ShopEasy-Api
python -m venv .venv
.venv\Scripts\activate        # Windows
# source .venv/bin/activate   # macOS / Linux

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

> **Database config** — update `ShopEasy-Api/config/settings/dev.py` if your MySQL user, password, or host differ from the defaults.

---

### Frontend

```bash
cd ShopEasy-front
npm install
npm run dev
```

### Production build

```bash
cd ShopEasy-front
npm run build
```

---
