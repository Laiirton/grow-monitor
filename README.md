# Grow Monitor

Um aplicativo desktop para monitorar o estoque do jogo Grow Garden.

## Funcionalidades

- 🔄 Atualização automática do estoque a cada minuto
- 📋 Exibição organizada dos itens por categorias
- 🔔 Sistema de notificação para itens monitorados
- 💾 Salvamento local dos itens monitorados

## Tecnologias

- Electron: Aplicativo desktop multiplataforma
- React: Interface de usuário
- TailwindCSS: Estilização
- Axios: Requisições HTTP

## Instruções de Desenvolvimento

### Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn

### Instalação

```bash
# Instalar dependências
npm install

# Iniciar em modo de desenvolvimento
npm run dev
```

### Construção para Produção

```bash
# Construir aplicação
npm run build

# Empacotar para distribuição
npm run make
```

## Estrutura do Projeto

```
grow-monitor/
├── assets/             # Ícones e recursos estáticos
├── src/                # Código fonte React
│   ├── components/     # Componentes React
│   ├── App.jsx         # Componente principal
│   ├── main.jsx        # Ponto de entrada React
│   └── index.css       # Estilos globais (TailwindCSS)
├── main.js             # Processo principal Electron
├── preload.js          # Script de pré-carregamento Electron
├── package.json        # Dependências e scripts
└── README.md           # Esta documentação
```

## Licença

MIT
