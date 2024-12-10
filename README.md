# WrightE API

[PT] Back-end da aplicação web WrightE, conectando escritores amadores a editores e leitores apaixonados.

---

## Índice

- [Descrição](#descrição)
- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Instalação](#instalação)
- [Como Usar](#como-usar)
- [Rotas Principais](#rotas-principais)
- [Contribuição](#contribuição)
- [Licença](#licença)

---

## Descrição

WrightE é uma plataforma que visa conectar escritores amadores com editores e leitores apaixonados. Esta API serve como o back-end da aplicação, fornecendo todos os serviços e funcionalidades necessários para suportar a plataforma.

A API gerencia o cadastro e autenticação de usuários, publicação de textos, controle de versões, feedback detalhado, e gamificação para estimular a interação entre escritores e editores.

---

## Funcionalidades

- **Autenticação e Autorização**
  - Login e registro de usuários (JWT com autenticação baseada em tokens).
  - Diferenciação de papéis: escritores, editores e administradores.
  
- **Gerenciamento de Usuários**
  - Atualização de informações do usuário (e-mail, username, senha).
  - Desativação de contas (soft delete).

- **Publicação de Conteúdo**
  - Controle de versões dos textos.
  - Definição de níveis mínimos de editores para comentar.

- **Feedback e Gamificação**
  - Comentários em trechos específicos dos textos.
  - Atribuição de pontos para escritores e níveis de experiência para editores.

- **Administração**
  - Controle de usuários e acompanhamento da interação entre os mesmos.

---

## Tecnologias Utilizadas

- **Linguagem**: TypeScript
- **Framework**: Node.js com Express.js
- **Banco de Dados**:
  - **MongoDB**: Armazena textos, versões e comentários.
  - **PostgreSQL**: Gerencia usuários, gamificação e relacionamentos.
- **Autenticação**: JWT (JSON Web Token)
- **Middleware**: 
  - CORS para habilitar acessos entre origens.
  - Validação de níveis mínimos de editor.

---

## Instalação

Siga os passos abaixo para configurar a API localmente:

1. Clone o repositório:
   ```bash
   git clone https://github.com/LeandroRochAlg/wrighte-api.git
   ```
2. Navegue para o diretório do projeto:
   ```bash
   cd wrighte-api
   ```
3. Instale as dependências:
   ```bash
   npm install
   ```
4. Configure o arquivo `.env` com as variáveis de ambiente necessárias:
   ```env
   PORT=3000
   CORS_ORIGIN=http://localhost:5173
   DB_HOST=<seu-pgdb-host>
   DB_PORT=<seu-pgdb-port>
   DB_NAME=<seu-pgdb-name>
   DB_USER=<seu-pgdb-user>
   DB_PASSWORD=<seu-pgdb-password>
   JWT_SECRET=<seu-secret>
   MONGODB_URI=<seu-mongo-uri>
   MONGODB_DB_NAME=<seu-mongo-name>
   ```

5. Inicie o servidor:
   ```bash
   npm run dev
   ```

A API estará disponível em `http://localhost:3000`.

---

## Rotas Principais

### Usuários
- **POST** `/users/register`: Registro de novos usuários.
- **POST** `/users/login`: Login de usuários.
- **PUT** `/users/update-profile`: Atualização de e-mail ou username.
- **PUT** `/users/update-password`: Atualização de senha.
- **DELETE** `/users/deactivate-account`: Desativação de conta.

### Textos
- **POST** `/texts/book-content`: Criação de texto.
- **GET** `/texts/all-contents`: Lista todos os textos (filtrados por nível mínimo de editor).
- **GET** `/texts/user-contents`: Lista textos do usuário logado.

### Comentários
- **POST** `/comments`: Salva um comentário em um trecho de texto.
- **GET** `/comments/:contentID/:versionID`: Recupera comentários de uma versão específica.

---

## Como Usar

1. Inicie a API como descrito em [Instalação](#instalação).
2. Teste as rotas com uma ferramenta como [Postman](https://www.postman.com/) ou [Insomnia](https://insomnia.rest/).
3. Configure o front-end para consumir a API no endereço correto.

---

## Contribuição

Contribuições são bem-vindas! Siga os passos abaixo para colaborar com o projeto:

1. Faça um fork do repositório.
2. Crie uma branch para a sua contribuição:
   ```bash
   git checkout -b feature/sua-contribuicao
   ```
3. Faça suas alterações e commit:
   ```bash
   git commit -m 'Descrição da sua contribuição'
   ```
4. Envie para o seu repositório remoto:
   ```bash
   git push origin feature/sua-contribuicao
   ```
5. Abra um Pull Request no repositório original.

---

## Licença

Este projeto está licenciado sob a Licença MIT. Consulte o arquivo [LICENSE](LICENSE) para mais informações.
``` 

Este README apresenta uma visão completa da API, destacando as funcionalidades, tecnologias utilizadas, como instalá-la, principais rotas, e como contribuir para o projeto.
