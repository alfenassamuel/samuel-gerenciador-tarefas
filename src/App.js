import React, { useState } from 'react';
import './App.css';
import { TarefasProvider, useTarefas } from './context/TarefasContext';
import ListaDeTarefas from './components/ListaDeTarefas';

/**
 * Componente interno que renderiza a interface principal do gerenciador.
 * Utiliza useState para gerenciar o estado local do formulário de entrada.
 * Utiliza o hook useTarefas (useContext + useReducer) para acessar e alterar o estado global.
 */
function GerenciadorApp() {
  // Estado local gerenciado com useState (conforme orientações da atividade)
  const [nomeTarefa, setNomeTarefa] = useState('');
  const [mensagemErro, setMensagemErro] = useState('');

  // Consumindo o estado global e ações do contexto
  const {
    adicionarTarefa,
    filtro,
    definirFiltro,
    estatisticas,
  } = useTarefas();

  // Manipulador do evento de envio do formulário (Event Listener onSubmit)
  const handleSubmit = (evento) => {
    evento.preventDefault();

    if (!nomeTarefa.trim()) {
      setMensagemErro('Por favor, digite o nome da tarefa antes de adicionar.');
      return;
    }

    adicionarTarefa(nomeTarefa);
    setNomeTarefa('');
    setMensagemErro('');
  };

  // Manipulador do evento de digitação no campo de entrada (Event Listener onChange)
  const handleInputChange = (evento) => {
    setNomeTarefa(evento.target.value);
    if (mensagemErro) {
      setMensagemErro('');
    }
  };

  return (
    <div className="app-container">
      {/* Cabeçalho da aplicação */}
      <header className="app-header">
        <div className="logo-area">
          <span className="logo-icone" role="img" aria-label="prancheta">📋</span>
          <h1>Gerenciador de Tarefas</h1>
        </div>
        <p className="app-subtitulo">
          Organize suas atividades diárias com estado global em React
        </p>
      </header>

      {/* 1 - Formulário para adicionar nova tarefa */}
      <section className="secao-formulario" aria-label="Adicionar nova tarefa">
        <form onSubmit={handleSubmit} className="formulario-tarefa">
          <div className="input-grupo">
            <input
              type="text"
              placeholder="Digite o nome da tarefa..."
              value={nomeTarefa}
              onChange={handleInputChange}
              className={`input-tarefa ${mensagemErro ? 'input-erro' : ''}`}
              aria-label="Nome da nova tarefa"
            />
            <button type="submit" className="botao-adicionar">
              <span>+</span> Adicionar
            </button>
          </div>
          {mensagemErro && <span className="texto-erro">{mensagemErro}</span>}
        </form>
      </section>

      {/* 3 - Barra de Filtragem (Todas, Concluídas, Pendentes) */}
      <section className="secao-filtros" aria-label="Filtrar tarefas por status">
        <div className="botoes-filtro">
          <button
            type="button"
            className={`botao-filtro ${filtro === 'Todas' ? 'ativo' : ''}`}
            onClick={() => definirFiltro('Todas')}
          >
            Todas
            <span className="badge-contador">{estatisticas.total}</span>
          </button>

          <button
            type="button"
            className={`botao-filtro ${filtro === 'Pendentes' ? 'ativo' : ''}`}
            onClick={() => definirFiltro('Pendentes')}
          >
            Pendentes
            <span className="badge-contador">{estatisticas.pendentes}</span>
          </button>

          <button
            type="button"
            className={`botao-filtro ${filtro === 'Concluídas' ? 'ativo' : ''}`}
            onClick={() => definirFiltro('Concluídas')}
          >
            Concluídas
            <span className="badge-contador">{estatisticas.concluidas}</span>
          </button>
        </div>
      </section>

      {/* 2 - Lista de Tarefas */}
      <main className="secao-lista" aria-label="Lista de Tarefas">
        <ListaDeTarefas />
      </main>

      {/* Rodapé com resumo do progresso */}
      <footer className="app-footer">
        <p>
          {estatisticas.total === 0 ? (
            'Nenhuma tarefa adicionada ainda.'
          ) : (
            <>
              Progresso: <strong>{estatisticas.concluidas}</strong> de{' '}
              <strong>{estatisticas.total}</strong> tarefa(s) concluída(s) (
              {Math.round((estatisticas.concluidas / estatisticas.total) * 100)}%)
            </>
          )}
        </p>
      </footer>
    </div>
  );
}

/**
 * Componente principal App:
 * Envolve a aplicação com o TarefasProvider para fornecer o estado global
 * a todos os componentes filhos.
 */
function App() {
  return (
    <TarefasProvider>
      <GerenciadorApp />
    </TarefasProvider>
  );
}

export default App;
