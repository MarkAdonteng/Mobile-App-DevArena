import React from 'react';
import { Lesson, Difficulty } from '../../types/quiz';

export const laravelLessons: Record<Difficulty, Lesson[]> = {
  Beginner: [
    {
      id: 'laravel_basics_1',
      title: 'Introduction to Laravel',
      content: `Laravel is a PHP web application framework with expressive, elegant syntax.

Key Concepts:
• Project setup
• Directory structure
• Artisan CLI
• Basic routing`,
      codeExamples: [`
# Creating a new Laravel project
composer create-project laravel/laravel example-app
cd example-app
php artisan serve

# Basic routing
// routes/web.php
Route::get('/', function () {
    return view('welcome');
});

Route::get('/users', [UserController::class, 'index']);

# Generate a controller
php artisan make:controller UserController`],
      difficulty: 'Beginner',
      order: 1,
    },
    {
      id: 'laravel_basics_2',
      title: 'Eloquent ORM',
      content: `Working with Laravel's Eloquent ORM.

Key Concepts:
• Models
• Migrations
• Relationships
• CRUD operations`,
      codeExamples: [`
// Creating a model with migration
php artisan make:model Post -m

// app/Models/Post.php
class Post extends Model {
    protected $fillable = ['title', 'content'];
    
    public function user() {
        return $this->belongsTo(User::class);
    }
}

// Database migration
public function up() {
    Schema::create('posts', function (Blueprint $table) {
        $table->id();
        $table->string('title');
        $table->text('content');
        $table->foreignId('user_id')->constrained();
        $table->timestamps();
    });
}`],
      difficulty: 'Beginner',
      order: 2,
    },
    {
      id: 'laravel_basics_3',
      title: 'Blade Templates',
      content: `Using Laravel's Blade templating engine.

Key Concepts:
• Blade syntax
• Template inheritance
• Components
• Forms`,
      codeExamples: [`
<!-- layouts/app.blade.php -->
<!DOCTYPE html>
<html>
<head>
    <title>@yield('title')</title>
</head>
<body>
    @include('partials.nav')
    
    <div class="container">
        @yield('content')
    </div>
</body>
</html>

<!-- posts/index.blade.php -->
@extends('layouts.app')

@section('content')
    @foreach($posts as $post)
        <div class="post">
            <h2>{{ $post->title }}</h2>
            <p>{{ $post->content }}</p>
        </div>
    @endforeach
@endsection`],
      difficulty: 'Beginner',
      order: 3,
    }
  ],
  Intermediate: [
    {
      id: 'laravel_inter_1',
      title: 'Authentication and Authorization',
      content: `Implementing user authentication and authorization.

Key Concepts:
• Laravel Breeze/Jetstream
• Middleware
• Gates and Policies
• Role-based access`,
      codeExamples: [`
// Installing authentication
composer require laravel/breeze
php artisan breeze:install

// Creating a policy
php artisan make:policy PostPolicy

class PostPolicy {
    public function update(User $user, Post $post) {
        return $user->id === $post->user_id;
    }
}

// Using middleware
Route::middleware(['auth'])->group(function () {
    Route::resource('posts', PostController::class);
});`],
      difficulty: 'Intermediate',
      order: 1,
    },
    {
      id: 'laravel_inter_2',
      title: 'API Development',
      content: `Building APIs with Laravel.

Key Concepts:
• API resources
• Token authentication
• Rate limiting
• API versioning`,
      codeExamples: [`
// Creating API resource
php artisan make:resource PostResource

class PostResource extends JsonResource {
    public function toArray($request) {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'content' => $this->content,
            'author' => new UserResource($this->user)
        ];
    }
}

// API routes
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('posts', PostController::class);
});`],
      difficulty: 'Intermediate',
      order: 2,
    }
  ],
  Advanced: [
    {
      id: 'laravel_adv_1',
      title: 'Advanced Laravel Features',
      content: `Advanced Laravel concepts and patterns.

Key Concepts:
• Service container
• Events and listeners
• Job queues
• Custom artisan commands`,
      codeExamples: [`
// Service provider
class PostServiceProvider extends ServiceProvider {
    public function register() {
        $this->app->singleton(PostRepository::class, function () {
            return new EloquentPostRepository();
        });
    }
}

// Event and listener
php artisan make:event PostCreated
php artisan make:listener NotifySubscribers

class NotifySubscribers {
    public function handle(PostCreated $event) {
        // Send notifications
    }
}

// Queue job
php artisan make:job ProcessPodcast

class ProcessPodcast implements ShouldQueue {
    public function handle() {
        // Process the job
    }
}`],
      difficulty: 'Advanced',
      order: 1,
    }
  ]
};
