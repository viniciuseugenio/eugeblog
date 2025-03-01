# Generated by Django 5.1.1 on 2024-12-24 17:19

import django.db.models.deletion
import django_resized.forms
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=64, verbose_name='Category')),
            ],
            options={
                'verbose_name': 'Category',
                'verbose_name_plural': 'Categories',
            },
        ),
        migrations.CreateModel(
            name='Post',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', django_resized.forms.ResizedImageField(crop=None, force_format=None, help_text='Recommended size: 1366\t× 768', keep_meta=True, quality=75, scale=2, size=[1366, 768], upload_to='posts_images/', verbose_name='Image')),
                ('title', models.CharField(max_length=264, verbose_name='Title')),
                ('excerpt', models.CharField(max_length=264, verbose_name='Excerpt')),
                ('content', models.TextField(verbose_name='Content')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Updated at')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Created at')),
                ('is_published', models.BooleanField(default=False, verbose_name='Is published')),
                ('review_status', models.CharField(choices=[('P', 'Pending'), ('A', 'Approved'), ('R', 'Rejected')], default='A', max_length=1)),
                ('author', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL, verbose_name='Author')),
                ('category', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='posts.category', verbose_name='Category')),
            ],
            options={
                'verbose_name': 'Post',
                'verbose_name_plural': 'Posts',
            },
        ),
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('comment', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('author', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='Author')),
                ('post', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='posts.post', verbose_name='Post')),
            ],
            options={
                'verbose_name': 'Comment',
                'verbose_name_plural': 'Comments',
            },
        ),
    ]
