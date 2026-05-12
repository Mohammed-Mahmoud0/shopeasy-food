from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from debug_toolbar.toolbar import debug_toolbar_urls

admin.site.site_header = "ShopEasy Admin"
admin.site.index_title = "Admin"

urlpatterns = [
    path("", include("core.urls")),
    path("admin/", admin.site.urls),
    path("store/", include("store.urls")),
    path("auth/", include("djoser.urls")),
    path("auth/", include("djoser.urls.jwt")),
    path("__debug__/", include(debug_toolbar_urls())),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    if settings.SILK_INSTALLED:
        urlpatterns += [path("silk/", include("silk.urls", namespace="silk"))]
