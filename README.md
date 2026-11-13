# Gerenciador de Tarefas em React

Aplicação completa desenvolvida com **React**, utilizando **Context API** (`useContext` + `useReducer`) para gerenciamento de estado global e `useState` para estado local.

---

## 📋 Requisitos Implementados

1. **Adicionando Tarefas**:
   - Campo de entrada (`<input>`) com validação de campo vazio.
   - Botão para adicionar (`<button>`) conectado ao evento `onSubmit` / `onClick`.
   - Limpeza automática do campo após o envio.

2. **Lista de Tarefas**:
   - Listagem completa das tarefas renderizadas via componente `ListaDeTarefas`.
   - Caixa de seleção (checkbox) em cada item (`Tarefa`) para marcar como concluída/pendente.
   - Estilização visual imediata de tarefa concluída (texto tachado e badge visual).
   - Botão para remover tarefa individualmente (bônus).

3. **Filtragem de Tarefas**:
   - Botões para filtrar tarefas por status:
     - **Todas** (exibe o total geral com contador)
     - **Pendentes** (exibe apenas as pendentes)
     - **Concluídas** (exibe apenas as finalizadas)
   - Realce visual no botão do filtro atualmente selecionado.

4. **Estado Global e Imutabilidade**:
   - Implementado através do `TarefasContext` usando `createContext`, `useContext` e `useReducer`.
   - Toda atualização no array de tarefas é 100% **imutável** (utilizando spread operator `...`, `map` e `filter`).
   - Persistência automática no `localStorage` do navegador para não perder as tarefas ao atualizar a página.

---

## 🏗️ Estrutura de Componentes

Seguindo a recomendação da atividade, o projeto foi dividido nos seguintes componentes:

```
src/
├── context/
│   └── TarefasContext.js    # Estado global (Context + Reducer + Custom Hook useTarefas)
├── components/
│   ├── Tarefa.js            # Componente de item individual (checkbox, texto, status, remover)
│   └── ListaDeTarefas.js    # Componente de listagem e estado vazio
├── App.js                   # Componente principal com formulário e barra de filtros
├── App.standalone.js        # Versão com todos os componentes unificados (ideal para envio de arquivo único)
├── App.css                  # Estilização completa, moderna e responsiva
├── index.js                 # Ponto de entrada React 18 (createRoot)
└── index.css                # Reset de estilos globais
```

---

## 🚀 Como Executar o Projeto

1. Abra o terminal na pasta do projeto:
   ```bash
   cd C:\samuel-gerenciador-tarefas
   ```

2. Instale as dependências com o Yarn (conforme solicitado na atividade):
   ```bash
   yarn
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   yarn start
   ```

4. Acesse no navegador:
   ```
   http://localhost:3000
   ```

---

## 📦 Como Salvar e Postar no AVA

A atividade informa:
> *"pode postar somente o arquivo App.js (COMPACTADO NO FORMATO ZIP) ou outro arquivo que você tenha alterado, bem como postar no github e enviar o link no AVA."*

### Opção 1: Compactar pelo Windows Explorer (Interface Gráfica)
1. Abra a pasta `src` do projeto.
2. Clique com o botão direito no arquivo `App.js` (ou selecione os arquivos alterados).
3. Selecione: **Enviar para** > **Pasta compactada (zipada)**.
4. Envie o arquivo `.zip` gerado no AVA.

### Opção 2: Compactar via Terminal PowerShell
Execute no PowerShell:
```powershell
Compress-Archive -Path ".\src\App.js" -DestinationPath ".\App.zip" -Force
```

Ou para compactar todos os arquivos da pasta `src`:
```powershell
Compress-Archive -Path ".\src\*" -DestinationPath ".\arquivos_projeto.zip" -Force
```

---

## 🐙 Como Subir para o GitHub (e enviar o link no AVA)

1. No terminal do projeto:
   ```bash
   git init
   git add .
   git commit -m "feat: Gerenciador de Tarefas com React Context API e useReducer"
   ```

2. Crie um repositório no seu GitHub (ex: `gerenciador-de-tarefas`).

3. Vincule e envie o código:
   ```bash
   git branch -M main
   git remote add origin https://github.com/alfenassamuel/samuel-gerenciador-tarefas.git
   git push -u origin main
   ```

4. Copie o link do repositório e cole no campo de texto ou comentários da atividade no AVA.
