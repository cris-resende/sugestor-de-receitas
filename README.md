 Aplicação de Sugestão Inteligente de Receitas

Este projeto constitui uma aplicação web destinada à sugestão personalizada de receitas, desenvolvida com uma abordagem mobile-first. O objetivo central da iniciativa é aprimorar a experiência culinária do usuário, facilitando a identificação de pratos relevantes e de alta qualidade com base exclusivamente nos ingredientes disponíveis em sua cozinha.

 Escopo e Objetivos Estratégicos

O propósito fundamental desta ferramenta interativa e intuitiva é mitigar o desperdício alimentar, fornecendo sugestões de receitas compatíveis que são geradas a partir da seleção de insumos pelo usuário, mediante o consumo de uma API externa e a manutenção integral da experiência na língua portuguesa.

 Arquitetura e Plataforma Tecnológica 

O sistema foi concebido com base em uma arquitetura robusta e escalável, integrando os seguintes componentes tecnológicos:
Componentes e Funções Primárias

  - Interface do Usuário (ReactJS): O ReactJS é utilizado para o desenvolvimento modular da interface, o gerenciamento de estado e a implementação de alta interatividade, com foco especial em dispositivos móveis.

  - Fonte de Dados (Spoonacular API): A Spoonacular API é a fonte principal para a aquisição de um vasto acervo de dados de receitas, incluindo componentes de ingredientes e informações nutricionais detalhadas.

  - Persistência de Dados (Supabase): O Supabase é a plataforma escolhida para diversos serviços essenciais, incluindo:

      - Autenticação (login, registro e recuperação de credenciais).

      - Gerenciamento de perfis de usuário.

      - Persistência de dados personalizados do usuário.

  - Estratégia Linguística (Supabase - Dicionário): É mantido um dicionário dentro do Supabase para realizar o mapeamento de nome_pt para nome_en. Isso garante que, embora a interface de seleção seja apresentada ao usuário em Português, as requisições à Spoonacular API sejam executadas em Inglês para maximizar a precisão dos resultados obtidos.

    
 Funcionalidades Críticas do Sistema

  - Gestão Interativa de Insumos: Provisão de uma interface de usuário que viabiliza a pesquisa e a seleção eficiente de ingredientes disponíveis.

  - Mecanismo de Busca Otimizada: O sistema processa os ingredientes selecionados para consumir a API da Spoonacular, gerando sugestões de receitas pertinentes.

  - Autenticação e Segurança: O Supabase gerencia o ciclo completo de autenticação, desde o cadastro e login até a recuperação de senha, garantindo a integridade dos perfis de usuário.

  - Gestão de Preferências: Implementação de recursos para salvar e classificar (Rating) receitas favoritas, com persistência dos dados na estrutura Supabase.

  - Visualização Detalhada: Apresentação em uma página dedicada dos metadados completos da receita, incluindo título, imagem, lista detalhada de ingredientes e instruções de preparo.


 Instruções para Implantação Local do Projeto

O procedimento a seguir detalha a configuração do ambiente de desenvolvimento.
Pré-requisitos Fundamentais

  - Ambiente Node.js (Recomendada a versão 14 ou posterior).

  - Gerenciador de pacotes npm ou Yarn.

  - Credenciais de acesso ao Supabase (URL e Chave de Anonimato).

  - Chave de Acesso à API da Spoonacular.


 1. Obtenção do Código-Fonte

git clone [https://github.com/cris-resende/sugestor-de-receitas.git](https://github.com/cris-resende/sugestor-de-receitas.git)
cd sugestor-de-receitas



2. Instalação de Dependências

npm install
# ou
# yarn install



3. Configuração do Ambiente

É imprescindível criar um arquivo de variáveis de ambiente (.env) no diretório raiz do projeto, contendo as chaves de serviço a seguir:

# Credenciais do Serviço Supabase
REACT_APP_SUPABASE_URL = https://zotrteveondiwrhgahiy.supabase.co
REACT_APP_SUPABASE_ANON_KEY= eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvdHJ0ZXZlb25kaXdyaGdhaGl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0MzQ5MTAsImV4cCI6MjA3MjAxMDkxMH0.HjlDP3Kb-kp8QKBfpkzd2XfrUxrmC99_3BCLJZrML3Q

# Credencial da Spoonacular API
REACT_APP_SPOONACULAR_API_KEY= AIzaSyDhdUcFNsTLPkd_R0Cawz0ZlopO_DGKYeU
  <!-- const firebaseConfig = {
    apiKey: "AIzaSyDhdUcFNsTLPkd_R0Cawz0ZlopO_DGKYeU",
    authDomain: "sugestor-de-receitas.firebaseapp.com",
    projectId: "sugestor-de-receitas",
    storageBucket: "sugestor-de-receitas.firebasestorage.app",
    messagingSenderId: "295651858837",
    appId: "1:295651858837:web:ac34d7dd3b3df9a8abfe9c"
  }; -->




4. Inicialização do Servidor de Desenvolvimento

A execução do projeto é realizada através do seguinte comando:

npm start
# ou
# yarn start


O projeto será disponibilizado na URL http://localhost:3000
