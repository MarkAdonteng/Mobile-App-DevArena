import React from 'react';
import { Lesson, Difficulty } from '../../types/quiz';

export const angularLessons: Record<Difficulty, Lesson[]> = {
  Beginner: [
    {
      id: 'angular_basics_1',
      title: 'Introduction to Angular',
      content: `Angular is a powerful framework for building web applications developed by Google.

Key Concepts:
• Angular CLI and project setup
• Components and modules
• Basic template syntax
• Data binding`,
      codeExamples: [`
// Creating a new Angular project
ng new my-app
cd my-app
ng serve

// Basic component
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: \`
    <h1>{{ title }}</h1>
    <p>Welcome to {{ appName }}!</p>
  \`
})
export class AppComponent {
  title = 'My First Angular App';
  appName = 'Angular';
}`],
      difficulty: 'Beginner',
      order: 1,
    },
    {
      id: 'angular_basics_2',
      title: 'Components and Templates',
      content: `Learn about Angular components and template syntax.

Key Concepts:
• Component lifecycle
• Template syntax
• Property binding
• Event binding`,
      codeExamples: [`
import { Component } from '@angular/core';

@Component({
  selector: 'app-user',
  template: \`
    <div>
      <h2 [style.color]="titleColor">{{ userName }}</h2>
      <button (click)="greet()">Greet</button>
      <p *ngIf="showMessage">Hello, {{ userName }}!</p>
    </div>
  \`
})
export class UserComponent {
  userName = 'John';
  titleColor = 'blue';
  showMessage = false;

  greet() {
    this.showMessage = true;
  }
}`],
      difficulty: 'Beginner',
      order: 2,
    },
    {
      id: 'angular_basics_3',
      title: 'Directives',
      content: `Understanding Angular directives for DOM manipulation.

Key Concepts:
• Structural directives (*ngIf, *ngFor)
• Attribute directives
• Custom directives
• ngClass and ngStyle`,
      codeExamples: [`
import { Component } from '@angular/core';

@Component({
  selector: 'app-list',
  template: \`
    <ul>
      <li *ngFor="let item of items; let i = index">
        {{ i + 1 }}. {{ item }}
      </li>
    </ul>
    <div [ngClass]="{'active': isActive}">
      Dynamic Classes
    </div>
  \`
})
export class ListComponent {
  items = ['Apple', 'Banana', 'Orange'];
  isActive = true;
}`],
      difficulty: 'Beginner',
      order: 3,
    },
    {
      id: 'angular_basics_4',
      title: 'Forms and Validation',
      content: `Working with forms in Angular.

Key Concepts:
• Template-driven forms
• Reactive forms
• Form validation
• Form submission`,
      codeExamples: [`
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  template: \`
    <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
      <input formControlName="email" placeholder="Email">
      <input formControlName="password" type="password">
      <button type="submit" [disabled]="!loginForm.valid">
        Login
      </button>
    </form>
  \`
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
    }
  }
}`],
      difficulty: 'Beginner',
      order: 4,
    }
  ],
  Intermediate: [
    {
      id: 'angular_inter_1',
      title: 'Services and Dependency Injection',
      content: `Understanding services and DI in Angular.

Key Concepts:
• Creating services
• Dependency injection
• Service hierarchy
• Singleton services`,
      codeExamples: [`
// user.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users = ['John', 'Jane', 'Bob'];

  getUsers() {
    return this.users;
  }
}

// user-list.component.ts
@Component({
  selector: 'app-user-list',
  template: \`
    <ul>
      <li *ngFor="let user of users">{{ user }}</li>
    </ul>
  \`
})
export class UserListComponent {
  users: string[];

  constructor(private userService: UserService) {
    this.users = this.userService.getUsers();
  }
}`],
      difficulty: 'Intermediate',
      order: 1,
    },
    {
      id: 'angular_inter_2',
      title: 'HTTP and Observables',
      content: `Working with HTTP and Observables in Angular.

Key Concepts:
• HttpClient
• Observables and Subjects
• Error handling
• CRUD operations`,
      codeExamples: [`
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'https://api.example.com';

  constructor(private http: HttpClient) {}

  getData(): Observable<any> {
    return this.http.get(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error:', error);
        throw error;
      })
    );
  }
}`],
      difficulty: 'Intermediate',
      order: 2,
    }
  ],
  Advanced: [
    {
      id: 'angular_adv_1',
      title: 'State Management with NgRx',
      content: `Advanced state management using NgRx.

Key Concepts:
• Store and actions
• Reducers
• Effects
• Selectors`,
      codeExamples: [`
// actions
import { createAction, props } from '@ngrx/store';

export const loadUsers = createAction('[Users] Load');
export const loadUsersSuccess = createAction(
  '[Users] Load Success',
  props<{ users: User[] }>()
);

// reducer
export const userReducer = createReducer(
  initialState,
  on(loadUsers, state => ({ ...state, loading: true })),
  on(loadUsersSuccess, (state, { users }) => ({
    ...state,
    users,
    loading: false
  }))
);

// effect
@Injectable()
export class UserEffects {
  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadUsers),
      mergeMap(() => this.userService.getUsers()
        .pipe(
          map(users => loadUsersSuccess({ users }))
        ))
    )
  );
}`],
      difficulty: 'Advanced',
      order: 1,
    }
  ]
};