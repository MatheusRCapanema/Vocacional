# Vocational Assessment Platform

Plataforma de avaliação vocacional baseada no modelo RIASEC e CBO.

## Estrutura
- `/frontend`: Aplicação Next.js
- `/backend`: API FastAPI

## Como Rodar

### 1. Backend (API)
Abra um terminal na pasta raiz do projeto e execute:

```powershell
cd backend
.\venv\Scripts\activate
uvicorn app.main:app --reload --port 8000
```
A API ficará disponível em: http://localhost:8000

### 2. Frontend (Site)
Abra **outro** terminal na pasta raiz do projeto e execute:

```powershell
cd frontend
npm run dev
```
O site ficará disponível em: http://localhost:3000
