from django.urls import path
from . import views

urlpatterns = [
    path("", views.dashboard, name="farmer_dashboard"),
    path("add-crop/", views.add_crop, name="add_crop"),
    path("crop/<int:crop_id>/", views.crop_detail, name="crop_detail"),
    path("crop/<int:crop_id>/scan/", views.add_scan, name="add_scan"),
]
