import React, { createContext, useContext, useReducer, useState, useEffect } from 'react';
import './App.css';

/* ==========================================================================
   1. ESTADO GLOBAL - CONTEXTO E REDUCER (TarefasContext)
   ========================================================================== */

const TarefasContext = createContext();

const STORAGE_KEY = 'gerenciador_tarefas_react_standalone';

// Inicia com lista vazia para o professor testar do zero
const estadoInicial = {
  tarefas: [],
  filtro: 'Todas', // 'Todas' | 'Concluídas' | 'Pendentes'
};

const carregarEstadoInicial = () => {
  try {
    const dadosSalvos = localStorage.getItem(STORAGE_KEY);
    if (dadosSalvos) {
      const parsed = JSON.parse(dadosSalvos);
      if (Array.isArray(parsed.tarefas)) {
        return {
          ...estadoInicial,
          tarefas: parsed.tarefas,
        };
      }
    }
  } catch (error) {
    console.warn('Não foi possível carregar do localStorage:', error);
  }
  return estadoInicial;
};

// Reducer para manipulação IMUTÁVEL da lista de tarefas
function tarefasReducer(state, action) {
  switch (action.type) {
    case 'ADICIONAR_TAREFA': {
      const texto = action.payload.trim();
      if (!texto) return state;

      const novaTarefa = {
        id: Date.now(),
        texto,
        concluida: false,
      };

      // Imutabilidade com spread operator
      return {
        ...state,
        tarefas: [...state.tarefas, novaTarefa],
      };
    }

    case 'ALTERNAR_TAREFA': {
      // Imutabilidade com map
      return {
        ...state,
        tarefas: state.tarefas.map((tarefa) =>
          tarefa.id === action.payload
            ? { ...tarefa, concluida: !tarefa.concluida }
            : tarefa
        ),
      };
    }

    case 'REMOVER_TAREFA': {
      // Imutabilidade com filter
      return {
        ...state,
        tarefas: state.tarefas.filter((tarefa) => tarefa.id !== action.payload),
      };
    }

    case 'DEFINIR_FILTRO': {
      return {
        ...state,
        filtro: action.payload,
      };
    }

    default:
      return state;
  }
}

// Provider do Contexto
function TarefasProvider({ children }) {
  const [state, dispatch] = useReducer(tarefasReducer, estadoInicial, carregarEstadoInicial);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ tarefas: state.tarefas }));
    } catch (error) {
      console.warn('Erro ao salvar no localStorage:', error);
    }
  }, [state.tarefas]);

  const adicionarTarefa = (texto) => {
    dispatch({ type: 'ADICIONAR_TAREFA', payload: texto });
  };

  const alternarTarefa = (id) => {
    dispatch({ type: 'ALTERNAR_TAREFA', payload: id });
  };

  const removerTarefa = (id) => {
    dispatch({ type: 'REMOVER_TAREFA', payload: id });
  };

  const definirFiltro = (filtro) => {
    dispatch({ type: 'DEFINIR_FILTRO', payload: filtro });
  };

  // Filtragem
  const tarefasFiltradas = state.tarefas.filter((tarefa) => {
    if (state.filtro === 'Concluídas') return tarefa.concluida === true;
    if (state.filtro === 'Pendentes') return tarefa.concluida === false;
    return true; // 'Todas'
  });

  const estatisticas = {
    total: state.tarefas.length,
    concluidas: state.tarefas.filter((t) => t.concluida).length,
    pendentes: state.tarefas.filter((t) => !t.concluida).length,
  };

  return (
    <TarefasContext.Provider
      value={{
        tarefas: state.tarefas,
        filtro: state.filtro,
        tarefasFiltradas,
        estatisticas,
        adicionarTarefa,
        alternarTarefa,
        removerTarefa,
        definirFiltro,
      }}
    >
      {children}
    </TarefasContext.Provider>
  );
}

function useTarefas() {
  const context = useContext(TarefasContext);
  if (!context) {
    throw new Error('useTarefas deve ser utilizado dentro de TarefasProvider');
  }
  return context;
}

