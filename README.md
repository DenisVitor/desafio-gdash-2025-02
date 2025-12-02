# Weather Dashboard - Aplicação de Coleta e Visualização de Dados Meteorológicos

## Visão Geral

Este projeto é uma aplicação completa para coleta, processamento e visualização de dados meteorológicos. Utiliza:
- Python para coletar dados de APIs públicas (Open-Meteo), enviando para RabbitMQ
- Golang para consumir dados da fila e enviar para backend
- Backend em NestJS com MongoDB para persistência e API segura via JWT
- Frontend React para dashboard com visualização paginada, gráficos e insights

---

## Pré-requisitos

- [Docker e Docker Compose](https://docs.docker.com/compose/install/) instalados
- Ambiente com porta 3001 livre (backend)
- Navegador para acessar dashboard React

---

## Configuração

1. Crie um arquivo `.env` na raiz do projeto com as variáveis:

2. No arquivo `docker-compose.yml`, as variáveis são referenciadas via `${VARIAVEL}` e serão lidas automaticamente do `.env`.

---

## Como rodar a aplicação

No terminal, execute:

docker-compose up --build

Isso vai criar e subir os containers do RabbitMQ, MongoDB, backend, worker e collector.

A coleta de dados ocorrerá automaticamente no intervalo configurado (`WEATHER_INTERVAL_MINUTES`).

---

## Como usar

- Acesse o frontend React em `http://localhost:3000/`
- Faça login para usar o dashboard
- Visualize os dados meteorológicos atualizados, gráficos de temperatura e histórico paginado (10 itens por página)
- Use os botões para exportar dados em CSV ou XLSX
- O backend expõe APIs REST protegidas por JWT para segurança

---

## Desenvolvimento

- Para alterar a frequência de coleta, modifique `WEATHER_INTERVAL_MINUTES` no `.env`.
- Variáveis no `.env` são strings e devem ser convertidas em número dentro do código.
- Timestamp das leituras é convertido para ISO 8601 no frontend para garantir uniformidade.
- A paginação do histórico está implementada no React, mostrando 10 registros por página.

---

## Logs e Debug

- Use `docker logs -f <container>` para ver logs de collector, worker ou backend.
- Para testar APIs manualmente, utilize ferramentas como Postman ou Insomnia.
- Recomenda-se monitorar a fila RabbitMQ via painel em `http://localhost:15672`.

---

## Licença

Projeto aberto sob licença MIT.

---

## Contato

Para dúvidas, basta entrar em contato.