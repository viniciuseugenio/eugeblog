from django import forms
from .models import Post
from django_summernote.widgets import SummernoteWidget
from django.utils.translation import gettext_lazy as _


class CreatePostForm(forms.ModelForm):
    class Meta:
        model = Post
        fields = ["title", "excerpt", "content", "image", "category"]

        common_class = "input-form"
        widgets = {
            "title": forms.TextInput(
                attrs={
                    "class": common_class,
                    "id": "id_title",
                    "placeholder": " ",
                    "required": "required",
                }
            ),
            "excerpt": forms.TextInput(
                attrs={
                    "class": common_class,
                    "id": "id_excerpt",
                    "placeholder": " ",
                    "required": "required",
                }
            ),
            "content": SummernoteWidget(),
            "image": forms.FileInput(
                attrs={
                    "accept": "image/png, image/jpeg",
                    "id": "id_image",
                }
            ),
            "category": forms.Select(
                attrs={
                    "class": "select-category",
                    "id": "id_category",
                },
            ),
        }

    def clean(self):
        cleaned_data = super().clean()

        title = cleaned_data.get("title")
        excerpt = cleaned_data.get("excerpt")

        if title == excerpt:
            self.add_error("title", _("The title and excerpt cannot be the same"))
            self.add_error("excerpt", _("The title and excerpt cannot be the same"))

        return cleaned_data

    def clean_title(self):
        title = self.cleaned_data.get("title")

        if len(title) < 10:
            self.add_error(
                "title", _("The title can be nothing short of 10 characters.")
            )

        return title
