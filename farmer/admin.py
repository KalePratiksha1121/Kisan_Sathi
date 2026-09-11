from django.contrib import admin
from .models import Crop, CropScan

@admin.register(Crop)
class CropAdmin(admin.ModelAdmin):
    list_display = ("name", "crop_type", "field_name", "health_status", "health_percentage", "created_at")

@admin.register(CropScan)
class CropScanAdmin(admin.ModelAdmin):
    list_display = ("crop", "health_status", "health_percentage", "scanned_at")
