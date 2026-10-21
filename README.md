# Smart Insurance Claim Management System

Full-stack insurance claim management platform: a Spring Boot 4 REST API backend
and a React (Vite) single-page frontend, designed to be built and run inside a
VMware virtual machine.

## Project layout

```
Project/        Spring Boot backend (Java 21, REST API, JWT auth, JPA)
frontend/       React + Vite single-page application (SPA)
docker-compose.yml   One-command deployment: Postgres + backend + frontend
```

## Option A — Run with Docker (recommended for the VM)

Prerequisites on the VM: Docker Engine + Docker Compose plugin.

```bash
docker compose build
docker compose up -d
```

This starts:
- `postgres` — PostgreSQL 16 database (port 5432)
- `backend`  — Spring Boot API (port 8080), profile `prod`, auto-creates schema on first boot
- `frontend` — Nginx serving the built React app (port 80), proxies `/api/*` to the backend

Open `http://<vm-ip>/` in a browser. Default seeded accounts:
- `admin` / `Admin@123` (ADMIN)
- `officer1` / `Officer@123` (CLAIMS_OFFICER)
- `agent1` / `Agent@123` (AGENT)
- Customers self-register from the Register page.

Stop everything: `docker compose down` (add `-v` to also wipe the database volume).

## Option B — Run manually (no Docker)

### Backend
```bash
cd Project
./mvnw -q -DskipTests package
java -jar target/claims-management-0.0.1-SNAPSHOT.jar --spring.profiles.active=dev
```
`dev` profile uses an in-memory H2 database — zero setup, data resets on restart.
For PostgreSQL, use `--spring.profiles.active=prod` and set `DB_HOST`, `DB_NAME`,
`DB_USERNAME`, `DB_PASSWORD` environment variables (see `Project/src/main/resources/application.yml`).

Backend runs on `http://localhost:8080`.

### Frontend
```bash
cd frontend
npm install
npm run build      # production build -> frontend/dist
npm run dev         # OR: local dev server with hot reload (port 5173)
```
See `frontend/README.md` for environment variables (`VITE_API_BASE_URL`,
`VITE_API_PROXY_TARGET`) to point the SPA at the backend's address on the VM.
Serve `frontend/dist` with any static web server (Nginx, `serve`, Apache, etc.)
or copy it into the backend's `src/main/resources/static` folder to serve both
from a single Spring Boot origin.

## Requirements coverage

- Backend: Customer/Product/Policy/Claim/Payment REST APIs, JWT auth, role-based
  access control (CUSTOMER, CLAIMS_OFFICER, ADMIN, AGENT), claim workflow with
  status history and reviews, admin reporting.
- Frontend: role-specific dashboards (customer, officer, admin, agent), product
  catalog & purchase flow, claim filing & review queue, payments, admin product
  management — custom dark theme UI (no Bootstrap/MUI).
- Deployment: Dockerfiles for both services + `docker-compose.yml` for one-command
  VM deployment.

## Not yet included (see Deliverables PDF for full scope)

Terraform IaC, CI/CD pipeline (GitHub Actions), dedicated SQL reporting scripts
(views/stored procedures/window functions), architecture/BRD/API documentation,
and automated unit/integration tests were out of scope for this build pass and
can be added incrementally.
