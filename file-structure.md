frontend/
├── package.json
├── angular.json
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── .gitignore
├── README.md
└── src/
    ├── index.html
    ├── main.ts
    ├── styles.css
    ├── environments/
    │   ├── environment.ts
    │   └── environment.prod.ts
    └── app/
        ├── app.component.ts
        ├── app.component.html
        ├── app.config.ts
        ├── app.routes.ts
        ├── core/
        │   ├── models/
        │   │   ├── employee.model.ts
        │   │   ├── department.model.ts
        │   │   └── auth.model.ts
        │   ├── services/
        │   │   ├── auth.service.ts
        │   │   ├── employee.service.ts
        │   │   └── department.service.ts
        │   ├── guards/
        │   │   └── auth.guard.ts
        │   └── interceptors/
        │       └── auth.interceptor.ts
        ├── features/
        │   ├── auth/
        │   │   ├── login/
        │   │   │   ├── login.component.ts
        │   │   │   └── login.component.html
        │   │   └── set-password/
        │   │       ├── set-password.component.ts
        │   │       └── set-password.component.html
        │   ├── dashboard/
        │   │   ├── dashboard.component.ts
        │   │   └── dashboard.component.html
        │   ├── employees/
        │   │   ├── employee-list/
        │   │   │   ├── employee-list.component.ts
        │   │   │   └── employee-list.component.html
        │   │   ├── employee-detail/
        │   │   │   ├── employee-detail.component.ts
        │   │   │   └── employee-detail.component.html
        │   │   ├── employee-form/
        │   │   │   ├── employee-form.component.ts
        │   │   │   └── employee-form.component.html
        │   │   └── employee-card/
        │   │       ├── employee-card.component.ts
        │   │       └── employee-card.component.html
        │   └── departments/
        │       ├── department-list/
        │       │   ├── department-list.component.ts
        │       │   └── department-list.component.html
        │       └── department-form/
        │           ├── department-form.component.ts
        │           └── department-form.component.html
        └── shared/
            ├── components/
            │   ├── navbar/
            │   │   ├── navbar.component.ts
            │   │   └── navbar.component.html
            │   ├── sidebar/
            │   │   ├── sidebar.component.ts
            │   │   └── sidebar.component.html
            │   ├── loading-spinner/
            │   │   ├── loading-spinner.component.ts
            │   │   └── loading-spinner.component.html
            │   └── confirmation-dialog/
            │       ├── confirmation-dialog.component.ts
            │       └── confirmation-dialog.component.html
            └── layouts/
                ├── main-layout/
                │   ├── main-layout.component.ts
                │   └── main-layout.component.html
                └── auth-layout/
                    ├── auth-layout.component.ts
                    └── auth-layout.component.html