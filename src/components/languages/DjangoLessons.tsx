import React from 'react';
import { Lesson, Difficulty } from '../../types/quiz';

export const djangoLessons: Record<Difficulty, Lesson[]> = {
  Beginner: [
    {
      id: 'django_basics_1',
      title: 'Introduction to Django',
      content: `Django is a high-level Python web framework that enables rapid development of secure and maintainable websites.

Key Concepts:
• Project setup and structure
• Django architecture (MVT)
• Virtual environments
• Basic project configuration`,
      codeExamples: [`
# Creating a new Django project
python -m venv env
source env/bin/activate  # On Windows: env\\Scripts\\activate
pip install django
django-admin startproject mysite
cd mysite

# Creating a new app
python manage.py startapp myapp

# Basic settings.py configuration
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'myapp',  # Add your app here
]`],
      difficulty: 'Beginner',
      order: 1,
    },
    {
      id: 'django_basics_2',
      title: 'Models and Database',
      content: `Understanding Django's ORM and database operations.

Key Concepts:
• Model definition
• Field types
• Database migrations
• Basic queries`,
      codeExamples: [`
# models.py
from django.db import models

class Article(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    published_date = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(
        'auth.User',
        on_delete=models.CASCADE
    )

    def __str__(self):
        return self.title

# Terminal commands
python manage.py makemigrations
python manage.py migrate

# Using the model
# views.py
from .models import Article

def article_list(request):
    articles = Article.objects.all()
    return render(request, 'articles/list.html', {'articles': articles})`],
      difficulty: 'Beginner',
      order: 2,
    },
    {
      id: 'django_basics_3',
      title: 'Views and URLs',
      content: `Creating views and mapping URLs in Django.

Key Concepts:
• Function-based views
• URL patterns
• URL naming
• URL parameters`,
      codeExamples: [`
# views.py
from django.shortcuts import render, get_object_or_404
from .models import Article

def article_detail(request, pk):
    article = get_object_or_404(Article, pk=pk)
    return render(request, 'articles/detail.html', {'article': article})

# urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.article_list, name='article_list'),
    path('article/<int:pk>/', views.article_detail, name='article_detail'),
]

# Template usage
<a href="{% url 'article_detail' pk=article.pk %}">
    {{ article.title }}
</a>`],
      difficulty: 'Beginner',
      order: 3,
    },
    {
      id: 'django_basics_4',
      title: 'Templates and Forms',
      content: `Working with Django templates and forms.

Key Concepts:
• Template language
• Template inheritance
• Form creation
• Form validation`,
      codeExamples: [`
# forms.py
from django import forms
from .models import Article

class ArticleForm(forms.ModelForm):
    class Meta:
        model = Article
        fields = ['title', 'content']

# views.py
def article_new(request):
    if request.method == "POST":
        form = ArticleForm(request.POST)
        if form.is_valid():
            article = form.save(commit=False)
            article.author = request.user
            article.save()
            return redirect('article_detail', pk=article.pk)
    else:
        form = ArticleForm()
    return render(request, 'articles/edit.html', {'form': form})

# template.html
{% extends 'base.html' %}

{% block content %}
    <form method="POST">
        {% csrf_token %}
        {{ form.as_p }}
        <button type="submit">Save</button>
    </form>
{% endblock %}`],
      difficulty: 'Beginner',
      order: 4,
    }
  ],
  Intermediate: [
    {
      id: 'django_inter_1',
      title: 'Class-Based Views',
      content: `Using Django's class-based views for common patterns.

Key Concepts:
• Generic class-based views
• Mixins
• View customization
• Context data`,
      codeExamples: [`
from django.views.generic import ListView, DetailView
from django.views.generic.edit import CreateView, UpdateView
from .models import Article

class ArticleListView(ListView):
    model = Article
    template_name = 'articles/list.html'
    context_object_name = 'articles'
    ordering = ['-published_date']

class ArticleDetailView(DetailView):
    model = Article
    template_name = 'articles/detail.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['related_articles'] = Article.objects.filter(
            author=self.object.author
        ).exclude(pk=self.object.pk)[:3]
        return context`],
      difficulty: 'Intermediate',
      order: 1,
    },
    {
      id: 'django_inter_2',
      title: 'Authentication and Authorization',
      content: `Implementing user authentication and permissions.

Key Concepts:
• User authentication
• Permissions
• Decorators
• Custom user models`,
      codeExamples: [`
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin

# Function-based view with decorator
@login_required
def profile(request):
    return render(request, 'profile.html', {'user': request.user})

# Class-based view with mixin
class ArticleCreateView(LoginRequiredMixin, CreateView):
    model = Article
    template_name = 'articles/create.html'
    fields = ['title', 'content']

    def form_valid(self, form):
        form.instance.author = self.request.user
        return super().form_valid(form)

# Custom permissions
from django.contrib.auth.mixins import UserPassesTestMixin

class ArticleUpdateView(LoginRequiredMixin, UserPassesTestMixin, UpdateView):
    model = Article
    fields = ['title', 'content']

    def test_func(self):
        article = self.get_object()
        return self.request.user == article.author`],
      difficulty: 'Intermediate',
      order: 2,
    },
    {
      id: 'django_inter_3',
      title: 'REST APIs with Django REST Framework',
      content: `Building RESTful APIs using Django REST Framework.

Key Concepts:
• Serializers
• ViewSets
• Authentication
• Permissions`,
      codeExamples: [`
from rest_framework import serializers, viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly

# Serializer
class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = ['id', 'title', 'content', 'author', 'published_date']
        read_only_fields = ['author']

# ViewSet
class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

# urls.py
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'articles', ArticleViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]`],
      difficulty: 'Intermediate',
      order: 3,
    }
  ],
  Advanced: [
    {
      id: 'django_adv_1',
      title: 'Advanced Django Features',
      content: `Advanced Django concepts and best practices.

Key Concepts:
• Custom middleware
• Signals
• Caching
• Custom template tags`,
      codeExamples: [`
# Custom middleware
class RequestTimingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        start_time = time.time()
        response = self.get_response(request)
        duration = time.time() - start_time
        response['X-Request-Duration'] = str(duration)
        return response

# Signals
from django.db.models.signals import post_save
from django.dispatch import receiver

@receiver(post_save, sender=Article)
def article_post_save(sender, instance, created, **kwargs):
    if created:
        # Send notification, update search index, etc.
        notify_subscribers(instance)

# Custom template tags
from django import template
register = template.Library()

@register.simple_tag
def get_popular_articles(count=5):
    return Article.objects.annotate(
        views_count=Count('views')
    ).order_by('-views_count')[:count]`],
      difficulty: 'Advanced',
      order: 1,
    }
  ]
};
