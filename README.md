# Chatbot de Gestão Financeira (Simulação WhatsApp)

## Visão Geral

Este projeto é uma simulação de um chatbot de gestão financeira pessoal, projetado para replicar a experiência de interação via WhatsApp. Ele utiliza o Next.js para a interface, o Vercel AI SDK para a integração com APIs de IA (neste caso, agindo como um proxy para a API do Controla.eu), e componentes Shadcn/ui para um design moderno e responsivo.

A principal funcionalidade é demonstrar como um agente de IA pode processar mensagens de linguagem natural relacionadas a finanças (despesas, receitas, metas, relatórios) e retornar respostas estruturadas, como as que você veria em um aplicativo de mensagens.

## Funcionalidades

*   **Simulação de Conversa:** Interaja com o chatbot através de mensagens pré-definidas, simulando um fluxo de conversa no WhatsApp.
*   **Processamento Financeiro:** O chatbot envia as mensagens para uma API externa (Controla.eu) que as classifica e processa como:
    *   **Despesas:** Registro de gastos.
    *   **Receitas:** Registro de entradas de dinheiro.
    *   **Metas:** Definição e acompanhamento de objetivos financeiros (mensais ou gerais).
    *   **Relatórios:** Geração de resumos financeiros e análises de gastos.
    *   **Mensagens Mistas:** Capacidade de processar múltiplos tipos de informação em uma única mensagem.
*   **Respostas Estruturadas:** As respostas da IA são formatadas de forma visualmente rica, com ícones, valores destacados e informações detalhadas, imitando a experiência de um aplicativo de mensagens.
*   **Fluxo de Demonstração Guiado:** O aplicativo apresenta um fluxo de demonstração passo a passo para que o usuário possa explorar as capacidades do agente.

## Como Usar (Demonstração)

O chatbot foi projetado para uma demonstração interativa, onde você não digita, mas escolhe entre opções de mensagens pré-definidas.

1.  **Página Inicial:** Ao acessar o aplicativo, você verá uma página de "landing page" com informações sobre o serviço.
2.  **Iniciar Demonstração:** Clique no botão "Demonstração" para iniciar o fluxo interativo.
3.  **Passo 1 - Registrar Despesa:** Você será guiado a "digitar" uma despesa (clicando no botão com a mensagem de exemplo ou usando o campo de texto para simular a entrada). O chatbot responderá com a despesa adicionada e, se aplicável, um lembrete.
4.  **Passo 2 - Consultar Relatório:** Prossiga para o próximo passo, onde você poderá solicitar um relatório de gastos. O chatbot exibirá um resumo financeiro com gráficos simulados.
5.  **Passo 3 - Mensagem Composta:** Experimente enviar uma mensagem que contenha múltiplos tipos de informações (despesa, receita, meta, agendamento). O chatbot processará cada item separadamente.
6.  **Passo 4 - Meta com Progresso:** Defina uma meta financeira com um progresso inicial e veja como o chatbot a registra.
7.  **Reiniciar:** Ao final da demonstração, você terá a opção de reiniciar o fluxo.

## Estrutura do Projeto

