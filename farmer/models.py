from django.db import models

# Create your models here.



class Crop(models.Model):
    CROP_CHOICES = [
        ("Cotton", "Cotton"),
        ("Soybean", "Soybean"),
        ("Wheat", "Wheat"),
        ("Rice", "Rice"),
        ("Maize", "Maize"),
        ("Other", "Other"),
    ]

    HEALTH_CHOICES = [
        ("Healthy", "Healthy"),
        ("Warning", "Warning"),
        ("Critical", "Critical"),
    ]

    name = models.CharField(max_length=100)
    crop_type = models.CharField(
        max_length=50,
        choices=CROP_CHOICES,
        default="Other"
    )
    field_name = models.CharField(max_length=100, blank=True)
    area = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        null=True,
        blank=True
    )
    health_status = models.CharField(
        max_length=20,
        choices=HEALTH_CHOICES,
        default="Healthy"
    )
    health_percentage = models.PositiveIntegerField(default=100)
    planted_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class CropScan(models.Model):
    crop = models.ForeignKey(Crop, on_delete=models.CASCADE, related_name="scans")
    image = models.FileField(upload_to="crop_scans/")
    health_status = models.CharField(
        max_length=20, choices=Crop.HEALTH_CHOICES, default="Healthy"
    )
    health_percentage = models.PositiveIntegerField(default=100)
    notes = models.TextField(blank=True)
    scanned_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-scanned_at"]

    def __str__(self):
        return f"{self.crop.name} - {self.scanned_at:%d %b %Y}"
