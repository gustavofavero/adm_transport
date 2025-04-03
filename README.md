# Sistema de Gestão para Transportadora 🚛

Este projeto é um sistema 100% em HTML, CSS e JavaScript puro, desenvolvido para a gestão operacional de uma transportadora rodoviária de cargas. O sistema é executado diretamente no navegador e armazena os dados localmente via `localStorage`, sem necessidade de servidor ou banco de dados externo.

## 🔧 Funcionalidades Implementadas

### 🧭 Tela Principal

- Navegação entre módulos
- Estilo SPA (Single Page Application)

### 📦 Lançamento de Fretes

- Cadastro completo de fretes
- Dropdowns dinâmicos para UF e cidades (com base nos dados oficiais do Brasil)
- Cálculo de R$/Ton
- Campo CTe com validação e opção "NC"
- Filtragem estilo Excel em todas as colunas
- Edição e exclusão de fretes

### 🔧 Manutenção de Veículos

- Lançamento e histórico de manutenções por placa
- Cadastro de tipo (Cavalo/Carreta), data, tipo, valor, oficina, status
- Próxima revisão por KM

### ⛽ Controle de Abastecimento

- Lançamento de abastecimentos por placa
- Cálculo automático da média KM/L entre tanques cheios

### 📊 Relatórios

- Em construção (versão Nível 3)
- Gráficos e filtros avançados planejados com Chart.js

### ⚙️ Cadastros

- Cadastro de clientes, motoristas e placas
- Controle de tipo e status das placas (Cavalo, Carreta, Ativo/Inativo)

---

## 💾 Armazenamento

Todos os dados são salvos localmente no navegador usando `localStorage`. O sistema não depende de internet após carregado.

---

## 🖥️ Como usar

1. Clone o repositório ou baixe o `.zip`
2. Abra o `index.html` no navegador
3. Use o sistema normalmente

---

## 📁 Estrutura de Pastas

SISTEMA_TRANSPORTADORA/ ├── index.html ├── login.html ├── style.css ├── ufs_cidades.js ├── fretes.html ├── fretes.js ├── manutencao.html ├── manutencao.js ├── abastecimento.html ├── abastecimento.js ├── relatorios.html ├── relatorios.js ├── cadastro.html ├── cadastro.js └── dados.json (opcional)

---

## 👨‍💻 Desenvolvido por

Gustavo Favero  
[LinkedIn](https://www.linkedin.com/in/gustavofavero)  
Em desenvolvimento com suporte técnico do ChatGPT  
