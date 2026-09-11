from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("farmer", "0001_initial"),
    ]
    operations = [
        migrations.CreateModel(
            name="CropScan",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("image", models.FileField(upload_to="crop_scans/")),
                ("health_status", models.CharField(choices=[("Healthy", "Healthy"), ("Warning", "Warning"), ("Critical", "Critical")], default="Healthy", max_length=20)),
                ("health_percentage", models.PositiveIntegerField(default=100)),
                ("notes", models.TextField(blank=True)),
                ("scanned_at", models.DateTimeField(auto_now_add=True)),
                ("crop", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="scans", to="farmer.crop")),
            ],
            options={"ordering": ["-scanned_at"]},
        ),
    ]