*   \`app/\`: Contém as rotas do Next.js (App Router).
    *   \`app/layout.tsx\`: Layout principal da aplicação.
    *   \`app/page.tsx\`: Página inicial que renderiza o chatbot.
    *   \`app/api/agent/route.ts\`: Rota da API que atua como proxy para a API do Controla.eu, processando as mensagens e formatando as respostas.
    *   \`app/api/chat/route.ts\`: Rota original do Vercel AI SDK (não utilizada diretamente nesta simulação, mas mantida).
*   \`components/\`: Componentes React reutilizáveis.
    *   \`components/chat-form.tsx\`: O componente principal do chatbot, que gerencia o estado da conversa, exibe mensagens e botões de interação.
    *   \`components/autoresize-textarea.tsx\`: Um textarea que se auto-ajusta ao conteúdo (não usado na simulação atual, mas mantido).
    *   \`components/ui/\`: Componentes Shadcn/ui (Button, Input, Card, etc.) que foram explicitamente incluídos para garantir a compatibilidade de deploy.
*   \`lib/\`: Funções utilitárias.
    *   \`lib/utils.ts\`: Contém a função `cn` para combinar classes Tailwind CSS.
*   \`public/images/\`: Contém as imagens de placeholder usadas para simular os gráficos e a interface do WhatsApp.
*   \`tailwind.config.ts\`: Configuração do Tailwind CSS, incluindo cores personalizadas.

## Configuração Local

Para rodar o projeto em seu ambiente de desenvolvimento local:

### Pré-requisitos

*   Node.js (versão 18 ou superior recomendada)
*   npm, yarn ou pnpm

### 1. Clone o Repositório

\`\`\`bash
git clone https://github.com/diegaosx/chatbot-teste-controlaeu.git
cd chatbot-teste-controlaeu
\`\`\`

### 2. Instale as Dependências

\`\`\`bash
pnpm install
# ou
npm install
# ou
yarn install
\`\`\`

### 3. Configure as Variáveis de Ambiente

Este projeto se integra com a API do Controla.eu. Você precisará de uma chave de API.
Crie um arquivo \`.env.local\` na raiz do projeto e adicione sua chave:

\`\`\`dotenv
CONTROLA_API_KEY="SUA_CHAVE_API_DO_CONTROLA_EU_AQUI"
\`\`\`

**Importante:** Substitua `"SUA_CHAVE_API_DO_CONTROLA_EU_AQUI"` pela sua chave de API real. Esta chave é usada na rota \`app/api/agent/route.ts\` para autenticar as requisições à API do Controla.eu.

### 4. Rode o Servidor de Desenvolvimento

\`\`\`bash
pnpm dev
# ou
npm run dev
# ou
yarn dev
\`\`\`

O aplicativo estará disponível em \`http://localhost:3000\`.

## Deploy em Qualquer Servidor

Para fazer o deploy deste projeto em um servidor de produção (Vercel, Netlify, ou qualquer outro ambiente Node.js/Next.js), siga estas etapas gerais:

### 1. Variáveis de Ambiente

Certifique-se de que a variável de ambiente \`CONTROLA_API_KEY\` esteja configurada no seu ambiente de produção. A forma de fazer isso varia de acordo com o provedor de hospedagem:

*   **Vercel:** Vá para as configurações do seu projeto > "Environment Variables" e adicione \`CONTROLA_API_KEY\` com o valor da sua chave.
*   **Netlify:** Vá para as configurações do seu site > "Build & deploy" > "Environment variables" e adicione \`CONTROLA_API_KEY\`.
*   **Outros Servidores (Ex: VPS, Docker):** Defina a variável de ambiente antes de iniciar o aplicativo. Por exemplo, no seu script de inicialização ou Dockerfile:
    \`\`\`bash
    export CONTROLA_API_KEY="SUA_CHAVE_API_DO_CONTROLA_EU_AQUI"
    npm run build
    npm start
    \`\`\`

### 2. Comandos de Build e Start

Next.js é um framework de React para produção. Para fazer o deploy, você precisará construir o projeto e depois iniciá-lo.

\`\`\`bash
# Construir o projeto para produção
pnpm build
# ou
npm run build
# ou
yarn build

# Iniciar o servidor de produção
pnpm start
# ou
npm start
# ou
yarn start
\`\`\`

O comando \`build\` criará uma versão otimizada do seu aplicativo na pasta \`.next/\`. O comando \`start\` iniciará o servidor Next.js em modo de produção.

### 3. Considerações para o EasyPanel

Se você estiver usando o EasyPanel ou um ambiente similar que gerencia contêineres ou processos Node.js, o processo será semelhante:

*   **Definição de Variáveis de Ambiente:** Use a interface do EasyPanel para adicionar \`CONTROLA_API_KEY\` às variáveis de ambiente do seu serviço.
*   **Comando de Build:** Configure o EasyPanel para executar \`pnpm build\` (ou \`npm run build\`, \`yarn build\`) como parte do processo de deploy.
*   **Comando de Inicialização:** Configure o EasyPanel para executar \`pnpm start\` (ou \`npm start\`, \`yarn start\`) para iniciar o aplicativo após o build.

### 4. Dependências

Certifique-se de que todas as dependências listadas no \`package.json\` sejam instaladas no ambiente de deploy. A maioria dos serviços de hospedagem modernos faz isso automaticamente ao detectar o \`package.json\`.

## Créditos

*   **Desenvolvido com v0.dev:** Este projeto foi inicialmente gerado e aprimorado com a ajuda do v0.dev.
*   **API Controla.eu:** A inteligência financeira é fornecida pela API do Agente Controla.eu.
*   **Next.js & Vercel AI SDK:** Frameworks e ferramentas essenciais para o desenvolvimento.
*   **Shadcn/ui:** Componentes de UI reutilizáveis e acessíveis.
