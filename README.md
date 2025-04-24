# Loanmanagement

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.7.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Overview

A full-stack loan management application built with:
Frontend: Angular 19 with Angular Material
Backend: ASP.NET Core 8 Web API
Database: SQL Server (or SQLite)

## Features
## User Features
Loan application submission
View loan status and details
View EMI payment schedules
User authentication (login/register)
Admin Features
View all loan applications
Approve/reject pending loans
Generate EMI schedules automatically
View all users' loan details

## Technical Stack
## Frontend
Angular 19
Angular Material UI
Angular Signals for state management
Standalone components
Modern Angular control flow (@if, @for)
Functional guards and interceptors

## Backend
ASP.NET Core 8 Web API
Entity Framework Core (Code-First)
JWT Authentication
Repository + Service pattern
FluentValidation
AutoMapper
Swagger UI documentation

## Prerequisites
Node.js (v18+)
.NET 8 SDK
SQL Server or SQLite
Angular CLI (v19+)

## Installation
## Backend Setup
1. Navigate to the backend folder:
cd LoanManagement.API

2. Configure the database connection in appsettings.json:
"ConnectionStrings": {
  "DefaultConnection": "Your_Connection_String_Here"
} 

3. Apply database migrations:
dotnet ef database update

4. Run the API:
dotnet run

## Frontend Setup
1. Navigate to the frontend folder:
cd loan-management

2. Install dependencies:
npm install

3. Configure the API base URL in src/environments/environment.ts:
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5001/api' // Update with your API URL
};

4. Run the Angular application:
ng serve

## API Documentation
Access Swagger documentation at:
http://localhost:5001/swagger

## Application Structure
## Backend Structure
LoanManagement.API/
├── Controllers/       # API endpoints
├── Data/             # Database context and migrations
├── Models/           # Data models
├── Services/         # Business logic
├── Validators/       # Validation rules
└── Program.cs        # Startup configuration

## Frontend Structure
src/
├── app/
│   ├── components/    # UI components
│   ├── guards/        # Route guards
│   ├── interceptors/  # HTTP interceptors
│   ├── models/        # Data models
│   ├── services/      # API services
│   └── app.routes.ts  # Application routes
├── assets/           # Static assets
└── environments/     # Environment configurations

## Usage
## Default Admin Credentials
Email: admin@loans.com
Password: Admin@123

## Sample Loan Calculation
For a loan of $12,000 over 12 months at 12% annual interest:
Monthly EMI: $1,126.70
Total Interest: $1,520.40
Total Payment: $13,520.40

## Development Notes
## Key Implementation Details
EMI Calculation:
Simple interest calculation (no compounding)
Fixed 12% annual interest rate
Equal monthly installments
Authentication:
JWT token-based authentication
Role-based authorization (Admin/Borrower)
State Management:
Angular Signals for reactive state
Service layer for API communication

## Validation:
FluentValidation on backend
Reactive forms with validation on frontend
