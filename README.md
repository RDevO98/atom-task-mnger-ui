# Task Manager UI

Atom Challenge

> This repository provides a scalable Angular application starter built using **Clean Architecture** principles. It promotes separation of concerns, maintainability, and testability.

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.13.

## 🚀 Technologies and Tools

- 🟦 TypeScript
- 🧱 Clean Architecture (layered separation of responsibilities)
- 📦 Angular CLI (`firebase init`)
- 🎨 Angular Material
- 🚦 Signals

## 🧱 Project Structure (Clean Architecture)

The project follows a clean, layered architecture:

```
src/
├── app/
│   ├── core/                       # Guards, interceptors, services
│   ├── features/
|   │   ├── feature1/
|   |   │   ├── application/        # DTOs (data entry)
|   |   │   ├── domain/             # Models, responses (Database, API)
|   |   │   ├── infrastructure/     # Models, Services (Integration API)
|   |   │   ├── presentation/       # Components, views
├── environments/                   # Config
├── app.config.ts                   # Global application configuration
├── main.ts                         # Application bootstrap entry
```

## 🔧 Development server

Clone the repository, run:

```bash
git clone https://github.com/RDevO98/atom-task-mnger-ui.git
cd atom-task-mnger-ui
```

Install dependencies, run:

```bash
npm install
```

To start a local development server, run:

```bash
npm run start
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## 📂 Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## 📦 Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## 📌 Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

---
