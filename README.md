# GDASH Weather Dashboard - Desafio Técnico Completo

## 🚀 Visão Geral

Aplicação fullstack completa para monitoramento meteorológico em tempo real com arquitetura distribuída:

Python Collector → RabbitMQ → Go Worker → NestJS API → React Dashboard
↓
MongoDB (Persistência)

**Tecnologias**: Python, Go, NestJS, React (Vite), RabbitMQ, MongoDB, Docker Compose, Recharts

## 🛠️ Pré-requisitos

- Docker + Docker Compose
- Portas 3000 (frontend) e 3001 (backend) livres

## 🎯 Como Rodar (Docker Compose - Recomendado)

1. Copiar variáveis de ambiente
cp .env.example .env

2. Editar .env com suas configurações
CITY_LAT, CITY_LON, JWT_SECRET, etc.
3. Subir todos os serviços
docker-compose up --build

**URLs disponíveis:**
- **Dashboard**: http://localhost:3000
- **Gerenciar Usuários**: http://localhost:3000/users
- **API Backend**: http://localhost:3001/api
- **RabbitMQ Admin**: http://localhost:15672 (guest/guest)

## 👤 Usuário Padrão

Email: user@example.com
Senha: password123

## 📱 Funcionalidades

- ✅ Coleta automática de dados meteorológicos (Open-Meteo API)
- ✅ Pipeline assíncrono via RabbitMQ
- ✅ Worker Go de alta performance
- ✅ API REST segura (JWT Authentication)
- ✅ **CRUD Completo de Usuários** (criar/editar/excluir)
- ✅ Geração automática de insights IA
- ✅ Dashboard React responsivo com:
  - Gráficos de tendência (Recharts)
  - Tabela paginada (10 itens/página)
  - Cards de insights coloridos
  - Export CSV/XLSX
  - Botão "Gerenciar Usuários" no header
- ✅ Formatação brasileira de datas/horas
- ✅ Docker Compose completo

## 🏗️ Arquitetura & Pipeline de Dados

Python Collector: coleta a cada ${WEATHER_INTERVAL_MINUTES}min → RabbitMQ

Go Worker: consome fila → valida → POST para NestJS

NestJS Backend: salva MongoDB → gera insights → API REST

React Frontend: polling 30s → gráficos + tabela paginada + CRUD usuários

## 🎥 Vídeo Demonstrativo

[Vídeo Explicativo](https://youtu.be/Mb-Uq7jE39g)

## 🔧 Desenvolvimento Individual
### É possível rodar localmente, mas é preciso saber se faz necessário a configuração do rabbitmq localmente, por isso é recomendado o uso do Docker.

### Python Collector
```
cd python-collector
pip install -r requirements.txt
python collector.py
```
### Go Worker
```
cd worker-go
go mod tidy
go run main.go
```

### NestJS Backend
```
cd backend
npm install
npm run start:dev
```
### React Frontend
```
cd frontend
npm install
npm run dev
```
## 🤖 Insights IA Automatizados

Backend gera alertas baseados em thresholds:

| Severidade | Condições |
|------------|-----------|
| **Info** | Condições normais |
| **Warning** | Temp > 30°C, Umidade < 40%, Vento > 30km/h |
| **Danger** | Temp > 35°C, Umidade < 30%, Vento > 50km/h |

## 👥 Gerenciamento de Usuários

- **Página dedicada**: `/users` acessível pelo botão no header do dashboard
- **CRUD completo**: Criar, Editar, Excluir usuários
- **Campos**: Nome, Email, Senha (somente criação), Cargo (User/Admin), Status (Ativo/Inativo)
- **Interface**: Tabela responsiva + modal moderno
- **Validações**: Frontend + Backend (JWT protegido)

## 🔍 Debug & Logs

Logs de todos os serviços
docker-compose logs -f

Logs específicos
docker-compose logs -f collector
docker-compose logs -f worker-go
docker-compose logs -f backend
docker-compose logs -f frontend

## ✨ Decisões Técnicas

- **RabbitMQ**: Mensageria assíncrona + tolerância a falhas
- **Go Worker**: Máxima performance no processamento
- **NestJS**: TypeScript + decorators + validação automática
- **Recharts**: Gráficos leves e customizáveis (LineChart + PieChart)
- **Docker Compose**: Ambiente 100% reproduzível
- **Formatação BR**: `toLocaleDateString('pt-BR')` centralizada
- **Design System**: TailwindCSS + Lucide React consistente

## 📈 Dashboard Features

- Leituras atuais em tempo real
- Tabela histórica paginada (10 itens/página)
- Exportação CSV/XLSX
- Logout seguro

## 📞 Contato

- Quaisquer dúvidas, basta entrar em contato.

  
