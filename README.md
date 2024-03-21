# Projeto para conclusão da matéria Arquitetura de Microserviços e Containers @ IFMT - 2023/2024  

## Utilizando Kong Gateway como middleare para comunicação com as API's 

**Integrantes:**

- Bruno de Oliveira Figueiredo
- Edinei Nissola
- Eduardo Ormond dos Santos
- Francisco Jose Prata Vidal
- Jefferson Gonçalves de Oliveira Reis

**Tecnologias utlizadas:** 

- [Kong Gateway](https://docs.konghq.com/gateway/latest/)
- [Kong Manager](https://docs.konghq.com/gateway/3.6.x/kong-manager/)
- [NodeJS](https://nodejs.org/en)
    - [Express](https://expressjs.com/)
    - [keycloak-connect](https://github.com/keycloak/keycloak-nodejs-connect)
- [Angular 17](https://angular.io/)
    - [keycloak-angular](https://github.com/mauriciovigolo/keycloak-angular)
    - [keycloak-js](https://www.npmjs.com/package/keycloak-js)
- [Docker](https://docs.docker.com/)
- [PostgreSQL](https://www.postgresql.org/docs/)
- [KeyCloak](https://www.keycloak.org/documentation)



## Estrutura de Pastas

```
repository
│
├── app
│   │
|   ├── .devcontainer
|   |   ├── devcontainer.json         [Arquivo de configuração da extensão do VSC]
|   |   └── docker-compose.yml              [Compose para subir o ambiente de dev]
|   |
|   │
|   ├── backend
|   │   └── database               [Tabelas de Dados do Projeto - Simple JSObject]
|   ├── express.server.ts              [Backend server com o conector do Keycloak]
|   ├── ...
|   │
│   │
|   └── frontend
|       └── src
|           └── app
|               ├── consumer
|               │   ├── devops.service.ts     [Service - retorna dados do backend]
|               │   ├── generic.model.ts       [Model - mapeia dados dos services]
|               │   └── ia.service.ts         [Service - retorna dados do backend]
|               ├── keycloak
|               │   ├── auth.guard.ts      [KeycloakAuthGuard - proteger as rotas]
|               │   ├── auth.service.ts   [KeycloakService - servicos do keycloak]
|               │   └── keycloak-service-factory.ts   [Config - realm do keycloak]
|               ├── pages
|               ├── app.config.ts    [Config - bind factory e add providers a app]     
|               ├── app.routes.ts     [Rote - restringe as rotas com o auth.guard]
|               └── ...
|
|
├─ kong-api
|  ├── kong-gateway.postman_collection.json      [Collecttion - Import no Postman]
|  ├── rate-limiting.sh                        [Test - Realiza várias requisições]
|  └── requests.http                        [REST Client - Alternativa ao Postman]  
|
|
├── build.sh                                        [Script para criar o ambiente]
└── docker-compose.yml

```

## Levantando o Ambiente

### Pré-requisitos 

Você precisará ter instalado na sua maquina:

- Docker
- Visual Studio Code
    - [Extensão] Dev Container - Microsoft 

### Iniciando os containers

          

1. Execute o script "./build.sh"

    **[!ATENÇÃO!]** - O script deverá ser executado apenas na primeira vez, pois ele irá criar os volumes, rede e executar o migrations do Kong Gateway 

    * Executar novamente o script irá apagar o ambiente e criá-lo novamente.

2. Iniciando os containers com o docker compose

    ```
    docker compose up -d
    ```
3. Abra a pasta **"./app/"** no **Visual Studio Code**
4. Pressino \<F1> e busque a ação: **"Dev Containers: Reopen in Container"**
5. Abra dois terminais dentro do **Visual Studio Code** 
    
    5.1 Será preciso alterar dois arquivos para apontar para o ip da sua maquina local
    - backend/express.server.ts (linha 16)
    - frontend/src/app/keycloak/keycloak-service-factory.ts (linha 7)

    5.2 Iniciando o ambiente 
    
    No primeiro entre na pasta **"backend"**, instale as dependencias e start:
    ```
    cd backend 
    npm install 
    npm start
    ```
    - No segundo repita o processo mas na pasta **"frontend"**:
    ```
    cd backend 
    npm install 
    npm start
    ```
6. Utilize os Links na sessão abaixo(**Mapeamento de Portas**) para acessar os serviços 
7. Através do [Kong Manager](http://localhost:8002) manipule os serviços, rotas e plugins
    - Está disponível aqui no projeto chamadas a API para administrar o kong em:
        - Postman Collection - `./kong-api/kong-gateway.postman_collection.json`
        - REST Client (need VSCode Plugin) - `./kong-api/requests.http` 


## Mapeamento de Portas

| #                   | Host Port | Container Port | Obs                                   |
|---------------------|-----------|----------------|---------------------------------------|
| kong-db-postgres    |           | (5432)         |                                       | 
| keycloak-db-postgres|           | (5432)         |                                       | 
| keycloak            | 8081      | 8080           | [Keycloak](http://localhost:8081)     |
| pgadmin             | 8082      | 80             | [pgadmin](http://localhost:8082)      |
| kong-gateway        | 8000      | 8000           | [Roteamento HTTP](http://localhost:8000) |
|                     | 8443      | 8443           | Roteamento HTTPS                      |
|                     | 8001      | 8001           | [Admin API](http://localhost:8001)    |
|                     | 8444      | 8444           | Admin API (HTTPS)                     |
|                     | 8002      | 8002           | [Kong Manager](http://localhost:8002) |
|                     | 8445      | 8445           | Kong Manager (HTTPS)                  |
|                     | 8003      | 8003           |                                       |
|                     | 8004      | 8004           |                                       |


| #        | Host Port | Container Port | Obs                                              |   
|----------|-----------|----------------|--------------------------------------------------|
| backend  | 9090      | 9090           | [API NodeJS + Express](http://localhost:9090)    |
| frontend | 4200      | 4200           | [Angular App](http://localhost:4200)             |


## Plugins

- [IP Restriction](https://docs.konghq.com/hub/kong-inc/ip-restriction/)
- [Request Termination](https://docs.konghq.com/hub/kong-inc/request-termination/)
- [Request Size Limiting](https://docs.konghq.com/hub/kong-inc/request-size-limiting/)
    > For security reasons, we suggest enabling this plugin for any service you add to Kong Gateway to prevent a DOS (Denial of Service) attack. by Kong Inc
- [Proxy Cache](https://docs.konghq.com/hub/kong-inc/proxy-cache/)
- [Rate Limiting](https://docs.konghq.com/hub/kong-inc/rate-limiting/)
- [Bot Detection](https://docs.konghq.com/hub/kong-inc/bot-detection/)
- [File Log](https://docs.konghq.com/hub/kong-inc/file-log/)
- [OpenTelemetry](https://docs.konghq.com/hub/kong-inc/opentelemetry/)
- [Prometheus](https://docs.konghq.com/hub/kong-inc/prometheus/#accessing-the-metrics)
    - [Grafana Dashboard](https://grafana.com/grafana/dashboards/7424-kong-official/)
- [OAuth 2.0 Authentication](https://docs.konghq.com/hub/kong-inc/oauth2/)


## Material de apoio

- [Installing Kong's API Gateway with Docker](https://www.youtube.com/watch?v=sJEID1xEZMg&list=PLg_AhYkg50vioBwQA1VTvxuDr-bX9Cb_7&index=16)


## Links de Referência

- [Kong Docs](https://docs.konghq.com/gateway/3.6.x/)
- [Kong Api Docs](https://docs.konghq.com/gateway/api/admin-oss/latest/)
- [Kong GitHub](https://github.com/Kong/kong)
- [Kong YouTube](https://www.youtube.com/@KongInc/videos)
- [Kong Forum](https://discuss.konghq.com/)



## Angular and Express vs KeyCloak

- [Integração Angular and NodeJS vs KeyCloak](https://www.youtube.com/watch?v=E5-rkGf5DGA)
- [Refresh Tokens in Node.js Applications](https://medium.com/@manishmj_9431/integrating-keycloak-tokens-and-refresh-tokens-in-node-js-applications-6b1b0ffd8ca4)
- [Keycloak with Angular](https://wkrzywiec.medium.com/step-by-step-guide-how-integrate-keycloak-with-angular-application-d96b05f7dfdd)
- [Sample GitHub Repo](https://github.com/mauriciovigolo/keycloak-angular)
- [KeyCloak - Realm Import](https://medium.com/@kaloyanmanev/bitnami-keycloack-inside-docker-compose-import-realm-on-startup-3627a7da7f39)



## Outros API Gateway/Manager

- [WSO2](https://github.com/wso2/product-apim)
- [Gloo](https://github.com/solo-io/gloo)
- [Kusk-Gateway](https://github.com/kubeshop/kusk-gateway)
- [Lunar](https://github.com/TheLunarCompany/lunar)
- [Traefik](https://github.com/traefik/traefik)
- [Tyk](https://github.com/TykTechnologies/tyk)
