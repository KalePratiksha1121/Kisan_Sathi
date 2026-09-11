from django import forms
from .models import Crop, CropScan


class CropForm(forms.ModelForm):
    class Meta:
        model = Crop
        fields = [
            "name",
            "crop_type",
            "field_name",
            "area",
            "health_status",
            "health_percentage",
            "planted_date",
        ]

        widgets = {
            "name": forms.TextInput(attrs={
                "class": "form-control",
                "placeholder": "Enter crop name"
            }),

            "crop_type": forms.Select(attrs={
                "class": "form-control"
            }),

            "field_name": forms.TextInput(attrs={
                "class": "form-control",
                "placeholder": "e.g. Field A"
            }),

            "area": forms.NumberInput(attrs={
                "class": "form-control",
                "placeholder": "Area in acres",
                "step": "0.01"
            }),

            "health_status": forms.Select(attrs={
                "class": "form-control"
            }),

            "health_percentage": forms.NumberInput(attrs={
                "class": "form-control",
                "placeholder": "0 - 100",
                "min": "0",
                "max": "100"
            }),

            "planted_date": forms.DateInput(attrs={
                "class": "form-control",
                "type": "date"
            }),
        }

class CropScanForm(forms.ModelForm):
    class Meta:
        model = CropScan
        fields = ["image", "health_status", "health_percentage", "notes"]
        widgets = {
            "image": forms.ClearableFileInput(attrs={
                "class": "form-control", "accept": "image/*"
            }),
            "health_status": forms.Select(attrs={"class": "form-control"}),
            "health_percentage": forms.NumberInput(attrs={
                "class": "form-control", "min": "0", "max": "100"
            }),
            "notes": forms.Textarea(attrs={
                "class": "form-control", "rows": 4,
                "placeholder": "Optional: describe what you observed..."
            }),
        }
