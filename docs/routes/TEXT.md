### 1. **POST /book-content**
   - **Descrição**: Salva o conteúdo inicial de um texto com o título e o corpo.
   - **Autenticação**: Sim (requer token JWT).
   - **Corpo da Requisição**:
     ```json
     {
       "title": "Título do Livro",
       "content": "Conteúdo do Livro"
     }
     ```
   - **Resposta de Sucesso**:
     - Status: `200 OK`
     - Corpo:
       ```json
       { "message": "Conteúdo salvo com sucesso" }
       ```
   - **Erros**:
     - `500 Internal Server Error`: Erro ao salvar conteúdo no banco de dados.

---

### 2. **POST /content-version**
   - **Descrição**: Salva uma nova versão do conteúdo de um texto existente.
   - **Autenticação**: Sim (requer token JWT).
   - **Corpo da Requisição**:
     ```json
     {
       "id": "ID do conteúdo",
       "content": "Nova versão do conteúdo"
     }
     ```
   - **Resposta de Sucesso**:
     - Status: `200 OK`
     - Corpo:
       ```json
       { "message": "Versão do conteúdo salva com sucesso" }
       ```
   - **Erros**:
     - `404 Not Found`: Se o conteúdo com o ID fornecido não for encontrado.
     - `500 Internal Server Error`: Erro ao salvar a versão do conteúdo.

---

### 3. **GET /content-versions-list/:id**
   - **Descrição**: Obtém uma lista das versões de um conteúdo com base no ID.
   - **Autenticação**: Sim (requer token JWT).
   - **Parâmetros da URL**:
     - `:id`: O ID do conteúdo.
   - **Resposta de Sucesso**:
     - Status: `200 OK`
     - Corpo:
       ```json
       [
         {
           "id": "ID da Versão",
           "date": "Data da Versão"
         }
       ]
       ```
   - **Erros**:
     - `404 Not Found`: Se o conteúdo com o ID fornecido não for encontrado.
     - `500 Internal Server Error`: Erro ao buscar a lista de versões.

---

### 4. **GET /content-versions/:id**
   - **Descrição**: Obtém todas as versões de um conteúdo específico com base no ID.
   - **Autenticação**: Sim (requer token JWT).
   - **Parâmetros da URL**:
     - `:id`: O ID do conteúdo.
   - **Resposta de Sucesso**:
     - Status: `200 OK`
     - Corpo:
       ```json
       [
         {
           "id": "ID da Versão",
           "content": "Conteúdo da Versão",
           "date": "Data da Versão"
         }
       ]
       ```
   - **Erros**:
     - `404 Not Found`: Se o conteúdo com o ID fornecido não for encontrado.
     - `500 Internal Server Error`: Erro ao buscar as versões do conteúdo.

---

### 5. **GET /content-version/:contentID/:versionID**
   - **Descrição**: Obtém uma versão específica de um conteúdo com base no ID do conteúdo e da versão.
   - **Autenticação**: Sim (requer token JWT).
   - **Parâmetros da URL**:
     - `:contentID`: O ID do conteúdo.
     - `:versionID`: O ID da versão específica.
   - **Resposta de Sucesso**:
     - Status: `200 OK`
     - Corpo:
       ```json
       {
         "id": "ID da Versão",
         "content": "Conteúdo da Versão",
         "date": "Data da Versão"
       }
       ```
   - **Erros**:
     - `404 Not Found`: Se o conteúdo ou a versão com os IDs fornecidos não for encontrado.
     - `500 Internal Server Error`: Erro ao buscar a versão específica do conteúdo.

---

### 6. **GET /contents**
   - **Descrição**: Obtém uma lista de todos os conteúdos criados pelo usuário logado.
   - **Autenticação**: Sim (requer token JWT).
   - **Resposta de Sucesso**:
     - Status: `200 OK`
     - Corpo:
       ```json
       [
         {
           "id": "ID do Conteúdo",
           "title": "Título do Conteúdo"
         }
       ]
       ```
   - **Erros**:
     - `500 Internal Server Error`: Erro ao buscar os conteúdos do usuário.

---

### 7. **GET /content/:id**
   - **Descrição**: Obtém o conteúdo e sua última versão com base no ID do conteúdo.
   - **Autenticação**: Sim (requer token JWT).
   - **Parâmetros da URL**:
     - `:id`: O ID do conteúdo.
   - **Resposta de Sucesso**:
     - Status: `200 OK`
     - Corpo:
       ```json
       {
         "id": "ID da Última Versão",
         "title": "Título do Conteúdo",
         "content": "Conteúdo da Última Versão",
         "date": "Data da Última Versão"
       }
       ```
   - **Erros**:
     - `404 Not Found`: Se o conteúdo com o ID fornecido não for encontrado.
     - `500 Internal Server Error`: Erro ao buscar o conteúdo pelo ID.