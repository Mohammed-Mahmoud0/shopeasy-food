# ShopEasy Backend

This folder contains the Django REST API for ShopEasy.

For the full system overview, setup steps, architecture notes, and frontend instructions, see the top-level README at `../README.md`.

## Backend summary

- Django 6.0.1 API with DRF
- JWT authentication with Djoser and SimpleJWT
- MySQL database
- Redis cache and Celery broker
- Store, core, tags, and likes apps

## Run backend

```bash
cd ShopEasy-Api
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```
