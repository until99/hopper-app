# hopper-app

Este é um projeto web moderno construído com Vite, React e TypeScript.

> **Nota:** Este repositório contém o frontend do projeto Hopper. Os repositórios dos componentes principais estão separados:

- Backend (API + autenticação): https://github.com/until99/hopper-api
- Hopper (Landing Page): https://github.com/until99/hopper
- Airflow (ETL / DAGs): https://github.com/until99/hopper-airflow

## Navegação do Projeto

- **src/**: Código-fonte principal
  - **components/**: Componentes reutilizáveis
  - **contexts/**: Contextos React
  - **interfaces/**: Tipos e interfaces TypeScript
  - **pages/**: Páginas da aplicação
  - **styles/**: Arquivos de estilo
- **public/**: Arquivos estáticos
- **index.html**: HTML principal
- **vite.config.ts**: Configuração do Vite

## Setup Local

1. **Pré-requisitos**

   - Node.js 18+
   - pnpm (https://pnpm.io/installation)

2. **Instale as dependências**

   ```bash
   pnpm install
   ```

3. **Inicie o servidor de desenvolvimento**

   ```bash
   pnpm dev
   ```

4. **Acesse**
   - Abra [http://localhost:5173](http://localhost:5173) no navegador.

## Testes

O projeto utiliza Vitest para testes unitários e de integração.

### Executar Testes

```bash
# Modo watch (recomendado durante desenvolvimento)
pnpm test

# Executar todos os testes uma vez
pnpm test run

# Interface visual dos testes
pnpm test:ui
```

### Cobertura de Testes

```bash
# Gerar relatório de cobertura
pnpm test:coverage
```

O relatório HTML será gerado em `coverage/index.html` e pode ser aberto no navegador para visualização detalhada.

**Cobertura atual: ~94%** ✅

- 122 testes em 12 arquivos
- Cobertura de statements: 93.91%
- Cobertura de branches: 92.18%
- Cobertura de funções: 89.36%

---

Para dúvidas, consulte os arquivos e diretórios citados acima.
