from datetime import timedelta

from django.shortcuts import get_object_or_404, redirect, render
from django.utils import timezone

from .forms import CropForm, CropScanForm
from .models import Crop, CropScan


def dashboard(request):
    crops = Crop.objects.all().order_by("-created_at")
    scans = CropScan.objects.select_related("crop").all()[:6]
    active_crops = crops.count()
    total_scans = CropScan.objects.count()
    avg_health = round(sum(c.health_percentage for c in crops) / active_crops) if active_crops else 0
    warning_count = crops.filter(health_status__in=["Warning", "Critical"]).count()

    return render(request, "farmer/dashboard.html", {
        "crops": crops,
        "scans": scans,
        "active_crops": active_crops,
        "total_scans": total_scans,
        "avg_health": avg_health,
        "warning_count": warning_count,
    })


def add_crop(request):
    if request.method == "POST":
        form = CropForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect("farmer_dashboard")
    else:
        form = CropForm()
    return render(request, "farmer/add_crop.html", {"form": form})


def crop_detail(request, crop_id):
    crop = get_object_or_404(Crop, id=crop_id)
    scans = crop.scans.all()
    next_scan = None
    latest = scans.first()
    if latest:
        next_scan = latest.scanned_at.date() + timedelta(days=7)

    return render(request, "farmer/crop_detail.html", {
        "crop": crop,
        "scans": scans,
        "next_scan": next_scan,
    })


def add_scan(request, crop_id):
    crop = get_object_or_404(Crop, id=crop_id)
    if request.method == "POST":
        form = CropScanForm(request.POST, request.FILES)
        if form.is_valid():
            scan = form.save(commit=False)
            scan.crop = crop
            scan.save()

            # Keep the crop's latest health state synchronized with its latest scan.
            crop.health_status = scan.health_status
            crop.health_percentage = scan.health_percentage
            crop.save(update_fields=["health_status", "health_percentage"])
            return redirect("crop_detail", crop_id=crop.id)
    else:
        form = CropScanForm(initial={
            "health_status": crop.health_status,
            "health_percentage": crop.health_percentage,
        })
    return render(request, "farmer/add_scan.html", {"form": form, "crop": crop})