/* ==========================================================================
   2. COMPONENTE TAREFA
   ========================================================================== */

function Tarefa({ tarefa }) {
  const { alternarTarefa, removerTarefa } = useTarefas();

  return (
    <li className={`tarefa-item ${tarefa.concluida ? 'concluida' : ''}`}>
      <label className="tarefa-conteudo">
        <input
          type="checkbox"
          checked={tarefa.concluida}
          onChange={() => alternarTarefa(tarefa.id)}
          className="tarefa-checkbox"
          aria-label={`Marcar "${tarefa.texto}" como ${tarefa.concluida ? 'pendente' : 'concluída'}`}
        />
        <span className="tarefa-texto">{tarefa.texto}</span>
      </label>

      <div className="tarefa-acoes">
        <span className={`status-badge ${tarefa.concluida ? 'badge-concluida' : 'badge-pendente'}`}>
          {tarefa.concluida ? 'Concluída' : 'Pendente'}
        </span>
        <button
          type="button"
          onClick={() => removerTarefa(tarefa.id)}
          className="botao-remover"
          title="Excluir tarefa"
          aria-label={`Excluir tarefa ${tarefa.texto}`}
        >
          🗑️
        </button>
      </div>
    </li>
  );
}

/* ==========================================================================
   3. COMPONENTE LISTA DE TAREFAS
   ========================================================================== */

function ListaDeTarefas() {
  const { tarefasFiltradas, filtro } = useTarefas();

  if (tarefasFiltradas.length === 0) {
    let mensagemPrincipal = 'Nenhuma tarefa cadastrada ainda.';
    let mensagemSecundaria = 'Digite um nome acima e clique em "Adicionar" para começar!';

    if (filtro === 'Concluídas') {
      mensagemPrincipal = 'Nenhuma tarefa concluída no momento.';
      mensagemSecundaria = 'Marque a caixa de seleção de uma tarefa para concluí-la.';
    } else if (filtro === 'Pendentes') {
      mensagemPrincipal = 'Nenhuma tarefa pendente no momento.';
      mensagemSecundaria = 'Todas as tarefas cadastradas foram concluídas!';
    }

    return (
      <div className="lista-vazia">
        <p className="lista-vazia-icone">📝</p>
        <p className="lista-vazia-texto">{mensagemPrincipal}</p>
        <span className="lista-vazia-subtexto">{mensagemSecundaria}</span>
      </div>
    );
  }

  return (
    <ul className="lista-tarefas">
      {tarefasFiltradas.map((tarefa) => (
        <Tarefa key={tarefa.id} tarefa={tarefa} />
      ))}
    </ul>
  );
}

/* ==========================================================================
   4. COMPONENTE PRINCIPAL APP
   ========================================================================== */

function GerenciadorApp() {
  // Estado local gerenciado via useState
  const [nomeTarefa, setNomeTarefa] = useState('');
  const [mensagemErro, setMensagemErro] = useState('');

  // Estado global via useContext
  const { adicionarTarefa, filtro, definirFiltro, estatisticas } = useTarefas();

  // Event listener onSubmit
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

  // Event listener onChange
  const handleInputChange = (evento) => {
    setNomeTarefa(evento.target.value);
    if (mensagemErro) {
      setMensagemErro('');
    }
  };

  return (
    <div className="app-container">
      {/* Cabeçalho */}
      <header className="app-header">
        <div className="logo-area">
          <span className="logo-icone" role="img" aria-label="prancheta">📋</span>
          <h1>Gerenciador de Tarefas</h1>
        </div>
        <p className="app-subtitulo">
          Organize suas atividades diárias com estado global em React
        </p>
      </header>

      {/* Formulário de Adicionar Tarefa */}
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

      {/* Botões de Filtragem */}
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

      {/* Lista de Tarefas */}
      <main className="secao-lista" aria-label="Lista de Tarefas">
        <ListaDeTarefas />
      </main>

      {/* Rodapé Informativo */}
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

export default function App() {
  return (
    <TarefasProvider>
      <GerenciadorApp />
    </TarefasProvider>
  );
}
