from .common import *

DEBUG = True

SECRET_KEY = "django-insecure-(^k(wfy6le=q@v8z@sh4v0-8*w!kr^vil8$)itx+&zdvhs5hu^"


DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.mysql",
        "NAME": "shopeasy2",
        "HOST": "localhost",
        "USER": "root",
        "PASSWORD": "0000",
        "PORT": "3306",
        "CONN_MAX_AGE": int(os.getenv("DB_CONN_MAX_AGE", "0")),
        "CONN_HEALTH_CHECKS": True,
    }
}
