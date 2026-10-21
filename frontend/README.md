# Smart Insurance Claim Management System — Frontend

React 18 + Vite single-page application consuming the Spring Boot REST API.

## Prerequisites
- Node.js 18+ and npm (install on the VM; not required on the authoring machine).

## Local development
```bash
cd frontend
npm install
npm run dev
```
The dev server runs on `http://localhost:5173` and proxies `/api/**` to
`http://localhost:8080` (the backend). Override the proxy target with:
```bash
VITE_API_PROXY_TARGET=http://<backend-host>:8080 npm run dev
```

## Production build (for VMware deployment)
```bash
npm install
# Optional: point the build at a specific backend URL if not served
# behind the same reverse proxy as the API:
# copy .env.example to .env and set VITE_API_BASE_URL
npm run build
```
This produces a static `dist/` folder. Serve it with any static file server
(Nginx, Apache, `npm run preview`, or copy it into the Spring Boot app's
`src/main/resources/static` folder before building the backend jar to serve
both from one origin).

## Roles & demo accounts
After the backend starts, these seeded accounts are available:
| Username  | Password     | Role           |
|-----------|--------------|----------------|
| admin     | Admin@123    | ADMINISTRATOR  |
| officer1  | Officer@123  | CLAIMS_OFFICER |
| agent1    | Agent@123    | AGENT          |

New customers can self-register from the Register page.
