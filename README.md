# 🌐 Pedidos360 – Frontend (Angular + Azure AD)

Frontend del sistema de gestión de pedidos **Pedidos360**, desarrollado para la asignatura **Desarrollo Cloud Native I (DSY1107) – Duoc UC**.

**Integrantes:** Manuel Álvarez Guevara · Diego Sepúlveda · Martín Escobedo

**Backend:** [Pedidos360-Backend](https://github.com/nano1977/Pedidos360-Backend) (3 microservicios Spring Boot + RabbitMQ)

---

## ✨ Funcionalidades

- **Inicio de sesión con Azure AD (Microsoft Entra ID)** usando OAuth 2.0 / OpenID Connect con **Authorization Code + PKCE** (MSAL).
- **Envío automático del JWT** en cada llamada al backend: el `MsalInterceptor` agrega `Authorization: Bearer <token>` a toda petición hacia el API Gateway.
- **Gestión de pedidos:** listado y creación de pedidos almacenados en Azure PostgreSQL. Cada pedido creado dispara en el backend tres tareas asíncronas por RabbitMQ (notificación, ticket y documento).

---

## 🏗️ Flujo

```
[ Usuario ] → [ Angular + MSAL ] ──login──> [ Azure AD ] → JWT
                     │  Authorization: Bearer <JWT>
                     ▼
             [ AWS API Gateway ] → [ pedidos-service (Spring Boot) ] → [ Azure PostgreSQL ]
```

---

## ⚙️ Configuración

Toda la configuración está centralizada en `src/environments/environment.ts`:

| Propiedad | Descripción |
| :--- | :--- |
| `azure.tenantId` | Tenant de Azure AD donde está registrada la aplicación |
| `azure.clientId` | Id. de aplicación (cliente) del registro en Azure AD |
| `azure.redirectUri` | URI de redirección de tipo SPA (`http://localhost:4200`) |
| `api.baseUrl` | URL pública del AWS API Gateway |
| `api.scope` | Scope solicitado para obtener el access token |

---

## 📁 Estructura

```
src/
├── environments/environment.ts      # Azure AD y URL del API Gateway
├── main.ts                          # Arranque de la aplicación
└── app/
    ├── app.config.ts                # MSAL: instancia única, guard e interceptor (JWT)
    ├── app.component.*              # Login / logout y prueba de conexión
    ├── app.routes.ts                # Rutas
    ├── models/pedido.model.ts       # Modelo Pedido
    ├── services/pedido.service.ts   # Llamadas HTTP al API Gateway
    └── pedidos/                     # Vista de gestión de pedidos
```

---

## 🚀 Ejecución local

**Requisitos:** Node.js 20+.

```bash
npm install
npm start          # o: ng serve
```

Abrir **http://localhost:4200**, iniciar sesión con la cuenta de Azure AD y usar la sección **Gestión de Pedidos**.

Compilación de producción:

```bash
npm run build
```

---

## 🛠️ Tecnologías

Angular 21 · TypeScript · MSAL Angular 6 / MSAL Browser 5 · Microsoft Entra ID (Azure AD) · AWS API Gateway
