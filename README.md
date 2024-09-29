# wrightE API

Este é um projeto de backend criado com **Express.js** e **TypeScript**. Ele inclui configurações para desenvolvimento com **Nodemon** e **ts-node**, além de instruções para compilação e execução em produção.

## Pré-requisitos

Antes de iniciar, certifique-se de ter o seguinte instalado em seu ambiente:

- **Node.js** (versão 14 ou superior)
- **npm** (gerenciador de pacotes do Node.js)

## Instruções de Instalação

1. Clone o repositório para sua máquina local:

   ```bash
   git clone https://github.com/LeandroRochAlg/wrighte-api
   ```

2. Acesse o diretório do projeto:

   ```bash
   cd wrighte-api
   ```

3. Instale as dependências:

   ```bash
   npm install
   ```

## Configuração do TypeScript

O projeto já vem com um arquivo de configuração `tsconfig.json`. Se necessário, você pode ajustá-lo conforme suas necessidades.

## Scripts Disponíveis

A seguir, uma lista de scripts que podem ser executados:

### 1. Modo de Desenvolvimento

Para rodar o servidor em modo de desenvolvimento (com auto-reload usando **Nodemon**):

```bash
npm run dev
```

- Esse comando executa o servidor e monitora as mudanças nos arquivos dentro da pasta `src`.
- Ele utiliza o **ts-node** para executar diretamente o código TypeScript.

### 2. Compilar o Código TypeScript

Para compilar o projeto TypeScript para JavaScript:

```bash
npm run build
```

- O código compilado será gerado na pasta `dist`.

### 3. Rodar o Servidor em Produção

Após compilar o código, execute o servidor com:

```bash
npm start
```

- Isso executa o código JavaScript gerado na pasta `dist`.

## Estrutura do Projeto

A estrutura básica do projeto é a seguinte:

```
meu-projeto-backend/
│
├── src/                # Código-fonte em TypeScript
│   └── index.ts        # Arquivo principal do servidor
├── dist/               # Código JavaScript compilado (após build)
├── node_modules/       # Dependências instaladas
├── package.json        # Informações do projeto e scripts npm
├── tsconfig.json       # Configurações do TypeScript
└── README.md           # Instruções do projeto
```

## Tecnologias Utilizadas

- **Express.js**: Framework de backend para Node.js.
- **TypeScript**: Superset de JavaScript que adiciona tipagem estática.
- **ts-node**: Permite executar arquivos TypeScript diretamente no Node.js.
- **Nodemon**: Monitora mudanças no código e reinicia o servidor automaticamente.

## Contribuições

Sinta-se à vontade para contribuir com o projeto. Para isso:

1. Faça um **fork** do repositório.
2. Crie uma nova branch: `git checkout -b feature-nome-da-feature`.
3. Faça suas alterações e commit: `git commit -m 'Adiciona nova feature'`.
4. Envie para sua branch: `git push origin feature-nome-da-feature`.
5. Abra um **Pull Request** no repositório original.

## Licença

Este projeto está licenciado sob a [MIT License](https://opensource.org/licenses/MIT).